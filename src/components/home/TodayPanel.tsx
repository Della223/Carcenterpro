import {
  AlertCircle, AlertTriangle, CheckCircle, TrendingUp,
  Target, Camera, Radio, Video, DollarSign, Percent,
  type LucideIcon,
} from 'lucide-react';
import Badge from '../ui/Badge';
import type { HomeInsight } from '../../types';

interface TodayPanelProps {
  insights: HomeInsight[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'trending-up': TrendingUp,
  'trending-down': TrendingUp,
  'target': Target,
  'camera': Camera,
  'radio': Radio,
  'video': Video,
  'percent': Percent,
};

export default function TodayPanel({ insights }: TodayPanelProps) {
  const attention = insights.filter((i) => i.type === 'critical' || i.type === 'warning');
  const positives = insights.filter((i) => i.type === 'positive');

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Requer Atenção */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error-50">
              <AlertCircle className="h-4.5 w-4.5 text-error-600" />
            </div>
            <h3 className="text-base font-semibold text-ink-900">Requer Atenção</h3>
          </div>
          {attention.length > 0 && <Badge variant="error">{attention.length}</Badge>}
        </div>

        {attention.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg bg-success-50 p-4">
            <CheckCircle className="h-5 w-5 text-success-500" />
            <p className="text-sm font-medium text-success-700">Tudo em ordem! Nenhuma pendência.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {attention.map((insight) => {
              const Icon = ICON_MAP[insight.icon] ?? AlertCircle;
              const isCritical = insight.type === 'critical';
              return (
                <div
                  key={insight.id}
                  className={`flex items-start gap-3 rounded-lg p-3 transition-all ${
                    isCritical ? 'bg-error-50' : 'bg-warning-50'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 flex-shrink-0 mt-0.5 ${isCritical ? 'text-error-600' : 'text-warning-600'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isCritical ? 'text-error-700' : 'text-warning-700'}`}>
                      {insight.title}
                    </p>
                    <p className="text-xs text-ink-600 mt-0.5">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Destaques Positivos */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-50">
              <CheckCircle className="h-4.5 w-4.5 text-success-600" />
            </div>
            <h3 className="text-base font-semibold text-ink-900">Destaques Positivos</h3>
          </div>
          {positives.length > 0 && <Badge variant="success">{positives.length}</Badge>}
        </div>

        {positives.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg bg-ink-50 p-4">
            <DollarSign className="h-5 w-5 text-ink-400" />
            <p className="text-sm text-ink-500">Ainda não há destaques positivos neste mês.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {positives.map((insight) => {
              const Icon = ICON_MAP[insight.icon] ?? CheckCircle;
              return (
                <div key={insight.id} className="flex items-start gap-3 rounded-lg bg-success-50 p-3">
                  <Icon className="h-4.5 w-4.5 flex-shrink-0 mt-0.5 text-success-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-success-700">{insight.title}</p>
                    <p className="text-xs text-ink-600 mt-0.5">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
