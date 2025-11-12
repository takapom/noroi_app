'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export type ToastType = 'info' | 'warning' | 'error' | 'success';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyleByType = () => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-moonlight-700 to-moonlight-800',
          border: 'border-moonlight-500',
          text: 'text-moonlight-200',
          icon: 'ℹ️',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-800 to-amber-900',
          border: 'border-amber-600',
          text: 'text-amber-200',
          icon: '⚠️',
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-bloodstain-800 to-bloodstain-900',
          border: 'border-bloodstain-600',
          text: 'text-bloodstain-200',
          icon: '❌',
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-800 to-green-900',
          border: 'border-green-600',
          text: 'text-green-200',
          icon: '✅',
        };
    }
  };

  const style = getStyleByType();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-[9999]
        ${style.bg} ${style.text}
        border-2 ${style.border}
        px-6 py-4 rounded-lg
        shadow-2xl backdrop-blur-sm
        max-w-md w-full mx-4
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{style.icon}</span>
        <div className="flex-1">
          <p className="font-body text-sm leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-bone-400 hover:text-bone-200 transition-colors ml-2 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-1 bg-bone-400/30 rounded-b-lg"
      />

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-bone-400/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-bone-400/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-bone-400/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-bone-400/40" />
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-0 left-0 w-full z-[9999] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => onClose(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
