import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";

export function ProtectedRoute() {
  const isAuthenticated = useAdminStore(
    (state) => state.isAuthenticated
  );

  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}