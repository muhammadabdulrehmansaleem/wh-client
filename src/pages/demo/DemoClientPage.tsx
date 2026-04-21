/**
 * /demo/client — Read-only showcase of the Client experience.
 * No auth required. All data is mock. Every action CTA points to /signup.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus, MapPin, CreditCard, Clock, Filter, Star, CheckCircle2,
  Eye, ArrowRight, Bell, Briefcase, ChevronRight, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockJobs, mockWorkers, mockReviews } from "@/data/mockData";
import { DemoNav } from "@/components/DemoNav";
import { DemoFooter } from "@/components/DemoFooter";

const TABS = ["All Jobs", "Open", "In Progress", "Completed"] as const;
type Tab = typeof TABS[number];

const STATUS_COLORS: Record<string, string> = {
  open:        "bg-green-500/15 text-green-400 border-green-500/30",
  assigned:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  in_progress: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  completed:   "bg-muted text-muted-foreground",
  disputed:    "bg-red-500/15 text-red-400 border-red-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open — Accepting Bids",
  assigned: "Worker Hired",
  in_progress: "In Progress",
  completed: "Completed",
  disputed: "Disputed",
};

export default function DemoClientPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Jobs");
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);

  const filtered = mockJobs.filter(j => {
    if (activeTab === "All Jobs") return true;
    if (activeTab === "Open") return j.status === "open";
    if (activeTab === "In Progress") return j.status === "in_progress" || j.status === "assigned";
    if (activeTab === "Completed") return j.status === "completed";
    return true;
  });

  // Workers who bid on the selected job (mock — show first 3 workers)
  const biddingWorkers = mockWorkers.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <DemoNav active="client" />

      {/* push content below fixed nav */}
      <div className="flex flex-1 overflow-hidden pt-16">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-60 border-r flex-col shrink-0 bg-card">
          <nav className="flex-1 p-3 pt-4 space-y-1">
            {[
              { icon: Briefcase, label: "My Jobs",      active: true },
              { icon: Plus,      label: "Post a Job",   active: false },
              { icon: Bell,      label: "Notifications",active: false, badge: 2 },
              { icon: CreditCard,label: "Payments",     active: false },
              { icon: Star,      label: "Reviews",      active: false },
            ].map(item => (
              <Link key={item.label} to="/signup"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${item.active ? "gradient-amber text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{item.badge}</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full gradient-amber flex items-center justify-center text-xs font-bold text-accent-foreground">JD</div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Jane Doe</p>
                <p className="text-xs text-muted-foreground truncate">jane@example.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Jobs</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Track all your posted jobs and incoming bids</p>
              </div>
              <Link to="/signup">
                <Button className="gradient-amber text-accent-foreground gap-2">
                  <Plus className="h-4 w-4" /> Post a Job
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Jobs",   value: "3", color: "text-amber-500" },
                { label: "Total Bids",    value: "14", color: "text-blue-400" },
                { label: "In Progress",   value: "2", color: "text-green-400" },
                { label: "Completed",     value: "6", color: "text-muted-foreground" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border bg-card p-4">
                  <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-6">

              {/* Job List */}
              <div className="lg:col-span-2 space-y-3">
                {/* Tabs */}
                <div className="flex gap-1 rounded-lg border bg-card p-1">
                  {TABS.map(t => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === t ? "gradient-amber text-accent-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <Filter className="h-3.5 w-3.5" /> Filter
                  </Button>
                  <span className="text-xs text-muted-foreground">{filtered.length} jobs</span>
                </div>

                {/* Job cards */}
                <div className="space-y-2">
                  {filtered.map((job, i) => (
                    <motion.button key={job.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedJob(job)}
                      className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md ${selectedJob.id === job.id ? "border-amber-500/60 bg-amber-500/5" : "bg-card hover:border-border/80"}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold leading-snug">{job.title}</p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[job.status]}`}>
                          {job.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city}</span>
                        <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" />£{job.minFee}–£{job.maxFee}</span>
                      </div>
                      {job.bidsCount !== undefined && job.bidsCount > 0 && (
                        <p className="text-xs text-amber-500 font-medium mt-1.5">{job.bidsCount} bids received</p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Job Detail Panel */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl border bg-card overflow-hidden">
                  {/* Job image */}
                  {selectedJob.image && (
                    <div className="relative h-44 overflow-hidden">
                      <img src={selectedJob.image} alt={selectedJob.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      {selectedJob.urgency && selectedJob.urgency !== "normal" && (
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${selectedJob.urgency === "emergency" ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}>
                          {selectedJob.urgency === "emergency" ? "Emergency" : "Urgent"}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="text-lg font-bold leading-snug">{selectedJob.title}</h2>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[selectedJob.status]}`}>
                        {STATUS_LABELS[selectedJob.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{selectedJob.city}</span>
                      <span className="flex items-center gap-1"><CreditCard className="h-4 w-4" />£{selectedJob.minFee} – £{selectedJob.maxFee}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Posted {selectedJob.postedAt}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{selectedJob.description}</p>

                    {/* Bids section */}
                    {selectedJob.status === "open" && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          Bids Received
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold">{selectedJob.bidsCount ?? biddingWorkers.length}</span>
                        </h3>
                        <div className="space-y-3">
                          {biddingWorkers.map((worker, i) => (
                            <motion.div key={worker.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="rounded-xl border bg-background p-4">
                              <div className="flex items-start gap-3">
                                <div className="relative shrink-0">
                                  <img src={worker.avatar} alt={worker.name} className="h-10 w-10 rounded-full object-cover" />
                                  {worker.isAvailable && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-sm">{worker.name}</span>
                                    {worker.badge === "top_rated" && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-500">
                                        <Award className="h-2.5 w-2.5" /> Top Rated
                                      </span>
                                    )}
                                    {worker.badge === "verified" && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-500">
                                        <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span className="flex items-center gap-0.5">
                                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{worker.rating} ({worker.reviewCount})
                                    </span>
                                    <span>{worker.completedJobs} jobs</span>
                                    <span>{worker.category}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{worker.bio}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-bold text-amber-500">£{worker.hourlyRate * 3}/job</p>
                                  <p className="text-xs text-muted-foreground">ETA {worker.responseTime}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Link to="/signup" className="flex-1">
                                  <Button size="sm" className="w-full gradient-amber text-accent-foreground text-xs h-8">
                                    Accept Bid
                                  </Button>
                                </Link>
                                <Link to="/signup">
                                  <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                                    <Eye className="h-3 w-3" /> Profile
                                  </Button>
                                </Link>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedJob.status === "in_progress" && (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-sm font-semibold text-amber-500">Worker is on site</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Your worker checked in 45 minutes ago and is actively working. You'll receive an invoice once complete.</p>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Time on site:</span>
                          <span className="font-semibold text-amber-500">0h 45m</span>
                        </div>
                      </div>
                    )}

                    {selectedJob.status === "completed" && (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-green-400">Job Completed</p>
                            <p className="text-xs text-muted-foreground">Payment released to worker · Leave a review</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {mockReviews.slice(0, 1).map(r => (
                            <div key={r.id} className="col-span-2 rounded-xl border bg-background p-4">
                              <div className="flex items-center gap-1 mb-2">
                                {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />)}
                              </div>
                              <p className="text-sm text-muted-foreground">"{r.comment}"</p>
                              <p className="text-xs text-muted-foreground mt-2">— {r.clientName}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <DemoFooter />
    </div>
  );
}
