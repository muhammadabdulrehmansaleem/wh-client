import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Star, CheckCircle2, Zap, Shield, CreditCard } from "lucide-react";
import apiClient from "@/lib/axios";
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
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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


export default function Login() {
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg gradient-amber">
              <span className="text-sm font-bold text-accent-foreground">WH</span>
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Log in to WorkHive
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We'll send a verification code to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-amber text-accent-foreground font-semibold hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Sending code..." : "Log in"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

