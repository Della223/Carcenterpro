import { supabase } from '../lib/supabase';
import type { MarketingPost, MarketingKPIs, InstagramIntegration } from '../types';

export interface MarketingPostInput {
  post_type: 'Story' | 'Feed' | 'Reel' | 'Campanha';
  reference_date: string;
  published?: boolean;
}

export async function fetchMarketingPosts(startDate?: string, endDate?: string): Promise<MarketingPost[]> {
  let query = supabase
    .from('marketing_posts')
    .select('*, publisher:users(*)')
    .order('reference_date', { ascending: false });

  if (startDate) query = query.gte('reference_date', startDate);
  if (endDate) query = query.lte('reference_date', endDate);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createMarketingPost(input: MarketingPostInput): Promise<MarketingPost> {
  const { data, error } = await supabase
    .from('marketing_posts')
    .insert(input)
    .select('*, publisher:users(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function publishMarketingPost(
  id: string,
  publishedBy: string
): Promise<MarketingPost> {
  const { data, error } = await supabase
    .from('marketing_posts')
    .update({
      published: true,
      published_by: publishedBy,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, publisher:users(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function unpublishMarketingPost(id: string): Promise<MarketingPost> {
  const { data, error } = await supabase
    .from('marketing_posts')
    .update({
      published: false,
      published_by: null,
      published_at: null,
    })
    .eq('id', id)
    .select('*, publisher:users(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMarketingPost(id: string): Promise<void> {
  const { error } = await supabase.from('marketing_posts').delete().eq('id', id);
  if (error) throw error;
}

// ============================================================
// Marketing KPIs
// ============================================================

export async function fetchMarketingKPIs(): Promise<MarketingKPIs | null> {
  const { data, error } = await supabase
    .from('marketing_kpis')
    .select('*')
    .order('reference_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveMarketingKPIs(input: Partial<MarketingKPIs>): Promise<MarketingKPIs> {
  const { data: existing } = await supabase
    .from('marketing_kpis')
    .select('id')
    .order('reference_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('marketing_kpis')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('marketing_kpis')
    .insert({ ...input, reference_date: input.reference_date ?? new Date().toISOString().split('T')[0] })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// Instagram Integration — Edge Function calls
// ============================================================

const FUNCTION_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function getAuthHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'X-Client-Info': 'bolt',
  };
}

export async function fetchInstagramIntegration(): Promise<InstagramIntegration | null> {
  const { data, error } = await supabase
    .from('instagram_integration')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getInstagramAuthUrl(): Promise<string> {
  const res = await fetch(`${FUNCTION_BASE}/instagram-auth`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to get auth URL (${res.status})`);
  }
  const data = await res.json();
  if (!data.url) throw new Error('No auth URL returned');
  return data.url as string;
}

export async function syncInstagram(): Promise<{ synced: number; account: Record<string, unknown> }> {
  const res = await fetch(`${FUNCTION_BASE}/instagram-sync`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Sync failed (${res.status})`);
  }
  return await res.json();
}

export async function disconnectInstagramViaApi(): Promise<void> {
  const res = await fetch(`${FUNCTION_BASE}/instagram-disconnect`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Disconnect failed (${res.status})`);
  }
}

// Keep backward-compatible local disconnect for fallback
export async function disconnectInstagram(): Promise<void> {
  try {
    await disconnectInstagramViaApi();
  } catch {
    // Fallback: clear locally via direct DB update
    const { data: existing } = await supabase
      .from('instagram_integration')
      .select('id')
      .limit(1)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase
        .from('instagram_integration')
        .update({
          connected: false,
          disconnected_at: new Date().toISOString(),
          access_token: null,
          refresh_token: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (error) throw error;
    }
  }
}

export function buildOAuthUrl(clientId: string, redirectUri: string): string {
  const scope = 'instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    response_type: 'code',
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}
