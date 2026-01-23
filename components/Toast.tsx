'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast = { ...toast, id, duration: toast.duration || 4000 };
        setToasts(prev => [...prev, newToast]);

        // Auto remove
        setTimeout(() => {
            removeToast(id);
        }, newToast.duration);
    }, [removeToast]);

    const success = useCallback((title: string, message?: string) => {
        addToast({ type: 'success', title, message });
    }, [addToast]);

    const error = useCallback((title: string, message?: string) => {
        addToast({ type: 'error', title, message, duration: 6000 });
    }, [addToast]);

    const warning = useCallback((title: string, message?: string) => {
        addToast({ type: 'warning', title, message });
    }, [addToast]);

    const info = useCallback((title: string, message?: string) => {
        addToast({ type: 'info', title, message });
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast, index) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} index={index} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose, index }: { toast: Toast; onClose: () => void; index: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(onClose, 300);
    };

    const icons = {
        success: <CheckCircle size={22} />,
        error: <XCircle size={22} />,
        warning: <AlertCircle size={22} />,
        info: <Info size={22} />
    };

    const colors = {
        success: 'from-emerald-500 to-green-600',
        error: 'from-rose-500 to-red-600',
        warning: 'from-amber-500 to-orange-500',
        info: 'from-sky-500 to-blue-600'
    };

    const bgColors = {
        success: 'bg-emerald-50 border-emerald-200',
        error: 'bg-rose-50 border-rose-200',
        warning: 'bg-amber-50 border-amber-200',
        info: 'bg-sky-50 border-sky-200'
    };

    const textColors = {
        success: 'text-emerald-700',
        error: 'text-rose-700',
        warning: 'text-amber-700',
        info: 'text-sky-700'
    };

    return (
        <div
            className={`
        pointer-events-auto
        max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      `}
            style={{
                transitionDelay: `${index * 50}ms`,
            }}
        >
            {/* Premium Glass Card */}
            <div className={`
        relative overflow-hidden
        rounded-2xl border ${bgColors[toast.type]}
        backdrop-blur-xl
        shadow-2xl shadow-black/10
      `}>
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[toast.type]}`} />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />

                <div className="relative p-4 flex items-start gap-4">
                    {/* Icon with glow */}
                    <div className={`
            relative flex-shrink-0
            w-10 h-10 rounded-xl
            bg-gradient-to-br ${colors[toast.type]}
            flex items-center justify-center
            text-white
            shadow-lg
          `}>
                        {icons[toast.type]}
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors[toast.type]} blur-lg opacity-50 -z-10`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className={`font-bold text-sm ${textColors[toast.type]}`}>
                            {toast.title}
                        </p>
                        {toast.message && (
                            <p className={`text-xs mt-1 ${textColors[toast.type]} opacity-80`}>
                                {toast.message}
                            </p>
                        )}
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className={`
              flex-shrink-0
              w-8 h-8 rounded-lg
              flex items-center justify-center
              ${textColors[toast.type]} opacity-40 hover:opacity-100
              hover:bg-black/5
              transition-all duration-200
            `}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
                    <div
                        className={`h-full bg-gradient-to-r ${colors[toast.type]} origin-left`}
                        style={{
                            animation: `shrink ${toast.duration || 4000}ms linear forwards`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// Add these styles to globals.css:
// @keyframes shimmer { to { transform: translateX(100%); } }
// @keyframes shrink { from { transform: scaleX(1); } to { transform: scaleX(0); } }
// .animate-shimmer { animation: shimmer 2s infinite; }
