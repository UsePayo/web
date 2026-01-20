'use client';

import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const bgColors: Record<ToastType, string> = {
    success: 'bg-green-100 border-green-600',
    error: 'bg-red-100 border-marker',
    info: 'bg-blue-100 border-pen',
    warning: 'bg-yellow-100 border-yellow-600',
  };

  const icons: Record<ToastType, string> = {
    success: '\u2713',
    error: '\u2717',
    info: '\u2139',
    warning: '\u26A0',
  };

  return (
    <div
      className={`
        ${bgColors[toast.type]}
        border-2 border-pencil p-4 shadow-hard
        font-body text-pencil
        animate-slide-in
        flex items-start gap-3
      `}
      style={{
        borderRadius: '2px 8px 2px 8px',
      }}
    >
      <span className="text-xl">{icons[toast.type]}</span>
      <p className="flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-pencil/60 hover:text-pencil font-heading text-xl leading-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}
