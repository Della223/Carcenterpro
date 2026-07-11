import { Construction } from 'lucide-react';
import type { NavItem } from '../config/navigation';

interface PlaceholderScreenProps {
  item: NavItem;
}

export default function PlaceholderScreen({ item }: PlaceholderScreenProps) {
  const Icon = item.icon;
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 ring-1 ring-primary-100">
        <Icon className="h-10 w-10 text-primary-500" />
      </div>
      <h2 className="mt-6 text-xl font-bold text-ink-900">{item.label}</h2>
      <p className="mt-2 text-sm text-ink-500 max-w-sm text-center">{item.description}</p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 text-sm font-medium text-accent-700 ring-1 ring-inset ring-accent-200">
        <Construction className="h-4 w-4" />
        Em desenvolvimento
      </div>
      <p className="mt-4 text-xs text-ink-400 max-w-md text-center">
        Esta tela será implementada nos próximos blocos de desenvolvimento, conforme as especificações de regras de negócio forem fornecidas.
      </p>
    </div>
  );
}
