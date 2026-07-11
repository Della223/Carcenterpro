import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GRAPH_API_VERSION = "v19.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PageResponse {
  data: Array<{
    id: string;
    name: string;
    access_token: string;
    instagram_business_account?: { id: string };
  }>;
}

interface IGAccountResponse {
  id: string;
  name: string;
  username: string;
  profile_picture_url: string;
  followers_count: number;
  media_count: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorReason = url.searchParams.get("error_reason");
  const frontendUrl = Deno.env.get("FRONTEND_URL") ?? "/configuracoes";

  // User denied authorization
  if (error) {
    const redirectUrl = `${frontendUrl}?ig_error=${encodeURIComponent(errorReason || error)}`;
    return Response.redirect(redirectUrl, 302);
  }

  if (!code) {
    const redirectUrl = `${frontendUrl}?ig_error=${encodeURIComponent("No authorization code received")}`;
    return Response.redirect(redirectUrl, 302);
  }

  try {
    const appId = Deno.env.get("META_APP_ID");
    const appSecret = Deno.env.get("META_APP_SECRET");
    const redirectUri = Deno.env.get("META_REDIRECT_URI");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!appId || !appSecret || !redirectUri || !supabaseUrl || !serviceRoleKey) {
      return Response.redirect(`${frontendUrl}?ig_error=${encodeURIComponent("Server configuration error")}`, 302);
    }

    // Step 1: Exchange code for short-lived access token
    const tokenRes = await fetch(
      `${GRAPH_BASE}/oauth/access_token?` +
      new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code,
      })
    );
    const tokenData: TokenResponse = await tokenRes.json();

    if (!tokenData.access_token) {
      const msg = (tokenData as unknown as { error?: { message?: string } }).error?.message ?? "Token exchange failed";
      return Response.redirect(`${frontendUrl}?ig_error=${encodeURIComponent(msg)}`, 302);
    }

    const shortLivedToken = tokenData.access_token;

    // Step 2: Exchange for long-lived token
    const longLivedRes = await fetch(
      `${GRAPH_BASE}/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: shortLivedToken,
      })
    );
    const longLivedData: LongLivedTokenResponse = await longLivedRes.json();

    if (!longLivedData.access_token) {
      return Response.redirect(`${frontendUrl}?ig_error=${encodeURIComponent("Long-lived token exchange failed")}`, 302);
    }

    const longLivedToken = longLivedData.access_token;
    const expiresIn = longLivedData.expires_in || 5184000; // Default ~60 days
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Step 3: Get Facebook Pages
    const pagesRes = await fetch(
      `${GRAPH_BASE}/me/accounts?` +
      new URLSearchParams({
        access_token: longLivedToken,
        fields: "id,name,access_token,instagram_business_account",
      })
    );
    const pagesData: PageResponse = await pagesRes.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return Response.redirect(
        `${frontendUrl}?ig_error=${encodeURIComponent("Nenhuma Página do Facebook encontrada. A integração requer uma Página com conta Instagram Business vinculada.")}`,
        302
      );
    }

    // Step 4: Find page with Instagram Business Account
    const pageWithIG = pagesData.data.find((p) => p.instagram_business_account?.id);
    if (!pageWithIG) {
      return Response.redirect(
        `${frontendUrl}?ig_error=${encodeURIComponent("Nenhuma conta Instagram Business encontrada. Verifique se uma Página do Facebook possui Instagram Business vinculado.")}`,
        302
      );
    }

    const igBusinessId = pageWithIG.instagram_business_account!.id;
    const pageId = pageWithIG.id;
    const pageAccessToken = pageWithIG.access_token;

    // Step 5: Get Instagram Business Account details
    const igAccountRes = await fetch(
      `${GRAPH_BASE}/${igBusinessId}?` +
      new URLSearchParams({
        access_token: pageAccessToken,
        fields: "id,name,username,profile_picture_url,followers_count,media_count",
      })
    );
    const igAccount: IGAccountResponse = await igAccountRes.json();

    if (!igAccount.id) {
      return Response.redirect(
        `${frontendUrl}?ig_error=${encodeURIComponent("Não foi possível obter dados da conta Instagram Business.")}`,
        302
      );
    }

    // Step 6: Get last media date
    let lastPostDate: string | null = null;
    try {
      const mediaRes = await fetch(
        `${GRAPH_BASE}/${igBusinessId}/media?` +
        new URLSearchParams({
          access_token: pageAccessToken,
          fields: "timestamp",
          limit: "1",
        })
      );
      const mediaData = await mediaRes.json();
      if (mediaData.data && mediaData.data.length > 0) {
        lastPostDate = mediaData.data[0].timestamp.split("T")[0];
      }
    } catch {
      // Non-critical, continue
    }

    // Step 7: Store credentials in database
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if integration record already exists
    const { data: existing } = await supabase
      .from("instagram_integration")
      .select("id")
      .limit(1)
      .maybeSingle();

    const integrationData = {
      instagram_business_id: igBusinessId,
      facebook_page_id: pageId,
      access_token: longLivedToken,
      refresh_token: pageAccessToken,
      token_expires_at: tokenExpiresAt,
      connected: true,
      connected_at: new Date().toISOString(),
      disconnected_at: null,
      account_name: igAccount.name ?? null,
      username: igAccount.username ?? null,
      profile_pic_url: igAccount.profile_picture_url ?? null,
      followers_count: igAccount.followers_count ?? 0,
      media_count: igAccount.media_count ?? 0,
      last_post_date: lastPostDate,
      last_sync_at: new Date().toISOString(),
      sync_error: null,
    };

    if (existing) {
      await supabase.from("instagram_integration").update({
        ...integrationData,
        updated_at: new Date().toISOString(),
      }).eq("id", existing.id);
    } else {
      await supabase.from("instagram_integration").insert({
        ...integrationData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Step 8: Initial sync — import recent media as marketing posts
    await syncMediaPosts(supabase, igBusinessId, pageAccessToken);

    // Redirect to frontend with success
    return Response.redirect(`${frontendUrl}?ig_success=true`, 302);
  } catch (err) {
    return Response.redirect(
      `${frontendUrl}?ig_error=${encodeURIComponent(err.message)}`,
      302
    );
  }
});

async function syncMediaPosts(supabase: ReturnType<typeof createClient>, igBusinessId: string, accessToken: string) {
  try {
    const mediaRes = await fetch(
      `${GRAPH_BASE}/${igBusinessId}/media?` +
      new URLSearchParams({
        access_token: accessToken,
        fields: "id,media_type,permalink,timestamp,caption",
        limit: "25",
      })
    );
    const mediaData = await mediaRes.json();

    if (!mediaData.data) return;

    for (const media of mediaData.data) {
      const mediaType = media.media_type;
      const timestamp = media.timestamp;
      const date = timestamp.split("T")[0];

      // Map media_type to our post_type
      let postType: string;
      if (mediaType === "STORY") {
        postType = "Story";
      } else if (mediaType === "REEL") {
        postType = "Reel";
      } else {
        postType = "Feed";
      }

      // Check if already exists (by reference date + type)
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
      }
    }
  } catch {
    // Non-critical sync error
  }
}
