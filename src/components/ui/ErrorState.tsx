import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Não foi possível carregar os dados.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error-50 ring-1 ring-error-100">
        <AlertCircle className="h-8 w-8 text-error-500" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-800">Erro</h3>
      <p className="mt-1 text-sm text-ink-500 max-w-sm text-center">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-6">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
