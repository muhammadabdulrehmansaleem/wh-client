import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { LayoutDashboard, Ticket, CreditCard, AlertTriangle } from "lucide-react";
import { mockJobs, mockComplaints } from "@/data/mockData";
import { adminNavItems } from "./adminNav";
import { Link } from "react-router-dom";

function StatCard({ label, value, icon: Icon, href }: { label: string; value: string | number; icon: typeof LayoutDashboard; href?: string }) {
  const card = (
    <div className="p-5 rounded-xl border bg-card hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
    </div>
  );
  return href ? <Link to={href}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const openJobs = mockJobs.filter(j => j.status === "open").length;
  const activeJobs = mockJobs.filter(j => j.status === "in_progress" || j.status === "assigned").length;
  const completed = mockJobs.filter(j => j.status === "completed").length;
  const openComplaints = mockComplaints.filter(c => c.status !== "resolved").length;

  return (
    <DashboardLayout items={adminNavItems} title="Admin Panel" groupLabel="Administration">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Overview</h1>
        <p className="text-muted-foreground mb-6">Manage jobs, payments and complaints across the platform</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Open Jobs" value={openJobs} icon={Ticket} href="/admin/tickets" />
          <StatCard label="Active Jobs" value={activeJobs} icon={LayoutDashboard} href="/admin/tickets" />
          <StatCard label="Completed" value={completed} icon={CreditCard} href="/admin/payments" />
          <StatCard label="Open Complaints" value={openComplaints} icon={AlertTriangle} href="/admin/complaints" />
        </div>

        {/* Recent activity */}
        <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Activity</h2>
        <div className="space-y-2">
          {mockJobs.slice(0, 4).map(job => (
            <div key={job.id} className="p-3 rounded-lg border bg-card flex items-center justify-between text-sm">
              <span className="font-medium">{job.title}</span>
              <span className="text-muted-foreground">{job.city} · {job.postedAt}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link to="/admin/tickets" className="text-sm font-medium text-accent hover:underline">View all tickets →</Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
