import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Download, Search, Pencil, Trash2, Eye, CreditCard, DollarSign, Layers, Building2, Tag, Calendar } from 'lucide-react';
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
  fetchExpenses, createExpense, updateExpense, deleteExpense,
  fetchExpenseCategories, fetchSubcategories, fetchCostCenters,
  fetchSuppliers, findOrCreateSupplier,
} from '../services/expense.service';
import { createAuditLog } from '../services/audit.service';
import { formatCurrency, formatDate, getCurrentCompetence, getCompetenceString, downloadCSV } from '../utils/format';
import type { Expense, ExpenseCategory, ExpenseSubcategory, CostCenter, Supplier } from '../types';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

interface ExpenseForm {
  competence_month: number;
  competence_year: number;
  cost_center_id: string;
  category_id: string;
  subcategory_id: string;
  supplier_name: string;
  supplier_id: string | null;
  payment_date: string;
  total_amount: string;
  installment_count: number;
  notes: string;
}

export default function DespesasScreen() {
  const { user } = useAuth();
  const toast = useToast();
  const { month, year } = getCurrentCompetence();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allCategories, setAllCategories] = useState<ExpenseCategory[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<ExpenseSubcategory[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterCostCenter, setFilterCostCenter] = useState('');
  const [searchText, setSearchText] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [form, setForm] = useState<ExpenseForm>({
    competence_month: month, competence_year: year, cost_center_id: '', category_id: '',
    subcategory_id: '', supplier_name: '', supplier_id: null,
    payment_date: new Date().toISOString().split('T')[0], total_amount: '',
    installment_count: 1, notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [viewTarget, setViewTarget] = useState<Expense | null>(null);

  // Supplier autocomplete state
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierSuggestions, setSupplierSuggestions] = useState<Supplier[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const supplierInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [exps, cats, subs, ccs, sups] = await Promise.all([
        fetchExpenses({}),
        fetchExpenseCategories(),
        fetchSubcategories(),
        fetchCostCenters(),
        fetchSuppliers(),
      ]);
      setExpenses(exps);
      setAllCategories(cats);
      setAllSubcategories(subs);
      setCostCenters(ccs);
      setSuppliers(sups);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Filter categories by selected cost center
  const filteredCategories = useMemo(() => {
    if (!form.cost_center_id) return [];
    return allCategories.filter(c => c.cost_center_id === form.cost_center_id);
  }, [allCategories, form.cost_center_id]);

  // Filter subcategories by selected category
  const filteredSubcategories = useMemo(() => {
    if (!form.category_id) return [];
    return allSubcategories.filter(s => s.category_id === form.category_id);
  }, [allSubcategories, form.category_id]);

  // Supplier autocomplete
  useEffect(() => {
    if (!supplierSearch.trim() || !showSuggestions) {
      setSupplierSuggestions([]);
      return;
    }
    const filtered = suppliers
      .filter(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase()))
      .slice(0, 8);
    setSupplierSuggestions(filtered);
  }, [supplierSearch, suppliers, showSuggestions]);

  const handleSupplierChange = (value: string) => {
    setForm(prev => ({ ...prev, supplier_name: value, supplier_id: null }));
    setSupplierSearch(value);
    setShowSuggestions(true);
  };

  const handleSupplierSelect = (supplier: Supplier) => {
    setForm(prev => ({ ...prev, supplier_name: supplier.name, supplier_id: supplier.id }));
    setSupplierSearch(supplier.name);
    setShowSuggestions(false);
  };

  const handleSupplierBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (filterCategory && e.category_id !== filterCategory) return false;
      if (filterCostCenter && e.cost_center_id !== filterCostCenter) return false;
      if (searchText) {
        const search = searchText.toLowerCase();
        if (!e.supplier?.toLowerCase().includes(search) && !e.description?.toLowerCase().includes(search)) return false;
      }
      return true;
    });
  }, [expenses, filterCategory, filterCostCenter, searchText]);

  const kpis = useMemo(() => {
    let totalCompetence = 0;
    let totalDespesasMes = 0;
    let totalParcelas = 0;
    const currentMonth = month;
    const currentYear = year;

    for (const e of filteredExpenses) {
      totalCompetence += Number(e.total_amount);
      for (const inst of e.installments ?? []) {
        const instMonth = inst.competence_month ?? e.competence_month;
        const instYear = inst.competence_year ?? e.competence_year;
        if (instMonth === currentMonth && instYear === currentYear) {
          totalDespesasMes += Number(inst.amount);
          totalParcelas++;
        }
      }
    }
    return { totalCompetence, totalDespesasMes, totalParcelas };
  }, [filteredExpenses, month, year]);

  const handleOpenNew = () => {
    setEditingExpense(null);
    setForm({
      competence_month: month, competence_year: year, cost_center_id: '', category_id: '',
      subcategory_id: '', supplier_name: '', supplier_id: null,
      payment_date: new Date().toISOString().split('T')[0], total_amount: '',
      installment_count: 1, notes: '',
    });
    setSupplierSearch('');
    setShowSuggestions(false);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setForm({
      competence_month: expense.competence_month,
      competence_year: expense.competence_year,
      cost_center_id: expense.cost_center_id,
      category_id: expense.category_id,
      subcategory_id: expense.subcategory_id ?? '',
      supplier_name: expense.supplier ?? '',
      supplier_id: expense.supplier_id ?? null,
      payment_date: expense.payment_date ?? expense.installments?.[0]?.due_date ?? new Date().toISOString().split('T')[0],
      total_amount: String(expense.total_amount),
      installment_count: expense.installment_count,
      notes: expense.notes ?? '',
    });
    setSupplierSearch(expense.supplier ?? '');
    setShowSuggestions(false);
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.competence_month || !form.competence_year) errors.competence = 'Competência é obrigatória.';
    if (!form.cost_center_id) errors.cost_center_id = 'Centro de custo é obrigatório.';
    if (!form.category_id) errors.category_id = 'Categoria é obrigatória.';
    if (filteredSubcategories.length > 0 && !form.subcategory_id) errors.subcategory_id = 'Subcategoria é obrigatória.';
    if (!form.payment_date) errors.payment_date = 'Data do pagamento é obrigatória.';
    if (!form.total_amount || Number(form.total_amount) <= 0) errors.total_amount = 'Valor deve ser maior que zero.';
    if (form.installment_count < 1 || form.installment_count > 120) errors.installment_count = 'Parcelas deve ser entre 1 e 120.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const auditUser = user?.id ?? null;

      // Handle optional supplier: find or create if name is provided
      let supplierId: string | null = form.supplier_id;
      const supplierName = form.supplier_name.trim();
      if (supplierName && !supplierId) {
        const supplier = await findOrCreateSupplier(supplierName);
        supplierId = supplier?.id ?? null;
      }

      const input = {
        competence_month: form.competence_month,
        competence_year: form.competence_year,
        supplier: supplierName || null,
        supplier_id: supplierId,
        category_id: form.category_id,
        subcategory_id: form.subcategory_id || null,
        cost_center_id: form.cost_center_id,
        description: null as string | null,
        total_amount: Number(form.total_amount),
        installment_count: Number(form.installment_count),
        payment_date: form.payment_date,
        notes: form.notes || null,
        created_by: auditUser ?? undefined,
      };

      if (editingExpense) {
        const { payment_date, ...updateData } = input;
        await updateExpense(editingExpense.id, { ...updateData, payment_date });
        await createAuditLog(auditUser, 'despesas', 'update', editingExpense.id, null, updateData);
        toast.success('Despesa atualizada com sucesso.');
      } else {
        const created = await createExpense(input);
        await createAuditLog(auditUser, 'despesas', 'create', created.id, null, input);
        toast.success('Despesa registrada com sucesso.');
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error('Não foi possível salvar a despesa.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExpense(deleteTarget.id);
      await createAuditLog(user?.id ?? null, 'despesas', 'delete', deleteTarget.id, null, null);
      toast.success('Despesa removida com sucesso.');
      await loadData();
    } catch {
      toast.error('Não foi possível excluir a despesa.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleExport = () => {
    const headers = ['Competência', 'Fornecedor', 'Centro de Custo', 'Categoria', 'Subcategoria', 'Valor Total', 'Parcelas', 'Data Pagamento'];
    const rows = filteredExpenses.map((e) => [
      getCompetenceString(e.competence_month, e.competence_year),
      e.supplier ?? '-',
      e.cost_center?.name ?? '-',
      e.category?.name ?? '-',
      e.subcategory?.name ?? '-',
      formatCurrency(Number(e.total_amount)),
      `${e.installment_count}x`,
      e.payment_date ? formatDate(e.payment_date) : '-',
    ]);
    downloadCSV('despesas.csv', headers, rows);
    toast.success('Exportação concluída com sucesso.');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ink-500 mb-1">Categoria</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field">
              <option value="">Todas</option>
              {allCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ink-500 mb-1">Centro de Custo</label>
            <select value={filterCostCenter} onChange={(e) => setFilterCostCenter(e.target.value)} className="input-field">
              <option value="">Todos</option>
              {costCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-ink-500 mb-1">Busca</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar..." className="input-field pl-10" />
            </div>
          </div>
          <button onClick={() => { setFilterCategory(''); setFilterCostCenter(''); setSearchText(''); }} className="btn-secondary">Limpar</button>
        </div>
      </div>

      {/* KPIs */}
      {loading ? <KPISkeleton /> : error ? null : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KPICard title="Total das Despesas" value={formatCurrency(kpis.totalCompetence)} icon={DollarSign} iconColor="text-primary-600" iconBg="bg-primary-50" />
          <KPICard title="Despesas da Competência" value={formatCurrency(kpis.totalDespesasMes)} icon={CreditCard} iconColor="text-success-600" iconBg="bg-success-50" />
          <KPICard title="Parcelas no Mês" value={String(kpis.totalParcelas)} icon={Layers} iconColor="text-accent-600" iconBg="bg-accent-50" />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <button onClick={handleExport} className="btn-secondary"><Download className="h-4 w-4" />Exportar</button>
        <button onClick={handleOpenNew} className="btn-primary"><Plus className="h-4 w-4" />Nova Despesa</button>
      </div>

      {/* Table */}
      {loading ? <TableSkeleton rows={8} /> : error ? <ErrorState onRetry={loadData} /> : filteredExpenses.length === 0 ? (
        <EmptyState title="Nenhuma despesa cadastrada." description="Clique em 'Nova Despesa' para registrar a primeira despesa." actionLabel="Nova Despesa" onAction={handleOpenNew} />
      ) : (
        <div className="overflow-hidden rounded-lg ring-1 ring-ink-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-200">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Competência</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Fornecedor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Centro de Custo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Valor Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-ink-500 uppercase tracking-wider">Parcelas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Data Pagamento</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-ink-700 whitespace-nowrap">{getCompetenceString(e.competence_month, e.competence_year)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-ink-900">{e.supplier ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{e.cost_center?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">
                      {e.category?.name ?? '-'}
                      {e.subcategory && <span className="text-ink-400 text-xs block">{e.subcategory.name}</span>}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-ink-900 text-right whitespace-nowrap">{formatCurrency(Number(e.total_amount))}</td>
                    <td className="px-4 py-3 text-sm text-ink-600 text-center">{e.installment_count}x</td>
                    <td className="px-4 py-3 text-sm text-ink-600 whitespace-nowrap">{e.payment_date ? formatDate(e.payment_date) : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(e)} className="p-1.5 text-ink-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleOpenEdit(e)} className="p-1.5 text-ink-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors" title="Editar">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(e)} className="p-1.5 text-ink-500 hover:text-error-600 hover:bg-error-50 rounded-md transition-colors" title="Excluir">
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

      {/* Expense Modal - New DRE-oriented flow */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Salvando...' : 'Salvar'}</button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Step 1: Competência */}
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <Calendar className="h-4 w-4 text-primary-600" />
            <span>Competência</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Mês *</label>
              <select
                value={form.competence_month}
                onChange={(e) => setForm({ ...form, competence_month: Number(e.target.value) })}
                className="input-field"
                disabled={!!editingExpense}
              >
                {MONTH_NAMES.map((name, i) => <option key={i + 1} value={i + 1}>{name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Ano *</label>
              <input
                type="number"
                min={2000}
                max={2100}
                value={form.competence_year}
                onChange={(e) => setForm({ ...form, competence_year: Number(e.target.value) })}
                className="input-field"
                disabled={!!editingExpense}
              />
            </div>
          </div>
          {formErrors.competence && <p className="text-xs text-error-600">{formErrors.competence}</p>}

          {/* Step 2: Centro de Custo */}
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <Building2 className="h-4 w-4 text-primary-600" />
            <span>Centro de Custo</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Centro de Custo *</label>
            <select
              value={form.cost_center_id}
              onChange={(e) => setForm({ ...form, cost_center_id: e.target.value, category_id: '', subcategory_id: '' })}
              className="input-field"
            >
              <option value="">Selecione...</option>
              {costCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {formErrors.cost_center_id && <p className="mt-1 text-xs text-error-600">{formErrors.cost_center_id}</p>}
          </div>

          {/* Step 3: Categoria (only after cost center selected) */}
          {form.cost_center_id && (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-700">
                <Tag className="h-4 w-4 text-primary-600" />
                <span>Categoria</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Categoria *</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value, subcategory_id: '' })}
                  className="input-field"
                >
                  <option value="">Selecione...</option>
                  {filteredCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {formErrors.category_id && <p className="mt-1 text-xs text-error-600">{formErrors.category_id}</p>}
              </div>
            </>
          )}

          {/* Step 4: Subcategoria (only if exists) */}
          {form.category_id && filteredSubcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Subcategoria *</label>
              <select
                value={form.subcategory_id}
                onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })}
                className="input-field"
              >
                <option value="">Selecione...</option>
                {filteredSubcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {formErrors.subcategory_id && <p className="mt-1 text-xs text-error-600">{formErrors.subcategory_id}</p>}
            </div>
          )}

          {/* Step 5: Fornecedor (optional, autocomplete) */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Fornecedor (opcional)</label>
            <div className="relative">
              <input
                ref={supplierInputRef}
                type="text"
                value={form.supplier_name}
                onChange={(e) => handleSupplierChange(e.target.value)}
                onBlur={handleSupplierBlur}
                onFocus={() => { if (supplierSearch) setShowSuggestions(true); }}
                className="input-field"
                maxLength={150}
                placeholder="Digite para buscar ou cadastrar..."
                autoComplete="off"
              />
              {showSuggestions && supplierSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-ink-200 max-h-56 overflow-y-auto">
                  {supplierSuggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleSupplierSelect(s); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-ink-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
              {form.supplier_name && !form.supplier_id && supplierSearch && !suppliers.some(s => s.name.toLowerCase() === supplierSearch.toLowerCase()) && (
                <p className="mt-1 text-xs text-accent-600">Novo fornecedor será cadastrado automaticamente.</p>
              )}
            </div>
          </div>

          {/* Step 6: Data do Pagamento */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Data do Pagamento *</label>
            <input
              type="date"
              value={form.payment_date}
              onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
              className="input-field"
            />
            {formErrors.payment_date && <p className="mt-1 text-xs text-error-600">{formErrors.payment_date}</p>}
          </div>

          {/* Step 7: Valor + Parcelas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Valor Total (R$) *</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.total_amount}
                onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                className="input-field"
                placeholder="0,00"
              />
              {formErrors.total_amount && <p className="mt-1 text-xs text-error-600">{formErrors.total_amount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Número de Parcelas *</label>
              <input
                type="number"
                min={1}
                max={120}
                value={form.installment_count}
                onChange={(e) => setForm({ ...form, installment_count: Number(e.target.value) })}
                className="input-field"
                disabled={!!editingExpense}
              />
              {formErrors.installment_count && <p className="mt-1 text-xs text-error-600">{formErrors.installment_count}</p>}
            </div>
          </div>

          {/* Preview of installments */}
          {form.total_amount && Number(form.total_amount) > 0 && form.installment_count > 1 && form.payment_date && (
            <div className="rounded-lg bg-primary-50 p-3">
              <p className="text-xs font-medium text-primary-700 mb-2">
                Preview: {form.installment_count}x de {formatCurrency(Number(form.total_amount) / form.installment_count)}
              </p>
              <div className="text-xs text-primary-600">
                {Array.from({ length: Math.min(form.installment_count, 3) }, (_, i) => {
                  let m = form.competence_month + i;
                  let y = form.competence_year;
                  while (m > 12) { m -= 12; y += 1; }
                  return `${MONTH_NAMES[m - 1]}/${y}`;
                }).join(' → ')}
                {form.installment_count > 3 && ' → ...'}
              </div>
            </div>
          )}

          {/* Step 8: Observações */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Observações</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field"
              rows={2}
              maxLength={500}
              placeholder="Observações opcionais..."
            />
          </div>
        </div>
      </Modal>

      {/* View Modal with installments */}
      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Detalhes da Despesa" size="lg">
        {viewTarget && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-xs text-ink-500">Competência:</span><p className="text-sm font-medium">{getCompetenceString(viewTarget.competence_month, viewTarget.competence_year)}</p></div>
              <div><span className="text-xs text-ink-500">Fornecedor:</span><p className="text-sm font-medium">{viewTarget.supplier ?? '-'}</p></div>
              <div><span className="text-xs text-ink-500">Centro de Custo:</span><p className="text-sm font-medium">{viewTarget.cost_center?.name ?? '-'}</p></div>
              <div><span className="text-xs text-ink-500">Categoria:</span><p className="text-sm font-medium">{viewTarget.category?.name ?? '-'}</p></div>
              <div><span className="text-xs text-ink-500">Subcategoria:</span><p className="text-sm font-medium">{viewTarget.subcategory?.name ?? '-'}</p></div>
              <div><span className="text-xs text-ink-500">Data Pagamento:</span><p className="text-sm font-medium">{viewTarget.payment_date ? formatDate(viewTarget.payment_date) : '-'}</p></div>
              <div><span className="text-xs text-ink-500">Valor Total:</span><p className="text-sm font-bold">{formatCurrency(Number(viewTarget.total_amount))}</p></div>
              <div><span className="text-xs text-ink-500">Parcelas:</span><p className="text-sm font-medium">{viewTarget.installment_count}x</p></div>
              {viewTarget.notes && <div className="col-span-2"><span className="text-xs text-ink-500">Observações:</span><p className="text-sm font-medium">{viewTarget.notes}</p></div>}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-900 mb-2">Parcelas</h4>
              <div className="overflow-hidden rounded-lg ring-1 ring-ink-200">
                <table className="min-w-full divide-y divide-ink-200">
                  <thead className="bg-ink-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-ink-500">#</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-ink-500">Competência</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-ink-500">Valor</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-ink-500">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {(viewTarget.installments ?? []).map((inst) => (
                      <tr key={inst.id}>
                        <td className="px-3 py-2 text-sm text-ink-700">{inst.installment_number}</td>
                        <td className="px-3 py-2 text-sm text-ink-700">
                          {inst.competence_month && inst.competence_year
                            ? getCompetenceString(inst.competence_month, inst.competence_year)
                            : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right font-medium">{formatCurrency(Number(inst.amount))}</td>
                        <td className="px-3 py-2 text-center">
                          <Badge variant="success">Pago</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir esta despesa? Todas as parcelas vinculadas serão removidas."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
