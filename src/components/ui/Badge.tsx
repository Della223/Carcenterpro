import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

const variants = {
  success: 'bg-success-50 text-success-700 ring-success-200',
  error: 'bg-error-50 text-error-700 ring-error-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  info: 'bg-primary-50 text-primary-700 ring-primary-200',
  neutral: 'bg-ink-100 text-ink-600 ring-ink-200',
};

export default function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ring-1 ring-inset ${variants[variant]} ${sizeClass}`}>
      {children}
    </span>
  );
}
