import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Star, CheckCircle2, Zap, Shield, CreditCard } from "lucide-react";
import apiClient from "@/lib/axios";
import authService from "@/services/auth.service";
import { API_URLS } from "@/config/api.urls";
import { mockWorkers } from "@/data/mockData";

const PERKS = [
  { icon: Zap,         text: "Jobs posted & filled in minutes" },
  { icon: Shield,      text: "Verified workers with DBS checks" },
  { icon: CreditCard,  text: "Secure escrow — pay only on approval" },
  { icon: CheckCircle2,text: "4.8★ average across 2,400+ reviews" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    setGoogleLoading(true);
    try {
      const { data } = await apiClient.post(API_URLS.AUTH.GOOGLE_AUTH, {
        access_token: tokenResponse.access_token,
      });
      authService.setAccessToken(data.accessToken);
      const user = { ...data.user, profile_picture_url: data.profile_picture_url ?? null };
      authService.setUser(user);
      toast.success("Signed in with Google!");
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
      toast.error(err?.response?.data?.message || "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Google sign-in was cancelled or failed."),
  });

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
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=1200&fit=crop&auto=format&q=70"
            alt="UK trades"
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

          {/* Headline */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full gradient-amber text-accent-foreground text-xs font-semibold mb-6">
                &#127468;&#127463; UK's #1 Trades Marketplace
              </span>
              <h2 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45,100%,96%)" }}>
                Where great work<br />gets done.
              </h2>
              <p className="text-base mb-8" style={{ color: "hsl(220,20%,72%)" }}>
                Connect with verified tradespeople, manage jobs end-to-end, and pay securely — all in one place.
              </p>

              {/* Perks list */}
              <ul className="space-y-3 mb-10">
                {PERKS.map((p) => (
                  <li key={p.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-amber text-accent-foreground shadow">
                      <p.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm" style={{ color: "hsl(220,20%,80%)" }}>{p.text}</span>
                  </li>
                ))}
              </ul>

              {/* Social proof avatars */}
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
                  <p className="text-xs mt-0.5" style={{ color: "hsl(220,20%,65%)" }}>Trusted by 12,000+ users</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom quote */}
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
            <p className="text-sm italic" style={{ color: "hsl(220,20%,75%)" }}>
              "Got 4 bids on my boiler repair within 10 minutes. Hired James and the job was done by lunch. Incredible service!"
            </p>
            <div className="flex items-center gap-2 mt-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face"
                alt="Emma" className="h-7 w-7 rounded-full object-cover" />
              <span className="text-xs font-medium" style={{ color: "hsl(45,100%,80%)" }}>Emma Watson · London</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────── */}
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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Log in to your WorkHive account. We'll send a verification code to your email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-amber text-accent-foreground font-semibold hover:opacity-90 gap-2"
              disabled={loading}
            >
              {loading ? "Sending code..." : (
                <><span>Log In</span> <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Sign-In */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 gap-3 font-medium"
            onClick={() => loginWithGoogle()}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <span className="text-sm">Signing in...</span>
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
            <span className="text-xs text-muted-foreground">New to WorkHive?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Link to="/signup">
            <Button variant="outline" className="w-full h-11 font-medium">
              Create a free account
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

