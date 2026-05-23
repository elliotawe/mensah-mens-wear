'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="size-4 shrink-0" />,
  error: <AlertCircle className="size-4 shrink-0" />,
  info: <Info className="size-4 shrink-0" />,
  warning: <AlertTriangle className="size-4 shrink-0" />,
};

const styles: Record<ToastType, string> = {
  success: 'bg-[var(--color-obsidian)] border-[var(--color-success)] text-[var(--color-parchment)]',
  error: 'bg-[var(--color-obsidian)] border-[var(--color-error)] text-[var(--color-parchment)]',
  info: 'bg-[var(--color-obsidian)] border-[var(--color-gold)] text-[var(--color-parchment)]',
  warning: 'bg-[var(--color-obsidian)] border-[var(--color-warning)] text-[var(--color-parchment)]',
};

const iconColors: Record<ToastType, string> = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-error)]',
  info: 'text-[var(--color-gold)]',
  warning: 'text-[var(--color-warning)]',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{
      toast: {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
        warning: (msg) => addToast(msg, 'warning'),
      },
    }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-(--z-toast) flex flex-col gap-3 w-85 max-w-[calc(100vw-2rem)]"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 px-4 py-3 rounded-[8px] border text-sm font-body shadow-(--shadow-elevated) animate-fade-up',
              styles[t.type]
            )}
            role="alert"
          >
            <span className={iconColors[t.type]}>{icons[t.type]}</span>
            <p className="flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-taupe hover:text-parchment transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}

export function ToastContainer() {
  return null;
}
