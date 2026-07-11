import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GRAPH_API_VERSION = "v19.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const appId = Deno.env.get("META_APP_ID");
    const appSecret = Deno.env.get("META_APP_SECRET");

    if (!supabaseUrl || !serviceRoleKey || !appId || !appSecret) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get integration record
    const { data: integration, error: fetchError } = await supabase
      .from("instagram_integration")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (fetchError || !integration || !integration.connected) {
      return new Response(
        JSON.stringify({ error: "Instagram not connected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let accessToken = integration.access_token;
    const igBusinessId = integration.instagram_business_id;

    if (!accessToken || !igBusinessId) {
      return new Response(
        JSON.stringify({ error: "Missing credentials" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token needs renewal (if expires within 7 days)
    const expiresAt = new Date(integration.token_expires_at).getTime();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (expiresAt - now < sevenDays) {
      try {
        const refreshRes = await fetch(
          `${GRAPH_BASE}/oauth/access_token?` +
          new URLSearchParams({
            grant_type: "fb_exchange_token",
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: accessToken,
          })
        );
        const refreshData = await refreshRes.json();
        if (refreshData.access_token) {
          accessToken = refreshData.access_token;
          const newExpiresAt = new Date(Date.now() + (refreshData.expires_in || 5184000) * 1000).toISOString();
          await supabase.from("instagram_integration").update({
            access_token: accessToken,
            token_expires_at: newExpiresAt,
            updated_at: new Date().toISOString(),
          }).eq("id", integration.id);
        }
      } catch {
        // Token refresh failed — will need re-auth
        await supabase.from("instagram_integration").update({
          sync_error: "Token renewal failed. Re-authentication required.",
          updated_at: new Date().toISOString(),
        }).eq("id", integration.id);

        return new Response(
          JSON.stringify({ error: "Token expired. Re-authentication required." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Fetch account data
    const accountRes = await fetch(
      `${GRAPH_BASE}/${igBusinessId}?` +
      new URLSearchParams({
        access_token: accessToken,
        fields: "id,name,username,profile_picture_url,followers_count,media_count",
      })
    );
    const accountData = await accountRes.json();

    if (accountData.error) {
      await supabase.from("instagram_integration").update({
        sync_error: accountData.error.message,
        updated_at: new Date().toISOString(),
      }).eq("id", integration.id);

      return new Response(
        JSON.stringify({ error: accountData.error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch recent media
    const mediaRes = await fetch(
      `${GRAPH_BASE}/${igBusinessId}/media?` +
      new URLSearchParams({
        access_token: accessToken,
        fields: "id,media_type,timestamp,caption",
        limit: "50",
      })
    );
    const mediaData = await mediaRes.json();

    let lastPostDate: string | null = null;
    const mediaItems = mediaData.data ?? [];

    if (mediaItems.length > 0) {
      lastPostDate = mediaItems[0].timestamp.split("T")[0];
    }

    // Sync media posts to marketing_posts table
    let syncedCount = 0;
    for (const media of mediaItems) {
      const mediaType = media.media_type;
      const timestamp = media.timestamp;
      const date = timestamp.split("T")[0];

      let postType: string;
      if (mediaType === "STORY") {
        postType = "Story";
      } else if (mediaType === "REEL") {
        postType = "Reel";
      } else {
        postType = "Feed";
      }

      const { data: existing } = await supabase
        .from("marketing_posts")
        .select("id")
        .eq("reference_date", date)
        .eq("post_type", postType)
        .maybeSingle();

      if (!existing) {
        await supabase.from("marketing_posts").insert({
          post_type: postType,
          reference_date: date,
          published: true,
          published_at: timestamp,
        });
        syncedCount++;
      }
    }

    // Update integration record with fresh data
    await supabase.from("instagram_integration").update({
      account_name: accountData.name ?? null,
      username: accountData.username ?? null,
      profile_pic_url: accountData.profile_picture_url ?? null,
      followers_count: accountData.followers_count ?? 0,
      media_count: accountData.media_count ?? 0,
      last_post_date: lastPostDate,
      last_sync_at: new Date().toISOString(),
      sync_error: null,
      updated_at: new Date().toISOString(),
    }).eq("id", integration.id);

    return new Response(
      JSON.stringify({
        success: true,
        synced: syncedCount,
        account: {
          name: accountData.name,
          username: accountData.username,
          followers: accountData.followers_count,
          media_count: accountData.media_count,
          last_post_date: lastPostDate,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
