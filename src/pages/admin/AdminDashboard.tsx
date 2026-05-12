import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  LayoutDashboard, Ticket, CreditCard, AlertTriangle,
  Users, TrendingUp, CheckCircle2, Clock, ArrowRight, ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockJobs, mockComplaints, platformStats, CATEGORIES } from "@/data/mockData";
import { adminNavItems, statusColors } from "./adminNav";

function StatCard({
  label, value, sub, icon: Icon, iconColor, href,
}: {
  label: string; value: string | number; sub?: string;
  icon: typeof LayoutDashboard; iconColor: string; href?: string;
}) {
  const content = (
    <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}

export default function AdminDashboard() {
  const open        = mockJobs.filter(j => j.status === "open").length;
  const active      = mockJobs.filter(j => ["assigned", "in_progress"].includes(j.status)).length;
  const completed   = mockJobs.filter(j => j.status === "completed").length;
  const disputed    = mockJobs.filter(j => j.status === "disputed").length;
  const openComplaints = mockComplaints.filter(c => c.status !== "resolved").length;

  const recentJobs = mockJobs.slice(0, 6);
  const urgentComplaints = mockComplaints.filter(c => c.status === "open").slice(0, 3);

  return (
    <DashboardLayout items={adminNavItems} title="Admin Panel" groupLabel="Administration">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Platform Overview</h1>
            <p className="text-muted-foreground mt-1">Monitor all activity across WorkHive</p>
          </div>
          {disputed > 0 && (
            <Link to="/admin/complaints">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
                <ShieldAlert className="h-4 w-4" />
                {disputed} disputed job{disputed > 1 ? "s" : ""} need attention
              </div>
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Open Jobs"       value={open}               icon={Ticket}       iconColor="bg-amber-500/10 text-amber-600"  href="/admin/tickets" />
          <StatCard label="Active"           value={active}             icon={TrendingUp}   iconColor="bg-blue-500/10 text-blue-600"    href="/admin/tickets" />
          <StatCard label="Completed"        value={completed}          icon={CheckCircle2} iconColor="bg-green-500/10 text-green-600"  href="/admin/payments" />
          <StatCard label="Complaints"       value={openComplaints}     icon={AlertTriangle} iconColor="bg-red-500/10 text-red-600"     href="/admin/complaints" />
          <StatCard label="Total Workers"    value={platformStats.totalWorkers} icon={Users} iconColor="bg-indigo-500/10 text-indigo-600" href="/admin/users" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent job tickets */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Tickets</h2>
              <Link to="/admin/tickets" className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentJobs.map(job => {
                const cat = CATEGORIES.find(c => c.value === job.category);
                return (
                  <div key={job.id} className="p-3.5 rounded-xl border bg-card flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg shrink-0">{cat?.icon}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.city} · {job.postedAt} · by {job.postedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {job.urgency && job.urgency !== "normal" && (
                        <Badge className={job.urgency === "emergency" ? "bg-red-100 text-red-700 border-0 text-xs" : "bg-orange-100 text-orange-700 border-0 text-xs"}>
                          {job.urgency}
                        </Badge>
                      )}
                      <Badge className={`${statusColors[job.status] ?? ""} text-xs`}>
                        {job.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">

            {/* Open complaints */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Open Complaints</h2>
                <Link to="/admin/complaints" className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {urgentComplaints.length === 0 ? (
                <div className="rounded-xl border bg-card p-4 text-center text-sm text-muted-foreground">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  No open complaints
                </div>
              ) : (
                <div className="space-y-2">
                  {urgentComplaints.map(c => (
                    <div key={c.id} className="p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                      <p className="font-medium text-sm">{c.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">From: {c.from}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Platform stats */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-sm">Platform Health</h3>
              {[
                { label: "Total Jobs",      value: platformStats.totalJobs.toLocaleString() },
                { label: "Total Workers",   value: platformStats.totalWorkers.toLocaleString() },
                { label: "Total Clients",   value: platformStats.totalClients.toLocaleString() },
                { label: "Avg. Rating",     value: `${platformStats.avgRating} ★` },
                { label: "Cities Covered",  value: platformStats.citiesCovered },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="rounded-xl border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-sm mb-3">Admin Actions</h3>
              {[
                { label: "Manage Tickets",    href: "/admin/tickets",    icon: Ticket },
                { label: "Review Payments",   href: "/admin/payments",   icon: CreditCard },
                { label: "Handle Complaints", href: "/admin/complaints", icon: AlertTriangle },
                { label: "Manage Users",      href: "/admin/users",      icon: Users },
              ].map(a => (
                <Link key={a.href} to={a.href} className="flex items-center gap-2.5 text-sm py-1.5 hover:text-amber-500 transition-colors group">
                  <a.icon className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                  {a.label}
                  <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            {/* Uptime badge */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-green-700 font-medium">All systems operational</p>
              <Clock className="h-3.5 w-3.5 ml-auto text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

