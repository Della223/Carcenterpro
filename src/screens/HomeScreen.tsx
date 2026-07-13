import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ErrorState from '../components/ui/ErrorState';
import { KPISkeleton, Skeleton } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { fetchHomeData, type HomeData } from '../services/home.service';
import { getCurrentCompetence, getCompetenceString, formatDate } from '../utils/format';
import ExecutivePanel from '../components/home/ExecutivePanel';
import TodayPanel from '../components/home/TodayPanel';
import ManagerAssistant from '../components/home/ManagerAssistant';

export default function HomeScreen() {
  const { user } = useAuth();
  const { month, year } = getCurrentCompetence();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<HomeData | null>(null);

  const loadData = useCallback(async () => {
    try {
      const homeData = await fetchHomeData(month, year);
      setData(homeData);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { loadData(); }, [loadData]);

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
    return <ErrorState onRetry={loadData} />;
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
        </div>
      </div>

      {/* 1. KPIs */}
      <ExecutivePanel kpis={data.kpis} />

      {/* 2. Assistente Gerencial */}
      <ManagerAssistant insights={data.insights} />

      {/* 3. Requer Atenção + 4. Destaques Positivos */}
      <TodayPanel insights={data.insights} />
    </div>
  );
}
