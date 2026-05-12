import { Navigate } from "react-router-dom";
import authService from "@/services/auth.service";
import ClientDashboard from "./client/ClientDashboard";
import WorkerHome from "./worker/WorkerHome";

/**
 * `/dashboard` entry point — renders the role-specific overview page.
 *
 * client  → ClientDashboard
 * worker  → WorkerHome
 * admin   → redirected to /admin (separate route tree)
 */
export default function Dashboard() {
  const user = authService.getUser();

  if (!user) return <Navigate to="/client-login" replace />;

  switch (user.role) {
    case "client":
      return <ClientDashboard />;
    case "worker":
      return <WorkerHome />;
    case "admin":
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/complete-profile" replace />;
  }
}
