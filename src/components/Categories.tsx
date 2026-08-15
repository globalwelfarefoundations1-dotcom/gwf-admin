import { useEffect, useState, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Eye, Grid2X2, ListFilter, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAdminStore, type Category } from '../store/useAdminStore';
import { BtnPrimary, BtnSecondary, Detail, Field, inputClass, Modal, ModalActions, SearchBar, StatusBadge } from './Shared';

export function Categories() {
  const { categories, projects, categoriesLoading, loadCategories, deleteCategory, mutating } = useAdminStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All status');
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Category | null>(null);

  useEffect(() => { if (categories.length === 0) loadCategories(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = categories.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) && (status === 'All status' || c.status === status)
  );

  const open = (kind: 'add' | 'edit' | 'view', cat?: Category) => {
    setSelected(cat ?? null);
    setModal(kind);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b98a2c]">WORKSPACE / CATEGORIES</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">Categories</h2>
          <p className="mt-1 text-sm text-stone-500">Keep programmes organised across the foundation.</p>
        </div>
        <button
          onClick={() => open('add')}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#d9aa3f] px-4 py-2.5 text-sm font-semibold text-stone-900 hover:bg-[#c99a34]"
        >
          <Plus size={17} /> Add category
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Search categories..." />
        <div className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
          <ListFilter size={16} className="text-stone-400" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-transparent text-sm outline-none w-full">
            <option>All status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white">

        {categoriesLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-stone-400">
            <Loader2 size={18} className="animate-spin" /> Loading categories...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-400">
                  <th className="px-5 py-3 font-medium">Category name</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Projects</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#d9aa3f]" />
                        <strong className="text-stone-900">{cat.name}</strong>
                      </div>
                    </td>
                    <td className="max-w-xs truncate px-5 py-3 text-stone-500">{cat.description}</td>
                    <td className="px-5 py-3 text-stone-600">
                      <strong className="text-stone-900">{projects.filter((p) => p.category === cat.name).length || cat.projects}</strong> projects
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={cat.status} /></td>
                    <td className="px-5 py-3 text-stone-500">{cat.created}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => open('view', cat)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"><Eye size={16} /></button>
                        <button onClick={() => open('edit', cat)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"><Pencil size={16} /></button>
                        <button onClick={() => deleteCategory(cat.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3 text-sm text-stone-500">
          <div className="border-b border-stone-100 px-5 py-3 text-sm text-stone-500">
            Showing <strong className="text-stone-900">{filtered.length}</strong> of <strong className="text-stone-900">{categories.length}</strong> categories
          </div>
          {/* <span>Page 1 of 1</span> */}
          <div className="flex items-center gap-1">
            <button disabled className="rounded-lg border border-stone-200 p-1.5 opacity-40"><ChevronLeft size={16} /></button>
            <button className="rounded-lg bg-[#d9aa3f] px-2.5 py-1 text-xs font-semibold text-stone-900">1</button>
            <button disabled className="rounded-lg border border-stone-200 p-1.5 opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {modal && <CategoryModal mode={modal} category={selected} onClose={() => setModal(null)} busy={mutating} />}
    </div>
  );
}

function CategoryModal({ mode, category, onClose, busy }: { mode: 'add' | 'edit' | 'view'; category: Category | null; onClose: () => void; busy: boolean }) {
  const { addCategory, updateCategory } = useAdminStore();
  const view = mode === 'view';
  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [status, setStatus] = useState<'Active' | 'Inactive'>(category?.status ?? 'Active');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const value = { name, description, status, projects: category?.projects ?? 0, created: category?.created ?? '15 Aug 2026' };
    if (category) await updateCategory({ ...category, ...value });
    else await addCategory(value);
    onClose();
  };

  if (view) {
    return (
      <Modal title="Category details" subtitle="Organise project records by programme area." onClose={onClose}>
        <div className="flex flex-col items-start gap-3">
          <div className='flex gap-2 items-center'>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d9aa3f]/15 text-[#b98a2c]"><Grid2X2 size={22} /></div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900">{category?.name}</h3>
              <StatusBadge status={category?.status ?? 'Active'} />
            </div>
          </div>
          <p className="text-sm text-stone-600">{category?.description}</p>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            <Detail label="Projects" value={`${category?.projects ?? 0} projects`} />
            <Detail label="Created" value={category?.created} />
            <Detail label="Last updated" value={category?.updated} />
          </div>
          <div className="shrink-0 border-t border-stone-200 pt-0 mt-2 mb-3 w-full">
            <ModalActions>
              <BtnSecondary onClick={onClose}>Close</BtnSecondary>
            </ModalActions>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal cls="!h-[100%] md:!h-max" title={category ? 'Edit category' : 'Add category'} subtitle="Organise project records by programme area." onClose={onClose} wide>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Category name">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Education" required />
        </Field>
        <Field label="Description">
          <textarea className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="A short description of this programme area" />
        </Field>
        <Field label="Status">
          <div className="flex gap-2">
            {(['Active', 'Inactive'] as const).map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setStatus(value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${status === value ? 'border-[#d9aa3f] bg-[#d9aa3f]/15 text-[#b98a2c]' : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                  }`}
              >
                {value}
              </button>
            ))}
          </div>
        </Field>
        <div className="shrink-0 border-t border-stone-200 pt-0 mb-3">
          <ModalActions>
            <BtnSecondary type="button" onClick={onClose}>Cancel</BtnSecondary>
            <BtnPrimary type="submit" disabled={busy}>
              {busy ? 'Saving...' : category ? 'Save changes' : 'Create category'}
            </BtnPrimary>
          </ModalActions>
        </div>
      </form>
    </Modal>
  );
}
