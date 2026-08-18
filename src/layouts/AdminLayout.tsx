import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Sidebar, SidebarBackdrop } from "../components/Sidebar";
import { useAdminStore } from "../store/useAdminStore";
import { ToastContainer } from "../components/ToastContainer";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/projects": "Project management",
  "/categories": "Categories",
  "/profile": "Your profile",
};

export function AdminLayout() {
  const navigate = useNavigate();

  const location = useLocation();

  const {
    collapsed,
    toggleSidebar,
  } = useAdminStore();

  const user = useAdminStore(
    (state) => state.user
  );

  const title =
    pageTitles[location.pathname] ??
    "Administration";

  return (
    <div className="flex min-h-screen w-full bg-stone-50">

      <Sidebar />

      <SidebarBackdrop />

      <div className="flex min-h-screen w-full flex-1 flex-col">

        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                GWF ADMINISTRATION
              </div>

              <h1 className="text-lg font-semibold text-stone-900">
                {title}
              </h1>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="relative rounded-lg p-2 text-stone-500 hover:bg-stone-100"
            >
              <Bell size={19} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#d9aa3f]" />
            </button>

            <div className="hidden h-6 w-px bg-stone-200 sm:block" />

            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-stone-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9aa3f] text-xs font-semibold text-stone-900">
                {user?.name
                  ?.slice(0, 2)
                  .toUpperCase() ?? "AK"}
              </span>

              <span className="hidden flex-col items-start leading-tight sm:flex">

                <strong className="text-sm text-stone-900">
                  {user?.name ??
                    "Ashok Kumar"}
                </strong>

                <small className="text-xs text-stone-400">
                  {user?.role ??
                    "Administrator"}
                </small>

              </span>

              <ChevronDown
                size={15}
                className="hidden text-stone-400 sm:block"
              />

            </button>

          </div>

        </header>

        <main
          className={`flex-1 p-4 sm:p-6 ${
            collapsed ? "" : ""
          }`}
        >
          <Outlet />
        </main>

      </div>

      <ToastContainer />

    </div>
  );
}