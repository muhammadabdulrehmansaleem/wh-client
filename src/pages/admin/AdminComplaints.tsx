import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockComplaints, Complaint } from "@/data/mockData";
import { adminNavItems } from "./adminNav";
import { toast } from "sonner";
import { Search, MessageSquare, AlertCircle, CheckCircle2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const complaintStatusColors: Record<string, string> = {
  open: "bg-destructive text-destructive-foreground",
  investigating: "bg-warning text-warning-foreground",
  resolved: "bg-success text-success-foreground",
};

const complaintStatusIcons: Record<string, typeof AlertCircle> = {
  open: AlertCircle,
  investigating: Eye,
  resolved: CheckCircle2,
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = complaints.filter(c => {
    const matchSearch = c.subject.toLowerCase().includes(search.toLowerCase()) || c.from.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (id: string, newStatus: Complaint["status"]) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast.success(`Complaint #${id} status updated to ${newStatus}`);
  };

  const openCount = complaints.filter(c => c.status === "open").length;
  const investigatingCount = complaints.filter(c => c.status === "investigating").length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;

  return (
    <DashboardLayout items={adminNavItems} title="Admin Panel" groupLabel="Administration">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Complaints</h1>
        <p className="text-muted-foreground mb-6">Review and resolve disputes and complaints</p>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl border bg-card text-center">
            <p className="text-2xl font-bold text-destructive">{openCount}</p>
            <p className="text-xs text-muted-foreground">Open</p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center">
            <p className="text-2xl font-bold text-warning">{investigatingCount}</p>
            <p className="text-xs text-muted-foreground">Investigating</p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center">
            <p className="text-2xl font-bold text-success">{resolvedCount}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search complaints..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} complaints</p>

        {/* Complaints list */}
        <div className="space-y-4">
          {filtered.map(c => {
            const StatusIcon = complaintStatusIcons[c.status];
            return (
              <div key={c.id} className="p-5 rounded-xl border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.status === "open" ? "bg-destructive/10" : c.status === "investigating" ? "bg-warning/10" : "bg-success/10"}`}>
                      <StatusIcon className={`h-5 w-5 ${c.status === "open" ? "text-destructive" : c.status === "investigating" ? "text-warning" : "text-success"}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{c.subject}</h3>
                      <p className="text-xs text-muted-foreground">From: <strong>{c.from}</strong> · Job #{c.jobId} · {c.createdAt}</p>
                    </div>
                  </div>
                  <Badge className={complaintStatusColors[c.status]}>{c.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4 pl-[52px]">{c.message}</p>
                <div className="flex gap-2 pl-[52px]">
                  {c.status === "open" && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(c.id, "investigating")}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> Start Investigation
                    </Button>
                  )}
                  {c.status === "investigating" && (
                    <Button size="sm" className="gradient-amber text-accent-foreground border-0 hover:opacity-90" onClick={() => handleStatusChange(c.id, "resolved")}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Resolved
                    </Button>
                  )}
                  {c.status === "resolved" && (
                    <span className="text-xs text-success flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Case closed</span>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-30" />
              <p>No complaints match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
