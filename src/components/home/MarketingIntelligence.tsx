import { useState, useMemo } from 'react';
import {
  Megaphone, Camera, Radio, Video,
  CheckCircle, TrendingUp, Calendar,
  AlertCircle, Clock, Lightbulb, type LucideIcon,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { createMarketingPost, publishMarketingPost } from '../../services/marketing.service';
import { formatDate } from '../../utils/format';
import type { MarketingPost, InstagramIntegration } from '../../types';

interface MarketingIntelligenceProps {
  marketing: MarketingPost[];
  integration: InstagramIntegration | null;
  onRefresh: () => void;
}

type PostType = 'Story' | 'Feed' | 'Reel' | 'Campanha';

const POST_CONFIG: Record<PostType, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  Story: { icon: Camera, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Story' },
  Feed: { icon: Radio, color: 'text-secondary-600', bg: 'bg-secondary-50', label: 'Feed' },
  Reel: { icon: Video, color: 'text-primary-600', bg: 'bg-primary-50', label: 'Reel' },
  Campanha: { icon: Megaphone, color: 'text-success-600', bg: 'bg-success-50', label: 'Campanha' },
};

export default function MarketingIntelligence({
  marketing, integration, onRefresh,
}: MarketingIntelligenceProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PostType>('Story');

  const isApiConnected = integration?.connected ?? false;

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const storiesToday = marketing.filter((m) => m.post_type === 'Story' && m.reference_date === today && m.published).length;
    const feedToday = marketing.filter((m) => m.post_type === 'Feed' && m.reference_date === today && m.published).length;
    const reelsThisWeek = marketing.filter((m) => m.post_type === 'Reel' && m.reference_date >= weekAgoStr && m.published).length;
    const campaignsThisMonth = marketing.filter((m) => m.post_type === 'Campanha' && m.published).length;

    const publishedPosts = marketing.filter((m) => m.published).sort((a, b) => b.reference_date.localeCompare(a.reference_date));
    const lastPost = publishedPosts[0];
    const lastPostDate = lastPost?.reference_date;
    const daysWithoutPost = lastPostDate
      ? Math.floor((new Date(today).getTime() - new Date(lastPostDate + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const storiesThisWeek = marketing.filter((m) => m.post_type === 'Story' && m.reference_date >= weekAgoStr && m.published).length;
    const weeklyGoal = 5;
    const monthlyGoal = 20;

    return {
      storiesToday, feedToday, reelsThisWeek, campaignsThisMonth,
      lastPostDate, daysWithoutPost,
      storiesThisWeek, weeklyGoal, monthlyGoal,
      totalPosts: marketing.length,
    };
  }, [marketing]);

  const alerts = useMemo(() => {
    const result: { id: string; text: string; type: 'warning' | 'info' }[] = [];
    const dayOfWeek = new Date().getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    if (isWeekday && stats.storiesToday === 0) {
      result.push({ id: 'no-story', text: 'Hoje ainda não foi publicado Story.', type: 'warning' });
    }
    if (isWeekday && stats.feedToday === 0) {
      result.push({ id: 'no-feed', text: 'Hoje ainda não foi publicado Feed.', type: 'warning' });
    }
    if (stats.daysWithoutPost > 5) {
      result.push({ id: 'reels-gap', text: `Mais de 5 dias sem Reel (${stats.daysWithoutPost} dias).`, type: 'warning' });
    }
    if (stats.storiesThisWeek < stats.weeklyGoal) {
      result.push({ id: 'weekly-goal', text: `Meta semanal abaixo do esperado (${stats.storiesThisWeek}/${stats.weeklyGoal}).`, type: 'warning' });
    }
    return result;
  }, [stats]);

  const recommendations = useMemo(() => {
    const result: string[] = [];
    if (stats.daysWithoutPost > 3) {
      result.push(`Há ${stats.daysWithoutPost} dias sem publicação no Feed.`);
    }
    result.push('O melhor horário para postagem é entre 18h e 20h.');
    if (stats.reelsThisWeek > 0) {
      result.push('Os Reels possuem maior engajamento.');
    }
    if (stats.storiesThisWeek < stats.weeklyGoal) {
      result.push('A frequência de Stories caiu nesta semana.');
    }
    return result;
  }, [stats]);

  const handleRegister = (type: PostType) => {
    setSelectedType(type);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const post = await createMarketingPost({ post_type: selectedType, reference_date: today, published: true });
      await publishMarketingPost(post.id, user.id);
      toast.success(`${POST_CONFIG[selectedType].label} registrado com sucesso.`);
      setModalOpen(false);
      onRefresh();
    } catch {
      toast.error('Não foi possível registrar a publicação.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with API status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
            <Megaphone className="h-4.5 w-4.5 text-primary-600" />
          </div>
          <h3 className="text-base font-semibold text-ink-900">Marketing Intelligence</h3>
        </div>
        <div className="flex items-center gap-3">
          {isApiConnected && integration?.profile_pic_url ? (
            <div className="flex items-center gap-2">
              <img
                src={integration.profile_pic_url}
                alt={integration.account_name ?? 'Instagram'}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-ink-200"
              />
              <div className="text-xs">
                <p className="font-semibold text-ink-700">{integration.account_name ?? '-'}</p>
                <p className="text-ink-400">@{integration.username ?? '-'}</p>
              </div>
            </div>
          ) : null}
          {isApiConnected ? (
            <Badge variant="success">API Conectada</Badge>
          ) : (
            <Badge variant="neutral">Modo Manual</Badge>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Stories Hoje', value: stats.storiesToday, icon: Camera, color: 'text-accent-600', bg: 'bg-accent-50' },
          { label: 'Feed Hoje', value: stats.feedToday, icon: Radio, color: 'text-secondary-600', bg: 'bg-secondary-50' },
          { label: 'Reels Semana', value: stats.reelsThisWeek, icon: Video, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Meta Semanal', value: `${stats.storiesThisWeek}/${stats.weeklyGoal}`, icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Última Postagem', value: stats.lastPostDate ? formatDate(stats.lastPostDate) : '-', icon: Calendar, color: 'text-ink-600', bg: 'bg-ink-100' },
          { label: 'Dias sem Post', value: stats.daysWithoutPost, icon: Clock, color: stats.daysWithoutPost > 5 ? 'text-error-600' : 'text-ink-600', bg: stats.daysWithoutPost > 5 ? 'bg-error-50' : 'bg-ink-100' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-xs text-ink-500">{kpi.label}</p>
              <p className="text-lg font-bold text-ink-900">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Manual registration buttons */}
        <div className="card p-5">
          <h4 className="text-sm font-semibold text-ink-900 mb-3">Registrar Publicação</h4>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(POST_CONFIG) as PostType[]).map((type) => {
              const config = POST_CONFIG[type];
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => handleRegister(type)}
                  className="flex flex-col items-center gap-2 rounded-lg bg-ink-50 p-3 hover:bg-ink-100 transition-all active:scale-[0.98]"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${config.color}`} />
                  </div>
                  <span className="text-xs font-medium text-ink-700">{config.label}</span>
                </button>
              );
            })}
          </div>
          {!isApiConnected && (
            <p className="mt-3 text-xs text-ink-400">
              Conecte o Instagram Business nas Configurações para automação completa.
            </p>
          )}
        </div>

        {/* Alerts */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4.5 w-4.5 text-warning-600" />
            <h4 className="text-sm font-semibold text-ink-900">Alertas</h4>
          </div>
          {alerts.length === 0 ? (
            <p className="text-sm text-ink-500">Nenhum alerta no momento.</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 rounded-lg bg-warning-50 p-2.5">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                  <p className="text-xs text-warning-700">{alert.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Intelligence / Recommendations */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4.5 w-4.5 text-primary-600" />
            <h4 className="text-sm font-semibold text-ink-900">Inteligência</h4>
          </div>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-primary-50 p-2.5">
                <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary-600" />
                <p className="text-xs text-primary-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial Calendar */}
      <div className="card p-5">
        <h4 className="text-sm font-semibold text-ink-900 mb-3">Calendário Editorial</h4>
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {marketing.slice(0, 20).map((post) => {
              const config = POST_CONFIG[post.post_type];
              const Icon = config.icon;
              return (
                <div
                  key={post.id}
                  className={`flex flex-col items-center gap-1 rounded-lg ${config.bg} p-2.5 min-w-[80px]`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <span className="text-xs font-medium text-ink-700">{formatDate(post.reference_date)}</span>
                  {post.published ? (
                    <CheckCircle className="h-3.5 w-3.5 text-success-500" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-ink-400" />
                  )}
                </div>
              );
            })}
            {marketing.length === 0 && (
              <p className="text-sm text-ink-400 py-4">Nenhuma publicação registrada.</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm registration modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Registrar ${POST_CONFIG[selectedType].label}`}
        size="sm"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleConfirm} className="btn-primary">
              <CheckCircle className="h-4 w-4" />
              Confirmar
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          Deseja registrar a publicação de <strong>{POST_CONFIG[selectedType].label}</strong> para hoje ({formatDate(new Date().toISOString())})?
        </p>
      </Modal>
    </div>
  );
}
