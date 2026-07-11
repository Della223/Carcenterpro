import { supabase } from '../lib/supabase';
import type { RevenueCategory, ExpenseCategory, ExpenseSubcategory, CostCenter, Supplier } from '../types';

export async function fetchAllRevenueCategories(): Promise<RevenueCategory[]> {
  const { data, error } = await supabase
    .from('revenue_categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function createRevenueCategory(name: string): Promise<RevenueCategory> {
  const { data, error } = await supabase
    .from('revenue_categories')
    .insert({ name })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateRevenueCategory(id: string, updates: { name?: string; active?: boolean }): Promise<RevenueCategory> {
  const { data, error } = await supabase
    .from('revenue_categories')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRevenueCategory(id: string): Promise<void> {
  const { error } = await supabase.from('revenue_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function createExpenseCategory(name: string, costCenterId?: string): Promise<ExpenseCategory> {
  const { data, error } = await supabase
    .from('expense_categories')
    .insert({ name, cost_center_id: costCenterId ?? null })
    .select('*, cost_center:cost_centers(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateExpenseCategory(id: string, updates: { name?: string; active?: boolean; cost_center_id?: string | null }): Promise<ExpenseCategory> {
  const { data, error } = await supabase
    .from('expense_categories')
    .update(updates)
    .eq('id', id)
    .select('*, cost_center:cost_centers(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpenseCategory(id: string): Promise<void> {
  const { error } = await supabase.from('expense_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function createSubcategory(categoryId: string, name: string): Promise<ExpenseSubcategory> {
  const { data, error } = await supabase
    .from('expense_subcategories')
    .insert({ category_id: categoryId, name })
    .select('*, category:expense_categories(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubcategory(id: string, updates: { name?: string; active?: boolean }): Promise<ExpenseSubcategory> {
  const { data, error } = await supabase
    .from('expense_subcategories')
    .update(updates)
    .eq('id', id)
    .select('*, category:expense_categories(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSubcategory(id: string): Promise<void> {
  const { error } = await supabase.from('expense_subcategories').delete().eq('id', id);
  if (error) throw error;
}

export async function createCostCenter(name: string): Promise<CostCenter> {
  const { data, error } = await supabase
    .from('cost_centers')
    .insert({ name })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateCostCenter(id: string, updates: { name?: string; active?: boolean }): Promise<CostCenter> {
  const { data, error } = await supabase
    .from('cost_centers')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCostCenter(id: string): Promise<void> {
  const { error } = await supabase.from('cost_centers').delete().eq('id', id);
  if (error) throw error;
}

export async function checkCategoryInUse(table: 'revenues' | 'expenses', categoryId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq(table === 'revenues' ? 'category_id' : 'category_id', categoryId);
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function checkCostCenterInUse(costCenterId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: true })
    .eq('cost_center_id', costCenterId);
  if (error) throw error;
  return (count ?? 0) > 0;
}

// ============================================================
// Suppliers - CRUD
// ============================================================

export async function createSupplierRecord(name: string): Promise<Supplier> {
  const { data, error } = await supabase
    .from('suppliers')
    .insert({ name: name.trim() })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateSupplierRecord(id: string, updates: { name?: string; active?: boolean }): Promise<Supplier> {
  const { data, error } = await supabase
    .from('suppliers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSupplierRecord(id: string): Promise<void> {
  const { error } = await supabase.from('suppliers').delete().eq('id', id);
  if (error) throw error;
}

export async function checkSupplierInUse(supplierId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: true })
    .eq('supplier_id', supplierId);
  if (error) throw error;
  return (count ?? 0) > 0;
}
