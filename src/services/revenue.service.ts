import { supabase } from '../lib/supabase';
import type { Revenue, RevenueCategory } from '../types';

export interface RevenueFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  searchText?: string;
}

export interface RevenueInput {
  revenue_date: string;
  category_id: string;
  quantity: number;
  amount: number;
  notes?: string;
  created_by?: string;
}

export async function fetchRevenueCategories(): Promise<RevenueCategory[]> {
  const { data, error } = await supabase
    .from('revenue_categories')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchRevenues(filters: RevenueFilters = {}): Promise<Revenue[]> {
  let query = supabase
    .from('revenues')
    .select('*, category:revenue_categories(*), user:users(*)')
    .order('revenue_date', { ascending: false });

  if (filters.startDate) query = query.gte('revenue_date', filters.startDate);
  if (filters.endDate) query = query.lte('revenue_date', filters.endDate);
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId);

  const { data, error } = await query;
  if (error) throw error;

  let result = data ?? [];
  if (filters.searchText) {
    const search = filters.searchText.toLowerCase();
    result = result.filter(
      (r) =>
        r.notes?.toLowerCase().includes(search) ||
        r.category?.name.toLowerCase().includes(search)
    );
  }
  return result;
}

export async function createRevenue(input: RevenueInput): Promise<Revenue> {
  const { data, error } = await supabase
    .from('revenues')
    .insert(input)
    .select('*, category:revenue_categories(*), user:users(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateRevenue(id: string, input: Partial<RevenueInput>): Promise<Revenue> {
  const { data, error } = await supabase
    .from('revenues')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:revenue_categories(*), user:users(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRevenue(id: string): Promise<void> {
  const { error } = await supabase.from('revenues').delete().eq('id', id);
  if (error) throw error;
}
