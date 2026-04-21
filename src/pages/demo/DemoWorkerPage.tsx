/**
 * /demo/worker — Read-only showcase of the Worker experience.
 * No auth required. All data is mock. Every action CTA points to /signup.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, CreditCard, Clock, Bell, Star, CheckCircle2,
  Eye, ArrowRight, Briefcase, ChevronRight, Award, Zap,
  ToggleLeft, TrendingUp, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockJobs, mockWorkers, mockNotifications } from "@/data/mockData";

const CATEGORY_COLORS: Record<string, string> = {
  plumber:     "bg-blue-500/20 text-blue-400",
  electrician: "bg-yellow-500/20 text-yellow-400",
  cleaner:     "bg-green-500/20 text-green-400",
  security:    "bg-purple-500/20 text-purple-400",
  carpenter:   "bg-orange-500/20 text-orange-400",
  gardener:    "bg-emerald-500/20 text-emerald-400",
  painter:     "bg-pink-500/20 text-pink-400",
  labourer:    "bg-stone-500/20 text-stone-400",
};

const worker = mockWorkers[0]; // James Carter — Plumber, London

export default function DemoWorkerPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "bids" | "earnings" | "notifications">("browse");
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);

  const openJobs = mockJobs.filter(j => j.status === "open");

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Demo Banner */}
      <div className="gradient-amber text-accent-foreground text-center py-2 px-4 text-sm font-medium sticky top-0 z-50 flex items-center justify-center gap-3">
        <Eye className="h-4 w-4 shrink-0" />
        <span>You're viewing a <strong>read-only demo</strong> of the Worker dashboard. All data is sample data.</span>
        <Link to="/signup">
          <Button size="sm" variant="outline" className="h-7 text-xs border-accent-foreground/40 hover:bg-accent-foreground/10 ml-2">
            Join as a Worker <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-60 border-r flex-col shrink-0 bg-card">
          <div className="p-5 border-b">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-amber">
                <span className="text-xs font-bold text-accent-foreground">WH</span>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WorkHive</span>
            </Link>
          </div>

          {/* Worker profile card */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={worker.avatar} alt={worker.name} className="h-12 w-12 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{worker.name}</p>
                <p className="text-xs text-muted-foreground">{worker.category} · {worker.city}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">{worker.rating}</span>
                  <span className="text-xs text-muted-foreground">({worker.reviewCount})</span>
                </div>
              </div>
            </div>
            {/* Availability toggle */}
            <div className="mt-3 flex items-center justify-between rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2">
              <span className="text-xs font-medium text-green-400">Open to Work</span>
              <ToggleLeft className="h-4 w-4 text-green-400" />
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {[
              { key: "browse",        icon: Briefcase,   label: "Browse Jobs"    },
              { key: "bids",          icon: Zap,         label: "My Bids"        },
              { key: "earnings",      icon: TrendingUp,  label: "Earnings"       },
              { key: "notifications", icon: Bell,        label: "Notifications", badge: 2 },
            ].map(item => (
              <button key={item.key}
                onClick={() => setActiveTab(item.key as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === item.key ? "gradient-amber text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {/* ── Browse Jobs tab ── */}
            {activeTab === "browse" && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Browse Nearby Jobs</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">{openJobs.length} open jobs matching your skills in your area</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5 hidden md:flex">
                    <Filter className="h-3.5 w-3.5" /> Filter
                  </Button>
                </div>

                <div className="grid lg:grid-cols-5 gap-5">
                  {/* Job list */}
                  <div className="lg:col-span-2 space-y-3">
                    {openJobs.map((job, i) => (
                      <motion.button key={job.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => setSelectedJob(job)}
                        className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md ${selectedJob.id === job.id ? "border-amber-500/60 bg-amber-500/5" : "bg-card hover:border-border/80"}`}>
                        {job.image && (
                          <div className="relative h-28 rounded-lg overflow-hidden mb-3">
                            <img src={job.image} alt={job.title} className="w-full h-full object-cover" />
                            {job.urgency && job.urgency !== "normal" && (
                              <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${job.urgency === "emergency" ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}>
                                {job.urgency === "emergency" ? "Emergency" : "Urgent"}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-sm font-semibold leading-snug mb-1.5">{job.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{job.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city}</span>
                          <span className="flex items-center gap-1 font-medium text-amber-500"><CreditCard className="h-3 w-3" />£{job.minFee}–£{job.maxFee}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{job.postedAt}</span>
                          <span className="text-xs text-muted-foreground">{job.bidsCount ?? 0} bids</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Job detail + bid form */}
                  <div className="lg:col-span-3">
                    <div className="rounded-2xl border bg-card overflow-hidden">
                      {selectedJob.image && (
                        <div className="relative h-52 overflow-hidden">
                          <img src={selectedJob.image} alt={selectedJob.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                          {selectedJob.urgency && selectedJob.urgency !== "normal" && (
                            <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${selectedJob.urgency === "emergency" ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}>
                              {selectedJob.urgency === "emergency" ? "Emergency" : "Urgent"}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-5 space-y-4">
                        <div>
                          <h2 className="text-lg font-bold mb-1">{selectedJob.title}</h2>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selectedJob.city}</span>
                            <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" />£{selectedJob.minFee} – £{selectedJob.maxFee}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Posted {selectedJob.postedAt}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob.description}</p>

                        {/* Bid form (demo — read-only) */}
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                          <p className="text-sm font-semibold">Place Your Bid</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Your Price (£)</label>
                              <div className="rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">£ 150.00</div>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">ETA</label>
                              <div className="rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">Within 30 min</div>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Short Pitch (max 200 chars)</label>
                            <div className="rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground min-h-[64px]">
                              Hi, I'm James. Master plumber with 12 years experience. I can be there within 30 minutes. Emergency call-outs are my speciality.
                            </div>
                          </div>
                          <Link to="/signup" className="block">
                            <Button className="w-full gradient-amber text-accent-foreground gap-2">
                              Submit Bid — Sign Up to Unlock <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                          <p className="text-xs text-muted-foreground text-center">Blind bidding — other workers cannot see your price.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Earnings tab ── */}
            {activeTab === "earnings" && (
              <>
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Earnings</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Your earnings and payout summary</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "This Week",   value: "£420",  sub: "+18% vs last week",   color: "text-green-400" },
                    { label: "This Month",  value: "£1,840",sub: "12 jobs completed",    color: "text-amber-500" },
                    { label: "In Escrow",   value: "£360",  sub: "2 pending approvals", color: "text-blue-400" },
                    { label: "Total Earned",value: "£9,240",sub: "since joining",        color: "text-muted-foreground" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl border bg-card p-4">
                      <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <h3 className="font-semibold mb-4">Recent Payments</h3>
                  <div className="space-y-3">
                    {[
                      { job: "Emergency Boiler Repair",  amount: "£180", date: "Apr 20", status: "paid" },
                      { job: "Bathroom Installation",     amount: "£340", date: "Apr 18", status: "paid" },
                      { job: "Kitchen Extension Rewire",  amount: "£280", date: "Apr 15", status: "in_escrow" },
                      { job: "Burst Pipe Emergency",      amount: "£120", date: "Apr 12", status: "paid" },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium">{p.job}</p>
                          <p className="text-xs text-muted-foreground">{p.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-500">{p.amount}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                            {p.status === "paid" ? "Paid" : "In Escrow"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Notifications tab ── */}
            {activeTab === "notifications" && (
              <>
                <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Notifications</h1>
                <div className="space-y-2">
                  {[
                    { icon: Zap,          color: "text-amber-500 bg-amber-500/10", title: "New job near you!", body: "Emergency Boiler Breakdown posted in London · £120–£300", time: "2 min ago", read: false },
                    { icon: CheckCircle2, color: "text-green-400 bg-green-500/10",  title: "Your bid was accepted", body: "4-Bedroom End of Tenancy Clean · Manchester", time: "1 hour ago", read: false },
                    { icon: CreditCard,   color: "text-blue-400 bg-blue-500/10",    title: "Payment released", body: "Bathroom Installation — £340 has been sent to your account", time: "Yesterday", read: true },
                    { icon: Star,         color: "text-amber-500 bg-amber-500/10",  title: "New 5-star review", body: "Emma Watson left a review: \"Brilliant service, arrived fast!\"", time: "2 days ago", read: true },
                    ...mockNotifications.map(n => ({
                      icon: Bell,
                      color: "text-muted-foreground bg-muted",
                      title: n.message,
                      body: "",
                      time: n.time,
                      read: n.read,
                    })),
                  ].map((n, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-4 rounded-xl border p-4 ${!n.read ? "bg-card" : "bg-background opacity-70"}`}>
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${n.color}`}>
                        <n.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug">{n.title}</p>
                        {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">{n.time}</span>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* ── My Bids tab ── */}
            {activeTab === "bids" && (
              <>
                <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Bids</h1>
                <div className="space-y-3">
                  {[
                    { title: "Emergency Boiler Breakdown",   city: "London",     bid: "£180", eta: "25 min",    status: "pending",  bidsCount: 3 },
                    { title: "4-Bed End of Tenancy Clean",   city: "Manchester", bid: "£240", eta: "2 hours",   status: "accepted", bidsCount: 7 },
                    { title: "SIA Security – Night Shift",   city: "Birmingham", bid: "£145", eta: "1 hour",    status: "rejected", bidsCount: 5 },
                    { title: "Kitchen Extension Rewire",     city: "Leeds",      bid: "£520", eta: "Next day",  status: "pending",  bidsCount: 4 },
                  ].map((b, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-xl border bg-card p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{b.title}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{b.city}</span>
                          <span>ETA: {b.eta}</span>
                          <span>{b.bidsCount} total bids</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-amber-500">{b.bid}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          b.status === "accepted" ? "bg-green-500/20 text-green-400" :
                          b.status === "rejected" ? "bg-red-500/20 text-red-400" :
                          "bg-amber-500/20 text-amber-400"
                        }`}>
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

          </div>
        </main>
      </div>

      {/* Bottom CTA */}
      <div className="border-t bg-card py-4 px-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Join 3,000+ workers already earning on WorkHive. No subscription needed.</p>
        <div className="flex gap-3 shrink-0">
          <Link to="/"><Button variant="outline" size="sm">Back to Home</Button></Link>
          <Link to="/signup"><Button size="sm" className="gradient-amber text-accent-foreground gap-1">Join as a Worker <ChevronRight className="h-3.5 w-3.5" /></Button></Link>
        </div>
      </div>
    </div>
  );
}
