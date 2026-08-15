import type { ReactNode } from 'react';
import {
  ArrowUpRight, ChevronDown, ChevronRight, FolderKanban, Grid2X2,
  MoreHorizontal, Plus, ShieldCheck, UserRound, Zap,
} from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { StatusBadge } from './Shared';

const gold = '#d9aa3f';

function MetricCard({ icon, label, value, trend, detail, up, tone }: { icon: ReactNode; label: string; value: string; trend: string; detail: string; up?: boolean; tone: string }) {
  const toneMap: Record<string, string> = {
    gold: 'bg-[#d9aa3f]/15 text-[#b98a2c]',
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    peach: 'bg-orange-100 text-orange-700',
  };
  return (
    <div className="rounded-2xl border border-stone-200 items-center bg-white p-5 flex justify-between min-h-max">
      <div className={`!mb-0 flex h-10 w-10 items-center justify-center rounded-xl ${toneMap[tone]}`}>{icon}</div>
      <div>
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <div className="mt-1 text-2xl font-semibold text-stone-900 text-end">{value}</div>
      </div>
      {/* <div className="mt-2 flex items-center gap-2 text-xs">
        <span className={`flex items-center gap-0.5 font-medium ${up ? 'text-emerald-600' : 'text-stone-500'}`}>
          {up && <ArrowUpRight size={13} />}
          {trend}
        </span>
        <span className="text-stone-400">{detail}</span>
      </div> */}
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-stone-600">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="flex-1">{label}</span>
      <strong className="text-stone-900">{value}</strong>
    </div>
  );
}

export function Dashboard() {
  const { projects, categories, setPage } = useAdminStore();
  const published = projects.filter((p) => p.status === 'Published').length;
  const active = projects.filter((p) => p.status === 'Active').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b98a2c]">SATURDAY, 15 AUGUST 2026</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">Good morning, Ashok Kumar.</h2>
          <p className="mt-1 text-sm text-stone-500">Here's what's happening across your foundation today.</p>
        </div>
        <button
          onClick={() => setPage('projects')}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#d9aa3f] px-4 py-2.5 text-sm font-semibold text-stone-900 hover:bg-[#c99a34]"
        >
          <Plus size={17} /> New project
        </button>
      </div>

      {/* Metric grid: 1 col mobile, 2 col sm, 4 col lg */}
      <section className="grid grid-cols-1 gap-4 xs:grid-cols-1 sm:grid-cols-4 xl:grid-cols-4">
        <MetricCard icon={<FolderKanban size={20} />} label="Total projects" value={String(projects.length).padStart(2, '0')} trend="12.5%" up detail="vs last month" tone="gold" />
        <MetricCard icon={<Zap size={20} />} label="Active projects" value={String(active + 3).padStart(2, '0')} trend="8.2%" up detail="vs last month" tone="green" />
        <MetricCard icon={<ShieldCheck size={20} />} label="Published" value={String(published + 1).padStart(2, '0')} trend="4.6%" up detail="vs last month" tone="blue" />
        <MetricCard icon={<Grid2X2 size={20} />} label="Categories" value={String(categories.length).padStart(2, '0')} trend="2 new" detail="this quarter" tone="peach" />
      </section>

      {/* Chart + status: stacked on mobile, side by side from lg */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Recent projects</h3>
              <p className="text-sm text-stone-500">Latest additions to your portfolio</p>
            </div>
            <button onClick={() => setPage('projects')} className="flex items-center gap-1 text-sm font-medium text-[#b98a2c] hover:underline">
              View all <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-stone-100">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="flex items-center gap-3 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9aa3f]/15 text-sm font-semibold text-[#b98a2c]">
                  {project.image}
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm text-stone-900">{project.name}</strong>
                  <small className="text-xs text-stone-500">{project.category} · {project.updated}</small>
                </div>
                <StatusBadge status={project.status} />
              </div>
            ))}
          </div>
        </section>
        {/* <section className="rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-stone-900">Project performance</h3>
              <p className="text-sm text-stone-500">Project activity over the last 6 months</p>
            </div>
            <button className="hidden items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-600 sm:flex">
              Last 6 months <ChevronDown size={14} />
            </button>
          </div>
          <div className="mt-6 h-56 w-full">
            <svg viewBox="0 0 650 220" preserveAspectRatio="none" className="h-full w-full" aria-label="Project performance chart">
              <defs>
                <linearGradient id="fillGold" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={gold} stopOpacity=".28" />
                  <stop offset="1" stopColor={gold} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 176 C55 166, 70 136, 125 146 S180 117, 235 132 S280 96, 330 108 S380 75, 430 82 S490 48, 540 65 S600 26, 650 38 V220 H0Z" fill="url(#fillGold)" />
              <path d="M0 176 C55 166, 70 136, 125 146 S180 117, 235 132 S280 96, 330 108 S380 75, 430 82 S490 48, 540 65 S600 26, 650 38" fill="none" stroke={gold} strokeWidth="3" />
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-xs text-stone-400">
            <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
          </div>
        </section> */}

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Project status</h3>
              <p className="text-sm text-stone-500">Current portfolio breakdown</p>
            </div>
            <button className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100"><MoreHorizontal size={19} /></button>
          </div>
          <div className="my-6 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-[#d9aa3f]/30">
              <div className="flex flex-col items-center">
                <strong className="text-2xl font-semibold text-stone-900">{projects.length}</strong>
                <small className="text-xs text-stone-400">total</small>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <Legend color="#d9aa3f" label="Published" value="2" />
            <Legend color="#3f7f6b" label="Active" value="1" />
            <Legend color="#c9b9a0" label="Draft" value="1" />
            <Legend color="#e3ddd1" label="Inactive" value="1" />
          </div>
          <button onClick={() => setPage('projects')} className="mt-4 flex items-center gap-1 text-sm font-medium text-[#b98a2c] hover:underline">
            View all projects <ArrowUpRight size={16} />
          </button>
        </section>
      </div>

      {/* Recent + quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="text-base font-semibold text-stone-900">Quick actions</h3>
          <p className="text-sm text-stone-500">Commonly used tools</p>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={() => setPage('projects')} className="flex items-center gap-3 rounded-lg p-2 text-left hover:bg-stone-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d9aa3f]/15 text-[#b98a2c]"><Plus size={18} /></span>
              <span className="flex-1">
                <strong className="block text-sm text-stone-900">Add project</strong>
                <small className="text-xs text-stone-500">Create a new foundation project</small>
              </span>
              <ChevronRight size={16} className="text-stone-400" />
            </button>
            <button onClick={() => setPage('categories')} className="flex items-center gap-3 rounded-lg p-2 text-left hover:bg-stone-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Grid2X2 size={18} /></span>
              <span className="flex-1">
                <strong className="block text-sm text-stone-900">Manage categories</strong>
                <small className="text-xs text-stone-500">Organise your programme areas</small>
              </span>
              <ChevronRight size={16} className="text-stone-400" />
            </button>
            <button onClick={() => setPage('profile')} className="flex items-center gap-3 rounded-lg p-2 text-left hover:bg-stone-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700"><UserRound size={18} /></span>
              <span className="flex-1">
                <strong className="block text-sm text-stone-900">Update profile</strong>
                <small className="text-xs text-stone-500">Keep your details up to date</small>
              </span>
              <ChevronRight size={16} className="text-stone-400" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
