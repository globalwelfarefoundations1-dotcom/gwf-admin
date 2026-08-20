import { create } from 'zustand';
import { toast } from './toastStore';
import { apiClient } from '../api/apiClient'; // CHANGE ONLY THIS IMPORT IF YOUR apiClient LIVES ELSEWHERE
import type {
  Category,
  CategoryListResponse,
  CategoryPayload,
  CategoryStatus,
  CategoryUi,
} from '../types/category';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface CategoryFormValue {
  name: string;
  description?: string;
  status: CategoryStatus;
}

export interface CategoryQuery {
  offset?: number;
  limit?: number;
  search?: string;
  status?: 'All status' | CategoryStatus;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB');
};

const toUiStatus = (status: Category['status']): CategoryStatus =>
  String(status).toLowerCase() === 'inactive' ? 'Inactive' : 'Active';

const toApiStatus = (status: CategoryStatus): 'active' | 'inactive' =>
  status === 'Inactive' ? 'inactive' : 'active';

// API -> UI shape
const toUi = (c: Category): CategoryUi => ({
  ...c,
  name: c.categoryName,
  created: formatDate(c.created_at),
  updated: formatDate(c.updated_at ?? c.created_at),
  status: toUiStatus(c.status),
  projects: Number(c.projects ?? 0),
});

// form -> API payload shape
const toPayload = (v: CategoryFormValue): CategoryPayload => ({
  categoryName: v.name.trim(),
  description: v.description?.trim() || null,
  status: toApiStatus(v.status),
});

// builds ?offset=0&limit=10&search=h&status=active — drops empty/undefined keys
const buildQuery = (q: CategoryQuery) => {
  const params = new URLSearchParams();
  const entries: Record<string, string | number | undefined> = {
    offset: q.offset,
    limit: q.limit,
    search: q.search || undefined,
    status: q.status && q.status !== 'All status' ? toApiStatus(q.status) : undefined,
  };

  Object.entries(entries).forEach(([key, val]) => {
    if (val !== undefined && val !== '') params.set(key, String(val));
  });

  return params.toString();
};

const getErrorMessage = (error: unknown): string => {
  const value = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return value.response?.data?.message ?? value.response?.data?.error ?? value.message ?? 'Something went wrong';
};

/* -------------------------------------------------------------------------- */
/* Store                                                                      */
/* -------------------------------------------------------------------------- */

interface CategoryStore {
  categories: CategoryUi[];
  total: number;
  loading: boolean;
  submitting: boolean;
  deletingId: string | null;

  loadCategories: (query?: CategoryQuery) => Promise<void>;
  addCategory: (value: CategoryFormValue) => Promise<CategoryUi | null>;
  updateCategory: (id: string, value: CategoryFormValue) => Promise<CategoryUi | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  clearCategories: () => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  total: 0,
  loading: false,
  submitting: false,
  deletingId: null,

  loadCategories: async (query = {}) => {
    set({ loading: true });

    try {
      const qs = buildQuery({ offset: 0, limit: 10, ...query });
      const data = await apiClient.get<CategoryListResponse>(`/categories?${qs}`);
      set({ categories: data.data.map(toUi), total: data.total });
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      set({ loading: false });
    }
  },

  addCategory: async (value) => {
    const { loadCategories } = get()
    set({ submitting: true });

    try {
      const data = await apiClient.post<Category>('/categories', toPayload(value));
      const category = toUi(data);
      set((state) => ({ categories: [category, ...state.categories], total: state.total + 1 }));
      toast('Category created successfully', 'success');
      loadCategories();
      return category;
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      return null;
    } finally {
      set({ submitting: false });
    }
  },

  updateCategory: async (id, value) => {
    const { loadCategories } = get()
    set({ submitting: true });

    try {
      const data = await apiClient.put<Category>(`/categories/${id}`, toPayload(value));
      const category = toUi(data);
      set((state) => ({ categories: state.categories.map((c) => (c.id === id ? category : c)) }));
      toast('Category updated successfully', 'success');
      loadCategories();
      return category;
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      return null;
    } finally {
      set({ submitting: false });
    }
  },

  deleteCategory: async (id) => {
    set({ deletingId: id });

    try {
      await apiClient.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        total: Math.max(0, state.total - 1),
      }));
      toast('Category deleted successfully', 'success');
      return true;
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      return false;
    } finally {
      set({ deletingId: null });
    }
  },

  clearCategories: () => set({ categories: [], total: 0 }),
}));