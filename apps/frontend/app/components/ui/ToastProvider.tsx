"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

type ToastVariant = "success" | "error";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextType = {
  toast: (message: string, variant: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant) => {
      const id = ++counterRef.current;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => remove(id), 3000);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Portal — top right */}
      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "none",
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: 10,
              border: `1px solid ${t.variant === "success" ? "#166534" : "#7f1d1d"}`,
              background: t.variant === "success" ? "#052e16" : "#1c0a0a",
              color: t.variant === "success" ? "#4ade80" : "#f87171",
              fontSize: 18,
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              animation: "toastIn 0.25s ease",
              minWidth: 440,
              maxWidth: 720,
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: 14, flexShrink: 0 }}>
              {t.variant === "success" ? "✓" : "✗"}
            </span>

            {/* Message */}
            <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>

            {/* Close */}
            <button
              onClick={() => remove(t.id)}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                opacity: 0.5,
                fontSize: 14,
                padding: 0,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}