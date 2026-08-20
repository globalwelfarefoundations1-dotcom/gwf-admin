import { create } from 'zustand';
import { toast } from './toastStore';
import { apiClient } from '../api/apiClient'; // CHANGE ONLY THIS IMPORT IF YOUR apiClient LIVES ELSEWHERE
import type { Project, ProjectListResponse, ProjectStatus, ProjectUi } from '../types/project';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ProjectFormValue {
  name: string;
  description?: string;
  categoryId: string | null;
  status: ProjectStatus;
  client: string;
  services: string[];
  projectUrl?: string;
  projectDate?: string | null;
  coverImage: string | null;
  photos: { url: string }[];
  videos: { type: 'file' | 'link'; url: string }[];
}

export interface ProjectQuery {
  offset?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string | number;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'P';

// the API sometimes returns `category` populated as { id, categoryName }
// instead of a plain string — normalise it so components can render it directly
const resolveCategoryName = (category: unknown): string | null => {
  if (!category) return null;
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && 'categoryName' in category) {
    return (category as { categoryName?: string }).categoryName ?? null;
  }
  return null;
};

// when `category` comes back populated, its `id` is the only place the
// selected category's id survives — the top-level `categoryId` field is absent
const resolveCategoryId = (p: Project): string | null => {
  if (p.categoryId) return p.categoryId;
  const category = p.category as unknown;
  if (category && typeof category === 'object' && 'id' in category) {
    return (category as { id?: string }).id ?? null;
  }
  return null;
};

// storage URLs look like ".../cover-images/1787200263263_parkzaa.png" — strip the
// upload timestamp prefix so uploaded files show a readable name in the UI
const filenameFromUrl = (url: string): string => {
  const last = url.split('/').pop() ?? url;
  return decodeURIComponent(last).replace(/^\d+_/, '');
};

// API -> UI shape
const toUi = (p: Project): ProjectUi => ({
  ...p,
  name: p.projectName,
  category: resolveCategoryName(p.category),
  categoryId: resolveCategoryId(p),
  client: p.company ?? '',
  date: p.projectDate ? new Date(p.projectDate).toLocaleDateString('en-GB') : '',
  updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-GB') : '',
  image: initials(p.projectName),
  coverImage: p.coverImageUrl,
  url: p.projectUrl,
  photos: (p.projectImages ?? []).map((url) => ({ id: uid(), url, name: filenameFromUrl(url) })),
  videos: [
    ...(p.projectVideos ?? []).map((url) => ({ id: uid(), type: 'file' as const, url, name: filenameFromUrl(url) })),
    ...(p.youtubeLinks ?? []).map((url) => ({ id: uid(), type: 'link' as const, url, name: url })),
  ],
});

// form -> multipart/form-data payload, matching the API's field names.
// projectImages / projectVideos / youtubeLinks / services are arrays -> appended
// multiple times under the same key: fd.append('key', v1); fd.append('key', v2); ...
const toPayload = (v: ProjectFormValue) => ({
  projectName: v.name,
  description: v.description ?? '',
  categoryId: v.categoryId ?? '',
  status: v.status,
  company: v.client,
  projectUrl: v.projectUrl ?? '',
  projectDate: v.projectDate ?? '',
  coverImage: v.coverImage ?? '',

  // "wfw,ff,ef"
  services: v.services?.join(',') ?? '',

  projectImages: v.photos.map((photo) => photo.url),

  projectVideos: v.videos
    .filter((vid) => vid.type === 'file')
    .map((vid) => vid.url),

  youtubeLinks: v.videos
    .filter((vid) => vid.type === 'link')
    .map((vid) => vid.url),
});


// builds ?offset=0&limit=10&search=s&status=s&categoryId=2 — drops empty/undefined keys
const buildQuery = (q: ProjectQuery) => {
  const params = new URLSearchParams();
  Object.entries(q).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') params.set(key, String(val));
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

interface ProjectStore {
  projects: ProjectUi[];
  total: number;
  loading: boolean;
  loadingDetail: boolean;
  submitting: boolean;
  deletingId: string | null;

  getProjects: (query?: ProjectQuery) => Promise<void>;
  fetchProjectById: (id: string) => Promise<ProjectUi | null>;
  addProjectApi: (value: ProjectFormValue) => Promise<ProjectUi | null>;
  updateProjectApi: (id: string, value: ProjectFormValue) => Promise<ProjectUi | null>;
  deleteProjectApi: (id: string) => Promise<void>;
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  total: 0,
  loading: false,
  loadingDetail: false,
  submitting: false,
  deletingId: null,

  getProjects: async (query = {}) => {
    set({ loading: true });

    try {
      const qs = buildQuery({ offset: 0, limit: 10, ...query });
      const data = await apiClient.get<ProjectListResponse>(`/projects?${qs}`);
      set({ projects: data.data.map(toUi), total: data.total });
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      set({ loading: false });
    }
  },

  fetchProjectById: async (id) => {
    set({ loadingDetail: true });

    try {
      const data = await apiClient.get<Project>(`/projects/${id}`);
      return toUi(data);
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      return null;
    } finally {
      set({ loadingDetail: false });
    }
  },

  addProjectApi: async (value) => {
    const { getProjects } = get();
    set({ submitting: true });

    try {
      const data = await apiClient.post<Project>('/projects', toPayload(value));
      const project = toUi(data);
      set((state) => ({ projects: [project, ...state.projects], total: state.total + 1 }));
      toast('Project created successfully', 'success');
      getProjects();
      return project;
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      return null;
    } finally {
      set({ submitting: false });
    }
  },

  updateProjectApi: async (id, value) => {
    const { getProjects } = get();
    set({ submitting: true });

    try {
      const data = await apiClient.put<Project>(`/projects/${id}`, toPayload(value));
      const project = toUi(data);
      set((state) => ({ projects: state.projects.map((p) => (p.id === id ? project : p)) }));
      toast('Project updated successfully', 'success');
      getProjects();
      return project;
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      return null;
    } finally {
      set({ submitting: false });
    }
  },

  deleteProjectApi: async (id) => {
    set({ deletingId: id });

    try {
      await apiClient.delete(`/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        total: Math.max(0, state.total - 1),
      }));
      toast('Project deleted successfully', 'success');
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      set({ deletingId: null });
    }
  },

  clearProjects: () => set({ projects: [], total: 0 }),
}));