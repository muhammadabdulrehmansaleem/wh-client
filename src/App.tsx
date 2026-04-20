import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerNotifications from "./pages/worker/WorkerNotifications";
import ClientPostJob from "./pages/client/ClientPostJob";
import ClientJobs from "./pages/client/ClientJobs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminComplaints from "./pages/admin/AdminComplaints";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyTwoFactor from "./pages/auth/VerifyTwoFactor";
import CompleteProfile from "./pages/auth/CompleteProfile";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-2fa" element={<VerifyTwoFactor />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/worker" element={<WorkerDashboard />} />
          <Route path="/worker/notifications" element={<WorkerNotifications />} />
          <Route path="/client" element={<ClientPostJob />} />
          <Route path="/client/jobs" element={<ClientJobs />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
