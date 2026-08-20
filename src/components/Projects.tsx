import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react';

import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageIcon,
  Link2,
  ListFilter,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';

import { useProjectStore, type ProjectFormValue } from '../store/projectStore';
import { useCategoryStore } from '../store/categoryStore';
import { toast } from '../store/toastStore';
import { removeIfManaged, uploadManyToStorage, uploadToStorage } from '../lib/storage';
import {
  BtnPrimary,
  BtnSecondary,
  Detail,
  Field,
  inputClass,
  Modal,
  ModalActions,
  SearchBar,
  StatusBadge,
} from './Shared';
import type { ProjectStatus, ProjectUi } from '../types/project';
import Loading from './loading';
import DeleteConfirmationModal from './deleteModal';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ModalMode = 'add' | 'edit' | 'view';

interface ProjectsProps {
  setPage?: (page: string) => void;
}

interface FormErrors {
  name?: string;
  categoryId?: string;
  client?: string;
  services?: string;
  coverImage?: string;
  photos?: string;
  videos?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const LIMIT = 10;

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export function Projects({ setPage }: ProjectsProps) {
  const { projects, total, loading, submitting, deletingId, getProjects, deleteProjectApi } = useProjectStore();
  const { categories, loadCategories } = useCategoryStore();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All status');
  const [category, setCategory] = useState('All categories');
  const [page, setPage_] = useState(1);

  const [modal, setModal] = useState<ModalMode | null>(null);
  const [showModal, setShowModal] = useState<any>({
    modal: false,
    values: ''
  });
  const [selected, setSelected] = useState<ProjectUi | null>(null);

  useEffect(() => {
    if (categories.length === 0) loadCategories();
  }, [categories.length, loadCategories]);

  // reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage_(1);
  }, [query, status, category]);

  // debounced server call — dynamic query params: offset, limit, search, status, categoryId
  useEffect(() => {
    const categoryId = categories.find((c) => c.name === category)?.id;

    const timer = setTimeout(() => {
      getProjects({
        offset: (page - 1) * LIMIT,
        limit: LIMIT,
        search: query || undefined,
        status: status !== 'All status' ? status : undefined,
        categoryId,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [query, status, category, page, categories, getProjects]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const open = (kind: ModalMode, project?: ProjectUi) => {
    setSelected(project ?? null);
    setModal(kind);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleDelete = async (id: string) => {
    await deleteProjectApi(id);
    setShowModal(null);
    getProjects();
  };

  const filtersActive = Boolean(query) || status !== 'All status' || category !== 'All categories';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      {loading && <Loading message='Please wait, loading your data...' />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b98a2c]">WORKSPACE / PROJECTS</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">Projects</h2>
          <p className="mt-1 text-sm text-stone-500">Manage, publish and track every foundation initiative.</p>
        </div>

        <button
          type="button"
          onClick={() => open('add')}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#d9aa3f] px-4 py-2.5 text-sm font-semibold text-stone-900 hover:bg-[#c99a34]"
        >
          <Plus size={17} />
          Add project
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Search projects..." />

        <div className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
          <ListFilter size={16} className="text-stone-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option>All status</option>
            <option>Published</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="rounded-lg border border-stone-300 bg-white px-3 py-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option>All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setStatus('All status');
              setCategory('All categories');
            }}
            className="text-sm font-medium text-[#b98a2c] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-stone-200 bg-white">

        {projects?.length ? <div className="overflow-x-auto min-h-[230px]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-400">
                <th className="px-5 py-3 font-medium">Project name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium">Last updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9aa3f]/15 text-sm font-semibold text-[#b98a2c]">
                        {project.image}
                      </div>
                      <div className="min-w-0">
                        <strong className="block truncate text-stone-900">{project.name}</strong>
                        <small className="text-xs text-stone-500">{project.client || 'No client'}</small>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-stone-600">{project.category || '-'}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-5 py-3 text-stone-500">{project.date || '-'}</td>
                  <td className="px-5 py-3 text-stone-500">{project.updated || '-'}</td>

                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="View"
                        onClick={() => open('view', project)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        title="Edit"
                        onClick={() => open('edit', project)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        disabled={deletingId === project.id}
                        onClick={() => setShowModal({
                          modal: true,
                          values: project
                        })}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> : null
        }

        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-stone-400">
            <Archive size={30} />
            <strong className="text-stone-600">No projects found</strong>
            <span className="text-sm">Try adjusting your search or filters.</span>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3 text-sm text-stone-500">
          <span>
            Showing <strong className="text-stone-900">{projects.length}</strong> of{' '}
            <strong className="text-stone-900">{total}</strong> projects
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage_((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-stone-200 p-1.5 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="rounded-lg bg-[#d9aa3f] px-2.5 py-1 text-xs font-semibold text-stone-900">
              {page}
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage_((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-stone-200 p-1.5 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <ProjectModal mode={modal} project={selected} categories={categories} onClose={closeModal} busy={submitting} />
      )}

      {showModal?.modal && <DeleteConfirmationModal
        title={`Are you sure you want to delete this`}
        subtitle={`${showModal?.values?.name}?`}
        loading={deletingId === showModal?.values?.id}
        cancel={() => setShowModal(false)}
        confirm={() => handleDelete(showModal?.values?.id)}
      />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Lightbox                                                                   */
/* -------------------------------------------------------------------------- */

function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: { url: string; name?: string }[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  const hasMultiple = images.length > 1;

  const goPrev = () => onIndexChange((index - 1 + images.length) % images.length);
  const goNext = () => onIndexChange((index + 1) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasMultiple) goPrev();
      if (e.key === 'ArrowRight' && hasMultiple) goNext();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, hasMultiple]);

  if (!images[index]) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 sm:p-8" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6 sm:p-3"
          aria-label="Previous image"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      <img
        src={images[index].url}
        alt={images[index].name ?? 'Project image'}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl sm:max-w-[85vw]"
      />

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6 sm:p-3"
          aria-label="Next image"
        >
          <ChevronRight size={26} />
        </button>
      )}

      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white sm:bottom-6">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Project Modal                                                              */
/* -------------------------------------------------------------------------- */

function ProjectModal({
  mode,
  project,
  categories,
  onClose,
  busy,
}: {
  mode: ModalMode;
  project: ProjectUi | null;
  categories: Array<{ id: string; name: string }>;
  onClose: () => void;
  busy: boolean;
}) {
  const { addProjectApi, updateProjectApi, fetchProjectById, loadingDetail } = useProjectStore();
  const view = mode === 'view';

  // detail holds the freshly-fetched record; falls back to the row passed in
  // until the getById call resolves
  const [detail, setDetail] = useState<ProjectUi | null>(project);

  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [categoryId, setCategoryId] = useState(project?.categoryId ?? '');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(project?.status ?? 'Draft');
  const [client, setClient] = useState(project?.client ?? '');
  const [services, setServices] = useState(project?.services?.join(', ') ?? '');
  const [projectUrl, setProjectUrl] = useState(project?.url ?? '');

  const [errors, setErrors] = useState<FormErrors>({});

  const [coverImage, setCoverImage] = useState<string | null>(project?.coverImage ?? null);
  const [photos, setPhotos] = useState<{ id: string; url: string; name?: string }[]>(project?.photos ?? []);
  const [videos, setVideos] = useState<{ id: string; type: 'file' | 'link'; url: string; name?: string }[]>(
    project?.videos ?? []
  );
  const [videoLink, setVideoLink] = useState('');

  // Uploads go straight to Supabase Storage (project-media bucket); these flags
  // drive the per-zone spinner and keep the form from submitting mid-upload.
  const [uploading, setUploading] = useState<{ cover: boolean; photos: boolean; videos: boolean }>({
    cover: false,
    photos: false,
    videos: false,
  });

  const [dragOver, setDragOver] = useState<'cover' | 'photos' | 'videos' | null>(null);
  const [lightbox, setLightbox] = useState<{ images: { url: string; name?: string }[]; index: number } | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const videosInputRef = useRef<HTMLInputElement>(null);

  // on open (edit/view), fetch the full record by id and populate the form
  useEffect(() => {
    if (!project?.id) return;

    let cancelled = false;

    fetchProjectById(project.id).then((data) => {
      if (cancelled || !data) return;

      setDetail(data);
      setName(data.name);
      setDescription(data.description ?? '');
      setCategoryId(data.categoryId ?? '');
      setProjectStatus(data.status);
      setClient(data.client);
      setServices(data.services?.join(', ') ?? '');
      setProjectUrl(data.url ?? '');
      setCoverImage(data.coverImage);
      setPhotos(data.photos);
      setVideos(data.videos);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const clearError = (key: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  /* ---------- cover image (single, uploaded to Supabase Storage) ---------- */

  const handleCoverFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const previousUrl = coverImage;
    setUploading((prev) => ({ ...prev, cover: true }));
    try {
      const { url } = await uploadToStorage(file, 'cover-images');
      setCoverImage(url);
      clearError('coverImage');
      if (previousUrl) removeIfManaged(previousUrl);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not upload cover image', 'error');
    } finally {
      setUploading((prev) => ({ ...prev, cover: false }));
    }
  };

  const removeCoverImage = () => {
    if (coverImage) removeIfManaged(coverImage);
    setCoverImage(null);
  };

  /* ---------- project photos (multiple, uploaded to Supabase Storage) ---------- */

  const handlePhotoFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setUploading((prev) => ({ ...prev, photos: true }));
    try {
      const uploaded = await uploadManyToStorage(imageFiles, 'project-photos');
      const next = uploaded.map((u, i) => ({ id: uid(), url: u.url, name: imageFiles[i].name }));
      setPhotos((prev) => [...prev, ...next]);
      clearError('photos');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not upload photos', 'error');
    } finally {
      setUploading((prev) => ({ ...prev, photos: false }));
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) removeIfManaged(photo.url);
      return prev.filter((photo) => photo.id !== id);
    });
  };

  /* ---------- project videos (multiple files uploaded to Supabase Storage, or links) ---------- */

  const handleVideoFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const videoFiles = Array.from(files).filter((file) => file.type.startsWith('video/'));
    if (videoFiles.length === 0) return;

    setUploading((prev) => ({ ...prev, videos: true }));
    try {
      const uploaded = await uploadManyToStorage(videoFiles, 'project-videos');
      const next = uploaded.map((u, i) => ({
        id: uid(),
        type: 'file' as const,
        url: u.url,
        name: videoFiles[i].name,
      }));
      setVideos((prev) => [...prev, ...next]);
      clearError('videos');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not upload videos', 'error');
    } finally {
      setUploading((prev) => ({ ...prev, videos: false }));
    }
  };

  const addLinkVideo = () => {
    const link = videoLink.trim();
    if (!link) return;

    setVideos((prev) => [...prev, { id: uid(), type: 'link', url: link, name: link }]);
    setVideoLink('');
    clearError('videos');
  };

  const removeVideo = (id: string) => {
    setVideos((prev) => {
      const video = prev.find((v) => v.id === id);
      if (video?.type === 'file') removeIfManaged(video.url);
      return prev.filter((video) => video.id !== id);
    });
  };

  const dropHandlers = (zone: 'cover' | 'photos' | 'videos', onFiles: (files: FileList | null) => void) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      setDragOver(zone);
    },
    onDragLeave: () => setDragOver((current) => (current === zone ? null : current)),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setDragOver(null);
      onFiles(e.dataTransfer.files);
    },
  });

  const dropZoneClass = (zone: 'cover' | 'photos' | 'videos') =>
    `flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-8 text-center transition ${dragOver === zone ? 'border-[#d9aa3f] bg-[#d9aa3f]/10 text-[#b98a2c]' : 'border-stone-200 text-stone-400'
    }`;

  // all fields mandatory except description and projectUrl; video needs
  // either a file or a link (at least one)
  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!name.trim()) next.name = 'Project name is required.';
    if (!categoryId) next.categoryId = 'Category is required.';
    if (!client.trim()) next.client = 'Client / company is required.';
    if (!services.split(',').map((s) => s.trim()).filter(Boolean).length) next.services = 'At least one service is required.';
    if (!coverImage) next.coverImage = 'Cover image is required.';
    if (photos.length === 0) next.photos = 'At least one project photo is required.';
    if (videos.length === 0) next.videos = 'Add a video file or a video link.';

    return next;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const value: ProjectFormValue = {
      name: name.trim(),
      description: description.trim() || undefined,
      categoryId: categoryId || null,
      status: projectStatus,
      client: client.trim(),
      services: services.split(',').map((service) => service.trim()).filter(Boolean),
      projectUrl: projectUrl.trim() || undefined,
      projectDate: project?.projectDate ?? new Date().toISOString(),
      coverImage,
      photos: photos.map((photo) => ({ url: photo.url })),
      videos: videos.map((video) => ({ type: video.type, url: video.url })),
    };

    const result = project ? await updateProjectApi(project.id, value) : await addProjectApi(value);
    if (result) onClose();
  };

  const galleryImages = photos.map((photo) => ({ url: photo.url, name: photo.name }));
  const videoFiles = videos.filter((video) => video.type === 'file');
  const videoLinks = videos.filter((video) => video.type === 'link');
  const fetchingDetail = Boolean(project?.id) && loadingDetail && !view;
  const isUploading = uploading.cover || uploading.photos || uploading.videos;

  /* -------------------------------------------------------------------------- */
  /* View mode                                                                  */
  /* -------------------------------------------------------------------------- */

  if (view) {
    if (loadingDetail && !detail) {
      return <Loading message='Please wait, loading your data...' />
        ;
    }

    return (
      <Modal title="Project details" subtitle="A clear view of the project record." onClose={onClose} wide>
        <div className="flex max-h-[75vh] flex-col">
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#d9aa3f]/15 text-lg font-semibold text-[#b98a2c]">
                  {detail?.image}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-stone-900">{detail?.name}</h3>
                  {detail?.description && <p className="mb-1 text-sm text-stone-600">{detail.description}</p>}
                  <StatusBadge status={detail?.status ?? 'Draft'} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Category" value={detail?.category || '-'} />
                <Detail label="Client / company" value={detail?.client || '-'} />
                <Detail label="Project date" value={detail?.date || '-'} />
                <Detail label="Last updated" value={detail?.updated || '-'} />
              </div>

              {detail?.services && detail.services.length > 0 && (
                <div>
                  <strong className="text-sm text-stone-700">Services delivered</strong>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detail.services.map((service) => (
                      <span key={service} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {detail?.url && (
                <div>
                  <strong className="text-sm text-stone-700">Project URL</strong>
                  <a
                    href={detail.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center gap-2 text-sm text-[#b98a2c] hover:underline"
                  >
                    <Link2 size={15} />
                    {detail.url}
                  </a>
                </div>
              )}

              {coverImage && (
                <div className="flex w-max flex-col">
                  <strong className="text-sm text-stone-700">Cover image</strong>
                  <button
                    type="button"
                    onClick={() => setLightbox({ images: [{ url: coverImage }], index: 0 })}
                    className="mt-2 overflow-hidden rounded-2xl"
                  >
                    <img src={coverImage} alt="Cover" className="h-40 w-full object-cover sm:h-56" />
                  </button>
                </div>
              )}

              {photos.length > 0 && (
                <div>
                  <strong className="text-sm text-stone-700">Project photos</strong>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {photos.map((photo, index) => (
                      <button
                        type="button"
                        key={photo.id}
                        onClick={() => setLightbox({ images: galleryImages, index })}
                        className="aspect-square overflow-hidden rounded-lg"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name ?? 'Project photo'}
                          className="h-full w-full object-cover transition hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {videos.length > 0 && (
                <div>
                  <strong className="text-sm text-stone-700">Project videos</strong>

                  {videos.some((video) => video.type === 'file') && (
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {videos
                        .filter((video) => video.type === 'file')
                        .map((video) => (
                          <video
                            key={video.id}
                            src={video.url}
                            controls
                            className="aspect-video w-full rounded-lg object-cover"
                          />
                        ))}
                    </div>
                  )}

                  {videos.some((video) => video.type === 'link') && (
                    <div className="mt-2 flex flex-col gap-2">
                      {videos
                        .filter((video) => video.type === 'link')
                        .map((video) => (
                          <a
                            key={video.id}
                            href={video.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-600 hover:bg-stone-200"
                          >
                            <Link2 size={14} />
                            <span className="truncate">{video.url}</span>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 mb-3 shrink-0 border-t border-stone-200 pt-0">
            <ModalActions>
              <BtnSecondary onClick={onClose}>Close</BtnSecondary>
            </ModalActions>
          </div>
        </div>

        {lightbox && (
          <Lightbox
            images={lightbox.images}
            index={lightbox.index}
            onIndexChange={(index) => setLightbox((previous) => (previous ? { ...previous, index } : previous))}
            onClose={() => setLightbox(null)}
          />
        )}
      </Modal>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Add / edit mode                                                            */
  /* -------------------------------------------------------------------------- */

  return (
    <Modal
      title={mode === 'edit' ? 'Edit project' : 'Add project'}
      subtitle="Create a project record for your foundation portfolio."
      onClose={onClose}
      wide
    >
      <form onSubmit={submit} className="flex max-h-[75vh] flex-col">
        <div className="relative flex-1 overflow-y-auto pr-1">
          {fetchingDetail && (
            <Loading message='Please wait, loading your data...' />

          )}

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">BASIC INFORMATION</div>

              <Field label="Project name">
                <input
                  className={`${inputClass} ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError('name');
                  }}
                  placeholder="e.g. Rural healthcare outreach camp"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </Field>

              <Field label="Short description" hint="Optional">
                <textarea
                  className={inputClass}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="One or two sentences about what the project did and what changed."
                  rows={3}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category / industry">
                  <select
                    className={`${inputClass} ${errors.categoryId ? 'border-red-400 focus:border-red-400' : ''}`}
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      clearError('categoryId');
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
                </Field>

                <Field label="Project date">
                  <input
                    className={inputClass}
                    value={detail?.date ?? new Date().toLocaleDateString('en-GB')}
                    readOnly
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Client / company">
                  <input
                    className={`${inputClass} ${errors.client ? 'border-red-400 focus:border-red-400' : ''}`}
                    value={client}
                    onChange={(e) => {
                      setClient(e.target.value);
                      clearError('client');
                    }}
                    placeholder="Organisation name"
                  />
                  {errors.client && <p className="mt-1 text-xs text-red-500">{errors.client}</p>}
                </Field>

                <Field label="Project URL" hint="Optional">
                  <input
                    className={inputClass}
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="https://"
                  />
                </Field>
              </div>

              <Field label="Services delivered">
                <input
                  className={`${inputClass} ${errors.services ? 'border-red-400 focus:border-red-400' : ''}`}
                  value={services}
                  onChange={(e) => {
                    setServices(e.target.value);
                    clearError('services');
                  }}
                  placeholder="Type a service, separated by commas"
                />
                {errors.services && <p className="mt-1 text-xs text-red-500">{errors.services}</p>}
              </Field>

              <Field label="Status">
                <div className="flex flex-wrap gap-2">
                  {(['Draft', 'Published', 'Active', 'Inactive'] as ProjectStatus[]).map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setProjectStatus(value)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${projectStatus === value
                        ? 'border-[#d9aa3f] bg-[#d9aa3f]/15 text-[#b98a2c]'
                        : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {/* Cover image */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">COVER IMAGE</div>

              {coverImage ? (
                <div className="group relative overflow-hidden rounded-xl">
                  <img
                    src={coverImage}
                    alt="Cover"
                    onClick={() => setLightbox({ images: [{ url: coverImage }], index: 0 })}
                    className="h-40 w-full cursor-pointer object-cover sm:h-56"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove cover image"
                  >
                    <X size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={uploading.cover}
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-100"
                  >
                    {uploading.cover ? 'Uploading...' : 'Replace'}
                  </button>
                </div>
              ) : (
                <div
                  className={`${dropZoneClass('cover')} ${uploading.cover ? 'pointer-events-none opacity-60' : ''}`}
                  {...dropHandlers('cover', handleCoverFiles)}
                  onClick={() => coverInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  {uploading.cover ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                  <strong className="text-sm text-stone-600">
                    {uploading.cover ? 'Uploading...' : 'Drop a cover image here, or browse'}
                  </strong>
                  <small className="text-xs">PNG, JPG or SVG · 1600×900 works best</small>
                </div>
              )}

              {errors.coverImage && <p className="mt-1 text-xs text-red-500">{errors.coverImage}</p>}

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading.cover}
                onChange={(e) => handleCoverFiles(e.target.files)}
              />
            </div>

            {/* Project photos */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">PROJECT PHOTOS</div>

              <div
                className={`${dropZoneClass('photos')} ${uploading.photos ? 'pointer-events-none opacity-60' : ''}`}
                {...dropHandlers('photos', handlePhotoFiles)}
                onClick={() => photosInputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                {uploading.photos ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                <strong className="text-sm text-stone-600">
                  {uploading.photos ? 'Uploading...' : 'Drop photos here, or browse'}
                </strong>
                <small className="text-xs">Up to 20 images · PNG or JPG, 15MB each</small>
              </div>

              {errors.photos && <p className="mt-1 text-xs text-red-500">{errors.photos}</p>}

              <input
                ref={photosInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading.photos}
                onChange={(e) => handlePhotoFiles(e.target.files)}
              />

              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg">
                      <img
                        src={photo.url}
                        alt={photo.name ?? 'Project photo'}
                        onClick={() => setLightbox({ images: galleryImages, index })}
                        className="h-full w-full cursor-pointer object-cover transition group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                        aria-label={`Remove ${photo.name ?? 'photo'}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project videos */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                PROJECT VIDEOS <span className="normal-case text-stone-400">(video file or link — one required)</span>
              </div>

              <div
                className={`${dropZoneClass('videos')} ${uploading.videos ? 'pointer-events-none opacity-60' : ''}`}
                {...dropHandlers('videos', handleVideoFiles)}
                onClick={() => videosInputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                {uploading.videos ? <Loader2 size={20} className="animate-spin" /> : <Video size={20} />}
                <strong className="text-sm text-stone-600">
                  {uploading.videos ? 'Uploading...' : 'Drop videos here, or browse'}
                </strong>
                <small className="text-xs">MP4 or WebM up to 50MB each</small>
              </div>

              <input
                ref={videosInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                disabled={uploading.videos}
                onChange={(e) => handleVideoFiles(e.target.files)}
              />

              <div className="mt-3 mb-2">
                <Field label="Or add a video link">
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addLinkVideo();
                        }
                      }}
                      placeholder="https://youtube.com/watch?v="
                    />
                    <BtnSecondary type="button" onClick={addLinkVideo}>
                      Add
                    </BtnSecondary>
                  </div>
                </Field>
              </div>

              {errors.videos && <p className="mb-2 text-xs text-red-500">{errors.videos}</p>}

              {videoFiles.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {videoFiles.map((video) => (
                    <div key={video.id} className="group relative overflow-hidden rounded-lg bg-stone-100">
                      <video src={video.url} controls className="aspect-video w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeVideo(video.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                        aria-label={`Remove ${video.name ?? 'video'}`}
                      >
                        <X size={12} />
                      </button>
                      <span className="block truncate px-2 py-1 text-xs text-stone-500">{video.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {videoLinks.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {videoLinks.map((video) => (
                    <div key={video.id} className="flex items-center justify-between gap-3 rounded-lg bg-stone-100 px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2 text-xs text-stone-600">
                        <Link2 size={14} className="shrink-0" />
                        <span className="truncate">{video.name || video.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(video.id)}
                        className="shrink-0 text-stone-400 hover:text-red-500"
                        aria-label={`Remove ${video.name ?? 'video link'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3 shrink-0 border-t border-stone-200 pt-0">
          <ModalActions>
            <BtnSecondary type="button" onClick={onClose} disabled={busy}>
              Cancel
            </BtnSecondary>
            <BtnPrimary type="submit" disabled={busy || fetchingDetail || isUploading}>
              {busy ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </span>
              ) : mode === 'edit' ? (
                'Save changes'
              ) : (
                'Create project'
              )}
            </BtnPrimary>
          </ModalActions>
        </div>
      </form>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onIndexChange={(index) => setLightbox((previous) => (previous ? { ...previous, index } : previous))}
          onClose={() => setLightbox(null)}
        />
      )}
    </Modal>
  );
}

export default Projects;
