import { Navigate, Outlet } from "react-router-dom";
import authService from "@/services/auth.service";
import type { UserRole } from "@/services/auth.service";

interface ProtectedRouteProps {
  /** If provided, only these roles can access the route. super_admin always passes. */
  allowedRoles?: UserRole[];
  /** Where to redirect unauthenticated users. Defaults to /login. */
  redirectTo?: string;
}

/** Role → home route mapping used for wrong-role redirects. */
const ROLE_HOME: Record<UserRole, string> = {
  client:      "/client",
  worker:      "/worker",
  admin:       "/admin",
  super_admin: "/admin",
};

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const user = authService.getUser();

  // Not logged in → send to login
  if (!authService.isAuthenticated() || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Profile incomplete → force onboarding
  if (!user.profile_complete && window.location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  // Role check — super_admin bypasses all role restrictions
  if (allowedRoles && user.role && user.role !== "super_admin" && !allowedRoles.includes(user.role)) {
    const home = user.role ? (ROLE_HOME[user.role] ?? "/login") : "/login";
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
