import { supabase } from '../lib/supabase';
import type { User } from '../types';

export async function fetchAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function hasAdminUser(): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .eq('active', true)
    .limit(1);
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function bootstrapAdmin(
  name: string,
  email: string,
  password: string
): Promise<{ error: string | null }> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) return { error: authError.message };
  if (!authData.user) return { error: 'Falha ao criar usuário de autenticação.' };

  const { error: profileError } = await supabase.from('users').insert({
    auth_id: authData.user.id,
    name,
    email,
    role: 'admin',
    active: true,
  });

  if (profileError) {
    return { error: 'Erro ao criar perfil: ' + profileError.message };
  }

  await supabase.auth.signOut();
  return { error: null };
}

export async function createUserByAdmin(
  name: string,
  email: string,
  password: string,
  role: string
): Promise<{ error: string | null }> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) return { error: authError.message };
  if (!authData.user) return { error: 'Falha ao criar usuário.' };

  const { error: profileError } = await supabase.from('users').insert({
    auth_id: authData.user.id,
    name,
    email,
    role,
    active: true,
  });

  if (profileError) {
    return { error: 'Erro ao criar perfil: ' + profileError.message };
  }

  return { error: null };
}

export async function updateUserStatus(
  userId: string,
  active: boolean
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('users')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', userId);
  return { error: error?.message ?? null };
}

export async function updateUserRole(
  userId: string,
  role: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId);
  return { error: error?.message ?? null };
}

export async function updateUserName(
  userId: string,
  name: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('users')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', userId);
  return { error: error?.message ?? null };
}
