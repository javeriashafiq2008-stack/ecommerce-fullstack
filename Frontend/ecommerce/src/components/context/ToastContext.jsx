import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      const timer = setTimeout(() => removeToast(id), duration);
      timers.current.set(id, timer);
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message) => showToast(message, "success"),
    error: (message) => showToast(message, "error"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`min-w-[260px] max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white
              animate-[fadeIn_.2s_ease] flex items-start justify-between gap-3
              ${t.type === "success" ? "bg-[#123328]" : "bg-red-600"}`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="text-white/80 hover:text-white leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}