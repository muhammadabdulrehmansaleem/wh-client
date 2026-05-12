import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  LayoutDashboard, Briefcase, Bell, User,
  MapPin, Star, TrendingUp, CheckCircle2, Zap, ArrowRight,
  Clock, BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockJobs, CATEGORIES } from "@/data/mockData";
import authService from "@/services/auth.service";

const WORKER_NAV = [
  { title: "Overview",       url: "/worker",               icon: LayoutDashboard },
  { title: "Browse Jobs",    url: "/worker/browse",        icon: Briefcase },
  { title: "Notifications",  url: "/worker/notifications", icon: Bell },
  { title: "My Profile",     url: "/profile",              icon: User },
];

export default function WorkerHome() {
  const user = authService.getUser();
  const displayName = user?.full_name ?? user?.first_name ?? "there";

  // Nearby open jobs preview (mock)
  const nearbyJobs = mockJobs.filter(j => j.status === "open").slice(0, 4);

  // Mock worker stats (will be real API later)
  const stats = {
    rating:        user?.rating ?? 4.8,
    completedJobs: user?.completed_jobs_count ?? 0,
    bidsPlaced:    3,
    earnings:      0,
  };

  return (
    <DashboardLayout items={WORKER_NAV} title="Worker Panel" groupLabel="Dashboard">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome banner */}
        <div className="rounded-2xl border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {displayName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.category
                ? `${user.category.charAt(0).toUpperCase() + user.category.slice(1)} · ${user.city ?? "UK"}`
                : "Find jobs near you and start earning."}
            </p>
          </div>
          <Link to="/dashboard/browse">
            <Button className="gradient-amber text-accent-foreground border-0 hover:opacity-90 gap-2 shrink-0">
              <Briefcase className="h-4 w-4" /> Browse Open Jobs
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Rating",         value: stats.rating ? stats.rating.toFixed(1) : "—",  icon: Star,         color: "text-amber-500" },
            { label: "Jobs Completed", value: stats.completedJobs,                            icon: CheckCircle2, color: "text-green-500" },
            { label: "Bids Placed",    value: stats.bidsPlaced,                               icon: TrendingUp,   color: "text-blue-500" },
            { label: "Total Earned",   value: `£${stats.earnings}`,                           icon: BadgeCheck,   color: "text-indigo-500" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Nearby open jobs */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Open Jobs Near You</h2>
              <Link to="/dashboard/browse" className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1">
                Browse all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {nearbyJobs.map(job => {
              const cat = CATEGORIES.find(c => c.value === job.category);
              return (
                <div key={job.id} className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-xl shrink-0 mt-0.5">{cat?.icon}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{job.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city}</span>
                          <span>£{job.minFee}–£{job.maxFee}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.postedAt}</span>
                        </div>
                      </div>
                    </div>
                    <Link to="/dashboard/browse">
                      <Button size="sm" className="gradient-amber text-accent-foreground border-0 hover:opacity-90 shrink-0 h-8 text-xs">
                        Place Bid
                      </Button>
                    </Link>
                  </div>
                  {job.urgency && job.urgency !== "normal" && (
                    <div className="mt-2">
                      <Badge className={job.urgency === "emergency" ? "bg-red-100 text-red-800 border-0" : "bg-orange-100 text-orange-800 border-0"}>
                        {job.urgency === "emergency" ? "🚨 Emergency" : "⚡ Urgent"}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}

            {nearbyJobs.length === 0 && (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No open jobs right now. Check back soon!</p>
              </div>
            )}
          </div>

          {/* Quick actions + tips */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Quick Actions</h2>

            <Link to="/dashboard/browse" className="block">
              <div className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg gradient-amber flex items-center justify-center shrink-0">
                    <Briefcase className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Browse All Jobs</p>
                    <p className="text-xs text-muted-foreground">Filter by city & trade</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>

            <Link to="/dashboard/notifications" className="block">
              <div className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg border flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Notifications</p>
                    <p className="text-xs text-muted-foreground">Job alerts & updates</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>

            <Link to="/profile" className="block">
              <div className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg border flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Edit Profile</p>
                    <p className="text-xs text-muted-foreground">Skills, bio & location</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>

            {/* Earnings tip */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mt-2">
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-600">Earn more</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Workers who bid within <strong>10 minutes</strong> of a job posting win <strong>2× more contracts</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Skills preview */}
            {user?.skills && user.skills.length > 0 && (
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Your Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
