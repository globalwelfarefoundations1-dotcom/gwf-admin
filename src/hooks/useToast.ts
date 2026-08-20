import { useAdminStore } from "../store/useAdminStore";

export const useToast = () => {
  const showToast = useAdminStore(
    (state) => state.showToast
  );

  return {
    success: (message: string) => {
      showToast(message, "success");
    },

    error: (message: string) => {
      showToast(message, "error");
    },

    warning: (message: string) => {
      showToast(message, "warning");
    },

    info: (message: string) => {
      showToast(message, "info");
    },
  };
};