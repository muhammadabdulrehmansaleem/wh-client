import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES, mockJobs } from "@/data/mockData";

function JobCard({ job }: { job: (typeof mockJobs)[number] }) {
  const categoryInfo = CATEGORIES.find((c) => c.value === job.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border bg-card hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryInfo?.icon}</span>
          <Badge variant="secondary" className="text-xs">
            {categoryInfo?.label}
          </Badge>
        </div>
        <Badge
          variant={job.status === "open" ? "default" : "outline"}
          className={job.status === "open" ? "gradient-amber text-accent-foreground border-0" : ""}
        >
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
        {job.status === "open" && (
          <Button size="sm" className="gradient-amber text-accent-foreground border-0 hover:opacity-90">
            Apply
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function CategoryPage() {
  const { category } = useParams();
  const categoryInfo = CATEGORIES.find((c) => c.value === category);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Category not found
            </h1>
            <p className="text-muted-foreground mb-6">That category doesn’t exist.</p>
            <Link to="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const jobs = mockJobs.filter((j) => j.category === categoryInfo.value);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" aria-label="Back to home">
            <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>

          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-amber text-accent-foreground shadow-sm">
              <span className="text-2xl leading-none">{categoryInfo.icon}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {categoryInfo.label} jobs
              </h1>
              <p className="text-muted-foreground">
                Dummy listings for now — styled consistently with the rest of WorkHive.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-muted-foreground">
              {jobs.length} jobs found
            </p>
            <div className="flex items-center gap-2">
              <Link to="/worker">
                <Button variant="outline" size="sm">
                  Browse all jobs
                </Button>
              </Link>
              <Link to="/client">
                <Button size="sm" className="gradient-amber text-accent-foreground border-0 hover:opacity-90">
                  Post a job
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </AnimatePresence>
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No jobs found in this category yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

