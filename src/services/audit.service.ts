import { supabase } from '../lib/supabase';
import type { AuditLog } from '../types';

export async function createAuditLog(
  userId: string | null,
  module: string,
  operation: string,
  recordId?: string,
  oldValue?: Record<string, unknown> | null,
  newValue?: Record<string, unknown> | null
): Promise<void> {
  const { error } = await supabase.from('audit_logs').insert({
    user_id: userId,
    module,
    operation,
    record_id: recordId ?? null,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
  });
  if (error) console.error('Audit log failed:', error);
}

export async function fetchAuditLogs(limit = 50): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, user:users(*)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
