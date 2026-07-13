import { supabase } from '../lib/supabase';
import type { ChangeHistory } from '../types';

export async function fetchChangeHistory(
  tableName: string,
  recordId: string
): Promise<ChangeHistory[]> {
  const { data, error } = await supabase
    .from('change_history')
    .select('*, user:users(*)')
    .eq('table_name', tableName)
    .eq('record_id', recordId)
    .order('changed_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function logChanges(
  tableName: string,
  recordId: string,
  changedBy: string | null,
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>
): Promise<void> {
  const changes: {
    table_name: string;
    record_id: string;
    field_name: string;
    old_value: string | null;
    new_value: string | null;
    changed_by: string | null;
  }[] = [];

  const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);

  for (const key of allKeys) {
    const oldVal = oldValues[key];
    const newVal = newValues[key];

    if (oldVal === newVal) continue;
    if (oldVal == null && newVal == null) continue;

    changes.push({
      table_name: tableName,
      record_id: recordId,
      field_name: key,
      old_value: oldVal != null ? String(oldVal) : null,
      new_value: newVal != null ? String(newVal) : null,
      changed_by: changedBy,
    });
  }

  if (changes.length === 0) return;

  const { error } = await supabase.from('change_history').insert(changes);
  if (error) console.error('Change history log failed:', error);
}
