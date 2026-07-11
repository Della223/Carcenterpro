import {
  DollarSign, TrendingUp, TrendingDown, Target, Percent,
  Calendar, BarChart3
} from 'lucide-react';
import KPICard from '../ui/KPICard';
import type { DashboardKPIs } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/format';

interface ExecutivePanelProps {
  kpis: DashboardKPIs;
}

export default function ExecutivePanel({ kpis }: ExecutivePanelProps) {
  const receitaTrend = kpis.variacaoReceita >= 0 ? 'up' : 'down';
  const despesaTrend = kpis.variacaoDespesa <= 0 ? 'up' : 'down';
  const resultadoTrend = kpis.variacaoResultado >= 0 ? 'up' : 'down';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receita do Mês"
          value={formatCurrency(kpis.receitaAcumulada)}
          icon={DollarSign}
          iconColor="text-success-600"
          iconBg="bg-success-50"
          comparison="vs mês anterior"
          trend={receitaTrend}
          trendValue={`${kpis.variacaoReceita >= 0 ? '+' : ''}${kpis.variacaoReceita.toFixed(1)}%`}
        />
        <KPICard
          title="Despesas do Mês"
          value={formatCurrency(kpis.despesaAcumulada)}
          icon={TrendingDown}
          iconColor="text-error-600"
          iconBg="bg-error-50"
          comparison="vs mês anterior"
          trend={despesaTrend}
          trendValue={`${kpis.variacaoDespesa >= 0 ? '+' : ''}${kpis.variacaoDespesa.toFixed(1)}%`}
        />
        <KPICard
          title="Resultado Operacional"
          value={formatCurrency(kpis.resultado)}
          icon={TrendingUp}
          iconColor={kpis.resultado >= 0 ? 'text-success-600' : 'text-error-600'}
          iconBg={kpis.resultado >= 0 ? 'bg-success-50' : 'bg-error-50'}
          comparison="vs mês anterior"
          trend={resultadoTrend}
          trendValue={`${kpis.variacaoResultado >= 0 ? '+' : ''}${kpis.variacaoResultado.toFixed(1)}%`}
        />
        <KPICard
          title="Projeção Fechamento"
          value={formatCurrency(kpis.projecao)}
          icon={Target}
          iconColor="text-primary-600"
          iconBg="bg-primary-50"
          comparison="estimativa mensal"
          trend="neutral"
          trendValue={formatCurrency(kpis.projecao)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Margem"
          value={formatPercent(kpis.margem)}
          icon={Percent}
          iconColor={kpis.margem >= 20 ? 'text-success-600' : kpis.margem >= 10 ? 'text-warning-600' : 'text-error-600'}
          iconBg={kpis.margem >= 20 ? 'bg-success-50' : kpis.margem >= 10 ? 'bg-warning-50' : 'bg-error-50'}
        />
        <KPICard
          title="Receita Diária Média"
          value={formatCurrency(kpis.receitaDiariaMedia)}
          icon={Calendar}
          iconColor="text-primary-600"
          iconBg="bg-primary-50"
        />
        <KPICard
          title="vs Orçamento"
          value={formatCurrency(kpis.totalBudget)}
          icon={BarChart3}
          iconColor={kpis.resultado >= 0 ? 'text-success-600' : 'text-error-600'}
          iconBg={kpis.resultado >= 0 ? 'bg-success-50' : 'bg-error-50'}
          comparison={kpis.totalBudget > 0 ? `${((kpis.despesaAcumulada / kpis.totalBudget) * 100).toFixed(0)}% usado` : 'sem orçamento'}
          trend="neutral"
          trendValue={formatCurrency(kpis.despesaAcumulada)}
        />
        <KPICard
          title="Qtd. Vendas"
          value={String(kpis.quantidadeVendas)}
          icon={DollarSign}
          iconColor="text-accent-600"
          iconBg="bg-accent-50"
          comparison={`Ticket: ${formatCurrency(kpis.ticketMedio)}`}
          trend="neutral"
          trendValue={formatCurrency(kpis.ticketMedio)}
        />
      </div>
    </div>
  );
}
