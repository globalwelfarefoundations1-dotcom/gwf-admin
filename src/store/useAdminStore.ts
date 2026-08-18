import { create } from "zustand";
import { authService } from "../api/services/authService";
import type {
  LoginUser,
  LoginResponse,
} from "../api/apiTypes";

export type Page =
  | "dashboard"
  | "projects"
  | "categories"
  | "profile";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface AdminState {
  // -----------------------------------------
  // UI
  // -----------------------------------------

  page: Page;
  collapsed: boolean;

  setPage: (page: Page) => void;
  toggleSidebar: () => void;

  // -----------------------------------------
  // AUTH
  // -----------------------------------------

  isAuthenticated: boolean;
  isAdmin: boolean;

  accessToken: string | null;
  refreshToken: string | null;

  user: LoginUser | null;

  authLoading: boolean;
  authError: string | null;

  login: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<boolean>;

  logout: () => void;

  clearAuthError: () => void;

  setAuthTokens: (
    accessToken: string,
    refreshToken?: string | null
  ) => void;

  // -----------------------------------------
  // TOAST
  // -----------------------------------------

  toast: ToastData | null;

  showToast: (
    message: string,
    type?: ToastType
  ) => void;

  clearToast: () => void;
}

const ACCESS_TOKEN_KEY = "gwf_access_token";
const REFRESH_TOKEN_KEY = "gwf_refresh_token";
const USER_KEY = "gwf_user";

const getStoredToken = (
  key: string
): string | null => {
  return (
    localStorage.getItem(key) ??
    sessionStorage.getItem(key)
  );
};

const getStoredUser = (): LoginUser | null => {
  const value =
    localStorage.getItem(USER_KEY) ??
    sessionStorage.getItem(USER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const initialAccessToken =
  getStoredToken(ACCESS_TOKEN_KEY);

const initialRefreshToken =
  getStoredToken(REFRESH_TOKEN_KEY);

const initialUser = getStoredUser();

export const useAdminStore = create<AdminState>(
  (set) => ({
    // -----------------------------------------
    // UI
    // -----------------------------------------

    page: "dashboard",

    collapsed: false,

    setPage: (page) => {
      set({
        page,
      });
    },

    toggleSidebar: () => {
      set((state) => ({
        collapsed: !state.collapsed,
      }));
    },

    // -----------------------------------------
    // AUTH INITIAL STATE
    // -----------------------------------------

    isAuthenticated: Boolean(initialAccessToken),

    isAdmin:
      initialUser?.role?.toLowerCase() ===
        "admin" ||
      initialUser?.role?.toLowerCase() ===
        "administrator" ||
      Boolean(initialAccessToken),

    accessToken: initialAccessToken,

    refreshToken: initialRefreshToken,

    user: initialUser,

    authLoading: false,

    authError: null,

    // -----------------------------------------
    // LOGIN
    // -----------------------------------------

    login: async (
      email,
      password,
      remember = true
    ) => {
      set({
        authLoading: true,
        authError: null,
      });

      try {
        const response =
          await authService.login({
            email,
            password,
          });

        const responseData =
          response.data ?? response;

        const accessToken =
          response.accessToken ??
          response.access_token ??
          response.token ??
          responseData?.accessToken ??
          responseData?.access_token ??
          responseData?.token ??
          null;

        const refreshToken =
          response.refreshToken ??
          response.refresh_token ??
          responseData?.refreshToken ??
          responseData?.refresh_token ??
          null;

        const user =
          response.user ??
          responseData?.user ??
          null;

        if (!accessToken) {
          throw new Error(
            "Access token was not returned by the server."
          );
        }

        const storage = remember
          ? localStorage
          : sessionStorage;

        // Clear both storage locations first.
        localStorage.removeItem(
          ACCESS_TOKEN_KEY
        );

        localStorage.removeItem(
          REFRESH_TOKEN_KEY
        );

        localStorage.removeItem(USER_KEY);

        sessionStorage.removeItem(
          ACCESS_TOKEN_KEY
        );

        sessionStorage.removeItem(
          REFRESH_TOKEN_KEY
        );

        sessionStorage.removeItem(USER_KEY);

        // Save access token.
        storage.setItem(
          ACCESS_TOKEN_KEY,
          accessToken
        );

        // Save refresh token if returned.
        if (refreshToken) {
          storage.setItem(
            REFRESH_TOKEN_KEY,
            refreshToken
          );
        }

        if (user) {
          storage.setItem(
            USER_KEY,
            JSON.stringify(user)
          );
        }

        set({
          isAuthenticated: true,
          isAdmin:
            user?.role?.toLowerCase() ===
              "admin" ||
            user?.role?.toLowerCase() ===
              "administrator" ||
            true,
          accessToken,
          refreshToken,
          user,
          authLoading: false,
          authError: null,
        });

        return true;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error?.response?.data?.error ??
          error?.message ??
          "Unable to sign in. Please try again.";

        set({
          authLoading: false,
          authError: message,
          isAuthenticated: false,
        });

        return false;
      }
    },

    // -----------------------------------------
    // LOGOUT
    // -----------------------------------------

    logout: () => {
      localStorage.removeItem(
        ACCESS_TOKEN_KEY
      );

      localStorage.removeItem(
        REFRESH_TOKEN_KEY
      );

      localStorage.removeItem(USER_KEY);

      sessionStorage.removeItem(
        ACCESS_TOKEN_KEY
      );

      sessionStorage.removeItem(
        REFRESH_TOKEN_KEY
      );

      sessionStorage.removeItem(USER_KEY);

      set({
        isAuthenticated: false,
        isAdmin: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        authError: null,
      });
    },

    clearAuthError: () => {
      set({
        authError: null,
      });
    },

    setAuthTokens: (
      accessToken,
      refreshToken = null
    ) => {
      const rememberStorage =
        localStorage.getItem(ACCESS_TOKEN_KEY)
          ? localStorage
          : sessionStorage;

      rememberStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
      );

      if (refreshToken) {
        rememberStorage.setItem(
          REFRESH_TOKEN_KEY,
          refreshToken
        );
      }

      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    },

    // -----------------------------------------
    // TOAST
    // -----------------------------------------

    toast: null,

    showToast: (
      message,
      type = "success"
    ) => {
      set({
        toast: {
          id: crypto.randomUUID(),
          message,
          type,
        },
      });
    },

    clearToast: () => {
      set({
        toast: null,
      });
    },
  })
);