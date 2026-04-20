import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/data/mockData";
import { adminNavItems } from "./adminNav";
import { toast } from "sonner";
import { PoundSterling, CheckCircle, Clock } from "lucide-react";

export default function AdminPayments() {
  const paidJobs = mockJobs.filter(j => j.depositPaid);
  const totalEscrow = paidJobs.reduce((sum, j) => sum + j.maxFee, 0);
  const releasable = paidJobs.filter(j => j.status === "completed");

  const handleRelease = (jobId: string) => toast.success("Payment released to worker for job #" + jobId);
  const handleReleaseAll = () => toast.success("All completed payments released!");

  return (
    <DashboardLayout items={adminNavItems} title="Admin Panel" groupLabel="Administration">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Payments</h1>
        <p className="text-muted-foreground mb-6">Manage escrow deposits and release payments to workers</p>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl border bg-card">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm"><PoundSterling className="h-4 w-4" /> Total in Escrow</div>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>£{totalEscrow.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-xl border bg-card">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm"><Clock className="h-4 w-4" /> Held Deposits</div>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{paidJobs.filter(j => j.status !== "completed").length}</p>
          </div>
          <div className="p-5 rounded-xl border bg-card">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm"><CheckCircle className="h-4 w-4" /> Ready to Release</div>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{releasable.length}</p>
          </div>
        </div>

        {releasable.length > 0 && (
          <div className="mb-6">
            <Button className="gradient-amber text-accent-foreground border-0 hover:opacity-90" onClick={handleReleaseAll}>
              Release All Completed Payments ({releasable.length})
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {paidJobs.map(job => (
            <div key={job.id} className="p-5 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-muted-foreground">Assigned to: <strong>{job.assignedTo}</strong> · Deposit: <strong>£{job.maxFee}</strong></p>
                <p className="text-xs text-muted-foreground mt-1">Posted by {job.postedBy} · {job.postedAt}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {job.status === "completed" ? (
                  <Button size="sm" className="gradient-amber text-accent-foreground border-0 hover:opacity-90" onClick={() => handleRelease(job.id)}>
                    Release £{job.maxFee}
                  </Button>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Held in Escrow</Badge>
                )}
              </div>
            </div>
          ))}
          {paidJobs.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No deposits have been made yet.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
