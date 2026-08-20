import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../components/Login";

import { DashboardPage } from "../pages/dashboard";
import { ProjectPage } from "../pages/projects";
import { CategoryPage } from "../pages/categories";
import { ProfilePage } from "../pages/profile";

import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./RouteGuard";
import { AdminLayout } from "../layouts/AdminLayout";

import { NotFound } from "../pages/NotFound";
import { Unauthorized } from "../pages/Unauthorized";

import { useEffect } from "react";
import { useProfileStore } from "@/store/profileStore";

export function AppRoutes() {
  const getProfileDetails = useProfileStore(
    (state) => state.getProfileDetails
  );

  // Example: change this based on your actual auth store
  const token = localStorage.getItem("gwf_access_token");

  useEffect(() => {
    if (token) {
      getProfileDetails();
    }
  }, [token, getProfileDetails]);

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ================= PROTECTED ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/projects"
              element={<ProjectPage />}
            />

            <Route
              path="/categories"
              element={<CategoryPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Route>
        </Route>
      </Route>

      {/* ================= UNAUTHORIZED ================= */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* ================= ROOT ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}