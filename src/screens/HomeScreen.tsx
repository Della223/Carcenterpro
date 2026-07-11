import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import ErrorState from '../components/ui/ErrorState';
import { KPISkeleton, Skeleton } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { fetchHomeData, type HomeData } from '../services/home.service';
import { fetchInstagramIntegration } from '../services/marketing.service';
import { getCurrentCompetence, getCompetenceString, formatDate } from '../utils/format';
import type { InstagramIntegration } from '../types';
import ExecutivePanel from '../components/home/ExecutivePanel';
import TodayPanel from '../components/home/TodayPanel';
import FinanceCalendar from '../components/home/FinanceCalendar';
import ManagerAssistant from '../components/home/ManagerAssistant';
import MarketingIntelligence from '../components/home/MarketingIntelligence';

export default function HomeScreen() {
  const { user } = useAuth();
  const toast = useToast();
  const { month, year } = getCurrentCompetence();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<HomeData | null>(null);
  const [integration, setIntegration] = useState<InstagramIntegration | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [homeData, integ] = await Promise.all([
        fetchHomeData(month, year),
        fetchInstagramIntegration(),
      ]);
      setData(homeData);
      setIntegration(integ);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [month, year]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(false);
    await loadData();
    toast.success('Dados atualizados com sucesso.');
  };

  const handleDayClick = (date: string) => {
    toast.info(`Dia ${formatDate(date)} selecionado. Abra o módulo de Receitas ou Despesas para lançar.`);
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  })();

  if (loading) {
    return (
      <div className="space-y-6">
        <KPISkeleton />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState onRetry={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900">{greeting}, {user?.name}!</h2>
          <p className="text-sm text-ink-500">Competência: {getCompetenceString(month, year)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info" size="md">{formatDate(new Date().toISOString())}</Badge>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* 1. Painel Executivo */}
      <ExecutivePanel kpis={data.kpis} />

      {/* 2. Painel Hoje */}
      <TodayPanel insights={data.insights} />

      {/* 3. Calendário Financeiro + 4. Assistente Gerencial */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FinanceCalendar
          calendar={data.calendar}
          consecutiveEmptyDays={data.consecutiveEmptyDays}
          month={month}
          year={year}
          onDayClick={handleDayClick}
        />
        <ManagerAssistant insights={data.insights} />
      </div>

      {/* 5. Marketing Intelligence */}
      <div className="card p-5">
        <MarketingIntelligence
          marketing={data.marketing}
          integration={integration}
          onRefresh={loadData}
        />
      </div>
    </div>
  );
}
