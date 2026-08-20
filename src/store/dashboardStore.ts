import { create } from 'zustand';
import { useProjectStore } from './projectStore';
import { useCategoryStore } from './categoryStore';
import type { DashboardState } from '../types/dashboard';

interface DashboardStore extends DashboardState {
  loadDashboard: () => Promise<void>;
  setPage: (page: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  loading: false,
  error: null,
  initialized: false,

  setPage: (page: string) => {
    // Store page value if DashboardState has a page property.
    set({ page } as Partial<DashboardStore>);
  },

  loadDashboard: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      await Promise.all([
        useProjectStore.getState().getProjects(),
        useCategoryStore.getState().loadCategories(),
      ]);

      set({
        initialized: true,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load dashboard',
        initialized: false,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));