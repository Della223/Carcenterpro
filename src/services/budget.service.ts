import { supabase } from '../lib/supabase';
import type { Budget } from '../types';

export interface BudgetInput {
  year: number;
  category_id: string;
  planned_amount: number;
  created_by?: string;
}

export async function fetchBudgets(year: number): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*, category:expense_categories(*)')
    .eq('year', year);
  if (error) throw error;
  return (data ?? []).sort((a, b) =>
    (a.category?.name ?? '').localeCompare(b.category?.name ?? '', 'pt-BR')
  );
}

export async function createBudget(input: BudgetInput): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .insert(input)
    .select('*, category:expense_categories(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateBudget(id: string, plannedAmount: number): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .update({ planned_amount: plannedAmount, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:expense_categories(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBudget(id: string): Promise<void> {
  const { error } = await supabase.from('budgets').delete().eq('id', id);
  if (error) throw error;
}

export async function duplicateBudgetsFromYear(sourceYear: number, targetYear: number, createdBy?: string): Promise<number> {
  const { data: sourceBudgets, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('year', sourceYear);
  if (error) throw error;
  if (!sourceBudgets || sourceBudgets.length === 0) return 0;

  const newBudgets = sourceBudgets.map((b) => ({
    year: targetYear,
    category_id: b.category_id,
    planned_amount: b.planned_amount,
    created_by: createdBy,
  }));

  const { data, error: insertError } = await supabase
    .from('budgets')
    .insert(newBudgets)
    .select('*');
  if (insertError) throw insertError;
  return data?.length ?? 0;
}
