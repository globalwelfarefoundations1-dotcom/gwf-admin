export type CategoryStatus = 'Active' | 'Inactive';

export type ApiCategoryStatus = 'active' | 'inactive';

export interface Category {
  id: string;
  created_at: string;
  updated_at?: string | null;
  categoryName: string;
  description: string | null;
  status: ApiCategoryStatus | CategoryStatus;
  projects: number;
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
  offset: number;
  limit: number;
}

export interface CategoryPayload {
  categoryName: string;
  description?: string | null;
  status: ApiCategoryStatus;
}

export interface CategoryUi extends Category {
  name: string;
  created: string;
  updated: string;
  status: CategoryStatus;
}