import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, MapPin, CreditCard, ArrowRight, Star, CheckCircle2,
  Clock, Briefcase, Zap, Bell, Users, TrendingUp, Award, ChevronRight,
  Wrench, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoNav } from "@/components/DemoNav";
import { DemoFooter } from "@/components/DemoFooter";
import { CATEGORIES, mockJobs, mockWorkers, mockReviews, platformStats } from "@/data/mockData";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const HOW_CLIENT = [
  { step: "01", icon: Briefcase,    title: "Post Your Job",    desc: "Describe what you need, add photos, set a budget. Takes under 2 minutes." },
  { step: "02", icon: Users,        title: "Receive Bids",     desc: "Nearby verified workers submit competitive bids with price, ETA, and a short pitch." },
  { step: "03", icon: CheckCircle2, title: "Hire the Best",    desc: "Review profiles, ratings and past reviews. Hire with one tap and pay via escrow." },
  { step: "04", icon: Star,         title: "Job Done & Paid",  desc: "Worker completes the job, you approve the invoice, payment is released instantly." },
];

const HOW_WORKER = [
  { step: "01", icon: Bell,       title: "Get Notified",     desc: "Receive instant alerts the moment a matching job is posted near you." },
  { step: "02", icon: Zap,        title: "Place Your Bid",   desc: "Submit your price, arrival time, and a short pitch. Blind bidding keeps it fair." },
  { step: "03", icon: MapPin,     title: "Check In On Site", desc: "GPS-verified check-in starts the job timer. Log work sessions and upload photos." },
  { step: "04", icon: CreditCard, title: "Get Paid Fast",    desc: "Send your itemised invoice. Once approved, money lands in your account same day." },
];

const TRUST = [
  { icon: Shield,     label: "Escrow Payments",    desc: "Funds held safely until job is approved" },
  { icon: Award,      label: "Verified Workers",   desc: "ID, DBS and trade cert checks" },
  { icon: TrendingUp, label: "Dispute Protection", desc: "Admin-managed resolution for every case" },
  { icon: Clock,      label: "24/7 Support",       desc: "Always someone to help you" },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"client" | "worker">("client");

  return (
    <div className="min-h-screen bg-background">

      <DemoNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="relative flex min-h-[94vh] items-center gradient-hero">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=900&fit=crop&auto=format&q=80"
              alt="UK tradespeople at work"
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(222,60%,8%)] via-[hsl(222,60%,8%)]/80 to-transparent" />
          </div>
          <div className="container mx-auto px-4 relative z-10 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium gradient-amber text-accent-foreground mb-6">
                  <span>&#127468;&#127463;</span> UK's On-Demand Trades Marketplace
                </span>
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45, 100%, 96%)" }}>
                  The Smarter Way<br />
                  to Hire <span className="text-gradient">Tradespeople</span><br />
                  Near You.
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-xl" style={{ color: "hsl(220, 20%, 78%)" }}>
                  Post a job, get competing bids from vetted local workers within minutes,
                  and pay only when you're satisfied. Trusted by 8,900+ UK clients.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link to="/signup">
                    <Button size="lg" className="gradient-amber text-accent-foreground font-semibold text-base px-8 hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/20">
                      Post a Job Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/demo/client">
                    <Button size="lg" variant="outline" className="border-2 border-[hsl(45_100%_51%)] bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground gap-2">
                      <Eye className="h-4 w-4" /> See How It Works
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                    <span className="text-sm ml-1" style={{ color: "hsl(220,20%,78%)" }}>4.8 from 2,400+ reviews</span>
                  </div>
                  <div className="flex -space-x-2">
                    {mockWorkers.slice(0,4).map(w => (
                      <img key={w.id} src={w.avatar} alt={w.name} className="h-8 w-8 rounded-full border-2 border-background object-cover" />
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-amber-500 text-xs font-bold text-white">+3k</div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
                <div className="relative">
                  <div className="rounded-2xl border bg-card/90 backdrop-blur-sm shadow-2xl p-5 max-w-sm ml-auto">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white">Emergency</span>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <h3 className="font-semibold mb-1">Emergency Boiler Breakdown</h3>
                    <p className="text-sm text-muted-foreground mb-3">No heating or hot water. Urgent fix needed for family home in East London.</p>
                    <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> London</span>
                      <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> £120–£300</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">3 bids received</span>
                      <Button size="sm" className="gradient-amber text-accent-foreground text-xs h-7">Place Bid</Button>
                    </div>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5 }}
                    className="absolute -bottom-6 -left-8 rounded-xl border bg-card shadow-xl p-3 flex items-center gap-3 max-w-[200px]">
                    <img src={mockWorkers[0].avatar} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">James C. placed a bid</p>
                      <p className="text-xs text-amber-500">£180 · ETA 25 min</p>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, duration: 0.4 }}
                    className="absolute -top-4 -right-4 rounded-full border bg-card shadow-lg px-3 py-1.5 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold">4.9</span>
                    <span className="text-xs text-muted-foreground">Top Rated</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { value: `${Math.round(platformStats.completedJobs / 1000)}k+`, label: "Jobs Completed" },
              { value: `${(platformStats.totalWorkers / 1000).toFixed(1)}k+`, label: "Verified Workers" },
              { value: `${(platformStats.totalClients / 1000).toFixed(1)}k+`, label: "Happy Clients" },
              { value: `${platformStats.citiesCovered}`,                      label: "UK Cities" },
              { value: `${platformStats.avgRating}`,                          label: "Avg. Rating" },
              { value: "< 5 min",                                             label: "Avg. First Bid" },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)}>
                <p className="text-3xl font-bold text-gradient" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium gradient-amber text-accent-foreground mb-3">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Simple for everyone.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Whether you need work done or want to earn — WorkHive makes it effortless.</p>
          </motion.div>
          <div className="flex justify-center mb-10">
            <div className="flex rounded-xl border bg-card p-1 gap-1">
              <button onClick={() => setActiveTab("client")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "client" ? "gradient-amber text-accent-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                I need work done
              </button>
              <button onClick={() => setActiveTab("worker")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "worker" ? "gradient-amber text-accent-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                I want to earn
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === "client" ? HOW_CLIENT : HOW_WORKER).map((step, i) => (
              <motion.div key={step.step} {...fadeUp(i * 0.1)} className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-xs font-bold text-amber-500 font-mono">{step.step}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-amber text-accent-foreground shadow">
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-8 gap-4">
            {activeTab === "client" ? (
              <>
                <Link to="/demo/client"><Button variant="outline" className="gap-2"><Eye className="h-4 w-4" /> See Client Demo</Button></Link>
                <Link to="/signup"><Button className="gradient-amber text-accent-foreground gap-2">Post a Job Free <ArrowRight className="h-4 w-4" /></Button></Link>
              </>
            ) : (
              <>
                <Link to="/demo/worker"><Button variant="outline" className="gap-2"><Eye className="h-4 w-4" /> See Worker Demo</Button></Link>
                <Link to="/signup"><Button className="gradient-amber text-accent-foreground gap-2">Start Earning <ArrowRight className="h-4 w-4" /></Button></Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Live Jobs Preview */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium gradient-amber text-accent-foreground mb-2">Live on the platform</span>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Jobs posted right now</h2>
            </div>
            <Link to="/demo/worker" className="hidden md:flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 transition-colors">
              Browse all <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockJobs.slice(0, 6).map((job, i) => (
              <motion.div key={job.id} {...fadeUp(i * 0.07)} className="rounded-2xl border bg-background overflow-hidden hover:shadow-lg transition-shadow group">
                {job.image && (
                  <div className="relative h-36 overflow-hidden">
                    <img src={job.image} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    {job.urgency && job.urgency !== "normal" && (
                      <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold ${job.urgency === "emergency" ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}>
                        {job.urgency === "emergency" ? "Emergency" : "Urgent"}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-snug mb-2">{job.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city}</span>
                    <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" />£{job.minFee}–£{job.maxFee}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.postedAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{job.bidsCount ?? 0} bids</span>
                    <Link to="/signup">
                      <Button size="sm" variant="outline" className="h-7 text-xs">Place Bid</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>All Trade Categories</h2>
            <p className="text-muted-foreground">From emergency call-outs to planned projects — every trade covered.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.value} {...fadeUp(i * 0.05)}
                className="rounded-2xl border bg-card p-4 text-center hover:shadow-md hover:border-amber-500/50 transition-all cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-amber text-accent-foreground shadow mx-auto mb-3">
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <p className="font-semibold text-sm">{cat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">UK-wide</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Workers */}
      <section id="workers" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium gradient-amber text-accent-foreground mb-2">Our workforce</span>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Top rated workers near you</h2>
            </div>
            <Link to="/demo/client" className="hidden md:flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 transition-colors">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockWorkers.slice(0, 6).map((worker, i) => (
              <motion.div key={worker.id} {...fadeUp(i * 0.07)} className="rounded-2xl border bg-background p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img src={worker.avatar} alt={worker.name} className="h-14 w-14 rounded-full object-cover" />
                    {worker.isAvailable && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{worker.name}</span>
                      {worker.badge === "top_rated" && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500">
                          <Award className="h-3 w-3" /> Top Rated
                        </span>
                      )}
                      {worker.badge === "verified" && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{worker.category} · {worker.city}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-0.5 text-xs font-medium">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{worker.rating} ({worker.reviewCount})
                      </span>
                      <span className="text-xs text-muted-foreground">{worker.completedJobs} jobs</span>
                      <span className="text-xs font-medium text-amber-500">£{worker.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{worker.bio}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {worker.skills.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-xs">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> Responds {worker.responseTime}</span>
                  <Link to="/signup"><Button size="sm" variant="outline" className="h-7 text-xs">Hire Now</Button></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium gradient-amber text-accent-foreground mb-3">What clients say</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Trusted by thousands across the UK.</h2>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
              <span className="ml-2 text-muted-foreground text-sm">4.8 average from 2,400+ reviews</span>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {mockReviews.map((review, i) => (
              <motion.div key={review.id} {...fadeUp(i * 0.1)} className="rounded-2xl border bg-card p-5 flex flex-col">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />)}
                </div>
                <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <img src={review.clientAvatar} alt={review.clientName} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{review.clientName}</p>
                    <p className="text-xs text-muted-foreground">{review.jobTitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST.map((t, i) => (
              <motion.div key={t.label} {...fadeUp(i * 0.08)} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-amber text-accent-foreground shadow">
                  <t.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{t.label}</p>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=600&fit=crop&auto=format&q=60" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(45,100%,96%)" }}>
              Ready to get started?
            </h2>
            <p className="mb-10 max-w-lg mx-auto text-lg" style={{ color: "hsl(220,20%,75%)" }}>
              Join 12,000+ people already using WorkHive to get work done or earn more.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link to="/signup">
                <Button size="lg" className="gradient-amber text-accent-foreground font-semibold text-base px-10 shadow-lg shadow-amber-500/20 hover:opacity-90">
                  Post a Job — It's Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="border-2 border-[hsl(45_100%_51%)] bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground font-semibold text-base px-10">
                  <Wrench className="mr-2 h-5 w-5" /> Join as a Worker
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm" style={{ color: "hsl(220,20%,60%)" }}>No subscription. No upfront fees. Pay only on completed jobs.</p>
          </motion.div>
        </div>
      </section>

      <DemoFooter />
    </div>
  );
}
