import {
  ChevronLeft,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  LogOut,
  UserRound,
  X,
} from 'lucide-react';
import { useAdminStore, type Page } from '../store/useAdminStore';
// @ts-ignore: allow importing image asset without type declaration
import Logo from "../assets/logo.png";

export function SidebarBackdrop() {
  const sidebarOpen = useAdminStore((s) => s.sidebarOpen);
  const toggleSidebar = useAdminStore((s) => s.toggleSidebar);

  if (!sidebarOpen) return null;

  return (
    <button
      aria-label="Close navigation"
      onClick={toggleSidebar}
      className="fixed inset-0 z-30 bg-stone-900/40 lg:hidden"
    />
  );
}

export function Sidebar() {
  const {
    page,
    setPage,
    collapsed,
    toggleCollapsed,
    toggleSidebar,
    sidebarOpen,
    logout,
    projects,
  } = useAdminStore();

  const nav: {
    id: Page;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
      {
        id: 'dashboard',
        label: 'Overview',
        icon: <LayoutDashboard size={19} />,
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: <FolderKanban size={19} />,
        count: projects.length,
      },
      {
        id: 'categories',
        label: 'Categories',
        icon: <Grid2X2 size={19} />,
      },
    ];

  /**
   * Menu click behavior:
   * - Change page
   * - Close mobile sidebar
   * - Collapse desktop sidebar when expanded
   */
  const handleMenuClick = (selectedPage: Page) => {
    setPage(selectedPage);

    // Desktop: collapse after selecting a menu item.
    // Mobile: do not collapse because mobile should always show labels.
    if (!collapsed) {
      toggleCollapsed();
    }

    // Mobile: close sidebar after selection.
    if (sidebarOpen) {
      toggleSidebar();
    }
  };

  const handleProfileClick = () => {
    handleMenuClick('profile');
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40
        flex flex-col
        border-r border-stone-800
        bg-stone-900 text-stone-100
        shadow-xl
        transition-all duration-200

        /* Mobile */
        w-72
        overflow-y-auto

        /* Desktop */
        lg:sticky
        lg:top-0
        lg:h-screen
        lg:overflow-hidden
        lg:translate-x-0

        ${collapsed ? 'lg:w-20' : 'lg:w-72'}

        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Brand */}
      <div
        className={`
          flex min-h-[88px] shrink-0
          items-center gap-3
          px-5 py-6
          ${collapsed ? 'lg:justify-center lg:px-3' : ''}
        `}
      >
        {/* Logo */}
        <div
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-full
            bg-[#d9aa3f]
            text-sm font-bold
            text-stone-900
          "
        >
          <img
            src={Logo}
            alt="Global Welfare Foundation"
            className="h-auto w-12 object-contain sm:w-16 lg:w-10 xl:w-18"
          />
        </div>

        {/* Brand text
            Always visible on mobile.
            Hidden only when desktop sidebar is collapsed.
        */}
        <div
          className={`
            flex min-w-0 flex-col leading-tight
            ${collapsed ? 'lg:hidden' : ''}
          `}
        >
          <strong className="whitespace-nowrap text-sm tracking-wide">
            GLOBAL WELFARE
          </strong>

          <span className="whitespace-nowrap text-xs text-stone-400">
            FOUNDATION
          </span>
        </div>

        {/* Mobile close button */}
        <button
          onClick={toggleSidebar}
          className="
            ml-auto shrink-0
            rounded-lg p-1.5
            text-stone-400
            hover:bg-stone-800
            lg:hidden
          "
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Workspace title
          Always visible on mobile.
          Hidden only when desktop is collapsed.
      */}
      <div
        className={`
          shrink-0
          px-5 pb-2
          text-xs font-semibold tracking-wide text-stone-500
          ${collapsed ? 'lg:hidden' : ''}
        `}
      >
        WORKSPACE
      </div>

      {/* Main Navigation */}
      <nav className="flex shrink-0 flex-col gap-1 px-3">
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            title={collapsed ? item.label : undefined}
            className={`
              flex w-full
              items-center gap-3
              rounded-lg
              px-3 py-2.5
              text-sm font-medium
              transition-colors

              ${page === item.id
                ? 'bg-[#d9aa3f] text-stone-900'
                : 'text-stone-300 hover:bg-stone-800'
              }

              /* Only center icons on collapsed desktop */
              ${collapsed ? 'lg:justify-center' : ''}
            `}
          >
            <span className="shrink-0">
              {item.icon}
            </span>

            {/* Menu text
                Always visible on mobile.
                Hidden only on collapsed desktop.
            */}
            <span
              className={`
                flex min-w-0 flex-1
                text-left
                ${collapsed ? 'lg:hidden' : ''}
              `}
            >
              {item.label}
            </span>

            {/* Count */}
            {item.count !== undefined && (
              <span
                className={`
                  shrink-0
                  rounded-full
                  bg-stone-800/60
                  px-2 py-0.5
                  text-xs text-stone-300

                  ${collapsed ? 'lg:hidden' : ''}
                `}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom / Account Section */}
      <div className="mt-auto flex shrink-0 flex-col gap-1 px-3 pb-6 pt-6">
        {/* Account title
            Always visible on mobile.
            Hidden only when desktop is collapsed.
        */}
        <div
          className={`
            px-2 pb-2
            text-xs font-semibold tracking-wide text-stone-500
            ${collapsed ? 'lg:hidden' : ''}
          `}
        >
          ACCOUNT
        </div>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          title={collapsed ? 'My profile' : undefined}
          className={`
            flex w-full
            items-center gap-3
            rounded-lg
            px-3 py-2.5
            text-sm font-medium
            transition-colors

            ${page === 'profile'
              ? 'bg-[#d9aa3f] text-stone-900'
              : 'text-stone-300 hover:bg-stone-800'
            }

            ${collapsed ? 'lg:justify-center' : ''}
          `}
        >
          <UserRound size={19} className="shrink-0" />

          <span
            className={`
              ${collapsed ? 'lg:hidden' : ''}
            `}
          >
            My profile
          </span>
        </button>

        {/* Desktop Collapse / Expand */}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
          className="
            mt-3
            hidden
            items-center gap-3
            rounded-lg
            px-3 py-2.5
            text-sm font-medium
            text-stone-400
            hover:bg-stone-800
            lg:flex
          "
        >
          <ChevronLeft
            size={24}
            strokeWidth={3}
            className={`
              shrink-0
              transition-transform duration-200
              ${collapsed ? 'rotate-180' : ''}
            `}
          />

          {!collapsed && (
            <span>
              Collapse menu
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          title={collapsed ? 'Sign out' : undefined}
          className={`
            flex w-full
            items-center gap-3
            rounded-lg
            px-3 py-2.5
            text-sm font-medium
            text-red-400
            hover:bg-stone-800

            ${collapsed ? 'lg:justify-center' : ''}
          `}
        >
          <LogOut size={18} className="shrink-0" />

          <span
            className={`
              ${collapsed ? 'lg:hidden' : ''}
            `}
          >
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}