/**
 * DemoNav — Simplified navigation shown on the landing page and demo preview pages.
 * Only exposes the two preview entry-points and a beautified account / CTA card.
 * No authenticated links, no category/section links — branding only.
 */
import { Link } from "react-router-dom";
import { Eye, UserPlus, LogIn, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DemoNavProps {
  /** Highlights the matching preview pill as active */
  active?: "client" | "worker";
}

export function DemoNav({ active }: DemoNavProps) {
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

        {/* Desktop — preview pills + account card */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Client Preview pill */}
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

          {/* Worker Preview pill */}
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

          {/* Beautified Account Card */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group relative flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-all hover:border-amber-500/60 hover:shadow-md hover:shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50">
                {/* Animated sparkle badge */}
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

            {/* Dropdown card */}
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-2xl border border-amber-500/20 shadow-2xl">

              {/* Card header gradient */}
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

              {/* Feature checklist */}
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

              {/* CTA buttons */}
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
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
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
        </div>
      </div>
    </nav>
  );
}
