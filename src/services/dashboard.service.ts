import { supabase } from '../lib/supabase';
import type { DashboardKPIs } from '../types';

function getPreviousMonth(month: number, year: number): { month: number; year: number } {
  if (month === 1) return { month: 12, year: year - 1 };
  return { month: month - 1, year };
}

function getDateRange(month: number, year: number): { startDate: string; endDate: string } {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
}

async function fetchMonthData(month: number, year: number) {
  const { startDate, endDate } = getDateRange(month, year);
  const [revenuesResult, expensesResult] = await Promise.all([
    supabase
      .from('revenues')
      .select('amount, quantity, revenue_date')
      .gte('revenue_date', startDate)
      .lte('revenue_date', endDate),
    supabase
      .from('expenses')
      .select('*, installments:expense_installments(*)')
      .eq('competence_month', month)
      .eq('competence_year', year)
      .neq('confirmation_status', 'pending_confirmation'),
  ]);
  if (revenuesResult.error) throw revenuesResult.error;
  if (expensesResult.error) throw expensesResult.error;

  const revenues = revenuesResult.data ?? [];
  const expenses = expensesResult.data ?? [];

  const receita = revenues.reduce((sum, r) => sum + Number(r.amount), 0);
  const quantidadeVendas = revenues.reduce((sum, r) => sum + (r.quantity || 0), 0);

  let despesa = 0;
  const categoryTotals: Record<string, number> = {};
  for (const expense of expenses) {
    for (const inst of (expense.installments ?? [])) {
      const instMonth = inst.competence_month ?? expense.competence_month;
      const instYear = inst.competence_year ?? expense.competence_year;
      if (instMonth === month && instYear === year) {
        despesa += Number(inst.amount);
        categoryTotals[expense.category_id] = (categoryTotals[expense.category_id] || 0) + Number(inst.amount);
      }
    }
  }

  return { receita, despesa, quantidadeVendas, categoryTotals, revenues };
}

export async function fetchDashboardKPIs(
  competenceMonth: number,
  competenceYear: number
): Promise<DashboardKPIs> {
  const month = competenceMonth;
  const year = competenceYear;
  const lastDay = new Date(year, month, 0).getDate();

  const prev = getPreviousMonth(month, year);
  const [current, previous] = await Promise.all([
    fetchMonthData(month, year),
    fetchMonthData(prev.month, prev.year),
  ]);

  const { data: budgets } = await supabase
    .from('budgets')
    .select('planned_amount')
    .eq('year', year)
    .eq('month', month);
  const totalBudget = (budgets ?? []).reduce((s, b) => s + Number(b.planned_amount), 0);

  const receitaAcumulada = current.receita;
  const despesaAcumulada = current.despesa;
  const resultado = receitaAcumulada - despesaAcumulada;
  const margem = receitaAcumulada > 0 ? (resultado / receitaAcumulada) * 100 : 0;
  const ticketMedio = current.quantidadeVendas > 0 ? receitaAcumulada / current.quantidadeVendas : 0;

  const today = new Date();
  const elapsedDays = today.getFullYear() === year && today.getMonth() + 1 === month
    ? today.getDate()
    : lastDay;
  const projecao = elapsedDays > 0 ? (receitaAcumulada / elapsedDays) * lastDay : 0;
  const receitaDiariaMedia = elapsedDays > 0 ? receitaAcumulada / elapsedDays : 0;

  const resultadoMesAnterior = previous.receita - previous.despesa;
  const variacaoResultado = resultadoMesAnterior !== 0
    ? ((resultado - resultadoMesAnterior) / Math.abs(resultadoMesAnterior)) * 100
    : 0;
  const variacaoReceita = previous.receita > 0
    ? ((receitaAcumulada - previous.receita) / previous.receita) * 100
    : 0;
  const variacaoDespesa = previous.despesa > 0
    ? ((despesaAcumulada - previous.despesa) / previous.despesa) * 100
    : 0;

  let maiorCategoriaDespesa = '-';
  let maxAmount = 0;
  for (const [catId, amount] of Object.entries(current.categoryTotals)) {
    if (amount > maxAmount) {
      maxAmount = amount;
      const { data: cat } = await supabase
        .from('expense_categories')
        .select('name')
        .eq('id', catId)
        .maybeSingle();
      maiorCategoriaDespesa = cat?.name ?? '-';
    }
  }

  return {
    receitaAcumulada,
    despesaAcumulada,
    resultado,
    projecao,
    ticketMedio,
    maiorCategoriaDespesa,
    quantidadeVendas: current.quantidadeVendas,
    margem,
    receitaDiariaMedia,
    resultadoMesAnterior,
    receitaMesAnterior: previous.receita,
    despesaMesAnterior: previous.despesa,
    variacaoResultado,
    variacaoReceita,
    variacaoDespesa,
    totalBudget,
  };
}

export async function fetchRevenueByCategory(
  competenceMonth: number,
  competenceYear: number
): Promise<{ name: string; value: number }[]> {
  const { startDate, endDate } = getDateRange(competenceMonth, competenceYear);
  const { data, error } = await supabase
    .from('revenues')
    .select('amount, main_category:revenue_main_categories(name)')
    .gte('revenue_date', startDate)
    .lte('revenue_date', endDate);
  if (error) throw error;

  const grouped: Record<string, number> = {};
  for (const r of data ?? []) {
    const catName = (r.main_category as unknown as { name: string })?.name ?? 'Sem categoria';
    grouped[catName] = (grouped[catName] || 0) + Number(r.amount);
  }
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}
export async function fetchRevenueBySubcategory(
  competenceMonth: number,
  competenceYear: number
): Promise<{ name: string; value: number }[]> {
  const { startDate, endDate } = getDateRange(competenceMonth, competenceYear);
  const { data, error } = await supabase
    .from('revenues')
    .select('amount, subcategory:revenue_subcategories(name)')
    .gte('revenue_date', startDate)
    .lte('revenue_date', endDate);
  if (error) throw error;

  const grouped: Record<string, number> = {};
  for (const r of data ?? []) {
    const subName = (r.subcategory as unknown as { name: string })?.name ?? 'Sem subcategoria';
    grouped[subName] = (grouped[subName] || 0) + Number(r.amount);
  }
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}
export async function fetchExpenseByCategory(
  competenceMonth: number,
  competenceYear: number
): Promise<{ name: string; value: number }[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('category:expense_categories(name), installments:expense_installments(competence_month, competence_year, amount)')
    .eq('competence_month', competenceMonth)
    .eq('competence_year', competenceYear)
    .neq('confirmation_status', 'pending_confirmation');
  if (error) throw error;

  const grouped: Record<string, number> = {};
  for (const e of data ?? []) {
    const catName = (e.category as unknown as { name: string })?.name ?? 'Sem categoria';
    for (const inst of (e.installments as unknown as { competence_month: number; competence_year: number; amount: number }[]) ?? []) {
      if (inst.competence_month === competenceMonth && inst.competence_year === competenceYear) {
        grouped[catName] = (grouped[catName] || 0) + Number(inst.amount);
      }
    }
  }
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

export async function fetchMonthlyEvolution(year: number): Promise<{ month: string; receita: number; despesa: number }[]> {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const results = await Promise.all(
    Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      return fetchMonthData(m, year).then((data) => ({
        month: months[i],
        receita: data.receita,
        despesa: data.despesa,
      }));
    })
  );
  return results;
}

export async function fetchCostCenterDistribution(
  competenceMonth: number,
  competenceYear: number
): Promise<{ name: string; value: number }[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('cost_center:cost_centers(name), installments:expense_installments(competence_month, competence_year, amount)')
    .eq('competence_month', competenceMonth)
    .eq('competence_year', competenceYear)
    .neq('confirmation_status', 'pending_confirmation');
  if (error) throw error;

  const grouped: Record<string, number> = {};
  for (const e of data ?? []) {
    const ccName = (e.cost_center as unknown as { name: string })?.name ?? 'Sem centro';
    for (const inst of (e.installments as unknown as { competence_month: number; competence_year: number; amount: number }[]) ?? []) {
      if (inst.competence_month === competenceMonth && inst.competence_year === competenceYear) {
        grouped[ccName] = (grouped[ccName] || 0) + Number(inst.amount);
      }
    }
  }
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}
