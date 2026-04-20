import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, MapPin, Bell, CreditCard, ArrowRight, User, LogOut, Pencil, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-workers.jpg";
import { CATEGORIES } from "@/data/mockData";
import authService from "@/services/auth.service";
import apiClient from "@/lib/axios";
import { API_URLS } from "@/config/api.urls";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const features = [
  { icon: MapPin, title: "Location-Based Jobs", desc: "Find work in your city across the UK. Filter by region and get matched to nearby opportunities." },
  { icon: Bell, title: "Instant Notifications", desc: "Get alerted the moment a new job is posted in your area. Never miss an opportunity." },
  { icon: CreditCard, title: "Secure Payments", desc: "Clients deposit fees upfront. Get paid reliably once the job is completed and approved." },
  { icon: Shield, title: "Verified & Protected", desc: "Admin-managed dispute resolution and complaint portal keeps everyone protected." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  // useState so the nav re-renders reactively when auth state changes
  const [user, setUser] = useState(() => authService.getUser());
  const isLoggedIn = user !== null;

  const handleLogout = async () => {
    try {
      await apiClient.post(API_URLS.AUTH.LOGOUT);
    } catch {
      // clear locally even if server fails
    }
    authService.clear();
    setUser(null);
    toast.success("Logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/85 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-amber">
              <span className="text-sm font-bold text-accent-foreground">WH</span>
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              WorkHive
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </a>
            <a href="#cta" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For workers & clients
            </a>
            <span className="h-6 w-px bg-border" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl border bg-card px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-amber text-accent-foreground">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="max-w-[120px] truncate">
                    {isLoggedIn ? (user?.full_name ?? user?.first_name ?? user?.email) : "Account"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
                      {user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <Pencil className="h-4 w-4" />
                        Update Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="flex items-center gap-2 cursor-pointer">
                        <LogIn className="h-4 w-4" />
                        Log In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup" className="flex items-center gap-2 cursor-pointer">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile nav quick actions */}
          <div className="flex items-center gap-2 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-full gradient-amber text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <User className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
                      {user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <Pencil className="h-4 w-4" />
                        Update Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="flex items-center gap-2 cursor-pointer">
                        <LogIn className="h-4 w-4" />
                        Log In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup" className="flex items-center gap-2 cursor-pointer">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 overflow-hidden">
        <div className="relative flex min-h-[92vh] items-center gradient-hero">
          <div className="absolute inset-0 opacity-20">
            <img src={heroImage} alt="Professional workers" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium gradient-amber text-accent-foreground mb-6">
                  🇬🇧 UK's #1 Trade & Service Jobs Platform
                </span>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45, 100%, 96%)" }}>
                  Find Work.<br />
                  <span className="text-gradient">Get Paid.</span><br />
                  Stay Local.
                </h1>
                <p className="text-lg md:text-xl mb-8" style={{ color: "hsl(220, 20%, 80%)" }}>
                  Connect with clients in your city. Plumbers, security guards, labourers — 
                  browse jobs, get notified, and earn securely.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/worker">
                    <Button size="lg" className="gradient-amber text-accent-foreground font-semibold text-base px-8 hover:opacity-90 transition-opacity">
                      Find Jobs Near You <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/client">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-[hsl(45_100%_51%)] bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      Post a Job
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.value} to={`/categories/${cat.value}`} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl border bg-background p-4 text-left shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[hsl(45_100%_51%)]/10 blur-2xl" />
                    <div className="absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-[hsl(222_60%_18%)]/10 blur-2xl" />
                  </div>

                  <div className="relative flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-amber text-accent-foreground shadow-sm">
                      <span className="text-xl leading-none">{cat.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight">{cat.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Browse jobs in this category</p>
                    </div>
                  </div>

                  <div className="relative mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      UK-wide
                    </span>
                    <span className="font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                      View →
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Simple, secure, and built for UK tradespeople and clients.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl gradient-amber flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45, 100%, 96%)" }}>Ready to Get Started?</h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: "hsl(220, 20%, 75%)" }}>Whether you're looking for work or need to hire — WorkHive connects you with the right people in your area.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/worker"><Button size="lg" className="gradient-amber text-accent-foreground font-semibold">I'm a Worker</Button></Link>
            <Link to="/client">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[hsl(45_100%_51%)] bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                I'm a Client
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
