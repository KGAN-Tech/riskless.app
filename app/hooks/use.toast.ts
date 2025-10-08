import { useState } from 'react';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  open: boolean;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (options: Omit<Toast, 'id' | 'open'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...options, id, open: true };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto dismiss after duration (default 5 seconds)
    const duration = options.duration || 5000;
    setTimeout(() => {
      dismiss(id);
    }, duration);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, toast, dismiss };
};