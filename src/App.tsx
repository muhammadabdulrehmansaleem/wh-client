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

// ── Shared authenticated pages ────────────────────────────────────────────────
import Dashboard        from "./pages/Dashboard";
import Profile          from "./pages/Profile";

// ── Client pages ──────────────────────────────────────────────────────────────
import ClientJobs       from "./pages/client/ClientJobs";
import ClientPostJob    from "./pages/client/ClientPostJob";

// ── Worker pages ──────────────────────────────────────────────────────────────
import WorkerDashboard      from "./pages/worker/WorkerDashboard";
import WorkerNotifications  from "./pages/worker/WorkerNotifications";

// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminDashboard   from "./pages/admin/AdminDashboard";
import AdminTickets     from "./pages/admin/AdminTickets";
import AdminPayments    from "./pages/admin/AdminPayments";
import AdminComplaints  from "./pages/admin/AdminComplaints";

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
          <Route path="/"                    element={<LandingPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/signup"              element={<Signup />} />
          <Route path="/verify-2fa"          element={<VerifyTwoFactor />} />
          <Route path="/complete-profile"    element={<CompleteProfile />} />
          <Route path="/demo/client"          element={<DemoClientPage />} />
          <Route path="/demo/worker"          element={<DemoWorkerPage />} />

          {/* ── Authenticated — shared ──────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            {/* /dashboard → role-aware redirect */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile"   element={<Profile />} />
          </Route>

          {/* ── Client ─────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
            <Route path="/dashboard/jobs"      element={<ClientJobs />} />
            <Route path="/dashboard/post-job"  element={<ClientPostJob />} />
          </Route>

          {/* ── Worker ─────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
            <Route path="/dashboard/browse"        element={<WorkerDashboard />} />
            <Route path="/dashboard/notifications" element={<WorkerNotifications />} />
          </Route>

          {/* ── Admin ──────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin"              element={<AdminDashboard />} />
            <Route path="/admin/tickets"      element={<AdminTickets />} />
            <Route path="/admin/payments"     element={<AdminPayments />} />
            <Route path="/admin/complaints"   element={<AdminComplaints />} />
          </Route>

          {/* ── Legacy redirects ───────────────────────────────────────── */}
          <Route path="/worker"              element={<Navigate to="/dashboard/browse" replace />} />
          <Route path="/worker/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
          <Route path="/client"              element={<Navigate to="/dashboard/post-job" replace />} />
          <Route path="/client/jobs"         element={<Navigate to="/dashboard/jobs" replace />} />

          {/* ── 404 ────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
