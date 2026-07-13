export interface User {
  id: string;
  auth_id: string | null;
  name: string;
  email: string;
  role: 'admin' | 'financeiro' | 'operador';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RevenueMainCategory {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}

export interface RevenueSubcategory {
  id: string;
  main_category_id: string;
  name: string;
  active: boolean;
  created_at: string;
  main_category?: RevenueMainCategory;
}

export interface RevenueCategory {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}

export interface Revenue {
  id: string;
  revenue_date: string;
  competence_month: number | null;
  competence_year: number | null;
  category_id: string;
  main_category_id: string | null;
  subcategory_id: string | null;
  quantity: number;
  amount: number;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: RevenueCategory;
  main_category?: RevenueMainCategory | null;
  subcategory?: RevenueSubcategory | null;
  user?: User | null;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  active: boolean;
  cost_center_id: string | null;
  created_at: string;
  cost_center?: CostCenter | null;
}

export interface ExpenseSubcategory {
  id: string;
  category_id: string;
  name: string;
  active: boolean;
  created_at: string;
  category?: ExpenseCategory;
}

export interface Supplier {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostCenter {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  competence_month: number;
  competence_year: number;
  supplier: string | null;
  supplier_id: string | null;
  category_id: string;
  subcategory_id: string | null;
  cost_center_id: string;
  description: string | null;
  total_amount: number;
  installment_count: number;
  appropriation_type: string | null;
  payment_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: ExpenseCategory;
  subcategory?: ExpenseSubcategory | null;
  cost_center?: CostCenter;
  supplier_ref?: Supplier | null;
  user?: User | null;
  installments?: ExpenseInstallment[];
}

export interface ExpenseInstallment {
  id: string;
  expense_id: string;
  installment_number: number;
  due_date: string;
  amount: number;
  paid: boolean;
  payment_date: string | null;
  payment_method: string | null;
  competence_month: number | null;
  competence_year: number | null;
  created_at: string;
}

export interface Budget {
  id: string;
  year: number;
  category_id: string;
  planned_amount: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: ExpenseCategory;
}

export interface MarketingPost {
  id: string;
  post_type: 'Story' | 'Feed' | 'Reel' | 'Campanha';
  reference_date: string;
  published: boolean;
  published_by: string | null;
  published_at: string | null;
  created_at: string;
  publisher?: User | null;
}

export interface MarketingKPIs {
  id: string;
  reference_date: string;
  period_type: 'weekly' | 'monthly';
  stories_count: number;
  feed_count: number;
  reels_count: number;
  campaigns_count: number;
  followers: number;
  reach: number;
  engagement: number;
  weekly_goal: number;
  monthly_goal: number;
  created_at: string;
  updated_at: string;
}

export interface InstagramIntegration {
  id: string;
  instagram_business_id: string | null;
  facebook_page_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  connected: boolean;
  connected_at: string | null;
  disconnected_at: string | null;
  account_name: string | null;
  username: string | null;
  profile_pic_url: string | null;
  followers_count: number;
  media_count: number;
  last_post_date: string | null;
  last_sync_at: string | null;
  sync_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomeInsight {
  id: string;
  type: 'warning' | 'positive' | 'critical' | 'info';
  title: string;
  description: string;
  priority: number;
  icon: string;
}

export interface CalendarDayInfo {
  date: string;
  day: number;
  isWeekend: boolean;
  isToday: boolean;
  hasRevenue: boolean;
  hasExpense: boolean;
  hasMovement: boolean;
  isWeekday: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  module: string;
  operation: string;
  record_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
  user?: User | null;
}

export interface RevenueWithCategory extends Revenue {
  category: RevenueCategory;
}

export interface ExpenseWithRelations extends Expense {
  category: ExpenseCategory;
  cost_center: CostCenter;
  subcategory: ExpenseSubcategory | null;
  installments: ExpenseInstallment[];
}

export interface DashboardKPIs {
  receitaAcumulada: number;
  despesaAcumulada: number;
  resultado: number;
  projecao: number;
  ticketMedio: number;
  maiorCategoriaDespesa: string;
  quantidadeVendas: number;
  margem: number;
  receitaDiariaMedia: number;
  resultadoMesAnterior: number;
  receitaMesAnterior: number;
  despesaMesAnterior: number;
  variacaoResultado: number;
  variacaoReceita: number;
  variacaoDespesa: number;
  totalBudget: number;
}

export interface DREData {
  receitaBruta: number;
  receitaPorCategoria: { category: string; amount: number }[];
  deducoes: number;
  receitaLiquida: number;
  despesasOperacionais: number;
  despesasPorCategoria: { category: string; amount: number }[];
  resultadoOperacional: number;
  margemOperacional: number;
}

export interface BudgetExecution {
  category_id: string;
  categoryName: string;
  planned: number;
  actual: number;
  difference: number;
  differencePercent: number;
  executionPercent: number;
}

export interface ChangeHistory {
  id: string;
  table_name: string;
  record_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: string | null;
  changed_at: string;
  user?: User | null;
}
