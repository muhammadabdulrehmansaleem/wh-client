import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  LayoutDashboard, PlusCircle, ListChecks, User,
  Briefcase, MapPin, Clock, ArrowRight, TrendingUp, CheckCircle2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockJobs, CATEGORIES } from "@/data/mockData";
import authService from "@/services/auth.service";

const CLIENT_NAV = [
  { title: "Overview",    url: "/client",          icon: LayoutDashboard },
  { title: "Post a Job",  url: "/client/post-job", icon: PlusCircle },
  { title: "My Jobs",     url: "/client/jobs",     icon: ListChecks },
  { title: "My Profile",  url: "/profile",         icon: User },
];

const statusColors: Record<string, string> = {
  open:        "bg-amber-100 text-amber-800 border-0",
  assigned:    "bg-blue-100 text-blue-800 border-0",
  in_progress: "bg-indigo-100 text-indigo-800 border-0",
  completed:   "bg-green-100 text-green-800 border-0",
  disputed:    "bg-red-100 text-red-800 border-0",
  cancelled:   "bg-muted text-muted-foreground border-0",
};

export default function ClientDashboard() {
  const user = authService.getUser();
  const displayName = user?.full_name ?? user?.first_name ?? "there";

  // Derive mock stats from mock data
  const myJobs    = mockJobs.slice(0, 5);
  const open      = myJobs.filter(j => j.status === "open").length;
  const active    = myJobs.filter(j => ["assigned", "in_progress"].includes(j.status)).length;
  const completed = myJobs.filter(j => j.status === "completed").length;
  const totalBids = myJobs.reduce((s, j) => s + (j.bidsCount ?? 0), 0);

  return (
    <DashboardLayout items={CLIENT_NAV} title="Client Panel" groupLabel="Management">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome banner */}
        <div className="rounded-2xl border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {displayName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your jobs and find the best tradespeople near you.</p>
          </div>
          <Link to="/dashboard/post-job">
            <Button className="gradient-amber text-accent-foreground border-0 hover:opacity-90 gap-2 shrink-0">
              <PlusCircle className="h-4 w-4" /> Post a New Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Jobs Posted",   value: myJobs.length, icon: Briefcase,    color: "text-amber-500",  href: "/dashboard/jobs" },
            { label: "Open",          value: open,          icon: AlertCircle,   color: "text-blue-500",   href: "/dashboard/jobs" },
            { label: "In Progress",   value: active,        icon: TrendingUp,    color: "text-indigo-500", href: "/dashboard/jobs" },
            { label: "Completed",     value: completed,     icon: CheckCircle2,  color: "text-green-500",  href: "/dashboard/jobs" },
          ].map(s => (
            <Link key={s.label} to={s.href}>
              <div className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent jobs */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Jobs</h2>
              <Link to="/dashboard/jobs" className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {myJobs.slice(0, 4).map(job => {
              const cat = CATEGORIES.find(c => c.value === job.category);
              return (
                <div key={job.id} className="p-4 rounded-xl border bg-card flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{cat?.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{job.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city}</span>
                        <span>£{job.minFee}–£{job.maxFee}</span>
                        <span>{job.bidsCount ?? 0} bids</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={statusColors[job.status] ?? ""}>
                    {job.status.replace("_", " ")}
                  </Badge>
                </div>
              );
            })}

            {myJobs.length === 0 && (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No jobs posted yet.</p>
                <Link to="/dashboard/post-job">
                  <Button size="sm" className="mt-3 gradient-amber text-accent-foreground border-0">Post your first job</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions + activity */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Quick Actions</h2>

            <Link to="/dashboard/post-job" className="block">
              <div className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg gradient-amber flex items-center justify-center shrink-0">
                    <PlusCircle className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Post a New Job</p>
                    <p className="text-xs text-muted-foreground">Get bids within minutes</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>

            <Link to="/dashboard/jobs" className="block">
              <div className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg border flex items-center justify-center shrink-0">
                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Manage My Jobs</p>
                    <p className="text-xs text-muted-foreground">View bids & status</p>
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
                    <p className="text-xs text-muted-foreground">Update your details</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </Link>

            {/* Platform tip */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mt-2">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-600">Pro tip</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Jobs with photos and a clear budget receive <strong>3× more bids</strong> on average.
                  </p>
                </div>
              </div>
            </div>

            {/* Bids summary */}
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Total Bids Received</p>
              <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{totalBids}</p>
              <p className="text-xs text-muted-foreground mt-1">across all your jobs</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
