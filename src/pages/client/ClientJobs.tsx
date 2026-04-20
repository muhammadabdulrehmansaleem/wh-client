import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PlusCircle, ListChecks, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockJobs, CATEGORIES } from "@/data/mockData";
import { toast } from "sonner";

const navItems = [
  { title: "Post a Job", url: "/client", icon: PlusCircle },
  { title: "My Jobs", url: "/client/jobs", icon: ListChecks },
];

const statusColors: Record<string, string> = {
  open: "gradient-amber text-accent-foreground border-0",
  assigned: "bg-blue-100 text-blue-800 border-0",
  in_progress: "bg-indigo-100 text-indigo-800 border-0",
  completed: "bg-success text-success-foreground border-0",
  disputed: "bg-destructive text-destructive-foreground border-0",
};

export default function ClientJobs() {
  const [jobs] = useState(mockJobs);

  const handleDeposit = (jobId: string) => {
    toast.success("Deposit paid successfully! The worker can now start.");
  };

  const handleConfirmComplete = (jobId: string) => {
    toast.success("Job marked as completed. Payment will be released to the worker.");
  };

  return (
    <DashboardLayout items={navItems} title="Client Panel" groupLabel="Management">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Jobs</h1>
        <p className="text-muted-foreground mb-6">Manage your posted jobs and payments</p>

        <div className="space-y-4">
          {jobs.map(job => {
            const cat = CATEGORIES.find(c => c.value === job.category);
            return (
              <div key={job.id} className="p-5 rounded-xl border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{cat?.icon}</span>
                      <h3 className="font-semibold">{job.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.city}</span>
                      <span>£{job.minFee} – £{job.maxFee}</span>
                    </div>
                  </div>
                  <Badge className={statusColors[job.status] || ""}>{job.status.replace("_", " ")}</Badge>
                </div>
                {job.assignedTo && <p className="text-sm text-muted-foreground mt-2">Assigned to: <strong>{job.assignedTo}</strong></p>}
                <div className="mt-3 flex gap-2">
                  {job.status === "assigned" && !job.depositPaid && (
                    <Button size="sm" className="gradient-amber text-accent-foreground border-0" onClick={() => handleDeposit(job.id)}>
                      Pay Deposit (£{job.maxFee})
                    </Button>
                  )}
                  {job.status === "in_progress" && (
                    <Button size="sm" variant="outline" onClick={() => handleConfirmComplete(job.id)}>
                      Confirm Completed
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
