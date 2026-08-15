import { useEffect } from 'react';
import { Bell, Check, ChevronDown, Menu, X } from 'lucide-react';
import { useAdminStore, type Page } from './store/useAdminStore';
import { Sidebar, SidebarBackdrop } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Projects } from './components/Projects';
import { Categories } from './components/Categories';
import { Profile } from './components/Profile';

const pageTitles: Record<Page, string> = {
  dashboard: 'Overview',
  projects: 'Project management',
  categories: 'Categories',
  profile: 'Your profile',
};

function App() {
  const { page, collapsed, toast, toggleSidebar, clearToast } = useAdminStore();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div className="flex min-h-screen w-full bg-stone-50">
      <Sidebar />
      <SidebarBackdrop />

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 lg:hidden">
              <Menu size={20} />
            </button>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">GWF ADMINISTRATION</div>
              <h1 className="text-lg font-semibold text-stone-900">{pageTitles[page]}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-stone-500 hover:bg-stone-100">
              <Bell size={19} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#d9aa3f]" />
            </button>
            <div className="hidden h-6 w-px bg-stone-200 sm:block" />
            <button
              onClick={() => useAdminStore.getState().setPage('profile')}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-stone-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9aa3f] text-xs font-semibold text-stone-900">AK</span>
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <strong className="text-sm text-stone-900">Ashok Kumar</strong>
                <small className="text-xs text-stone-400">Administrator</small>
              </span>
              <ChevronDown size={15} className="hidden text-stone-400 sm:block" />
            </button>
          </div>
        </header>

        <main className={`flex-1 p-4 sm:p-6 ${collapsed ? '' : ''}`}>
          {page === 'dashboard' && <Dashboard />}
          {page === 'projects' && <Projects />}
          {page === 'categories' && <Categories />}
          {page === 'profile' && <Profile />}
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-stone-900 px-4 py-3 text-sm text-white shadow-lg">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500"><Check size={14} /></span>
          {toast}
          <button onClick={clearToast} className="text-stone-400 hover:text-white"><X size={15} /></button>
        </div>
      )}
    </div>
  );
}

export default App;
