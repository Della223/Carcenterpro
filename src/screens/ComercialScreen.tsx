import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Download, Search, Pencil, Trash2, Eye, DollarSign, ShoppingCart, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { KPISkeleton, TableSkeleton } from '../components/ui/Skeleton';
import KPICard from '../components/ui/KPICard';

import { fetchRevenues, createRevenue, updateRevenue, deleteRevenue, fetchRevenueCategories, type RevenueInput } from '../services/revenue.service';
import { createAuditLog } from '../services/audit.service';
import { formatCurrency, formatDate, formatNumber, downloadCSV } from '../utils/format';
import type { Revenue, RevenueCategory } from '../types';

export default function ComercialScreen() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [categories, setCategories] = useState<RevenueCategory[]>([]);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchText, setSearchText] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
  const [form, setForm] = useState({ revenue_date: '', category_id: '', quantity: 1, amount: '', notes: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Revenue | null>(null);

  const [viewTarget, setViewTarget] = useState<Revenue | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [revs, cats] = await Promise.all([
        fetchRevenues({}),
        fetchRevenueCategories(),
      ]);
      setRevenues(revs);
      setCategories(cats);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredRevenues = useMemo(() => {
    return revenues.filter((r) => {
      if (filterCategory && r.category_id !== filterCategory) return false;
      if (filterStartDate && r.revenue_date < filterStartDate) return false;
      if (filterEndDate && r.revenue_date > filterEndDate) return false;
      if (searchText) {
        const search = searchText.toLowerCase();
        if (!r.notes?.toLowerCase().includes(search) && !r.category?.name.toLowerCase().includes(search)) return false;
      }
      return true;
    });
  }, [revenues, filterCategory, filterStartDate, filterEndDate, searchText]);

  const kpis = useMemo(() => {
    const totalRevenue = filteredRevenues.reduce((s, r) => s + Number(r.amount), 0);
    const totalQuantity = filteredRevenues.reduce((s, r) => s + (r.quantity || 0), 0);
    const ticketMedio = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;
    const today = new Date().toISOString().split('T')[0];
    const receitaDia = filteredRevenues.filter(r => r.revenue_date === today).reduce((s, r) => s + Number(r.amount), 0);
    const elapsedDays = new Date().getDate();
    const mediaDiaria = elapsedDays > 0 ? totalRevenue / elapsedDays : 0;
    return { totalRevenue, totalQuantity, ticketMedio, receitaDia, mediaDiaria };
  }, [filteredRevenues]);

  const handleOpenNew = () => {
    setEditingRevenue(null);
    setForm({ revenue_date: new Date().toISOString().split('T')[0], category_id: '', quantity: 1, amount: '', notes: '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (revenue: Revenue) => {
    setEditingRevenue(revenue);
    setForm({
      revenue_date: revenue.revenue_date,
      category_id: revenue.category_id,
      quantity: revenue.quantity,
      amount: String(revenue.amount),
      notes: revenue.notes ?? '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.revenue_date) errors.revenue_date = 'Data é obrigatória.';
    else if (form.revenue_date > new Date().toISOString().split('T')[0]) errors.revenue_date = 'Data não pode ser futura.';
    if (!form.category_id) errors.category_id = 'Categoria é obrigatória.';
    if (form.quantity < 0) errors.quantity = 'Quantidade deve ser maior ou igual a zero.';
    if (!form.amount || Number(form.amount) <= 0) errors.amount = 'Valor deve ser maior que zero.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const auditUser = user?.id ?? null;
      const input = {
        revenue_date: form.revenue_date,
        category_id: form.category_id,
        quantity: Number(form.quantity),
        amount: Number(form.amount),
        notes: form.notes || undefined,
        created_by: auditUser ?? undefined,
      };
      if (editingRevenue) {
        await updateRevenue(editingRevenue.id, input);
        await createAuditLog(auditUser, 'comercial', 'update', editingRevenue.id, null, input);
        toast.success('Receita atualizada com sucesso.');
      } else {
        const created = await createRevenue(input as RevenueInput);
        await createAuditLog(auditUser, 'comercial', 'create', created.id, null, input);
        toast.success('Receita registrada com sucesso.');
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error('Não foi possível salvar a receita.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRevenue(deleteTarget.id);
      await createAuditLog(user?.id ?? null, 'comercial', 'delete', deleteTarget.id, null, null);
      toast.success('Receita removida com sucesso.');
      await loadData();
    } catch {
      toast.error('Não foi possível excluir a receita.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleExport = () => {
    const headers = ['Data', 'Categoria', 'Quantidade', 'Valor', 'Ticket Médio', 'Observações', 'Usuário'];
    const rows = filteredRevenues.map((r) => [
      formatDate(r.revenue_date),
      r.category?.name ?? '-',
      r.quantity,
      formatCurrency(Number(r.amount)),
      r.quantity > 0 ? formatCurrency(Number(r.amount) / r.quantity) : 'R$ 0,00',
      r.notes ?? '',
      r.user?.name ?? '-',
    ]);
    downloadCSV('receitas.csv', headers, rows);
    toast.success('Exportação concluída com sucesso.');
  };

  const handleClearFilters = () => {
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
    setSearchText('');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-ink-500 mb-1">Categoria</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field">
              <option value="">Todas</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Data Inicial</label>
            <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Data Final</label>
            <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="input-field" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-ink-500 mb-1">Busca</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar..." className="input-field pl-10" />
            </div>
          </div>
          <button onClick={handleClearFilters} className="btn-secondary">Limpar</button>
        </div>
      </div>

      {/* KPIs */}
      {loading ? <KPISkeleton /> : error ? null : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Receita da Competência" value={formatCurrency(kpis.totalRevenue)} icon={DollarSign} iconColor="text-success-600" iconBg="bg-success-50" />
          <KPICard title="Ticket Médio" value={formatCurrency(kpis.ticketMedio)} icon={TrendingUp} iconColor="text-primary-600" iconBg="bg-primary-50" />
          <KPICard title="Quantidade de Vendas" value={formatNumber(kpis.totalQuantity)} icon={ShoppingCart} iconColor="text-accent-600" iconBg="bg-accent-50" />
          <KPICard title="Média Diária" value={formatCurrency(kpis.mediaDiaria)} icon={Calendar} iconColor="text-secondary-600" iconBg="bg-secondary-50" />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <button onClick={handleExport} className="btn-secondary">
          <Download className="h-4 w-4" />
          Exportar
        </button>
        <button onClick={handleOpenNew} className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo Lançamento
        </button>
      </div>

      {/* Table */}
      {loading ? <TableSkeleton rows={8} /> : error ? <ErrorState onRetry={loadData} /> : filteredRevenues.length === 0 ? (
        <EmptyState title="Nenhuma receita cadastrada." description="Clique em 'Novo Lançamento' para registrar a primeira receita." actionLabel="Novo Lançamento" onAction={handleOpenNew} />
      ) : (
        <div className="overflow-hidden rounded-lg ring-1 ring-ink-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-200">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Qtd.</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Ticket Médio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Observações</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredRevenues.map((r) => (
                  <tr key={r.id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-ink-700 whitespace-nowrap">{formatDate(r.revenue_date)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-ink-900">{r.category?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-ink-700 text-right">{r.quantity}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-ink-900 text-right whitespace-nowrap">{formatCurrency(Number(r.amount))}</td>
                    <td className="px-4 py-3 text-sm text-ink-600 text-right whitespace-nowrap">{r.quantity > 0 ? formatCurrency(Number(r.amount) / r.quantity) : '-'}</td>
                    <td className="px-4 py-3 text-sm text-ink-500 max-w-xs truncate">{r.notes ?? '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(r)} className="p-1.5 text-ink-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleOpenEdit(r)} className="p-1.5 text-ink-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors" title="Editar">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(r)} className="p-1.5 text-ink-500 hover:text-error-600 hover:bg-error-50 rounded-md transition-colors" title="Excluir">
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

      {/* Revenue Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRevenue ? 'Editar Lançamento' : 'Novo Lançamento'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Salvando...' : 'Salvar'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Data *</label>
            <input type="date" value={form.revenue_date} onChange={(e) => setForm({ ...form, revenue_date: e.target.value })} className="input-field" max={new Date().toISOString().split('T')[0]} />
            {formErrors.revenue_date && <p className="mt-1 text-xs text-error-600">{formErrors.revenue_date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Categoria *</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
              <option value="">Selecione...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {formErrors.category_id && <p className="mt-1 text-xs text-error-600">{formErrors.category_id}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Quantidade *</label>
              <input type="number" min={0} max={9999} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="input-field" />
              {formErrors.quantity && <p className="mt-1 text-xs text-error-600">{formErrors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Valor (R$) *</label>
              <input type="number" min={0} step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" placeholder="0,00" />
              {formErrors.amount && <p className="mt-1 text-xs text-error-600">{formErrors.amount}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Observações</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={3} maxLength={500} placeholder="Observações opcionais..." />
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Detalhes da Receita" size="sm">
        {viewTarget && (
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-ink-500">Data:</span><span className="text-sm font-medium text-ink-900">{formatDate(viewTarget.revenue_date)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-ink-500">Categoria:</span><span className="text-sm font-medium text-ink-900">{viewTarget.category?.name ?? '-'}</span></div>
            <div className="flex justify-between"><span className="text-sm text-ink-500">Quantidade:</span><span className="text-sm font-medium text-ink-900">{viewTarget.quantity}</span></div>
            <div className="flex justify-between"><span className="text-sm text-ink-500">Valor:</span><span className="text-sm font-bold text-ink-900">{formatCurrency(Number(viewTarget.amount))}</span></div>
            <div className="flex justify-between"><span className="text-sm text-ink-500">Ticket Médio:</span><span className="text-sm font-medium text-ink-900">{viewTarget.quantity > 0 ? formatCurrency(Number(viewTarget.amount) / viewTarget.quantity) : '-'}</span></div>
            <div className="flex justify-between"><span className="text-sm text-ink-500">Usuário:</span><span className="text-sm font-medium text-ink-900">{viewTarget.user?.name ?? '-'}</span></div>
            {viewTarget.notes && <div><span className="text-sm text-ink-500">Observações:</span><p className="mt-1 text-sm text-ink-900">{viewTarget.notes}</p></div>}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir este lançamento?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
