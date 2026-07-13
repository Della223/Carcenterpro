import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-success-50 text-success-700 ring-success-200',
  error: 'bg-error-50 text-error-700 ring-error-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  info: 'bg-primary-50 text-primary-700 ring-primary-200',
};

const iconColors = {
  success: 'text-success-500',
  error: 'text-error-500',
  warning: 'text-warning-500',
  info: 'text-primary-500',
};

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: (id: string) => void }) {
  const Icon = icons[toast.type];
  return (
    <div className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ring-1 ring-inset ${styles[toast.type]} animate-slide-in shadow-md`}>
      <Icon className={`h-5 w-5 flex-shrink-0 ${iconColors[toast.type]}`} />
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="text-ink-400 hover:text-ink-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContextValue {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const value: ToastContextValue = {
    success: useCallback((msg: string) => addToast('success', msg), [addToast]),
    error: useCallback((msg: string) => addToast('error', msg), [addToast]),
    warning: useCallback((msg: string) => addToast('warning', msg), [addToast]),
    info: useCallback((msg: string) => addToast('info', msg), [addToast]),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
