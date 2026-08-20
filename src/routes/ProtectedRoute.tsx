import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";

export function ProtectedRoute() {
  const isAuthenticated = useAdminStore(
    (state) => state.accessToken
  );

  const location = useLocation();
    const token = localStorage.getItem("gwf_access_token");

  if (!isAuthenticated||!token) {
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