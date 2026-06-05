import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext();

const ICONS = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
};

let toastQueue = [];
let setToastsExternal = null;

export const showToast = (message, type = 'info', duration = 3500) => {
  const id = Date.now() + Math.random();
  const toast = { id, message, type, duration };
  toastQueue = [...toastQueue, toast];
  if (setToastsExternal) setToastsExternal([...toastQueue]);
  return id;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  setToastsExternal = setToasts;

  const removeToast = (id) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    setToasts([...toastQueue]);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-sm rounded-xl bg-white border border-borderGray shadow-hover px-4 py-3 animate-fade-in">
      {ICONS[toast.type]}
      <p className="flex-1 text-sm font-medium text-darkCharcoal leading-snug">{toast.message}</p>
      <button onClick={() => onClose(toast.id)} className="ml-2 p-0.5 rounded hover:bg-softGray transition-colors">
        <X className="h-4 w-4 text-mutedGray" />
      </button>
    </div>
  );
};

export const useToast = () => useContext(ToastContext);
