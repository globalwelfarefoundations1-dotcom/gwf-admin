import { create } from "zustand";

export type Page =
  | "dashboard"
  | "projects"
  | "categories"
  | "profile";

interface SidebarStore {
  page: Page;
  collapsed: boolean;
  mobileOpen: boolean;

  setPage: (page: Page) => void;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;

  openMobile: () => void;
  closeMobile: () => void;
  resetMobile: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  page: "dashboard",
  collapsed: true,
  mobileOpen: false,

  setPage: (page) =>
    set({
      page,
      mobileOpen: false,
    }),

  setCollapsed: (collapsed) =>
    set({ collapsed }),

  toggleCollapsed: () =>
    set((state) => ({
      collapsed: !state.collapsed,
    })),

  openMobile: () =>
    set({
      mobileOpen: true,
    }),

  closeMobile: () =>
    set({
      mobileOpen: false,
    }),

  resetMobile: () =>
    set({
      mobileOpen: false,
    }),
}));
