export type ProjectStatus = 'Draft' | 'Published' | 'Active' | 'Inactive';

export interface ProjectPhoto { id: string; url: string; name?: string; }
export interface ProjectVideo { id: string; type: 'file' | 'link'; url: string; name?: string; }

export interface Project {
  id: string;
  created_at: string;
  updatedAt: string;
  projectName: string;
  description: string | null;
  category: string | null;
  categoryId: string | null;
  projectDate: string | null;
  company: string | null;
  projectUrl: string | null;
  services: string[];
  status: ProjectStatus;
  coverImageUrl: string | null;
  projectImages: string[];
  projectVideos: string[];
  youtubeLinks: string[];
}

export interface ProjectListResponse { data: Project[]; total: number; offset: number; limit: number; }

export interface ProjectUi extends Project {
  name: string;
  client: string;
  date: string;
  updated: string;
  image: string;
  coverImage: string | null;
  url: string | null;
  photos: ProjectPhoto[];
  videos: ProjectVideo[];
}