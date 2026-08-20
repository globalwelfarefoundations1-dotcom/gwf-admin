import { Check, Info, TriangleAlert, X } from 'lucide-react';
import { useEffect } from 'react';
import { useToastStore } from '../store/toastStore';

export function ToastContainer() {
  const toast = useToastStore((state) => state.toast);
  const clearToast = useToastStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      clearToast();
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast, clearToast]);

  if (!toast) {
    return null;
  }

  const config = {
    success: {
      icon: <Check size={15} />,
      iconBg: 'bg-emerald-500',
    },

    error: {
      icon: <TriangleAlert size={15} />,
      iconBg: 'bg-red-500',
    },

    warning: {
      icon: <TriangleAlert size={15} />,
      iconBg: 'bg-amber-500',
    },

    info: {
      icon: <Info size={15} />,
      iconBg: 'bg-blue-500',
    },
  };

  const current = config[toast.type];

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3 rounded-xl bg-stone-900 px-4 py-3 text-sm text-white shadow-xl">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${current.iconBg}`}
      >
        {current.icon}
      </span>

      <span className="min-w-0 flex-1">
        {toast.message}
      </span>

      <button
        type="button"
        onClick={clearToast}
        aria-label="Close notification"
        className="shrink-0 text-stone-400 transition hover:text-white"
      >
        <X size={15} />
      </button>
    </div>
  );
}