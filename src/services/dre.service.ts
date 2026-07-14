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
      .select('amount, main_category:revenue_main_categories(name), subcategory:revenue_subcategories(name)')
      .gte('revenue_date', startDate)
      .lte('revenue_date', endDate),
    supabase
      .from('expenses')
      .select('category:expense_categories(name), subcategory:expense_subcategories(name), cost_center:cost_centers(name), installments:expense_installments(competence_month, competence_year, amount)')
      .eq('competence_month', competenceMonth)
      .eq('competence_year', competenceYear),
  ]);

  if (revenuesResult.error) throw revenuesResult.error;
  if (expensesResult.error) throw expensesResult.error;

  const revenues = revenuesResult.data ?? [];
  const expenses = expensesResult.data ?? [];

  // ---- Receitas: Categoria Principal -> Subcategoria ----
  const receitaMap: Record<string, { amount: number; subcategories: Record<string, number> }> = {};
  let receitaBruta = 0;

  for (const r of revenues) {
    const catName = (r.main_category as unknown as { name: string })?.name ?? 'Sem categoria';
    const subName = (r.subcategory as unknown as { name: string })?.name ?? 'Sem subcategoria';
    const amount = Number(r.amount);

    if (!receitaMap[catName]) receitaMap[catName] = { amount: 0, subcategories: {} };
    receitaMap[catName].amount += amount;
    receitaMap[catName].subcategories[subName] = (receitaMap[catName].subcategories[subName] || 0) + amount;
    receitaBruta += amount;
  }

  const receitaPorCategoria = Object.entries(receitaMap).map(([category, data]) => ({
    category,
    amount: data.amount,
    subcategories: Object.entries(data.subcategories).map(([name, amount]) => ({ name, amount })),
  }));

  const deducoes = 0;
  const receitaLiquida = receitaBruta - deducoes;

  // ---- Despesas: Centro de Custo -> Categoria -> Subcategoria ----
  const despesaMap: Record<string, {
    amount: number;
    categories: Record<string, { amount: number; subcategories: Record<string, number> }>;
  }> = {};
  let despesasOperacionais = 0;

  for (const e of expenses) {
    const ccName = (e.cost_center as unknown as { name: string })?.name ?? 'Sem centro de custo';
    const catName = (e.category as unknown as { name: string })?.name ?? 'Sem categoria';
    const subName = (e.subcategory as unknown as { name: string })?.name ?? 'Sem subcategoria';

    for (const inst of (e.installments as unknown as { competence_month: number; competence_year: number; amount: number }[]) ?? []) {
      if (inst.competence_month === competenceMonth && inst.competence_year === competenceYear) {
        const amount = Number(inst.amount);

        if (!despesaMap[ccName]) despesaMap[ccName] = { amount: 0, categories: {} };
        despesaMap[ccName].amount += amount;

        if (!despesaMap[ccName].categories[catName]) {
          despesaMap[ccName].categories[catName] = { amount: 0, subcategories: {} };
        }
        despesaMap[ccName].categories[catName].amount += amount;
        despesaMap[ccName].categories[catName].subcategories[subName] =
          (despesaMap[ccName].categories[catName].subcategories[subName] || 0) + amount;

        despesasOperacionais += amount;
      }
    }
  }

  const despesasPorCategoria = Object.entries(despesaMap).map(([costCenter, ccData]) => ({
    category: costCenter,
    amount: ccData.amount,
    categories: Object.entries(ccData.categories).map(([category, catData]) => ({
      category,
      amount: catData.amount,
      subcategories: Object.entries(catData.subcategories).map(([name, amount]) => ({ name, amount })),
    })),
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
