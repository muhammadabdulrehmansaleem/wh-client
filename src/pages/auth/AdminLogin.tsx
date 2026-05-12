import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Shield, Lock, Server, Users, BarChart3 } from "lucide-react";
import apiClient from "@/lib/axios";
import { API_URLS } from "@/config/api.urls";

const CAPABILITIES = [
  { icon: Users,     text: "Manage users, workers & clients" },
  { icon: BarChart3, text: "Platform analytics & reports" },
  { icon: Lock,      text: "Review disputes & complaints" },
  { icon: Server,    text: "Payments oversight & controls" },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post(API_URLS.AUTH.LOGIN, { email, password });
      toast.success("Verification code sent to your email.");
      navigate("/verify-2fa", { state: { email } });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col bg-[hsl(222,60%,6%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,60%,4%)] via-[hsl(222,60%,8%)] to-[hsl(222,60%,4%)]" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-amber shadow-lg">
              <span className="text-sm font-bold text-accent-foreground">WH</span>
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45,100%,96%)" }}>
              WorkHive
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold mb-6">
                <Shield className="h-3.5 w-3.5" />
                Admin Portal — Restricted Access
              </span>

              <h2 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45,100%,96%)" }}>
                Platform<br />Control Centre
              </h2>
              <p className="text-base mb-10" style={{ color: "hsl(220,20%,60%)" }}>
                Full oversight of users, jobs, payments and disputes across the WorkHive platform.
              </p>

              <ul className="space-y-4">
                {CAPABILITIES.map((c) => (
                  <li key={c.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                      <c.icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-sm" style={{ color: "hsl(220,20%,75%)" }}>{c.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">
            <p className="text-xs" style={{ color: "hsl(220,20%,55%)" }}>
              This portal is for authorised WorkHive administrators only. Unauthorised access attempts are logged and may be prosecuted.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right login form ─────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-amber">
              <span className="text-xs font-bold text-accent-foreground">WH</span>
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WorkHive Admin</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Admin Sign In
              </h1>
              <p className="text-sm text-muted-foreground">Restricted to authorised personnel</p>
            </div>
          </div>

          <div className="my-6 h-px bg-border" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@workhive.co.uk"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-amber text-accent-foreground border-0 hover:opacity-90 mt-2"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In to Admin Portal"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Not an admin?{" "}
            <Link to="/client-login" className="text-amber-500 hover:text-amber-400 font-medium">
              Go to client login
            </Link>
          </p>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              ← Back to WorkHive
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
