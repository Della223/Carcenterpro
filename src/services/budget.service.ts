import { supabase } from '../lib/supabase';
import type { Budget } from '../types';

export interface BudgetInput {
  year: number;
  month: number;
  category_id: string;
  planned_amount: number;
  created_by?: string;
}

export async function fetchBudgets(year: number, month: number): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*, category:expense_categories(*)')
    .eq('year', year)
    .eq('month', month);
  if (error) throw error;
  return (data ?? []).sort((a, b) =>
    (a.category?.name ?? '').localeCompare(b.category?.name ?? '', 'pt-BR')
  );
}

export async function createBudget(input: BudgetInput): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .insert({ ...input, origin: 'manual' })
    .select('*, category:expense_categories(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateBudget(id: string, plannedAmount: number): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .update({ planned_amount: plannedAmount, origin: 'manual', updated_at: new Date().toISOString() })
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
    month: b.month,
    category_id: b.category_id,
    planned_amount: b.planned_amount,
    origin: 'manual',
    created_by: createdBy,
  }));

  const { data, error: insertError } = await supabase
    .from('budgets')
    .insert(newBudgets)
    .select('*');
  if (insertError) throw insertError;
  return data?.length ?? 0;
}

// ============================================================
// Automatic budgets — 3-month moving average of closed months
// ============================================================

function getClosedMonths(referenceMonth: number, referenceYear: number, count: number): { month: number; year: number }[] {
  const months: { month: number; year: number }[] = [];
  let m = referenceMonth;
  let y = referenceYear;
  for (let i = 0; i < count; i++) {
    m -= 1;
    if (m < 1) { m = 12; y -= 1; }
    months.push({ month: m, year: y });
  }
  return months;
}

/**
 * Computes a monthly budget suggestion per category for (month, year), based
 * on the average actual spend across the 3 closed calendar months immediately
 * before it (that month itself is never included). Only months where the
 * system had any expense activity count toward the average's denominator —
 * if fewer than 3 closed months have activity, the average uses however many
 * are available. Categories with no spend in any active closed month are
 * omitted (a 0 suggestion isn't actionable — `planned_amount` must be > 0).
 */
export async function computeAutomaticBudgetSuggestions(month: number, year: number): Promise<Map<string, number>> {
  const closedMonths = getClosedMonths(month, year, 3);
  const years = Array.from(new Set(closedMonths.map((m) => m.year)));
  const monthKeySet = new Set(closedMonths.map((m) => `${m.year}-${m.month}`));

  const { data, error } = await supabase
    .from('expenses')
    .select('category_id, installments:expense_installments!inner(competence_month, competence_year, amount)')
    .in('installments.competence_year', years)
    .neq('confirmation_status', 'pending_confirmation');
  if (error) throw error;

  const perCategoryMonthTotals = new Map<string, Map<string, number>>();
  const activeMonthKeys = new Set<string>();

  for (const e of data ?? []) {
    for (const inst of (e.installments as unknown as { competence_month: number; competence_year: number; amount: number }[]) ?? []) {
      const key = `${inst.competence_year}-${inst.competence_month}`;
      if (!monthKeySet.has(key)) continue;
      activeMonthKeys.add(key);
      if (!perCategoryMonthTotals.has(e.category_id)) perCategoryMonthTotals.set(e.category_id, new Map());
      const catMonths = perCategoryMonthTotals.get(e.category_id)!;
      catMonths.set(key, (catMonths.get(key) ?? 0) + Number(inst.amount));
    }
  }

  const suggestions = new Map<string, number>();
  const monthCount = activeMonthKeys.size;
  if (monthCount === 0) return suggestions;

  for (const [categoryId, catMonths] of perCategoryMonthTotals.entries()) {
    let total = 0;
    for (const key of activeMonthKeys) {
      total += catMonths.get(key) ?? 0;
    }
    suggestions.set(categoryId, total / monthCount);
  }
  return suggestions;
}

export interface ApplyAutomaticBudgetsResult {
  created: number;
  updated: number;
}

/**
 * Creates/updates 'automatico' budgets for (year, month) from the latest
 * suggestions. Categories already budgeted manually for that month are left
 * untouched. Meant to be called on-demand when the Orçamentos screen loads
 * for the current year/month.
 */
export async function applyAutomaticBudgets(year: number, month: number, createdBy?: string): Promise<ApplyAutomaticBudgetsResult> {
  const suggestions = await computeAutomaticBudgetSuggestions(month, year);
  if (suggestions.size === 0) return { created: 0, updated: 0 };

  const { data: existing, error } = await supabase
    .from('budgets')
    .select('id, category_id, planned_amount, origin')
    .eq('year', year)
    .eq('month', month);
  if (error) throw error;

  const existingByCategory = new Map((existing ?? []).map((b) => [b.category_id, b]));

  let created = 0;
  let updated = 0;

  for (const [categoryId, suggestedAmount] of suggestions.entries()) {
    const rounded = Math.round(suggestedAmount * 100) / 100;
    const current = existingByCategory.get(categoryId);

    if (!current) {
      const { error: insError } = await supabase.from('budgets').insert({
        year,
        month,
        category_id: categoryId,
        planned_amount: rounded,
        origin: 'automatico',
        created_by: createdBy ?? null,
      });
      if (insError) throw insError;
      created++;
    } else if (current.origin === 'automatico' && Number(current.planned_amount) !== rounded) {
      const { error: updError } = await supabase
        .from('budgets')
        .update({ planned_amount: rounded, updated_at: new Date().toISOString() })
        .eq('id', current.id);
      if (updError) throw updError;
      updated++;
    }
  }

  return { created, updated };
}

/**
 * Switches a budget back to 'automatico' and, if a suggestion is available
 * for its category/month, applies it immediately. Returns applied=false when
 * there isn't enough closed-month history yet — the origin still flips, so a
 * future recalculation (for the current month) will pick it up once data exists.
 */
export async function revertBudgetToAutomatic(id: string, categoryId: string, month: number, year: number): Promise<{ applied: boolean }> {
  const suggestions = await computeAutomaticBudgetSuggestions(month, year);
  const suggested = suggestions.get(categoryId);

  if (suggested !== undefined) {
    const rounded = Math.round(suggested * 100) / 100;
    const { error } = await supabase
      .from('budgets')
      .update({ origin: 'automatico', planned_amount: rounded, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return { applied: true };
  }

  const { error } = await supabase
    .from('budgets')
    .update({ origin: 'automatico', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  return { applied: false };
}
