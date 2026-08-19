import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastState {
  message: string;
  type: ToastType;
  id: number;
}

interface ToastStore {
  toast: ToastState | null;
  showToast: (message: string, type?: ToastType) => void;
  clearToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,

  showToast: (message, type = 'info') => {
    set({
      toast: {
        message,
        type,
        id: Date.now(),
      },
    });
  },

  clearToast: () => {
    set({
      toast: null,
    });
  },
}));

export const toast = (
  message: string,
  type: ToastType = 'info'
) => {
  useToastStore.getState().showToast(message, type);
};