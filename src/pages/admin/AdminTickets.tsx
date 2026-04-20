import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MapPin, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockJobs, CATEGORIES, UK_CITIES } from "@/data/mockData";
import { adminNavItems, statusColors } from "./adminNav";

export default function AdminTickets() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const filtered = mockJobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.postedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || j.status === statusFilter;
    const matchCity = cityFilter === "all" || j.city === cityFilter;
    return matchSearch && matchStatus && matchCity;
  });

  return (
    <DashboardLayout items={adminNavItems} title="Admin Panel" groupLabel="Administration">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>All Tickets</h1>
        <p className="text-muted-foreground mb-6">View and manage all job tickets on the platform</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by title or client..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Cities" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {UK_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} tickets found</p>

        {/* Table-like list */}
        <div className="rounded-xl border overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_100px_120px] gap-2 p-3 bg-muted text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Job Details</span>
            <span>City</span>
            <span>Fee Range</span>
            <span>Status</span>
          </div>
          {filtered.map(job => {
            const cat = CATEGORIES.find(c => c.value === job.category);
            return (
              <div key={job.id} className="grid grid-cols-[1fr_120px_100px_120px] gap-2 p-4 border-t bg-card items-center hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat?.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">by {job.postedBy} · {job.postedAt}</p>
                  </div>
                </div>
                <span className="text-sm flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{job.city}</span>
                <span className="text-sm font-medium">£{job.minFee}–£{job.maxFee}</span>
                <Badge className={statusColors[job.status] || ""} >{job.status.replace("_", " ")}</Badge>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground border-t">No tickets match your filters.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
