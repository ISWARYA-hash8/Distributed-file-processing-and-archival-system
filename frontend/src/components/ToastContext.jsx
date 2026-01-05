import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, { type = 'info', duration = 4000 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full px-4 py-2 rounded shadow-lg transform transition-all duration-300 ease-out origin-bottom-right bg-white dark:bg-gray-800 border ${
              toast.type === 'error' ? 'border-red-300' : toast.type === 'success' ? 'border-green-300' : 'border-gray-200'
            }`}
          >
            <div className="text-sm text-gray-900 dark:text-gray-100">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export default ToastContext;
