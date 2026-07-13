import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Mail, Shield, Search, Pencil, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { TableSkeleton } from '../components/ui/Skeleton';
import {
  fetchAllUsers, createUserByAdmin, updateUserStatus, updateUserRole, updateUserName,
} from '../services/auth.service';
import { formatDateTime } from '../utils/format';
import type { User } from '../types';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  financeiro: 'Financeiro',
  operador: 'Operador',
};

export default function GestaoUsuariosScreen() {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'operador' });
  const [editForm, setEditForm] = useState({ name: '', role: 'operador', active: true });
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const filteredUsers = users.filter((u) => {
    if (!searchText) return true;
    const s = searchText.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
  });

  const handleCreate = async () => {
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password) {
      toast.error('Preencha todos os campos.');
      return;
    }
    if (createForm.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setSaving(true);
    try {
      const { error: createError } = await createUserByAdmin(
        createForm.name.trim(), createForm.email.trim(), createForm.password, createForm.role
      );
      if (createError) {
        toast.error(createError);
      } else {
        toast.success('Usuário criado com sucesso.');
        setCreateOpen(false);
        setCreateForm({ name: '', email: '', password: '', role: 'operador' });
        await loadUsers();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      if (editForm.name !== editTarget.name) {
        const { error: nameError } = await updateUserName(editTarget.id, editForm.name);
        if (nameError) { toast.error(nameError); setSaving(false); return; }
      }
      if (editForm.role !== editTarget.role) {
        const { error: roleError } = await updateUserRole(editTarget.id, editForm.role);
        if (roleError) { toast.error(roleError); setSaving(false); return; }
      }
      if (editForm.active !== editTarget.active) {
        const { error: statusError } = await updateUserStatus(editTarget.id, editForm.active);
        if (statusError) { toast.error(statusError); setSaving(false); return; }
      }
      toast.success('Usuário atualizado com sucesso.');
      setEditTarget(null);
      await loadUsers();
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u: User) => {
    const { error: toggleError } = await updateUserStatus(u.id, !u.active);
    if (toggleError) toast.error(toggleError);
    else { toast.success(u.active ? 'Usuário desativado.' : 'Usuário ativado.'); await loadUsers(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Gestão de Usuários</h2>
          <p className="text-sm text-ink-500">Gerencie usuários e perfis de acesso.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary">
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </button>
      </div>

      <div className="card p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {loading ? <TableSkeleton rows={5} /> : error ? <ErrorState onRetry={loadUsers} /> : filteredUsers.length === 0 ? (
        <EmptyState
          title="Nenhum usuário encontrado."
          description="Crie o primeiro usuário do sistema."
          actionLabel="Novo Usuário"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <div className="overflow-hidden rounded-lg ring-1 ring-ink-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-200">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">E-mail</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Perfil</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">Criado em</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-ink-900">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'admin' ? 'primary' : 'neutral'}>
                        {ROLE_LABELS[u.role] ?? u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(u)} className="cursor-pointer">
                        <Badge variant={u.active ? 'success' : 'error'}>
                          {u.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-500 whitespace-nowrap">{formatDateTime(u.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditTarget(u);
                          setEditForm({ name: u.name, role: u.role, active: u.active });
                        }}
                        className="p-1.5 text-ink-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo Usuário"
        size="md"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleCreate} disabled={saving} className="btn-primary">
              {saving ? 'Criando...' : 'Criar Usuário'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Nome *</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="input-field"
              placeholder="Nome completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">E-mail *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="input-field pl-10"
                placeholder="usuario@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Senha *</label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              className="input-field"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Perfil *</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                className="input-field pl-10"
              >
                <option value="operador">Operador</option>
                <option value="financeiro">Financeiro</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Editar Usuário"
        size="md"
        footer={
          <>
            <button onClick={() => setEditTarget(null)} className="btn-secondary">Cancelar</button>
            <button onClick={handleEditSave} disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </>
        }
      >
        {editTarget && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Nome</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">E-mail</label>
              <input type="email" value={editTarget.email} disabled className="input-field bg-ink-50 text-ink-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Perfil</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="input-field"
              >
                <option value="operador">Operador</option>
                <option value="financeiro">Financeiro</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.active}
                  onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                  className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-ink-700">Usuário ativo</span>
              </label>
            </div>
            {editTarget.id === currentUser?.id && (
              <div className="rounded-lg bg-accent-50 border border-accent-200 p-3">
                <p className="text-xs text-accent-800">Você está editando seu próprio perfil.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
