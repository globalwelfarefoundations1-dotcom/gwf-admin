import { create } from 'zustand';

export type Page = 'dashboard' | 'projects' | 'categories' | 'profile';
export type ProjectStatus = 'Published' | 'Draft' | 'Active' | 'Inactive';
export type CategoryStatus = 'Active' | 'Inactive';

/* ---------------------------------------------------------------- */
/*  NEW: media types for project uploads                             */
/* ---------------------------------------------------------------- */

export interface ProjectPhoto {
  id: string;
  url: string;   // data URL (base64) so it survives store updates without a real backend
  name: string;
}

export interface ProjectVideo {
  id: string;
  type: 'file' | 'link';
  url: string;   // blob/object URL for uploaded files, or the pasted link for 'link' type
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  client: string;
  date: string;
  updated: string;
  services: string[];
  image: string; // initials avatar used in list/table views

  // NEW: media fields
  coverImage: string | null;
  photos: ProjectPhoto[];
  videos: ProjectVideo[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  status: CategoryStatus;
  projects: number;
  created: string;
  updated: string;
}

/* ---------------------------------------------------------------- */
/*  DUMMY "API" LAYER                                                */
/*  Every call goes through a fake network delay so the UI can show  */
/*  real loading / error states, same shape as a real REST/fetch API */
/* ---------------------------------------------------------------- */

const wait = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

const seedProjects: Project[] = [
  { id: 1, name: 'Rural Healthcare Outreach Camp', description: 'Delivering accessible primary care and health education to remote communities.', category: 'Health', status: 'Published', client: 'District Health Department', date: '15 Aug 2026', updated: 'Today, 09:42', services: ['Primary care', 'Health education', 'Screening'], image: 'RH', coverImage: null, photos: [], videos: [] },
  { id: 2, name: 'Girls in STEM Scholarship', description: 'Removing barriers and creating pathways for the next generation of women in technology.', category: 'Education', status: 'Active', client: 'GWF Foundation', date: '09 Aug 2026', updated: 'Yesterday, 16:20', services: ['Scholarships', 'Mentorship'], image: 'GS', coverImage: null, photos: [], videos: [] },
  { id: 3, name: 'Clean Water Initiative', description: 'Building resilient water systems for families in underserved regions.', category: 'Livelihood', status: 'Published', client: 'Water For All', date: '02 Aug 2026', updated: '12 Aug 2026', services: ['Water access', 'Community training'], image: 'CW', coverImage: null, photos: [], videos: [] },
  { id: 4, name: 'Community Learning Hub', description: 'A safe, welcoming space where children learn, connect and grow.', category: 'Education', status: 'Draft', client: 'Nairobi Community Trust', date: '28 Jul 2026', updated: '10 Aug 2026', services: ['Learning spaces', 'Digital literacy'], image: 'CL', coverImage: null, photos: [], videos: [] },
  { id: 5, name: 'Women Build Forward', description: 'Supporting women-led enterprises with resources, training and market access.', category: 'Economic empowerment', status: 'Inactive', client: 'Forward Together', date: '18 Jul 2026', updated: '04 Aug 2026', services: ['Micro-grants', 'Enterprise support'], image: 'WB', coverImage: null, photos: [], videos: [] },
];

const seedCategories: Category[] = [
  { id: 1, name: 'Education', description: 'Learning, scholarships and skills development programmes.', status: 'Active', projects: 12, created: '18 Jan 2026', updated: 'Today, 09:10' },
  { id: 2, name: 'Health', description: 'Healthcare access, wellness and community health education.', status: 'Active', projects: 8, created: '18 Jan 2026', updated: 'Yesterday, 15:34' },
  { id: 3, name: 'Livelihood', description: 'Economic opportunity and resilient community development.', status: 'Active', projects: 6, created: '19 Jan 2026', updated: '08 Aug 2026' },
  { id: 4, name: 'Economic empowerment', description: 'Building pathways to sustainable income and independence.', status: 'Inactive', projects: 3, created: '22 Jan 2026', updated: '04 Aug 2026' },
];

export const api = {
  login: async (email: string, password: string) => {
    await wait(900);
    if (!email.trim() || !password.trim()) throw new Error('Please enter your email and password.');
    return { name: 'Amara Mensah', email, token: 'dummy-jwt-token' };
  },
  fetchProjects: async (): Promise<Project[]> => {
    await wait(600);
    return seedProjects;
  },
  fetchCategories: async (): Promise<Category[]> => {
    await wait(600);
    return seedCategories;
  },
  createProject: async (project: Omit<Project, 'id' | 'updated'>): Promise<Project> => {
    await wait(700);
    return { ...project, id: Date.now(), updated: 'Just now' };
  },
  updateProject: async (project: Project): Promise<Project> => {
    await wait(700);
    return { ...project, updated: 'Just now' };
  },
  deleteProject: async (id: number): Promise<number> => {
    await wait(500);
    return id;
  },
  createCategory: async (category: Omit<Category, 'id' | 'updated'>): Promise<Category> => {
    await wait(700);
    return { ...category, id: Date.now(), updated: 'Just now' };
  },
  updateCategory: async (category: Category): Promise<Category> => {
    await wait(700);
    return { ...category, updated: 'Just now' };
  },
  deleteCategory: async (id: number): Promise<number> => {
    await wait(500);
    return id;
  },
  updateProfile: async (data: { name: string; email: string; phone: string }) => {
    await wait(700);
    return data;
  },
};

/* ---------------------------------------------------------------- */
/*  STORE                                                            */
/* ---------------------------------------------------------------- */

interface AdminState {
  // auth
  authed: boolean;
  authLoading: boolean;
  authError: string;
  currentUser: { name: string; email: string; phone: string };

  // ui
  page: Page;
  sidebarOpen: boolean;
  collapsed: boolean;
  toast: string | null;

  // data
  projects: Project[];
  categories: Category[];
  projectsLoading: boolean;
  categoriesLoading: boolean;
  mutating: boolean;

  // actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setPage: (page: Page) => void;
  toggleSidebar: () => void;
  toggleCollapsed: () => void;

  loadProjects: () => Promise<void>;
  loadCategories: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'updated'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'updated'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  updateProfile: (data: { name: string; email: string; phone: string }) => Promise<void>;

  notify: (message: string) => void;
  clearToast: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  authed: false,
  authLoading: false,
  authError: '',
  currentUser: {
    name: 'Amara Mensah',
    email: 'amara.mensah@gwf.org',
    phone: '+233 24 555 0193',
  },

  page: 'dashboard',

  sidebarOpen: false,

  // IMPORTANT:
  // Sidebar will start in collapsed mode.
  collapsed: true,

  toast: null,

  projects: [],
  categories: [],
  projectsLoading: false,
  categoriesLoading: false,
  mutating: false,

  login: async (email, password) => {
    set({
      authLoading: true,
      authError: '',
    });

    try {
      const user = await api.login(email, password);

      set({
        authed: true,
        authLoading: false,
        currentUser: {
          ...get().currentUser,
          name: user.name,
          email: user.email,
        },
        toast: 'Welcome back, Amara.',
      });

      get().loadProjects();
      get().loadCategories();
    } catch (err) {
      set({
        authLoading: false,
        authError:
          err instanceof Error
            ? err.message
            : 'Unable to sign in.',
      });
    }
  },

  logout: () =>
    set({
      authed: false,
      page: 'dashboard',
      toast: 'You have signed out.',
    }),

  setPage: (page) =>
    set({
      page,
      sidebarOpen: false,
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  toggleCollapsed: () =>
    set((state) => ({
      collapsed: !state.collapsed,
    })),

  loadProjects: async () => {
    set({
      projectsLoading: true,
    });

    const projects = await api.fetchProjects();

    set({
      projects,
      projectsLoading: false,
    });
  },

  loadCategories: async () => {
    set({
      categoriesLoading: true,
    });

    const categories = await api.fetchCategories();

    set({
      categories,
      categoriesLoading: false,
    });
  },

  addProject: async (project) => {
    set({
      mutating: true,
    });

    const created = await api.createProject(project);

    set((state) => ({
      projects: [
        created,
        ...state.projects,
      ],
      mutating: false,
      toast: 'Project created successfully',
    }));
  },

  updateProject: async (project) => {
    set({
      mutating: true,
    });

    const saved = await api.updateProject(project);

    set((state) => ({
      projects: state.projects.map((item) =>
        item.id === saved.id
          ? saved
          : item
      ),
      mutating: false,
      toast: 'Project changes saved',
    }));
  },

  deleteProject: async (id) => {
    set({
      mutating: true,
    });

    await api.deleteProject(id);

    set((state) => ({
      projects: state.projects.filter(
        (item) => item.id !== id
      ),
      mutating: false,
      toast: 'Project moved to archive',
    }));
  },

  addCategory: async (category) => {
    set({
      mutating: true,
    });

    const created = await api.createCategory(category);

    set((state) => ({
      categories: [
        created,
        ...state.categories,
      ],
      mutating: false,
      toast: 'Category created successfully',
    }));
  },

  updateCategory: async (category) => {
    set({
      mutating: true,
    });

    const saved = await api.updateCategory(category);

    set((state) => ({
      categories: state.categories.map((item) =>
        item.id === saved.id
          ? saved
          : item
      ),
      mutating: false,
      toast: 'Category changes saved',
    }));
  },

  deleteCategory: async (id) => {
    set({
      mutating: true,
    });

    await api.deleteCategory(id);

    set((state) => ({
      categories: state.categories.filter(
        (item) => item.id !== id
      ),
      mutating: false,
      toast: 'Category deleted',
    }));
  },

  updateProfile: async (data) => {
    set({
      mutating: true,
    });

    const saved = await api.updateProfile(data);

    set({
      currentUser: saved,
      mutating: false,
      toast: 'Profile changes saved',
    });
  },

  notify: (message) =>
    set({
      toast: message,
    }),

  clearToast: () =>
    set({
      toast: null,
    }),
}));