import { useEffect, useRef, useState, type FormEvent } from 'react';

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Grid2X2,
  ListFilter,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import { useCategoryStore, type CategoryFormValue } from '../store/categoryStore';
import type { CategoryStatus, CategoryUi } from '../types/category';
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
import { toast } from '@/store/toastStore';
import DeleteConfirmationModal from './deleteModal';
import Loading from './loading';

const LIMIT = 10;

export function Categories() {
  const {
    categories,
    total,
    loading,
    submitting,
    deletingId,
    loadCategories,
    deleteCategory,
  } = useCategoryStore();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All status' | CategoryStatus>('All status');
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [showModal, setShowModal] = useState<any>({
    modal: false,
    values: ''
  });
  const [selected, setSelected] = useState<CategoryUi | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [query, status]);

  // debounced server call — dynamic query params: offset, limit, search, status
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      loadCategories({ offset: (page - 1) * LIMIT, limit: LIMIT, search: query, status });
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, status, page, loadCategories]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const open = (kind: 'add' | 'edit' | 'view', category?: CategoryUi) => {
    setSelected(category ?? null);
    setModal(kind);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleDelete = async (category: CategoryUi) => {
    const res = await deleteCategory(category.id);
    if (res) {
      setShowModal(null);
      loadCategories({ offset: (page - 1) * LIMIT, limit: LIMIT, search: query, status });
    }
  };

  const filtersActive = Boolean(query) || status !== 'All status';

  return (
    <div className="flex flex-col gap-6">

      {loading && <Loading message='Please wait, loading your data...' />}
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b98a2c]">WORKSPACE / CATEGORIES</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">Categories</h2>
          <p className="mt-1 text-sm text-stone-500">Keep programmes organised across the foundation.</p>
        </div>

        <button
          type="button"
          onClick={() => open('add')}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#d9aa3f] px-4 py-2.5 text-sm font-semibold text-stone-900 hover:bg-[#c99a34]"
        >
          <Plus size={17} />
          Add category
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Search categories..." />

        <div className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
          <ListFilter size={16} className="text-stone-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'All status' | CategoryStatus)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option value="All status">All status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setStatus('All status');
            }}
            className="text-sm font-medium text-[#b98a2c] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-stone-200 bg-white">

        {categories?.length ? <div className="overflow-x-auto min-h-[230px]">
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
              {categories.map((category) => {
                const deleting = deletingId === category.id;

                return (
                  <tr key={category.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#d9aa3f]" />
                        <strong className="text-stone-900">{category.name}</strong>
                      </div>
                    </td>

                    <td className="max-w-xs truncate px-5 py-3 text-stone-500">{category.description || '—'}</td>

                    <td className="px-5 py-3 text-stone-600">
                      <strong className="text-stone-900">{category.projects}</strong> projects
                    </td>

                    <td className="px-5 py-3">
                      <StatusBadge status={category.status} />
                    </td>

                    <td className="px-5 py-3 text-stone-500">{category.created || '—'}</td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="View"
                          onClick={() => open('view', category)}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() => open('edit', category)}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          disabled={deleting}
                          onClick={() => setShowModal({
                            modal: true,
                            values: category
                          })}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> : null}

        {!loading && categories.length === 0 && (
          <div className="flex flex-col min-h-[230px] items-center gap-2 py-16 text-stone-400">
            <Grid2X2 size={30} />
            <strong className="text-stone-600">No categories found</strong>
            <span className="text-sm">Try adjusting your search or filters.</span>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3 text-sm text-stone-500">
          <div>
            Showing <strong className="text-stone-900">{categories.length}</strong> of{' '}
            <strong className="text-stone-900">{total}</strong> categories
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-stone-200 p-1.5 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {modal && <CategoryModal mode={modal} category={selected} onClose={closeModal} busy={submitting} />}
      {showModal?.modal && <DeleteConfirmationModal
        title={`Are you sure you want to delete this`}
        subtitle={`${showModal?.values?.name}?`}
        loading={deletingId === showModal?.values?.id}
        cancel={() => setShowModal(false)}
        confirm={() => handleDelete(showModal?.values)}
      />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Category Modal                                                             */
/* -------------------------------------------------------------------------- */

function CategoryModal({
  mode,
  category,
  onClose,
  busy,
}: {
  mode: 'add' | 'edit' | 'view';
  category: CategoryUi | null;
  onClose: () => void;
  busy: boolean;
}) {
  const { addCategory, updateCategory } = useCategoryStore();
  const view = mode === 'view';

  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [status, setStatus] = useState<CategoryStatus>(category?.status ?? 'Active');
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Category name is required.');
      return;
    }

    setError(null);

    const value: CategoryFormValue = { name: trimmedName, description: description.trim(), status };

    const result = category ? await updateCategory(category.id, value) : await addCategory(value);
    if (result) onClose();
  };

  if (view) {
    return (
      <Modal title="Category details" subtitle="Organise project records by programme area." onClose={onClose}>
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d9aa3f]/15 text-[#b98a2c]">
              <Grid2X2 size={22} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-stone-900">{category?.name}</h3>
              <StatusBadge status={category?.status ?? 'Active'} />
            </div>
          </div>

          <p className="text-sm text-stone-600">{category?.description || 'No description available.'}</p>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            <Detail label="Projects" value={`${category?.projects ?? 0} projects`} />
            <Detail label="Created" value={category?.created || '—'} />
            <Detail label="Last updated" value={category?.updated || '—'} />
          </div>

          <div className="mt-2 mb-2 w-full shrink-0 border-t border-stone-200 pt-0">
            <ModalActions>
              <BtnSecondary type="button" onClick={onClose}>
                Close
              </BtnSecondary>
            </ModalActions>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      cls="!h-[100%] md:!h-max"
      title={category ? 'Edit category' : 'Add category'}
      subtitle="Organise project records by programme area."
      onClose={onClose}
      wide
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Category name">
          <input
            className={`${inputClass} ${error ? 'border-red-400 focus:border-red-400' : ''}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Education"
            required
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </Field>

        <Field label="Description">
          <textarea
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="A short description of this programme area"
          />
        </Field>

        <Field label="Status">
          <div className="flex gap-2">
            {(['Active', 'Inactive'] as const).map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setStatus(value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${status === value
                  ? 'border-[#d9aa3f] bg-[#d9aa3f]/15 text-[#b98a2c]'
                  : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                  }`}
              >
                {value}
              </button>
            ))}
          </div>
        </Field>

        <div className="mb-3 shrink-0 border-t border-stone-200 pt-0">
          <ModalActions>
            <BtnSecondary type="button" onClick={onClose} disabled={busy}>
              Cancel
            </BtnSecondary>

            <BtnPrimary type="submit" disabled={busy}>
              {busy ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </span>
              ) : category ? (
                'Save changes'
              ) : (
                'Create category'
              )}
            </BtnPrimary>
          </ModalActions>
        </div>
      </form>
    </Modal>
  );
}

export default Categories;