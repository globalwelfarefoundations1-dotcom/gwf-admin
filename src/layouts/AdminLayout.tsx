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

import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarBackdrop,
} from "../components/Sidebar";

import { ToastContainer } from "../components/ToastContainer";

import { useAdminStore } from "../store/useAdminStore";
import { useProfileStore } from "@/store/profileStore";
import { useSidebarStore } from "@/store/sidebarStore";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/projects": "Project management",
  "/categories": "Categories",
  "/profile": "Your profile",
};

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState<string | null>(null);

  const profile = useProfileStore(
    (state) => state.profile
  );

  const user = useAdminStore(
    (state) => state.user
  );

  const collapsed = useSidebarStore(
    (state) => state.collapsed
  );

  const mobileOpen = useSidebarStore(
    (state) => state.mobileOpen
  );

  const openMobile = useSidebarStore(
    (state) => state.openMobile
  );

  const title =
    pageTitles[location.pathname] ??
    "Administration";

  useEffect(() => {
    if (!profile) return;

    setName(profile.fullName ?? null);
  }, [profile]);

  const initial =
    name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AK";

  return (
    <div className="flex min-h-screen w-full bg-stone-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile backdrop */}
      <SidebarBackdrop />

      <div className="flex min-h-screen w-full flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={openMobile}
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 lg:hidden"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
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

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              type="button"
              className="relative rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              aria-label="Notifications"
            >
              <Bell size={19} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#d9aa3f]" />
            </button>

            <div className="hidden h-6 w-px bg-stone-200 sm:block" />

            {/* Profile */}
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-stone-100"
            >
              {/* Avatar */}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9aa3f] text-xs font-semibold text-stone-900">
                {initial}
              </span>

              {/* Name */}
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <strong className="text-sm text-stone-900">
                  {name ?? "Ashok Kumar"}
                </strong>

                <small className="text-xs text-stone-400">
                  {user?.role ?? "Administrator"}
                </small>
              </span>

              <ChevronDown
                size={15}
                className="hidden text-stone-400 sm:block"
              />
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
