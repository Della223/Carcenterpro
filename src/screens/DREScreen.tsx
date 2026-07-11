import { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, FileText } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { fetchDRE, fetchDREComparison } from '../services/dre.service';
import { formatCurrency, formatPercent, getCurrentCompetence, getPreviousCompetence, getCompetenceString, downloadCSV } from '../utils/format';
import type { DREData } from '../types';

export default function DREScreen() {
  const toast = useToast();
  const { month: defaultMonth, year: defaultYear } = getCurrentCompetence();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentDRE, setCurrentDRE] = useState<DREData | null>(null);
  const [previousDRE, setPreviousDRE] = useState<DREData | null>(null);

  const [filterMonth, setFilterMonth] = useState(defaultMonth);
  const [filterYear, setFilterYear] = useState(defaultYear);
  const [showComparison, setShowComparison] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      if (showComparison) {
        const prevComp = getPreviousCompetence(filterMonth, filterYear);
        const { current, previous } = await fetchDREComparison(filterMonth, filterYear, prevComp.month, prevComp.year);
        setCurrentDRE(current);
        setPreviousDRE(previous);
      } else {
        const data = await fetchDRE(filterMonth, filterYear);
        setCurrentDRE(data);
        setPreviousDRE(null);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filterMonth, filterYear, showComparison]);

  useEffect(() => { loadData(); }, [loadData]);

  const dreRows = useMemo(() => {
    if (!currentDRE) return [];
    const rows: { label: string; value: number; type: 'header' | 'category' | 'subtotal' | 'total'; indent?: number }[] = [
      { label: 'Receita Bruta', value: currentDRE.receitaBruta, type: 'header' },
      ...currentDRE.receitaPorCategoria.map((c) => ({ label: c.category, value: c.amount, type: 'category' as const, indent: 1 })),
      { label: '(-) Deduções', value: -currentDRE.deducoes, type: 'subtotal' },
      { label: '(=) Receita Líquida', value: currentDRE.receitaLiquida, type: 'total' },
      { label: '(-) Despesas Operacionais', value: -currentDRE.despesasOperacionais, type: 'header' },
      ...currentDRE.despesasPorCategoria.map((c) => ({ label: c.category, value: -c.amount, type: 'category' as const, indent: 1 })),
      { label: '(=) Resultado Operacional', value: currentDRE.resultadoOperacional, type: 'total' },
    ];
    return rows;
  }, [currentDRE]);

  const handleExport = () => {
    if (!currentDRE) return;
    const headers = showComparison
      ? ['Linha', 'Valor Atual', 'Valor Anterior', 'Diferença R$', 'Diferença %']
      : ['Linha', 'Valor'];
    const rows: (string | number)[][] = dreRows.map((row) => {
      if (showComparison && previousDRE) {
        const prevValue = getPreviousValue(row.label, previousDRE);
        const diff = row.value - prevValue;
        const diffPct = prevValue !== 0 ? (diff / Math.abs(prevValue)) * 100 : 0;
        return [row.label, formatCurrency(row.value), formatCurrency(prevValue), formatCurrency(diff), formatPercent(diffPct)];
      }
      return [row.label, formatCurrency(row.value)];
    });
    downloadCSV(`dre_${getCompetenceString(filterMonth, filterYear)}.csv`, headers, rows);
    toast.success('Exportação concluída com sucesso.');
  };

  const getPreviousValue = (label: string, prev: DREData): number => {
    if (label === 'Receita Bruta') return prev.receitaBruta;
    if (label === '(-) Deduções') return -prev.deducoes;
    if (label === '(=) Receita Líquida') return prev.receitaLiquida;
    if (label === '(-) Despesas Operacionais') return -prev.despesasOperacionais;
    if (label === '(=) Resultado Operacional') return prev.resultadoOperacional;
    const revCat = prev.receitaPorCategoria.find((c) => c.category === label);
    if (revCat) return revCat.amount;
    const expCat = prev.despesasPorCategoria.find((c) => c.category === label);
    if (expCat) return -expCat.amount;
    return 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-4"><Skeleton className="h-10 w-full" /></div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Não foi possível calcular a DRE." onRetry={loadData} />;
  }

  const hasData = (currentDRE?.receitaBruta ?? 0) > 0 || (currentDRE?.despesasOperacionais ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Competência (Mês)</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} className="input-field">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Ano</label>
            <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} className="input-field">
              {Array.from({ length: 5 }, (_, i) => defaultYear - 2 + i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 pb-2.5">
            <input type="checkbox" id="comparison" checked={showComparison} onChange={(e) => setShowComparison(e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="comparison" className="text-sm font-medium text-ink-700">Comparativo</label>
          </div>
          <div className="flex-1" />
          <button onClick={handleExport} className="btn-secondary"><Download className="h-4 w-4" />Exportar</button>
        </div>
      </div>

      {!hasData ? (
        <EmptyState title="Não existem dados para a competência selecionada." description="Registre receitas e despesas para gerar a demonstração." icon={<FileText className="h-8 w-8 text-ink-400" />} />
      ) : (
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="border-b border-ink-200 bg-ink-900 px-6 py-4">
            <h2 className="text-lg font-bold text-white">Demonstração do Resultado do Exercício (DRE)</h2>
            <p className="mt-1 text-sm text-ink-400">Competência: {getCompetenceString(filterMonth, filterYear)}</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-200">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Valor</th>
                  {showComparison && <th className="px-6 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Período Anterior</th>}
                  {showComparison && <th className="px-6 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Diferença</th>}
                  {showComparison && <th className="px-6 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Var. %</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {dreRows.map((row, i) => {
                  const isHeader = row.type === 'header';
                  const isTotal = row.type === 'total';
                  const isCategory = row.type === 'category';
                  const isPositive = row.value >= 0;

                  let rowClass = '';
                  if (isHeader) rowClass = 'bg-ink-50 font-semibold text-ink-900';
                  else if (isTotal) rowClass = 'bg-primary-50/50 font-bold text-ink-900 border-t-2 border-primary-200';
                  else if (isCategory) rowClass = 'text-ink-600';

                  return (
                    <tr key={i} className={rowClass}>
                      <td className={`px-6 py-3 text-sm ${isCategory ? 'pl-10' : ''} ${isHeader || isTotal ? 'font-semibold' : ''}`}>
                        {row.label}
                      </td>
                      <td className={`px-6 py-3 text-sm text-right whitespace-nowrap ${isTotal ? 'font-bold' : isHeader ? 'font-semibold' : ''} ${isPositive ? 'text-ink-900' : 'text-error-600'}`}>
                        {formatCurrency(Math.abs(row.value))}{row.value < 0 ? ' (-)' : ''}
                      </td>
                      {showComparison && previousDRE && (
                        <>
                          <td className="px-6 py-3 text-sm text-right text-ink-600 whitespace-nowrap">
                            {formatCurrency(Math.abs(getPreviousValue(row.label, previousDRE)))}
                          </td>
                          {(() => {
                            const prevVal = getPreviousValue(row.label, previousDRE);
                            const diff = row.value - prevVal;
                            const diffPct = prevVal !== 0 ? (diff / Math.abs(prevVal)) * 100 : 0;
                            return (
                              <>
                                <td className={`px-6 py-3 text-sm text-right whitespace-nowrap ${diff >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                                  {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
                                </td>
                                <td className={`px-6 py-3 text-sm text-right whitespace-nowrap ${diffPct >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                                  {diffPct >= 0 ? '+' : ''}{formatPercent(diffPct)}
                                </td>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          {currentDRE && (
            <div className="border-t border-ink-200 bg-ink-50 px-6 py-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-ink-500">Receita Líquida</p>
                  <p className="mt-1 text-lg font-bold text-ink-900">{formatCurrency(currentDRE.receitaLiquida)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500">Total de Despesas</p>
                  <p className="mt-1 text-lg font-bold text-error-600">{formatCurrency(currentDRE.despesasOperacionais)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500">Resultado</p>
                  <p className={`mt-1 text-lg font-bold ${currentDRE.resultadoOperacional >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                    {formatCurrency(currentDRE.resultadoOperacional)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-500">Margem Operacional</p>
                  <p className={`mt-1 text-lg font-bold ${currentDRE.margemOperacional >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                    {formatPercent(currentDRE.margemOperacional)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
