import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { LayoutDashboard, Briefcase, Bell, MapPin, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockJobs, mockNotifications, UK_CITIES, CATEGORIES } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { title: "Overview",      url: "/worker",               icon: LayoutDashboard },
  { title: "Browse Jobs",   url: "/worker/browse",        icon: Briefcase },
  { title: "Notifications", url: "/worker/notifications", icon: Bell },
  { title: "My Profile",    url: "/profile",              icon: User },
];

function JobCard({ job }: { job: typeof mockJobs[0] }) {
  const categoryInfo = CATEGORIES.find(c => c.value === job.category);
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryInfo?.icon}</span>
          <Badge variant="secondary" className="text-xs">{categoryInfo?.label}</Badge>
        </div>
        <Badge variant={job.status === "open" ? "default" : "outline"} className={job.status === "open" ? "gradient-amber text-accent-foreground border-0" : ""}>
          {job.status.replace("_", " ")}
        </Badge>
      </div>
      <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{job.city}</span>
        </div>
        <p className="font-semibold text-sm">£{job.minFee} – £{job.maxFee}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Posted {job.postedAt}</span>
        {job.status === "open" && <Button size="sm" className="gradient-amber text-accent-foreground border-0 hover:opacity-90">Apply</Button>}
      </div>
    </motion.div>
  );
}

export default function WorkerDashboard() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");

  const filtered = mockJobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "all" || j.city === city;
    const matchCat = category === "all" || j.category === category;
    return matchSearch && matchCity && matchCat;
  });

  return (
    <DashboardLayout items={navItems} title="Worker Panel" groupLabel="Dashboard">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Browse Jobs</h1>
          <p className="text-muted-foreground">Find work near you across the UK</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Cities" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {UK_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} jobs found</p>
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </AnimatePresence>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p>No jobs found matching your filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
