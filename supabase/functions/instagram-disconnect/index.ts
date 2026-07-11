import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: integration, error: fetchError } = await supabase
      .from("instagram_integration")
      .select("id, access_token, instagram_business_id")
      .limit(1)
      .maybeSingle();

    if (fetchError || !integration) {
      return new Response(
        JSON.stringify({ success: true, message: "No integration to disconnect" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Attempt to revoke the token via Graph API (best effort)
    if (integration.access_token) {
      try {
        await fetch(
          `https://graph.facebook.com/v19.0/me/permissions?` +
          new URLSearchParams({ access_token: integration.access_token }),
          { method: "DELETE" }
        );
      } catch {
        // Non-critical: proceed to clear local credentials regardless
      }
    }

    // Clear all credentials and mark as disconnected
    await supabase.from("instagram_integration").update({
      connected: false,
      disconnected_at: new Date().toISOString(),
      access_token: null,
      refresh_token: null,
      token_expires_at: null,
      sync_error: null,
      updated_at: new Date().toISOString(),
    }).eq("id", integration.id);

    return new Response(
      JSON.stringify({ success: true, message: "Instagram disconnected successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
