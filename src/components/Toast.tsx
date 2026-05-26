import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import type { ToastType } from '../types';

interface ToastProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      bg: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
    },
    error: {
      bg: 'bg-rose-950/90 border-rose-500/30 text-rose-400',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
    },
    info: {
      bg: 'bg-blue-950/90 border-blue-500/30 text-blue-400',
      icon: Info,
      iconColor: 'text-blue-400',
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${config.bg}`}
    >
      <div className={`mt-0.5 ${config.iconColor}`}>
        <Icon size={18} />
      </div>
      <div className="flex-grow">
        <p className="text-xs font-semibold text-white">
          {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notification'}
        </p>
        <p className="text-xs text-slate-300 mt-0.5 leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};
