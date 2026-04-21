/**
 * DemoNav — Navigation for public/demo pages.
 * Auth-aware: shows a user account card when logged in, Demo Mode card when not.
 */
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye, UserPlus, LogIn, Sparkles, ArrowRight,
  LayoutDashboard, LogOut, ChevronDown, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import apiClient from "@/lib/axios";
import { API_URLS } from "@/config/api.urls";

interface DemoNavProps {
  /** Highlights the matching preview pill as active */
  active?: "client" | "worker";
}

export function DemoNav({ active }: DemoNavProps) {
  const navigate = useNavigate();
  const user = authService.getUser();
  const isLoggedIn = authService.isAuthenticated();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await apiClient.post(API_URLS.AUTH.LOGOUT);
    } catch {
      // best-effort — clear local state regardless
    } finally {
      authService.clear();
      setLoggingOut(false);
      toast.success("Logged out successfully.");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Derive display name & initials
  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "My Account";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : null;

  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-amber shadow">
            <span className="text-sm font-bold text-accent-foreground">WH</span>
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            WorkHive
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Preview pills — only shown when not logged in */}
          {!isLoggedIn && (
            <>
              <Link to="/demo/client">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all
                    ${active === "client"
                      ? "gradient-amber text-accent-foreground shadow-md shadow-amber-500/20 border-transparent"
                      : "border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10"}`}>
                  <Eye className="h-3.5 w-3.5" />
                  Client Preview
                </button>
              </Link>
              <Link to="/demo/worker">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all
                    ${active === "worker"
                      ? "gradient-amber text-accent-foreground shadow-md shadow-amber-500/20 border-transparent"
                      : "border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10"}`}>
                  <Eye className="h-3.5 w-3.5" />
                  Worker Preview
                </button>
              </Link>
            </>
          )}

          {/* ── LOGGED IN: User account card ── */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-card px-3 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-amber-500/60 hover:shadow-md hover:shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50">
                  {/* Avatar */}
                  {user?.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover shrink-0 border border-amber-500/40"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full gradient-amber flex items-center justify-center shrink-0 text-xs font-bold text-accent-foreground">
                      {initials || <User className="h-4 w-4" />}
                    </div>
                  )}
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-semibold max-w-[120px] truncate">{displayName}</span>
                    {roleLabel && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mt-0.5">
                        {roleLabel}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="ml-1 h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 p-0 overflow-hidden rounded-2xl border border-amber-500/20 shadow-2xl">
                {/* Header */}
                <div className="gradient-hero px-5 py-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: "radial-gradient(circle at 80% 50%, hsl(45 100% 51% / 0.4), transparent 60%)" }} />
                  <div className="relative z-10 flex items-center gap-3">
                    {user?.profile_picture_url ? (
                      <img
                        src={user.profile_picture_url}
                        alt={displayName}
                        className="h-10 w-10 rounded-full object-cover border-2 border-amber-500/60 shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full gradient-amber flex items-center justify-center shrink-0 text-sm font-bold text-accent-foreground border-2 border-amber-500/60">
                        {initials || <User className="h-5 w-5" />}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary-foreground truncate">{displayName}</p>
                      {roleLabel && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 mt-0.5">
                          {roleLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 space-y-2">
                  <Link to="/dashboard" className="block">
                    <Button className="w-full gradient-amber text-accent-foreground font-semibold gap-2 h-10 shadow hover:opacity-90">
                      <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                      <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                    </Button>
                  </Link>
                  <Link to="/profile" className="block">
                    <Button variant="outline" className="w-full gap-2 h-9 text-sm">
                      <User className="h-4 w-4" /> My Profile
                    </Button>
                  </Link>
                </div>

                <DropdownMenuSeparator />

                <div className="px-4 py-3">
                  <Button
                    variant="ghost"
                    className="w-full gap-2 h-9 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Logging out..." : "Log Out"}
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

          ) : (
            /* ── GUEST: Demo Mode card ── */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group relative flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-all hover:border-amber-500/60 hover:shadow-md hover:shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-xl gradient-amber text-accent-foreground shadow">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                    </span>
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-500">Demo Mode</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Get Started</span>
                  </div>
                  <svg className="ml-1 h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-2xl border border-amber-500/20 shadow-2xl">
                <div className="gradient-hero px-5 py-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: "radial-gradient(circle at 80% 50%, hsl(45 100% 51% / 0.4), transparent 60%)" }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md gradient-amber shrink-0">
                        <Sparkles className="h-3 w-3 text-accent-foreground" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Demo Mode Active</span>
                    </div>
                    <p className="text-sm font-semibold text-primary-foreground">Exploring WorkHive</p>
                    <p className="text-xs mt-1" style={{ color: "hsl(220,20%,68%)" }}>
                      You're viewing a read-only preview. Sign up to unlock the full platform.
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3 space-y-2 border-b">
                  {[
                    "Post jobs & receive competitive bids",
                    "Browse local work, place bids, get paid",
                    "Secure escrow payments built-in",
                    "Verified worker profiles & reviews",
                  ].map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 space-y-2.5">
                  <Link to="/signup" className="block">
                    <Button className="w-full gradient-amber text-accent-foreground font-semibold gap-2 h-10 shadow hover:opacity-90">
                      <UserPlus className="h-4 w-4" /> Create Free Account
                      <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full gap-2 h-9 text-sm">
                      <LogIn className="h-4 w-4" /> Already have an account? Log In
                    </Button>
                  </Link>
                  <p className="text-center text-[10px] text-muted-foreground pt-1">
                    No credit card required · Free to post jobs
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button size="sm" className="gradient-amber text-accent-foreground h-8 text-xs px-3 gap-1">
                  <LayoutDashboard className="h-3 w-3" /> Dashboard
                </Button>
              </Link>
              {/* Avatar */}
              {user?.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover border border-amber-500/40"
                />
              ) : (
                <div className="h-8 w-8 rounded-full gradient-amber flex items-center justify-center text-xs font-bold text-accent-foreground">
                  {initials || <User className="h-4 w-4" />}
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/demo/client">
                <button className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${active === "client" ? "gradient-amber text-accent-foreground border-transparent" : "border-amber-500/40 text-amber-500"}`}>
                  <Eye className="h-3 w-3" /> Client
                </button>
              </Link>
              <Link to="/demo/worker">
                <button className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${active === "worker" ? "gradient-amber text-accent-foreground border-transparent" : "border-amber-500/40 text-amber-500"}`}>
                  <Eye className="h-3 w-3" /> Worker
                </button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gradient-amber text-accent-foreground h-8 text-xs px-3 gap-1">
                  <UserPlus className="h-3 w-3" /> Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
