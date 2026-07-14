import { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { fetchDRE, fetchDREComparison } from '../services/dre.service';
import { formatCurrency, formatPercent, getCurrentCompetence, getPreviousCompetence, getCompetenceString, downloadCSV } from '../utils/format';
import type { DREData } from '../types';

type DRERowType = 'header' | 'category' | 'subcategory' | 'subsubcategory' | 'subtotal' | 'total';

interface DRERow {
  key: string;
  label: string;
  value: number;
  type: DRERowType;
  indent: number;
  expandable?: boolean;
  expanded?: boolean;
}

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
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

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

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const dreRows = useMemo(() => {
    if (!currentDRE) return [];
    const rows: DRERow[] = [];

    rows.push({ key: 'receita-bruta', label: 'Receita Bruta', value: currentDRE.receitaBruta, type: 'header', indent: 0 });

    for (const cat of currentDRE.receitaPorCategoria) {
      const catKey = `rev|${cat.category}`;
      const hasChildren = cat.subcategories.length > 0;
      rows.push({
        key: catKey, label: cat.category, value: cat.amount, type: 'category', indent: 1,
        expandable: hasChildren, expanded: expandedKeys.has(catKey),
      });
      if (hasChildren && expandedKeys.has(catKey)) {
        for (const sub of cat.subcategories) {
          rows.push({ key: `${catKey}|${sub.name}`, label: sub.name, value: sub.amount, type: 'subcategory', indent: 2 });
        }
      }
    }

    rows.push({ key: 'deducoes', label: '(-) Deduções', value: -currentDRE.deducoes, type: 'subtotal', indent: 0 });
    rows.push({ key: 'receita-liquida', label: '(=) Receita Líquida', value: currentDRE.receitaLiquida, type: 'total', indent: 0 });
    rows.push({ key: 'despesas-operacionais', label: '(-) Despesas Operacionais', value: -currentDRE.despesasOperacionais, type: 'header', indent: 0 });

    for (const cc of currentDRE.despesasPorCategoria) {
      const ccKey = `exp|${cc.category}`;
      const hasCategories = cc.categories.length > 0;
      rows.push({
        key: ccKey, label: cc.category, value: -cc.amount, type: 'category', indent: 1,
        expandable: hasCategories, expanded: expandedKeys.has(ccKey),
      });
      if (hasCategories && expandedKeys.has(ccKey)) {
        for (const cat of cc.categories) {
          const catKey = `${ccKey}|${cat.category}`;
          const hasSubs = cat.subcategories.length > 0;
          rows.push({
            key: catKey, label: cat.category, value: -cat.amount, type: 'subcategory', indent: 2,
            expandable: hasSubs, expanded: expandedKeys.has(catKey),
          });
          if (hasSubs && expandedKeys.has(catKey)) {
            for (const sub of cat.subcategories) {
              rows.push({ key: `${catKey}|${sub.name}`, label: sub.name, value: -sub.amount, type: 'subsubcategory', indent: 3 });
            }
          }
        }
      }
    }

    rows.push({ key: 'resultado-operacional', label: '(=) Resultado Operacional', value: currentDRE.resultadoOperacional, type: 'total', indent: 0 });

    return rows;
  }, [currentDRE, expandedKeys]);

  const getPreviousValueByKey = (key: string, prev: DREData): number => {
    if (key === 'receita-bruta') return prev.receitaBruta;
    if (key === 'deducoes') return -prev.deducoes;
    if (key === 'receita-liquida') return prev.receitaLiquida;
    if (key === 'despesas-operacionais') return -prev.despesasOperacionais;
    if (key === 'resultado-operacional') return prev.resultadoOperacional;

    const parts = key.split('|');
    if (parts[0] === 'rev') {
      const cat = prev.receitaPorCategoria.find((c) => c.category === parts[1]);
      if (!cat) return 0;
      if (parts.length === 2) return cat.amount;
      const sub = cat.subcategories.find((s) => s.name === parts[2]);
      return sub ? sub.amount : 0;
    }
    if (parts[0] === 'exp') {
      const cc = prev.despesasPorCategoria.find((c) => c.category === parts[1]);
      if (!cc) return 0;
      if (parts.length === 2) return -cc.amount;
      const cat = cc.categories.find((c) => c.category === parts[2]);
      if (!cat) return 0;
      if (parts.length === 3) return -cat.amount;
      const sub = cat.subcategories.find((s) => s.name === parts[3]);
      return sub ? -sub.amount : 0;
    }
    return 0;
  };

  const handleExport = () => {
    if (!currentDRE) return;
    const headers = showComparison
      ? ['Linha', 'Valor Atual', 'Valor Anterior', 'Diferença R$', 'Diferença %']
      : ['Linha', 'Valor'];

    // Export sempre com tudo expandido, independente do estado visual da tela
    const exportRows: { label: string; value: number; key: string }[] = [];
    exportRows.push({ key: 'receita-bruta', label: 'Receita Bruta', value: currentDRE.receitaBruta });
    for (const cat of currentDRE.receitaPorCategoria) {
      exportRows.push({ key: `rev|${cat.category}`, label: `  ${cat.category}`, value: cat.amount });
      for (const sub of cat.subcategories) {
        exportRows.push({ key: `rev|${cat.category}|${sub.name}`, label: `    ${sub.name}`, value: sub.amount });
      }
    }
    exportRows.push({ key: 'deducoes', label: '(-) Deduções', value: -currentDRE.deducoes });
    exportRows.push({ key: 'receita-liquida', label: '(=) Receita Líquida', value: currentDRE.receitaLiquida });
    exportRows.push({ key: 'despesas-operacionais', label: '(-) Despesas Operacionais', value: -currentDRE.despesasOperacionais });
    for (const cc of currentDRE.despesasPorCategoria) {
      exportRows.push({ key: `exp|${cc.category}`, label: `  ${cc.category}`, value: -cc.amount });
      for (const cat of cc.categories) {
        exportRows.push({ key: `exp|${cc.category}|${cat.category}`, label: `    ${cat.category}`, value: -cat.amount });
        for (const sub of cat.subcategories) {
          exportRows.push({ key: `exp|${cc.category}|${cat.category}|${sub.name}`, label: `      ${sub.name}`, value: -sub.amount });
        }
      }
    }
    exportRows.push({ key: 'resultado-operacional', label: '(=) Resultado Operacional', value: currentDRE.resultadoOperacional });

    const rows: (string | number)[][] = exportRows.map((row) => {
      if (showComparison && previousDRE) {
        const prevValue = getPreviousValueByKey(row.key, previousDRE);
        const diff = row.value - prevValue;
        const diffPct = prevValue !== 0 ? (diff / Math.abs(prevValue)) * 100 : 0;
        return [row.label, formatCurrency(row.value), formatCurrency(prevValue), formatCurrency(diff), formatPercent(diffPct)];
      }
      return [row.label, formatCurrency(row.value)];
    });
    downloadCSV(`dre_${getCompetenceString(filterMonth, filterYear)}.csv`, headers, rows);
    toast.success('Exportação concluída com sucesso.');
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
                {dreRows.map((row) => {
                  const isHeader = row.type === 'header';
                  const isTotal = row.type === 'total';
                  const isCategory = row.type === 'category';
                  const isSubcategory = row.type === 'subcategory';
                  const isSubsubcategory = row.type === 'subsubcategory';
                  const isPositive = row.value >= 0;

                  let rowClass = '';
                  if (isHeader) rowClass = 'bg-ink-50 font-semibold text-ink-900';
                  else if (isTotal) rowClass = 'bg-primary-50/50 font-bold text-ink-900 border-t-2 border-primary-200';
                  else if (isCategory) rowClass = 'text-ink-700 font-medium';
                  else if (isSubcategory) rowClass = 'text-ink-600';
                  else if (isSubsubcategory) rowClass = 'text-ink-500';

                  const paddingLeft = 24 + row.indent * 20;

                  return (
                    <tr key={row.key} className={rowClass}>
                      <td className={`px-6 py-3 text-sm ${isHeader || isTotal ? 'font-semibold' : ''}`}>
                        <div
                          className={`flex items-center gap-1.5 ${row.expandable ? 'cursor-pointer select-none' : ''}`}
                          style={{ paddingLeft: row.indent > 0 ? `${paddingLeft - 24}px` : undefined }}
                          onClick={row.expandable ? () => toggleExpand(row.key) : undefined}
                        >
                          {row.expandable ? (
                            row.expanded ? <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-ink-400" /> : <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-ink-400" />
                          ) : row.indent > 0 ? (
                            <span className="inline-block w-3.5" />
                          ) : null}
                          <span className={row.expandable ? 'hover:underline' : ''}>{row.label}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-3 text-sm text-right whitespace-nowrap ${isTotal ? 'font-bold' : isHeader ? 'font-semibold' : ''} ${isPositive ? 'text-ink-900' : 'text-error-600'}`}>
                        {formatCurrency(Math.abs(row.value))}{row.value < 0 ? ' (-)' : ''}
                      </td>
                      {showComparison && previousDRE && (
                        <>
                          <td className="px-6 py-3 text-sm text-right text-ink-600 whitespace-nowrap">
                            {formatCurrency(Math.abs(getPreviousValueByKey(row.key, previousDRE)))}
                          </td>
                          {(() => {
                            const prevVal = getPreviousValueByKey(row.key, previousDRE);
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
