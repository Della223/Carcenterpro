import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  BarChart3,
  FileText,
  Target,
  ClipboardList,
  Settings,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

export type ScreenId =
  | 'home'
  | 'comercial'
  | 'despesas'
  | 'dashboard'
  | 'dre'
  | 'orcamentos'
  | 'relatorios'
  | 'configuracoes'
  | 'ajuda';

export interface NavItem {
  id: ScreenId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'HOME', icon: LayoutDashboard, description: 'Centro de Inteligência Empresarial' },
  { id: 'comercial', label: 'Comercial', icon: DollarSign, description: 'Receitas e vendas' },
  { id: 'despesas', label: 'Despesas', icon: Receipt, description: 'Lançamento de despesas' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Gráficos e indicadores' },
  { id: 'dre', label: 'DRE', icon: FileText, description: 'Demonstração do resultado' },
  { id: 'orcamentos', label: 'Orçamentos', icon: Target, description: 'Orçado x realizado' },
  { id: 'relatorios', label: 'Relatórios', icon: ClipboardList, description: 'Análises e exportações' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, description: 'Preferências do sistema' },
  { id: 'ajuda', label: 'Ajuda', icon: HelpCircle, description: 'Suporte e documentação' },
];
