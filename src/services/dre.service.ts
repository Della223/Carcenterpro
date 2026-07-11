import { supabase } from '../lib/supabase';
import type { DREData } from '../types';

export async function fetchDRE(
  competenceMonth: number,
  competenceYear: number
): Promise<DREData> {
  const startDate = `${competenceYear}-${String(competenceMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(competenceYear, competenceMonth, 0).getDate();
  const endDate = `${competenceYear}-${String(competenceMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const [revenuesResult, expensesResult] = await Promise.all([
    supabase
      .from('revenues')
      .select('amount, category:revenue_categories(name)')
      .gte('revenue_date', startDate)
      .lte('revenue_date', endDate),
    supabase
      .from('expenses')
      .select('category:expense_categories(name), cost_center:cost_centers(name), installments:expense_installments(competence_month, competence_year, amount)')
      .eq('competence_month', competenceMonth)
      .eq('competence_year', competenceYear),
  ]);

  if (revenuesResult.error) throw revenuesResult.error;
  if (expensesResult.error) throw expensesResult.error;

  const revenues = revenuesResult.data ?? [];
  const expenses = expensesResult.data ?? [];

  const receitaPorCategoriaMap: Record<string, number> = {};
  let receitaBruta = 0;

  for (const r of revenues) {
    const catName = (r.category as unknown as { name: string })?.name ?? 'Sem categoria';
    const amount = Number(r.amount);
    receitaPorCategoriaMap[catName] = (receitaPorCategoriaMap[catName] || 0) + amount;
    receitaBruta += amount;
  }

  const receitaPorCategoria = Object.entries(receitaPorCategoriaMap).map(([category, amount]) => ({
    category,
    amount,
  }));

  const deducoes = 0;
  const receitaLiquida = receitaBruta - deducoes;

  const despesasPorCategoriaMap: Record<string, number> = {};
  let despesasOperacionais = 0;

  for (const e of expenses) {
    const catName = (e.category as unknown as { name: string })?.name ?? 'Sem categoria';
    for (const inst of (e.installments as unknown as { competence_month: number; competence_year: number; amount: number }[]) ?? []) {
      if (inst.competence_month === competenceMonth && inst.competence_year === competenceYear) {
        const amount = Number(inst.amount);
        despesasPorCategoriaMap[catName] = (despesasPorCategoriaMap[catName] || 0) + amount;
        despesasOperacionais += amount;
      }
    }
  }

  const despesasPorCategoria = Object.entries(despesasPorCategoriaMap).map(([category, amount]) => ({
    category,
    amount,
  }));

  const resultadoOperacional = receitaLiquida - despesasOperacionais;
  const margemOperacional = receitaLiquida > 0 ? (resultadoOperacional / receitaLiquida) * 100 : 0;

  return {
    receitaBruta,
    receitaPorCategoria,
    deducoes,
    receitaLiquida,
    despesasOperacionais,
    despesasPorCategoria,
    resultadoOperacional,
    margemOperacional,
  };
}

export async function fetchDREComparison(
  currentMonth: number,
  currentYear: number,
  prevMonth: number,
  prevYear: number
): Promise<{ current: DREData; previous: DREData }> {
  const [current, previous] = await Promise.all([
    fetchDRE(currentMonth, currentYear),
    fetchDRE(prevMonth, prevYear),
  ]);
  return { current, previous };
}
