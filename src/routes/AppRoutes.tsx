import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../components/Login";

import {
  DashboardPage,
} from "../pages/dashboard";

import {
  ProjectPage,
} from "../pages/projects";

import {
  CategoryPage,
} from "../pages/categories";

import {
  ProfilePage,
} from "../pages/profile";

import {
  ProtectedRoute,
} from "./ProtectedRoute";

import {
  AdminRoute,
} from "./RouteGuard";

import {
  AdminLayout,
} from "../layouts/AdminLayout";

import {
  NotFound,
} from "../pages/NotFound";

import {
  Unauthorized,
} from "../pages/Unauthorized";

export function AppRoutes() {

  return (
    <Routes>

      {/* ================================================== */}
      {/* PUBLIC */}
      {/* ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ================================================== */}
      {/* PROTECTED */}
      {/* ================================================== */}

      <Route
        element={
          <ProtectedRoute />
        }
      >

        <Route
          element={
            <AdminRoute />
          }
        >

          <Route
            element={
              <AdminLayout />
            }
          >

            <Route
              path="/dashboard"
              element={
                <DashboardPage />
              }
            />

            <Route
              path="/projects"
              element={
                <ProjectPage />
              }
            />

            <Route
              path="/categories"
              element={
                <CategoryPage />
              }
            />

            <Route
              path="/profile"
              element={
                <ProfilePage />
              }
            />

          </Route>

        </Route>

      </Route>

      {/* ================================================== */}
      {/* UNAUTHORIZED */}
      {/* ================================================== */}

      <Route
        path="/unauthorized"
        element={
          <Unauthorized />
        }
      />

      {/* ================================================== */}
      {/* ROOT */}
      {/* ================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* ================================================== */}
      {/* 404 */}
      {/* ================================================== */}

      <Route
        path="*"
        element={
          <NotFound />
        }
      />

    </Routes>
  );
}