import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Star, Briefcase, Users, TrendingUp, Award } from "lucide-react";
import apiClient from "@/lib/axios";
import authService from "@/services/auth.service";
import { API_URLS } from "@/config/api.urls";
import { mockWorkers } from "@/data/mockData";

const ROLES = [
  {
    icon: Briefcase,
    title: "I need work done",
    desc: "Post jobs, get bids from vetted locals, pay securely.",
  },
  {
    icon: TrendingUp,
    title: "I want to earn",
    desc: "Browse nearby jobs, bid competitively, get paid fast.",
  },
];

const STATS = [
  { value: "12k+", label: "Active users" },
  { value: "£2.4M", label: "Paid out to workers" },
  { value: "4.8★", label: "Avg. rating" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    setGoogleLoading(true);
    try {
      const { data } = await apiClient.post(API_URLS.AUTH.GOOGLE_AUTH, {
        access_token: tokenResponse.access_token,
      });
      authService.setAccessToken(data.accessToken);
      const user = { ...data.user, profile_picture_url: data.profile_picture_url ?? null };
      authService.setUser(user);
      toast.success("Account created with Google!");
      if (!user.profile_complete) {
        navigate("/complete-profile", { replace: true });
      } else if (user.role === "worker") {
        navigate("/worker", { replace: true });
      } else if (user.role === "admin" || user.role === "super_admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/client", { replace: true });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Google sign-up failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const signupWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Google sign-up was cancelled or failed."),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URLS.AUTH.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Signup failed.");
        return;
      }
      toast.success("Verification code sent to your email!");
      navigate("/verify-2fa", { state: { email: form.email } });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ───────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&h=1200&fit=crop&auto=format&q=70"
            alt="trades work"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,60%,6%)] via-[hsl(222,60%,10%)]/90 to-[hsl(222,60%,6%)]" />
        </div>

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
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full gradient-amber text-accent-foreground text-xs font-semibold mb-6">
                &#127468;&#127463; Free to join · No subscription
              </span>
              <h2 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45,100%,96%)" }}>
                Join thousands<br />already thriving.
              </h2>
              <p className="text-base mb-8" style={{ color: "hsl(220,20%,72%)" }}>
                Whether you're posting your first job or looking for work, WorkHive gets you started in minutes.
              </p>

              {/* Role cards */}
              <div className="space-y-3 mb-8">
                {ROLES.map(r => (
                  <div key={r.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-amber text-accent-foreground shadow">
                      <r.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "hsl(45,100%,90%)" }}>{r.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "hsl(220,20%,68%)" }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {STATS.map(s => (
                  <div key={s.label} className="text-center rounded-xl border border-white/10 bg-white/5 py-3 px-2">
                    <p className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45,100%,70%)" }}>{s.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "hsl(220,20%,60%)" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {mockWorkers.slice(0, 4).map(w => (
                    <img key={w.id} src={w.avatar} alt={w.name}
                      className="h-9 w-9 rounded-full border-2 border-[hsl(222,60%,10%)] object-cover" />
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[hsl(222,60%,10%)] bg-amber-500 text-[10px] font-bold text-white">+3k</div>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(220,20%,65%)" }}>12,000+ users across the UK</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom badge */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-amber">
              <Award className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "hsl(45,100%,90%)" }}>Award-winning platform</p>
              <p className="text-xs" style={{ color: "hsl(220,20%,65%)" }}>UK Small Business Tech Award 2025 — Best Gig Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-amber">
              <span className="text-sm font-bold text-accent-foreground">WH</span>
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WorkHive</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Free forever. No credit card needed. Get started in 2 minutes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must include uppercase, number and special character.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gradient-amber text-accent-foreground font-semibold hover:opacity-90 gap-2"
            >
              {loading ? "Creating account..." : (
                <><span>Create Free Account</span> <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Sign-Up */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 gap-3 font-medium"
            onClick={() => signupWithGoogle()}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <span className="text-sm">Connecting...</span>
            ) : (
              <>
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">Already registered?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Link to="/login">
            <Button variant="outline" className="w-full h-11 font-medium">
              Log In to your account
            </Button>
          </Link>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Want to explore first?{" "}
            <Link to="/demo/client" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">View the demo</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
