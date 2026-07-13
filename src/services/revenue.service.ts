import { supabase } from '../lib/supabase';
import type { Revenue, RevenueCategory, RevenueMainCategory, RevenueSubcategory } from '../types';

export interface RevenueFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  mainCategoryId?: string;
  subcategoryId?: string;
  competenceMonth?: number;
  competenceYear?: number;
  searchText?: string;
}

export interface RevenueInput {
  revenue_date: string;
  competence_month?: number;
  competence_year?: number;
  category_id?: string;
  main_category_id?: string;
  subcategory_id?: string;
  quantity: number;
  amount: number;
  notes?: string;
  created_by?: string;
}

// ============================================================
// Main Categories
// ============================================================

export async function fetchRevenueMainCategories(): Promise<RevenueMainCategory[]> {
  const { data, error } = await supabase
    .from('revenue_main_categories')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function createRevenueMainCategory(name: string): Promise<RevenueMainCategory> {
  const { data, error } = await supabase
    .from('revenue_main_categories')
    .insert({ name })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// Subcategories
// ============================================================

export async function fetchRevenueSubcategories(mainCategoryId?: string): Promise<RevenueSubcategory[]> {
  let query = supabase
    .from('revenue_subcategories')
    .select('*, main_category:revenue_main_categories(*)')
    .eq('active', true)
    .order('name');
  if (mainCategoryId) query = query.eq('main_category_id', mainCategoryId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createRevenueSubcategory(mainCategoryId: string, name: string): Promise<RevenueSubcategory> {
  const { data, error } = await supabase
    .from('revenue_subcategories')
    .insert({ main_category_id: mainCategoryId, name })
    .select('*, main_category:revenue_main_categories(*)')
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// Legacy categories (backward compat)
// ============================================================

export async function fetchRevenueCategories(): Promise<RevenueCategory[]> {
  const { data, error } = await supabase
    .from('revenue_categories')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

// ============================================================
// Revenues CRUD
// ============================================================

export async function fetchRevenues(filters: RevenueFilters = {}): Promise<Revenue[]> {
  let query = supabase
    .from('revenues')
    .select('*, category:revenue_categories(*), main_category:revenue_main_categories(*), subcategory:revenue_subcategories(*), user:users(*)')
    .order('revenue_date', { ascending: false });

  if (filters.startDate) query = query.gte('revenue_date', filters.startDate);
  if (filters.endDate) query = query.lte('revenue_date', filters.endDate);
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId);
  if (filters.mainCategoryId) query = query.eq('main_category_id', filters.mainCategoryId);
  if (filters.subcategoryId) query = query.eq('subcategory_id', filters.subcategoryId);
  if (filters.competenceMonth) query = query.eq('competence_month', filters.competenceMonth);
  if (filters.competenceYear) query = query.eq('competence_year', filters.competenceYear);

  const { data, error } = await query;
  if (error) throw error;

  let result = data ?? [];
  if (filters.searchText) {
    const search = filters.searchText.toLowerCase();
    result = result.filter(
      (r) =>
        r.notes?.toLowerCase().includes(search) ||
        r.category?.name.toLowerCase().includes(search) ||
        r.subcategory?.name.toLowerCase().includes(search) ||
        r.main_category?.name.toLowerCase().includes(search)
    );
  }
  return result;
}

export async function fetchRevenueById(id: string): Promise<Revenue | null> {
  const { data, error } = await supabase
    .from('revenues')
    .select('*, category:revenue_categories(*), main_category:revenue_main_categories(*), subcategory:revenue_subcategories(*), user:users(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createRevenue(input: RevenueInput): Promise<Revenue> {
  const { data, error } = await supabase
    .from('revenues')
    .insert(input)
    .select('*, category:revenue_categories(*), main_category:revenue_main_categories(*), subcategory:revenue_subcategories(*), user:users(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateRevenue(id: string, input: Partial<RevenueInput>): Promise<Revenue> {
  const { data, error } = await supabase
    .from('revenues')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:revenue_categories(*), main_category:revenue_main_categories(*), subcategory:revenue_subcategories(*), user:users(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRevenue(id: string): Promise<void> {
  const { error } = await supabase.from('revenues').delete().eq('id', id);
  if (error) throw error;
}
