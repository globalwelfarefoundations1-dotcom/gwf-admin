import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";

export function AdminRoute() {
  const isAuthenticated = useAdminStore(
    (state) => state.isAuthenticated
  );

  const isAdmin = useAdminStore(
    (state) => state.isAdmin
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}