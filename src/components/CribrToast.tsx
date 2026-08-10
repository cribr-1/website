import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastListeners: Array<(toasts: ToastItem[]) => void> = [];
let toastsList: ToastItem[] = [];

export const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: ToastItem = { id, message, type };
  toastsList = [...toastsList, newToast];
  toastListeners.forEach((listener) => listener(toastsList));

  // Auto remove
  setTimeout(() => {
    toastsList = toastsList.filter((t) => t.id !== id);
    toastListeners.forEach((listener) => listener(toastsList));
  }, 4000);
};

export default function CribrToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleUpdate = (updatedToasts: ToastItem[]) => {
      setToasts(updatedToasts);
    };
    toastListeners.push(handleUpdate);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleUpdate);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className={`pointer-events-auto p-4 rounded-2xl border flex items-start gap-3 shadow-xl backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200/60 text-emerald-900"
                : toast.type === "error"
                ? "bg-rose-50/95 border-rose-200/60 text-rose-900"
                : "bg-white/95 border-neutral-200 text-apple-text-primary"
            }`}
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-apple-blue flex-shrink-0 mt-0.5" />}

            <div className="flex-grow text-[13px] font-semibold tracking-tight leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => {
                toastsList = toastsList.filter((t) => t.id !== toast.id);
                toastListeners.forEach((listener) => listener(toastsList));
              }}
              className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0 mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
