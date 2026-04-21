import { Navigate, Outlet } from "react-router-dom";
import authService from "@/services/auth.service";
import type { UserRole } from "@/services/auth.service";

interface ProtectedRouteProps {
  /** If provided, only these roles can access the route. */
  allowedRoles?: UserRole[];
  /** Where to redirect unauthenticated users. Defaults to /login. */
  redirectTo?: string;
}

/**
 * Wraps a group of routes requiring authentication (and optionally a specific role).
 * Place as the `element` of a parent <Route> and nest children inside.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/profile" element={<Profile />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
 *     <Route path="/dashboard/post-job" element={<ClientPostJob />} />
 *   </Route>
 */
export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const user = authService.getUser();

  // Not logged in → send to login
  if (!authService.isAuthenticated() || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Profile incomplete → force them to finish onboarding
  if (!user.profile_complete && window.location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  // Role check
  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    // Wrong role — redirect to their own dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
