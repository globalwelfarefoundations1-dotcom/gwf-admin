import { useEffect, useMemo, useRef, useState, type FormEvent, type DragEvent } from 'react';
import {
  Archive, ChevronLeft, ChevronRight, Eye, ImageIcon, Link2, ListFilter, Loader2,
  Pencil, Plus, Sparkles, Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { ProjectPhoto, ProjectVideo, useAdminStore, type Project, type ProjectStatus } from '../store/useAdminStore';
import { BtnPrimary, BtnSecondary, Detail, Field, inputClass, Modal, ModalActions, SearchBar, StatusBadge } from './Shared';

export function Projects() {
  const { projects, categories, projectsLoading, loadProjects, deleteProject, mutating } = useAdminStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All status');
  const [category, setCategory] = useState('All categories');
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => { if (projects.length === 0) loadProjects(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          `${p.name} ${p.client}`.toLowerCase().includes(query.toLowerCase()) &&
          (status === 'All status' || p.status === status) &&
          (category === 'All categories' || p.category === category)
      ),
    [projects, query, status, category]
  );

  const open = (kind: 'add' | 'edit' | 'view', project?: Project) => {
    setSelected(project ?? null);
    setModal(kind);
  };

  const filtersActive = query || status !== 'All status' || category !== 'All categories';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b98a2c]">WORKSPACE / PROJECTS</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">Projects</h2>
          <p className="mt-1 text-sm text-stone-500">Manage, publish and track every foundation initiative.</p>
        </div>
        <button
          onClick={() => open('add')}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#d9aa3f] px-4 py-2.5 text-sm font-semibold text-stone-900 hover:bg-[#c99a34]"
        >
          <Plus size={17} /> Add project
        </button>
      </div>

      {/* Toolbar: stacked on mobile, row from sm */}
      <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Search projects..." />
        <div className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
          <ListFilter size={16} className="text-stone-400" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-transparent text-sm outline-none w-full">
            <option>All status</option>
            <option>Published</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white px-3 py-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent text-sm outline-none w-full">
            <option>All categories</option>
            {categories.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {filtersActive && (
          <button
            onClick={() => { setQuery(''); setStatus('All status'); setCategory('All categories'); }}
            className="text-sm font-medium text-[#b98a2c] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white">

        {projectsLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-stone-400">
            <Loader2 size={18} className="animate-spin" /> Loading projects...
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {filtered.map((project) => (
                  <tr key={project.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9aa3f]/15 text-sm font-semibold text-[#b98a2c]">
                          {project.image}
                        </div>
                        <div className="min-w-0">
                          <strong className="block truncate text-stone-900">{project.name}</strong>
                          <small className="text-xs text-stone-500">{project.client}</small>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-stone-600">{project.category}</td>
                    <td className="px-5 py-3"><StatusBadge status={project.status} /></td>
                    <td className="px-5 py-3 text-stone-500">{project.date}</td>
                    <td className="px-5 py-3 text-stone-500">{project.updated}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button title="View" onClick={() => open('view', project)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"><Eye size={16} /></button>
                        <button title="Edit" onClick={() => open('edit', project)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"><Pencil size={16} /></button>
                        <button title="Archive" onClick={() => deleteProject(project.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!projectsLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-stone-400">
            <Archive size={30} />
            <strong className="text-stone-600">No projects found</strong>
            <span className="text-sm">Try adjusting your search or filters.</span>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3 text-sm text-stone-500">
          {/* <span>Page 1 of 1</span> */}
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3 text-sm text-stone-500">
            <span>Showing <strong className="text-stone-900">{filtered.length}</strong> of <strong className="text-stone-900">{projects.length}</strong> projects</span>
          </div>
          <div className="flex items-center gap-1">
            <button disabled className="rounded-lg border border-stone-200 p-1.5 opacity-40"><ChevronLeft size={16} /></button>
            <button className="rounded-lg bg-[#d9aa3f] px-2.5 py-1 text-xs font-semibold text-stone-900">1</button>
            <button disabled className="rounded-lg border border-stone-200 p-1.5 opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {modal && <ProjectModal mode={modal} project={selected} onClose={() => setModal(null)} busy={mutating} />}
    </div>
  );
}


/* ---------------------------------------------------------------- */
/*  small helpers                                                    */
/* ---------------------------------------------------------------- */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

/* ---------------------------------------------------------------- */
/*  Lightbox — full-screen viewer with left / right navigation       */
/* ---------------------------------------------------------------- */

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
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 sm:p-8"
      onClick={onClose}
    >
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

/* ---------------------------------------------------------------- */
/*  ProjectModal                                                     */
/* ---------------------------------------------------------------- */

function ProjectModal({ mode, project, onClose, busy }: { mode: 'add' | 'edit' | 'view'; project: Project | null; onClose: () => void; busy: boolean }) {
  const { categories, addProject, updateProject } = useAdminStore();
  const view = mode === 'view';

  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [cat, setCat] = useState(project?.category ?? categories[0]?.name ?? 'Education');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(project?.status ?? 'Draft');
  const [client, setClient] = useState(project?.client ?? '');
  const [services, setServices] = useState(project?.services.join(', ') ?? '');

  // NEW: validation — Project name is the only required field.
  // Every other field (description, client, URL, services, cover image,
  // photos, videos, video link) is optional and is never validated.
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validateName = (value: string) => {
    if (!value.trim()) return 'Project name is required.';
    return undefined;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors((prev) => {
        const { name: _n, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleNameBlur = () => {
    const error = validateName(name);
    setErrors((prev) => (error ? { ...prev, name: error } : (() => { const { name: _n, ...rest } = prev; return rest; })()));
  };

  // NEW: media state
  const [coverImage, setCoverImage] = useState<string | null>(project?.coverImage ?? null);
  const [photos, setPhotos] = useState<ProjectPhoto[]>(project?.photos ?? []);
  const [videos, setVideos] = useState<ProjectVideo[]>(project?.videos ?? []);
  const [videoLink, setVideoLink] = useState('');

  // NEW: drag-over highlight state, per drop zone
  const [dragOver, setDragOver] = useState<'cover' | 'photos' | 'videos' | null>(null);

  // NEW: lightbox state (which gallery is open + which index)
  const [lightbox, setLightbox] = useState<{ images: { url: string; name?: string }[]; index: number } | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const videosInputRef = useRef<HTMLInputElement>(null);

  /* ---------- cover image (single) ---------- */

  const handleCoverFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const url = await readAsDataURL(file);
    setCoverImage(url);
  };

  /* ---------- project photos (multiple) ---------- */

  const handlePhotoFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: ProjectPhoto[] = await Promise.all(
      Array.from(files).map(async (file) => ({
        id: uid(),
        url: await readAsDataURL(file),
        name: file.name,
      }))
    );
    setPhotos((prev) => [...prev, ...next]);
  };

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  /* ---------- project videos (multiple files + links) ---------- */

  const handleVideoFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: ProjectVideo[] = Array.from(files).map((file) => ({
      id: uid(),
      type: 'file',
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setVideos((prev) => [...prev, ...next]);
  };

  const addLinkVideo = () => {
    const link = videoLink.trim();
    if (!link) return;
    setVideos((prev) => [...prev, { id: uid(), type: 'link', url: link, name: link }]);
    setVideoLink('');
  };

  const removeVideo = (id: string) => setVideos((prev) => prev.filter((v) => v.id !== id));

  /* ---------- drag & drop plumbing ---------- */

  const dropHandlers = (
    zone: 'cover' | 'photos' | 'videos',
    onFiles: (files: FileList | null) => void
  ) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      setDragOver(zone);
    },
    onDragLeave: () => setDragOver((z) => (z === zone ? null : z)),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setDragOver(null);
      onFiles(e.dataTransfer.files);
    },
  });

  const dropZoneClass = (zone: 'cover' | 'photos' | 'videos') =>
    `flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-8 text-center transition ${dragOver === zone ? 'border-[#d9aa3f] bg-[#d9aa3f]/10 text-[#b98a2c]' : 'border-stone-200 text-stone-400'
    }`;

  /* ---------- submit ---------- */

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nameError = validateName(name);
    if (nameError) {
      setErrors({ name: nameError });
      return;
    }
    const next = {
      name, description, category: cat, status: projectStatus, client,
      date: project?.date ?? '15 Aug 2026',
      services: services.split(',').map((s) => s.trim()).filter(Boolean),
      image: project?.image ?? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      coverImage,
      photos,
      videos,
    };
    if (project) await updateProject({ ...project, ...next });
    else await addProject(next);
    onClose();
  };

  /* ---------- view mode ---------- */

  if (view) {
    const galleryImages = photos.map((p) => ({ url: p.url, name: p.name }));

    return (
      <Modal title="Project details" subtitle="A clear view of the project record." onClose={onClose} wide>
        <div className="flex max-h-[75vh] flex-col">
          {/* Scrollable body — only this area scrolls; Close stays fixed at the bottom */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#d9aa3f]/15 text-lg font-semibold text-[#b98a2c]">
                  {project?.image}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">{project?.name}</h3>
                  <p className="mb-1 text-sm text-stone-600">{project?.description}</p>
                  <StatusBadge status={project?.status ?? 'Draft'} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Category" value={project?.category} />
                <Detail label="Client / company" value={project?.client} />
                <Detail label="Project date" value={project?.date} />
                <Detail label="Last updated" value={project?.updated} />
              </div>

              <div>
                <strong className="text-sm text-stone-700">Services delivered</strong>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project?.services.map((s) => (
                    <span key={s} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">{s}</span>
                  ))}
                </div>
              </div>

              {coverImage && (
                <div className='flex flex-col w-max'>
                  <strong className="text-sm text-stone-700">Cover image</strong>
                  <button
                    type="button"
                    onClick={() => setLightbox({ images: [{ url: coverImage }], index: 0 })}
                    className="overflow-hidden rounded-2xl"
                  >
                    <img src={coverImage} alt="Cover" className="h-40 w-full object-cover sm:h-56" />
                  </button>
                </div>)}

              {photos.length > 0 && (
                <div>
                  <strong className="text-sm text-stone-700">Project photos</strong>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {photos.map((p, i) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setLightbox({ images: galleryImages, index: i })}
                        className="aspect-square overflow-hidden rounded-lg"
                      >
                        <img src={p.url} alt={p.name} className="h-full w-full object-cover transition hover:scale-105" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {videos.length > 0 && (
                <div>
                  <strong className="text-sm text-stone-700">Project videos</strong>
                  <div className="mt-2 flex flex-col gap-2">
                    {videos.map((v) =>
                      v.type === 'link' ? (
                        <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-600 hover:bg-stone-200">
                          <Link2 size={14} /> {v.url}
                        </a>
                      ) : (
                        <video key={v.id} src={v.url} controls className="w-full rounded-lg sm:max-w-sm" />
                      )
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
          {/* Fixed actions bar — stays visible while the body above scrolls */}
          <div className="shrink-0 border-t border-stone-200 pt-0 mt-2 mb-3">
            <ModalActions>
              <BtnSecondary onClick={onClose}>Close</BtnSecondary>
            </ModalActions>
          </div>
        </div>

        {lightbox && (
          <Lightbox
            images={lightbox.images}
            index={lightbox.index}
            onIndexChange={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
            onClose={() => setLightbox(null)}
          />
        )}
      </Modal>
    );
  }

  /* ---------- add / edit mode ---------- */

  const galleryImages = photos.map((p) => ({ url: p.url, name: p.name }));

  return (
    <Modal title={mode === 'edit' ? 'Edit project' : 'Add project'} subtitle="Create a project record for your foundation portfolio." onClose={onClose} wide>
      <form onSubmit={submit} className="flex max-h-[75vh] flex-col">
        {/* Scrollable body — only this area scrolls; the actions bar below stays fixed in place */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">BASIC INFORMATION</div>
              <Field label="Project name">
                <input
                  className={`${inputClass} ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={handleNameBlur}
                  placeholder="e.g. Rural healthcare outreach camp"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'project-name-error' : undefined}
                />
                {errors.name && (
                  <p id="project-name-error" className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </Field>
              {/* Description, Client, Project URL, Services, Cover image, Photos, Videos and Video link
              are all optional fields per the form — intentionally left without any validation. */}
              <Field label="Short description" hint="Shown on the project card">
                <textarea className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One or two sentences about what the project did and what changed." rows={3} />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category / industry">
                  <select className={inputClass} value={cat} onChange={(e) => setCat(e.target.value)}>
                    {categories.map((c) => <option key={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Project date">
                  <input className={inputClass} value={project?.date ?? '15 Aug 2026'} readOnly />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Client / company">
                  <input className={inputClass} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Organisation name" />
                </Field>
                <Field label="Project URL" hint="Optional">
                  <input className={inputClass} placeholder="https://" />
                </Field>
              </div>
              <Field label="Services delivered">
                <input className={inputClass} value={services} onChange={(e) => setServices(e.target.value)} placeholder="Type a service, separated by commas" />
              </Field>
              <Field label="Status">
                <div className="flex flex-wrap gap-2">
                  {(['Draft', 'Published', 'Active', 'Inactive'] as ProjectStatus[]).map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setProjectStatus(value)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${projectStatus === value ? 'border-[#d9aa3f] bg-[#d9aa3f]/15 text-[#b98a2c]' : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {/* ---------------- COVER IMAGE (single upload) ---------------- */}
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
                    onClick={() => setCoverImage(null)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove cover image"
                  >
                    <X size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div
                  className={dropZoneClass('cover')}
                  {...dropHandlers('cover', handleCoverFiles)}
                  onClick={() => coverInputRef.current?.click()}
                  role="button"
                >
                  <Upload size={20} />
                  <strong className="text-sm text-stone-600">Drop a cover image here, or browse</strong>
                  <small className="text-xs">PNG, JPG or SVG · 1600×900 works best</small>
                </div>
              )}

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverFiles(e.target.files)}
              />
            </div>

            {/* ---------------- PROJECT PHOTOS (multiple upload) ---------------- */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">PROJECT PHOTOS</div>

              <div
                className={dropZoneClass('photos')}
                {...dropHandlers('photos', handlePhotoFiles)}
                onClick={() => photosInputRef.current?.click()}
                role="button"
              >
                <ImageIcon size={20} />
                <strong className="text-sm text-stone-600">Drop photos here, or browse</strong>
                <small className="text-xs">Up to 20 images · PNG or JPG, 15MB each</small>
              </div>

              <input
                ref={photosInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handlePhotoFiles(e.target.files)}
              />

              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {photos.map((p, i) => (
                    <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg">
                      <img
                        src={p.url}
                        alt={p.name}
                        onClick={() => setLightbox({ images: galleryImages, index: i })}
                        className="h-full w-full cursor-pointer object-cover transition group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                        aria-label={`Remove ${p.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---------------- PROJECT VIDEOS (multiple upload + link) ---------------- */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">PROJECT VIDEOS</div>

              <div
                className={dropZoneClass('videos')}
                {...dropHandlers('videos', handleVideoFiles)}
                onClick={() => videosInputRef.current?.click()}
                role="button"
              >
                <Video size={20} />
                <strong className="text-sm text-stone-600">Drop videos here, or browse</strong>
                <small className="text-xs">MP4 or WebM up to 50MB each</small>
              </div>

              <input
                ref={videosInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => handleVideoFiles(e.target.files)}
              />

              <div className="mt-3 mb-2">
                <Field label="Or add a video link" hint="Optional — YouTube, Vimeo or MP4">
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLinkVideo())}
                      placeholder="https://youtube.com/watch?v="
                    />
                    <BtnSecondary type="button" onClick={addLinkVideo}>Add</BtnSecondary>
                  </div>
                </Field>
              </div>

              {videos.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {videos.map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-3 rounded-lg bg-stone-100 px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2 text-xs text-stone-600">
                        {v.type === 'link' ? <Link2 size={14} className="shrink-0" /> : <Video size={14} className="shrink-0" />}
                        <span className="truncate">{v.name}</span>
                      </div>
                      <button type="button" onClick={() => removeVideo(v.id)} className="shrink-0 text-stone-400 hover:text-red-500" aria-label={`Remove ${v.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Fixed actions bar — stays visible while the body above scrolls */}
        <div className="shrink-0 border-t border-stone-200 pt-0 mb-3">
          <ModalActions>
            <BtnSecondary type="button" onClick={onClose}>Cancel</BtnSecondary>
            <BtnPrimary type="submit" disabled={busy}>
              {busy ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Create project'}
            </BtnPrimary>
          </ModalActions>
        </div>
      </form>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onIndexChange={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
          onClose={() => setLightbox(null)}
        />
      )}
    </Modal>
  );
}

export default ProjectModal;