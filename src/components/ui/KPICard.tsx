import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  comparison?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBg = 'bg-primary-50',
  comparison,
  trend,
  trendValue,
  onClick,
}: KPICardProps) {
  return (
    <div
      className={`card p-5 ${onClick ? 'cursor-pointer hover:shadow-cardHover transition-all' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-500 truncate">{title}</p>
          <p className="mt-2 text-2xl font-bold text-ink-900 tracking-tight">{value}</p>
          {comparison && (
            <div className="mt-2 flex items-center gap-1.5">
              {trend === 'up' && <TrendingUp className="h-4 w-4 text-success-500" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 text-error-500" />}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-error-600' : 'text-ink-500'}`}>
                {trendValue}
              </span>
              <span className="text-xs text-ink-400">{comparison}</span>
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-5.5 w-5.5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
