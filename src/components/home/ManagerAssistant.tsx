import {
  AlertCircle, AlertTriangle, CheckCircle, TrendingUp,
  Target, Camera, Radio, Video, Percent,
  Bell, type LucideIcon,
} from 'lucide-react';
import Badge from '../ui/Badge';
import type { HomeInsight } from '../../types';

interface ManagerAssistantProps {
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

const TYPE_CONFIG = {
  critical: { bg: 'bg-error-50', text: 'text-error-700', icon: 'text-error-600', label: 'Crítico', badge: 'error' as const },
  warning: { bg: 'bg-warning-50', text: 'text-warning-700', icon: 'text-warning-600', label: 'Atenção', badge: 'warning' as const },
  positive: { bg: 'bg-success-50', text: 'text-success-700', icon: 'text-success-600', label: 'Positivo', badge: 'success' as const },
  info: { bg: 'bg-primary-50', text: 'text-primary-700', icon: 'text-primary-600', label: 'Info', badge: 'info' as const },
};

export default function ManagerAssistant({ insights }: ManagerAssistantProps) {
  const alertCount = insights.filter((i) => i.type === 'critical' || i.type === 'warning').length;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
            <Bell className="h-4.5 w-4.5 text-primary-600" />
          </div>
          <h3 className="text-base font-semibold text-ink-900">Assistente Gerencial</h3>
        </div>
        {alertCount > 0 && <Badge variant="error">{alertCount} alerta(s)</Badge>}
      </div>

      {insights.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg bg-success-50 p-4">
          <CheckCircle className="h-5 w-5 text-success-500" />
          <p className="text-sm font-medium text-success-700">Tudo em ordem! Nenhum alerta no momento.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map((insight) => {
            const Icon = ICON_MAP[insight.icon] ?? AlertCircle;
            const config = TYPE_CONFIG[insight.type];
            return (
              <div key={insight.id} className={`flex items-start gap-3 rounded-lg ${config.bg} p-3 transition-all hover:shadow-sm`}>
                <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.icon}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${config.text}`}>{insight.title}</p>
                    <Badge variant={config.badge} size="sm">{config.label}</Badge>
                  </div>
                  <p className="text-xs text-ink-600 mt-0.5">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
