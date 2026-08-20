import { useEffect, type ReactNode } from 'react';
import {
  ArrowUpRight,
  ChevronRight,
  FolderKanban,
  Grid2X2,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  UserRound,
  Zap,
} from 'lucide-react';

import { useDashboardStore } from '../store/dashboardStore';
import { useProjectStore } from '../store/projectStore';
import { useCategoryStore } from '../store/categoryStore';
import { StatusBadge } from './Shared';
import { useNavigate } from 'react-router-dom';
import Loading from './loading';
import { useProfileStore } from '@/store/profileStore';
import { formattedDate } from '@/utils/helper';

const gold = '#d9aa3f';


/* -------------------------------------------------------------------------- */
/* Metric Card                                                                */
/* -------------------------------------------------------------------------- */

function MetricCard({
  icon,
  label,
  value,
  trend,
  detail,
  up,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  trend: string;
  detail: string;
  up?: boolean;
  tone: string;
}) {
  const toneMap: Record<string, string> = {
    gold: 'bg-[#d9aa3f]/15 text-[#b98a2c]',
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    peach: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="flex min-h-max items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
      <div
        className={`!mb-0 flex h-10 w-10 items-center justify-center rounded-xl ${toneMap[tone]
          }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-500">{label}</p>

        <div className="mt-1 text-end text-2xl font-semibold text-stone-900">
          {value}
        </div>
      </div>

      {/*
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span
          className={`flex items-center gap-0.5 font-medium ${
            up ? 'text-emerald-600' : 'text-stone-500'
          }`}
        >
          {up && <ArrowUpRight size={13} />}
          {trend}
        </span>

        <span className="text-stone-400">{detail}</span>
      </div>
      */}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Legend                                                                     */
/* -------------------------------------------------------------------------- */

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-stone-600">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: color }}
      />

      <span className="flex-1">{label}</span>

      <strong className="text-stone-900">{value}</strong>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export function Dashboard() {
  const setPage = useDashboardStore((state) => state.setPage);
  const navigate = useNavigate()
  const projectStore = useProjectStore();
  const categoryStore = useCategoryStore();
  const profile = useProfileStore((state) => state.profile);

  const {
    projects: storeProjects,
    loading: projectLoading,
    getProjects
  } = projectStore;

  const {
    categories: storeCategories,
    loading: categoryLoading,
    loadCategories,
  } = categoryStore;

  /* ------------------------------------------------------------------------ */
  /* Use API/store data when available, otherwise dummy data                  */
  /* ------------------------------------------------------------------------ */

  const projects =
    storeProjects && storeProjects.length > 0
      ? storeProjects
      : [];

  const categories =
    storeCategories && storeCategories.length > 0
      ? storeCategories
      : [];

  /* ------------------------------------------------------------------------ */
  /* Project status calculations                                              */
  /* ------------------------------------------------------------------------ */

  const published = projects.filter(
    (project) => project.status === 'Published'
  ).length;

  const active = projects.filter(
    (project) => project.status === 'Active'
  ).length;

  const draft = projects.filter(
    (project) => project.status === 'Draft'
  ).length;

  const inactive = projects.filter(
    (project) => project.status === 'Inactive'
  ).length;

  const loading_ = (projectLoading || categoryLoading);

  const actionNavgiate = (route: string) => {
    navigate(route)
  }

  useEffect(() => {
    getProjects();
    loadCategories();
  }, [])
  return (
    <div className="flex flex-col gap-6">
      {loading_ && <Loading message='Please wait, loading your data...' />}
      {/* ------------------------------------------------------------------ */}
      {/* Welcome row                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#b98a2c]">
            {formattedDate}
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-stone-900">
            Good morning, {profile?.fullName}.
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Here's what's happening across your foundation today.
          </p>
        </div>

        <button
          onClick={() => navigate('/projects')}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#d9aa3f] px-4 py-2.5 text-sm font-semibold text-stone-900 hover:bg-[#c99a34]"
        >
          <Plus size={17} />

          New project
        </button>
      </div>


      {/* ------------------------------------------------------------------ */}
      {/* Metric grid                                                        */}
      {/* ------------------------------------------------------------------ */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 xl:grid-cols-4">
        <MetricCard
          icon={<FolderKanban size={20} />}
          label="Total projects"
          value={projects.length ? String(projects.length).padStart(2, '0') : "-"}
          trend="12.5%"
          up
          detail="vs last month"
          tone="gold"
        />

        <MetricCard
          icon={<Zap size={20} />}
          label="Active projects"
          value={active ? String(active).padStart(2, "0") : "-"}
          trend="8.2%"
          up
          detail="vs last month"
          tone="green"
        />

        <MetricCard
          icon={<ShieldCheck size={20} />}
          label="Published"
          value={published ? String(published).padStart(2, '0') : "-"}
          trend="4.6%"
          up
          detail="vs last month"
          tone="blue"
        />

        <MetricCard
          icon={<Grid2X2 size={20} />}
          label="Categories"
          value={categories.length ? String(categories.length).padStart(2, '0') : "-"}
          trend="2 new"
          detail="this quarter"
          tone="peach"
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Recent projects + project status                                   */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent projects */}

        <section className="rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Recent projects
              </h3>

              <p className="text-sm text-stone-500">
                Latest additions to your portfolio
              </p>
            </div>

            <button
              onClick={() => actionNavgiate('/projects')}
              className="flex items-center gap-1 text-sm font-medium text-[#b98a2c] hover:underline"
            >
              View all

              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="mt-4 flex flex-col divide-y divide-stone-100">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-3 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9aa3f]/15 text-sm font-semibold text-[#b98a2c]">
                  {project.image}
                </div>

                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm text-stone-900">
                    {project.name}
                  </strong>

                  <small className="text-xs text-stone-500">
                    {project.category} · {project.updated}
                  </small>
                </div>

                <StatusBadge status={project.status} />
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Project status                                                   */}
        {/* ---------------------------------------------------------------- */}

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Project status
              </h3>

              <p className="text-sm text-stone-500">
                Current portfolio breakdown
              </p>
            </div>

            <button className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100">
              <MoreHorizontal size={19} />
            </button>
          </div>

          {/* Status circle */}

          <div className="my-6 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-[#d9aa3f]/30">
              <div className="flex flex-col items-center">
                <strong className="text-2xl font-semibold text-stone-900">
                  {projects.length}
                </strong>

                <small className="text-xs text-stone-400">
                  total
                </small>
              </div>
            </div>
          </div>

          {/* Status legend */}

          <div className="flex flex-col gap-2.5">
            <Legend
              color="#d9aa3f"
              label="Published"
              value={String(published)}
            />

            <Legend
              color="#3f7f6b"
              label="Active"
              value={String(active)}
            />

            <Legend
              color="#c9b9a0"
              label="Draft"
              value={String(draft)}
            />

            <Legend
              color="#e3ddd1"
              label="Inactive"
              value={String(inactive)}
            />
          </div>

          <button
            onClick={() => actionNavgiate('/projects')}
            className="mt-4 flex items-center gap-1 text-sm font-medium text-[#b98a2c] hover:underline"
          >
            View all projects

            <ArrowUpRight size={16} />
          </button>
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Quick actions                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="text-base font-semibold text-stone-900">
            Quick actions
          </h3>

          <p className="text-sm text-stone-500">
            Commonly used tools
          </p>

          <div className="mt-4 flex flex-col gap-2">
            {/* Add project */}

            <button
              onClick={() => actionNavgiate('/projects')}
              className="flex items-center gap-3 rounded-lg p-2 text-left hover:bg-stone-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d9aa3f]/15 text-[#b98a2c]">
                <Plus size={18} />
              </span>

              <span className="flex-1">
                <strong className="block text-sm text-stone-900">
                  Add project
                </strong>

                <small className="text-xs text-stone-500">
                  Create a new foundation project
                </small>
              </span>

              <ChevronRight
                size={16}
                className="text-stone-400"
              />
            </button>

            {/* Manage categories */}

            <button
              onClick={() => actionNavgiate('/categories')}
              className="flex items-center gap-3 rounded-lg p-2 text-left hover:bg-stone-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Grid2X2 size={18} />
              </span>

              <span className="flex-1">
                <strong className="block text-sm text-stone-900">
                  Manage categories
                </strong>

                <small className="text-xs text-stone-500">
                  Organise your programme areas
                </small>
              </span>

              <ChevronRight
                size={16}
                className="text-stone-400"
              />
            </button>

            {/* Update profile */}

            <button
              onClick={() => actionNavgiate('/profile')}
              className="flex items-center gap-3 rounded-lg p-2 text-left hover:bg-stone-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <UserRound size={18} />
              </span>

              <span className="flex-1">
                <strong className="block text-sm text-stone-900">
                  Update profile
                </strong>

                <small className="text-xs text-stone-500">
                  Keep your details up to date
                </small>
              </span>

              <ChevronRight
                size={16}
                className="text-stone-400"
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}