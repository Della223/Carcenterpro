import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Download, Pencil, Trash2, Target, TrendingUp, TrendingDown, DollarSign, Copy, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { KPISkeleton, TableSkeleton } from '../components/ui/Skeleton';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import {
  fetchBudgets, createBudget, updateBudget, deleteBudget, duplicateBudgetsFromYear,
  applyAutomaticBudgets, revertBudgetToAutomatic,
} from '../services/budget.service';
import { fetchExpenseCategories, fetchExpenses } from '../services/expense.service';
import { createAuditLog } from '../services/audit.service';
import { formatCurrency, formatPercent, calculateBudgetExecution, getCurrentCompetence, downloadCSV } from '../utils/format';
import type { Budget, ExpenseCategory, Expense } from '../types';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function OrcamentosScreen() {
  const { user } = useAuth();
  const toast = useToast();
  const { month: currentMonth, year: currentYear } = getCurrentCompetence();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [form, setForm] = useState({ year: currentYear, month: currentMonth, category_id: '', planned_amount: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Budget | null>(null);

  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateSourceYear, setDuplicateSourceYear] = useState(currentYear - 1);
  const [duplicateTargetYear, setDuplicateTargetYear] = useState(currentYear);
  const [duplicating, setDuplicating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      if (filterYear === currentYear && filterMonth === currentMonth) {
        await applyAutomaticBudgets(filterYear, filterMonth, user?.id ?? undefined);
      }
      const [budgetsData, catsData, expsData] = await Promise.all([
        fetchBudgets(filterYear, filterMonth),
        fetchExpenseCategories(),
        fetchExpenses({ competenceYear: filterYear, competenceMonth: filterMonth }),
      ]);
      setBudgets(budgetsData);
      setCategories(catsData);
      setExpenses(expsData);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filterYear, filterMonth, currentYear, currentMonth, user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const budgetExecutions = useMemo(() => {
    return budgets.map((budget) => {
      const actual = expenses
        .filter((e) => e.category_id === budget.category_id)
        .reduce((sum, e) => {
          const insts = (e.installments ?? []).filter((i) => i.competence_year === filterYear && i.competence_month === filterMonth);
          return sum + insts.reduce((s, i) => s + Number(i.amount), 0);
        }, 0);
      const exec = calculateBudgetExecution(Number(budget.planned_amount), actual);
      return { ...budget, actual, ...exec };
    });
  }, [budgets, expenses, filterYear, filterMonth]);

  const kpis = useMemo(() => {
    const totalPlanned = budgetExecutions.reduce((s, b) => s + Number(b.planned_amount), 0);
    const totalActual = budgetExecutions.reduce((s, b) => s + b.actual, 0);
    const totalDifference = totalActual - totalPlanned;
    const totalExecPercent = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
    return { totalPlanned, totalActual, totalDifference, totalExecPercent };
  }, [budgetExecutions]);

  const handleOpenNew = () => {
    setEditingBudget(null);
    setForm({ year: filterYear, month: filterMonth, category_id: '', planned_amount: '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setForm({ year: budget.year, month: budget.month, category_id: budget.category_id, planned_amount: String(budget.planned_amount) });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.year || form.year < 2000 || form.year > 2100) errors.year = 'Ano inválido.';
    if (!form.month || form.month < 1 || form.month > 12) errors.month = 'Mês inválido.';
    if (!form.category_id) errors.category_id = 'Categoria é obrigatória.';
    if (!form.planned_amount || Number(form.planned_amount) <= 0) errors.planned_amount = 'Valor deve ser maior que zero.';
    if (!editingBudget) {
      const exists = budgets.find((b) => b.category_id === form.category_id && b.year === form.year && b.month === form.month);
      if (exists) errors.category_id = 'Já existe orçamento para esta categoria neste mês/exercício.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const auditUser = user?.id ?? null;
      if (editingBudget) {
        await updateBudget(editingBudget.id, Number(form.planned_amount));
        await createAuditLog(auditUser, 'orcamentos', 'update', editingBudget.id, null, { planned_amount: Number(form.planned_amount) });
        toast.success('Orçamento atualizado com sucesso.');
      } else {
        const created = await createBudget({ year: form.year, month: form.month, category_id: form.category_id, planned_amount: Number(form.planned_amount), created_by: auditUser ?? undefined });
        await createAuditLog(auditUser, 'orcamentos', 'create', created.id, null, { year: form.year, month: form.month, category_id: form.category_id, planned_amount: Number(form.planned_amount) });
        toast.success('Orçamento salvo com sucesso.');
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error('Não foi possível salvar o orçamento.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBudget(deleteTarget.id);
      await createAuditLog(user?.id ?? null, 'orcamentos', 'delete', deleteTarget.id, null, null);
      toast.success('Orçamento removido com sucesso.');
      await loadData();
    } catch {
      toast.error('Não foi possível excluir o orçamento.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRevertToAutomatic = async (budget: Budget) => {
    try {
      const { applied } = await revertBudgetToAutomatic(budget.id, budget.category_id, budget.month, budget.year);
      await createAuditLog(user?.id ?? null, 'orcamentos', 'revert_to_automatic', budget.id, { origin: 'manual' }, { origin: 'automatico' });
      if (applied) {
        toast.success('Orçamento voltou a ser automático e foi recalculado.');
      } else {
        toast.warning('Orçamento marcado como automático, mas ainda não há histórico suficiente para recalcular o valor.');
      }
      await loadData();
    } catch {
      toast.error('Não foi possível voltar o orçamento para automático.');
    }
  };

  const handleDuplicate = async () => {
    setDuplicating(true);
    try {
      const count = await duplicateBudgetsFromYear(duplicateSourceYear, duplicateTargetYear, user?.id ?? undefined);
      if (count > 0) {
        toast.success(`${count} orçamentos duplicados com sucesso.`);
        setDuplicateModalOpen(false);
        setFilterYear(duplicateTargetYear);
      } else {
        toast.warning('Nenhum orçamento encontrado no ano de origem.');
      }
    } catch {
      toast.error('Não foi possível duplicar os orçamentos.');
    } finally {
      setDuplicating(false);
    }
  };

  const handleExport = () => {
    const headers = ['Categoria', 'Orçado', 'Realizado', 'Diferença', 'Execução %'];
    const rows = budgetExecutions.map((b) => [
      b.category?.name ?? '-',
      formatCurrency(Number(b.planned_amount)),
      formatCurrency(b.actual),
      formatCurrency(b.difference),
      formatPercent(b.executionPercent),
    ]);
    downloadCSV(`orcamentos_${filterYear}_${String(filterMonth).padStart(2, '0')}.csv`, headers, rows);
    toast.success('Exportação concluída com sucesso.');
  };

  const availableCategories = categories.filter((c) => !budgets.find((b) => b.category_id === c.id));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Mês</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} className="input-field">
              {MONTH_NAMES.map((name, i) => <option key={i + 1} value={i + 1}>{name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Exercício</label>
            <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} className="input-field">
              {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={() => setDuplicateModalOpen(true)} className="btn-secondary">
            <Copy className="h-4 w-4" />
            Importar do ano anterior
          </button>
          <div className="flex-1" />
          <button onClick={handleExport} className="btn-secondary"><Download className="h-4 w-4" />Exportar</button>
          <button onClick={handleOpenNew} className="btn-primary"><Plus className="h-4 w-4" />Novo Orçamento</button>
        </div>
      </div>

      {/* KPIs */}
      {loading ? <KPISkeleton /> : error ? null : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Valor Orçado" value={formatCurrency(kpis.totalPlanned)} icon={Target} iconColor="text-primary-600" iconBg="bg-primary-50" />
          <KPICard title="Valor Realizado" value={formatCurrency(kpis.totalActual)} icon={DollarSign} iconColor="text-secondary-600" iconBg="bg-secondary-50" />
          <KPICard
            title="Diferença"
            value={formatCurrency(kpis.totalDifference)}
            icon={kpis.totalDifference >= 0 ? TrendingUp : TrendingDown}
            iconColor={kpis.totalDifference >= 0 ? 'text-error-600' : 'text-success-600'}
            iconBg={kpis.totalDifference >= 0 ? 'bg-error-50' : 'bg-success-50'}
          />
          <KPICard title="Execução" value={formatPercent(kpis.totalExecPercent)} icon={TrendingUp} iconColor="text-accent-600" iconBg="bg-accent-50" />
        </div>
      )}

      {/* Table */}
      {loading ? <TableSkeleton rows={6} /> : error ? <ErrorState onRetry={loadData} /> : budgetExecutions.length === 0 ? (
        <EmptyState title="Nenhum orçamento cadastrado." description="Crie o primeiro orçamento para o mês/exercício selecionado." actionLabel="Criar primeiro orçamento" onAction={handleOpenNew} />
      ) : (
        <div className="overflow-hidden rounded-lg ring-1 ring-ink-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-200">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Orçado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Realizado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Diferença</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-ink-500 uppercase tracking-wider">Execução</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {budgetExecutions.map((b) => (
                  <tr key={b.id} className={`hover:bg-ink-50/50 transition-colors ${b.executionPercent > 100 ? 'bg-error-50/30' : b.executionPercent > 90 ? 'bg-warning-50/30' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-ink-900">
                      {b.category?.name ?? '-'}
                      <span className="block mt-1">
                        <Badge variant={b.origin === 'automatico' ? 'info' : 'neutral'}>
                          {b.origin === 'automatico' ? 'Automático' : 'Manual'}
                        </Badge>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-700 text-right whitespace-nowrap">{formatCurrency(Number(b.planned_amount))}</td>
                    <td className="px-4 py-3 text-sm text-ink-700 text-right whitespace-nowrap">{formatCurrency(b.actual)}</td>
                    <td className={`px-4 py-3 text-sm text-right whitespace-nowrap font-medium ${b.difference > 0 ? 'text-error-600' : 'text-success-600'}`}>
                      {formatCurrency(b.difference)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={b.executionPercent > 100 ? 'error' : b.executionPercent > 90 ? 'warning' : 'success'}>
                        {formatPercent(b.executionPercent)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {b.origin === 'manual' && (
                          <button onClick={() => handleRevertToAutomatic(b)} className="p-1.5 text-ink-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors" title="Voltar para automático">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-ink-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors" title="Editar">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(b)} className="p-1.5 text-ink-500 hover:text-error-600 hover:bg-error-50 rounded-md transition-colors" title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
        size="sm"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Salvando...' : 'Salvar'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Mês *</label>
              <select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} className="input-field" disabled={!!editingBudget}>
                {MONTH_NAMES.map((name, i) => <option key={i + 1} value={i + 1}>{name}</option>)}
              </select>
              {formErrors.month && <p className="mt-1 text-xs text-error-600">{formErrors.month}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Exercício *</label>
              <input type="number" min={2000} max={2100} value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="input-field" disabled={!!editingBudget} />
              {formErrors.year && <p className="mt-1 text-xs text-error-600">{formErrors.year}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Categoria *</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field" disabled={!!editingBudget}>
              <option value="">Selecione...</option>
              {(editingBudget ? categories : availableCategories).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {formErrors.category_id && <p className="mt-1 text-xs text-error-600">{formErrors.category_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Valor Orçado (R$) *</label>
            <input type="number" min={0} step="0.01" value={form.planned_amount} onChange={(e) => setForm({ ...form, planned_amount: e.target.value })} className="input-field" placeholder="0,00" />
            {formErrors.planned_amount && <p className="mt-1 text-xs text-error-600">{formErrors.planned_amount}</p>}
          </div>
        </div>
      </Modal>

      {/* Duplicate Modal */}
      <Modal
        open={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        title="Importar Orçamentos"
        size="sm"
        footer={
          <>
            <button onClick={() => setDuplicateModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleDuplicate} disabled={duplicating} className="btn-primary">{duplicating ? 'Importando...' : 'Importar'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Ano de Origem</label>
            <select value={duplicateSourceYear} onChange={(e) => setDuplicateSourceYear(Number(e.target.value))} className="input-field">
              {Array.from({ length: 5 }, (_, i) => currentYear - 4 + i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Ano de Destino</label>
            <select value={duplicateTargetYear} onChange={(e) => setDuplicateTargetYear(Number(e.target.value))} className="input-field">
              {Array.from({ length: 5 }, (_, i) => currentYear - 1 + i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <p className="text-xs text-ink-500">Os orçamentos do ano de origem serão copiados para o ano de destino com os mesmos valores.</p>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir este orçamento?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
