import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Auth pages (public) ───────────────────────────────────────────────────────
import LandingPage      from "./pages/LandingPage";
import CategoryPage     from "./pages/CategoryPage";
import Login            from "./pages/auth/Login";
import Signup           from "./pages/auth/Signup";
import VerifyTwoFactor  from "./pages/auth/VerifyTwoFactor";
import CompleteProfile  from "./pages/auth/CompleteProfile";
import ForgotPassword   from "./pages/auth/ForgotPassword";
import ResetPassword    from "./pages/auth/ResetPassword";

// ── Shared authenticated pages ────────────────────────────────────────────────
import Profile          from "./pages/Profile";

// ── Client pages ──────────────────────────────────────────────────────────────
import ClientDashboard  from "./pages/client/ClientDashboard";
import ClientJobs       from "./pages/client/ClientJobs";
import ClientPostJob    from "./pages/client/ClientPostJob";

// ── Worker pages ──────────────────────────────────────────────────────────────
import WorkerHome           from "./pages/worker/WorkerHome";
import WorkerDashboard      from "./pages/worker/WorkerDashboard";
import WorkerNotifications  from "./pages/worker/WorkerNotifications";

// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminDashboard   from "./pages/admin/AdminDashboard";
import AdminTickets     from "./pages/admin/AdminTickets";
import AdminPayments    from "./pages/admin/AdminPayments";
import AdminComplaints  from "./pages/admin/AdminComplaints";
import AdminUsers       from "./pages/admin/AdminUsers";

// ── Demo preview pages (public, read-only) ──────────────────────────────────
import DemoClientPage   from "./pages/demo/DemoClientPage";
import DemoWorkerPage   from "./pages/demo/DemoWorkerPage";

// ── Route guards ──────────────────────────────────────────────────────────────
import ProtectedRoute   from "./components/ProtectedRoute";
import NotFound         from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* ── Public ─────────────────────────────────────────────────── */}
          <Route path="/"                     element={<LandingPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/login"                element={<Login />} />
          <Route path="/signup"               element={<Signup />} />
          <Route path="/verify-2fa"           element={<VerifyTwoFactor />} />
          <Route path="/complete-profile"     element={<CompleteProfile />} />
          <Route path="/forgot-password"      element={<ForgotPassword />} />
          <Route path="/reset-password"       element={<ResetPassword />} />
          <Route path="/demo/client"          element={<DemoClientPage />} />
          <Route path="/demo/worker"          element={<DemoWorkerPage />} />

          {/* ── Shared (any authenticated user) ────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* ── Client portal  /client/* ────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["client", "super_admin"]} />}>
            <Route path="/client"          element={<ClientDashboard />} />
            <Route path="/client/post-job" element={<ClientPostJob />} />
            <Route path="/client/jobs"     element={<ClientJobs />} />
          </Route>

          {/* ── Worker portal  /worker/* ────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["worker", "super_admin"]} />}>
            <Route path="/worker"                  element={<WorkerHome />} />
            <Route path="/worker/browse"           element={<WorkerDashboard />} />
            <Route path="/worker/notifications"    element={<WorkerNotifications />} />
          </Route>

          {/* ── Admin portal  /admin/* ──────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]} />}>
            <Route path="/admin"              element={<AdminDashboard />} />
            <Route path="/admin/tickets"      element={<AdminTickets />} />
            <Route path="/admin/payments"     element={<AdminPayments />} />
            <Route path="/admin/complaints"   element={<AdminComplaints />} />
            <Route path="/admin/users"        element={<AdminUsers />} />
          </Route>

          {/* ── Legacy redirects (keep old bookmarks working) ───────────── */}
          <Route path="/client-login"                element={<Navigate to="/login" replace />} />
          <Route path="/admin-login"                 element={<Navigate to="/login" replace />} />
          <Route path="/dashboard"                   element={<Navigate to="/client" replace />} />
          <Route path="/dashboard/post-job"          element={<Navigate to="/client/post-job" replace />} />
          <Route path="/dashboard/jobs"              element={<Navigate to="/client/jobs" replace />} />
          <Route path="/dashboard/browse"            element={<Navigate to="/worker/browse" replace />} />
          <Route path="/dashboard/notifications"     element={<Navigate to="/worker/notifications" replace />} />

          {/* ── 404 ────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
