import { Navigate } from "react-router-dom";
import authService from "@/services/auth.service";

/**
 * `/dashboard` entry point — immediately redirects to the correct
 * role-specific dashboard page.
 *
 * client  → /dashboard/jobs     (client job list)
 * worker  → /dashboard/browse   (browse nearby jobs)
 * admin   → /admin              (admin panel)
 */
export default function Dashboard() {
  const user = authService.getUser();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "client":
      return <Navigate to="/dashboard/jobs" replace />;
    case "worker":
      return <Navigate to="/dashboard/browse" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    default:
      // Profile complete but role somehow null — shouldn't happen
      return <Navigate to="/complete-profile" replace />;
  }
}
