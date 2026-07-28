import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Render Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl shadow-2xl border text-sm font-sans transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-slate-900 border-red-500/50 text-red-300'
                : toast.type === 'warning'
                ? 'bg-slate-900 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-blue-500/50 text-blue-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 shrink-0 ml-2"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
