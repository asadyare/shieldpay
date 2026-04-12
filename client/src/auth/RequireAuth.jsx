import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
