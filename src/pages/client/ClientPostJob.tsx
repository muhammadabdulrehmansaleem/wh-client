import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { LayoutDashboard, PlusCircle, ListChecks, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockJobs, UK_CITIES, CATEGORIES, Job } from "@/data/mockData";
import { toast } from "sonner";

const navItems = [
  { title: "Overview",   url: "/client",          icon: LayoutDashboard },
  { title: "Post a Job", url: "/client/post-job", icon: PlusCircle },
  { title: "My Jobs",    url: "/client/jobs",     icon: ListChecks },
  { title: "My Profile", url: "/profile",         icon: User },
];

export default function ClientPostJob() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    city: "",
    description: "",
    minFee: "",
    maxFee: "",
    locationNote: "",
  });
  const [isLocating, setIsLocating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.city) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Job posted successfully! Workers in " + form.city + " will be notified.");
    setForm({
      title: "",
      category: "",
      city: "",
      description: "",
      minFee: "",
      maxFee: "",
      locationNote: "",
    });
  };

  return (
    <DashboardLayout items={navItems} title="Client Panel" groupLabel="Management">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Post a New Job</h1>
        <p className="text-muted-foreground mb-6">Describe what you need and workers in your area will be notified</p>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-2xl border bg-card">
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" placeholder="e.g. Security Guard for Night Shift" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City *</Label>
              <Select value={form.city} onValueChange={v => setForm(f => ({ ...f, city: v }))}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {UK_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Optional: attach precise job location
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLocating}
                    onClick={() => {
                      if (!navigator.geolocation) {
                        toast.error("Location is not supported in this browser.");
                        return;
                      }
                      setIsLocating(true);
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const { latitude, longitude } = pos.coords;
                          setForm(f => ({
                            ...f,
                            locationNote: `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
                          }));
                          toast.success("Location added to your job.");
                          setIsLocating(false);
                        },
                        () => {
                          toast.error("We couldn't access your location. Please check permissions.");
                          setIsLocating(false);
                        },
                        { enableHighAccuracy: true, timeout: 10000 },
                      );
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    {isLocating ? "Detecting..." : "Use my location"}
                  </Button>
                </div>
                {form.locationNote && (
                  <p className="text-[11px] text-muted-foreground">
                    Saved location: <span className="font-medium text-foreground">{form.locationNote}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" placeholder="Describe the job requirements..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min">Min Fee (£)</Label>
              <Input id="min" type="number" placeholder="80" value={form.minFee} onChange={e => setForm(f => ({ ...f, minFee: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="max">Max Fee (£)</Label>
              <Input id="max" type="number" placeholder="150" value={form.maxFee} onChange={e => setForm(f => ({ ...f, maxFee: e.target.value }))} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground">
              💡 After a worker accepts your job, you'll need to <strong>deposit the max fee</strong>. 
              The payment will be held securely and released to the worker once you confirm the job is completed.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full gradient-amber text-accent-foreground font-semibold hover:opacity-90">
            Post Job & Notify Workers
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
