import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { LogOut, Pencil, MapPin, Phone, Briefcase, X, User, Mail, Star, CheckCircle2 } from "lucide-react";
import apiClient from "@/lib/axios";
import authService from "@/services/auth.service";
import { API_URLS } from "@/config/api.urls";
import { WORKER_CATEGORIES } from "@/config/categories";
import type { AuthUser } from "@/services/auth.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const buildForm = (u: AuthUser) => ({
  first_name:    u.first_name    ?? "",
  last_name:     u.last_name     ?? "",
  phone:         u.phone         ?? "",
  address_line1: u.address_line1 ?? "",
  address_line2: u.address_line2 ?? "",
  city:          u.city          ?? "",
  postcode:      u.postcode      ?? "",
  category:      u.category      ?? "",
  bio:           u.bio           ?? "",
  skills:        u.skills        ?? ([] as string[]),
});

export default function Profile() {
  const navigate = useNavigate();

  // useState so card re-renders when data changes after save
  const [user, setUser] = useState(() => authService.getUser());
  const [form, setForm] = useState(() => (user ? buildForm(user) : buildForm({} as AuthUser)));
  const [skillInput, setSkillInput]         = useState("");
  const [profilePic, setProfilePic]         = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  // Initialized from authService so it survives SPA navigation and page refresh
  const [displayPicture, setDisplayPicture] = useState<string | null>(
    () => authService.getUser()?.profile_picture_url ?? null
  );
  const [saving, setSaving]                 = useState(false);
  const [loggingOut, setLoggingOut]         = useState(false);
  const [editOpen, setEditOpen]             = useState(false);

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addSkill = () => {
    const t = skillInput.trim();
    if (t && !form.skills.includes(t)) update("skills", [...form.skills, t]);
    setSkillInput("");
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.first_name || !form.last_name || !form.phone || !form.address_line1 || !form.city || !form.postcode) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("first_name",    form.first_name);
      fd.append("last_name",     form.last_name);
      fd.append("phone",         form.phone);
      fd.append("address_line1", form.address_line1);
      if (form.address_line2) fd.append("address_line2", form.address_line2);
      fd.append("city",     form.city);
      fd.append("postcode", form.postcode);
      if (form.category) fd.append("category", form.category);
      if (form.bio)      fd.append("bio",      form.bio);
      if (form.skills.length > 0) fd.append("skills", JSON.stringify(form.skills));
      if (profilePic)    fd.append("profile_picture", profilePic);

      const { data } = await apiClient.patch(API_URLS.USERS.UPDATE_PROFILE, fd);

      // Merge profile_picture_url into the stored user so it survives page refresh
      const updatedUser = { ...data.user, profile_picture_url: data.profile_picture_url ?? null };
      authService.setUser(updatedUser);
      setUser(updatedUser);
      setForm(buildForm(updatedUser));
      // Prefer S3 presigned URL from server; fall back to local blob preview
      setDisplayPicture(data.profile_picture_url ?? profilePreview);
      setProfilePic(null);

      toast.success("Profile updated!");
      setEditOpen(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiClient.post(API_URLS.AUTH.LOGOUT);
    } catch {
      // clear locally even if server fails
    } finally {
      authService.clear();
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const displayName = user.full_name ?? (`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email);
  const initials = [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("").toUpperCase() || user.email[0].toUpperCase();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-3">

        {/* ── Profile Card ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border bg-card shadow-md">

          {/* Header + overlapping avatar in a single relative container */}
          <div className="relative">
            {/* Amber header strip */}
            <div className="h-24 gradient-amber rounded-t-2xl">
              <div className="absolute inset-0 opacity-20 rounded-t-2xl" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }} />
            </div>

            {/* Avatar — absolute so it overlaps header without clipping */}
            <div className="absolute -bottom-10 left-6">
              <div className="h-20 w-20 rounded-full border-4 border-card shadow-md overflow-hidden">
                {displayPicture ? (
                  <img src={displayPicture} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Role badge pinned top-right of header */}
            {user.role && (
              <div className="absolute top-3 right-4">
                <Badge className="capitalize text-xs px-2.5 py-0.5" variant={user.role === "worker" ? "default" : "secondary"}>
                  {user.role === "worker" ? "Worker" : user.role === "client" ? "Client" : user.role}
                </Badge>
              </div>
            )}
          </div>

          {/* Content — pt-12 makes room for the 80px avatar overlapping 40px down */}
          <div className="px-6 pt-12 pb-6">
            {/* Name + verified */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold leading-tight">{displayName}</h2>
              {user.is_verified && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
            </div>

            {/* Email */}
            <div className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span>{user.email}</span>
            </div>

            <Separator className="my-4" />

            {/* Info rows */}
            <div className="space-y-2.5 text-sm">
              {user.phone && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted shrink-0">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <span>{user.phone}</span>
                </div>
              )}
              {(user.address_line1 || user.city) && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted shrink-0">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span>{[user.address_line1, user.city, user.postcode].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {user.category && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted shrink-0">
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <span>{user.category}</span>
                </div>
              )}
              {user.rating != null && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted shrink-0">
                    <Star className="h-3.5 w-3.5" />
                  </div>
                  <span>{user.rating} / 5.0 · {user.completed_jobs_count} jobs</span>
                </div>
              )}
            </div>

            {user.bio && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-l-2 border-amber-400 pl-3">{user.bio}</p>
            )}

            {user.skills && user.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {user.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">

          {/* Edit Profile Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 w-full">
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">

                {/* Profile picture */}
                <div className="space-y-1.5">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    {profilePreview ? (
                      <img src={profilePreview} className="h-14 w-14 rounded-full object-cover border" alt="preview" />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                        <span className="text-lg font-bold text-white">{initials}</span>
                      </div>
                    )}
                    <label htmlFor="edit-profile-pic" className="cursor-pointer text-xs bg-muted px-3 py-1.5 rounded-md hover:bg-muted/80 transition-colors">
                      {profilePreview ? "Change" : "Upload photo"}
                    </label>
                    <input id="edit-profile-pic" type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setProfilePic(file);
                        setProfilePreview(URL.createObjectURL(file));
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>First Name <span className="text-destructive">*</span></Label>
                    <Input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Last Name <span className="text-destructive">*</span></Label>
                    <Input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label>Phone <span className="text-destructive">*</span></Label>
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <Label>Address Line 1 <span className="text-destructive">*</span></Label>
                  <Input value={form.address_line1} onChange={(e) => update("address_line1", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Address Line 2 <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input value={form.address_line2} onChange={(e) => update("address_line2", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>City <span className="text-destructive">*</span></Label>
                    <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Postcode <span className="text-destructive">*</span></Label>
                    <Input value={form.postcode} onChange={(e) => update("postcode", e.target.value.toUpperCase())} maxLength={8} />
                  </div>
                </div>

                {/* Worker-only fields */}
                {user.role === "worker" && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Select value={form.category} onValueChange={(v) => update("category", v)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {WORKER_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Bio</Label>
                      <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} className="resize-none" />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
                          placeholder="Press Enter to add"
                        />
                        <Button type="button" variant="outline" onClick={addSkill} disabled={!skillInput.trim()}>Add</Button>
                      </div>
                      {form.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {form.skills.map((s) => (
                            <Badge key={s} variant="secondary" className="gap-1 pr-1">
                              {s}
                              <button type="button" onClick={() => update("skills", form.skills.filter((x) => x !== s))} className="rounded-full hover:bg-muted p-0.5">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Button
                  className="w-full gradient-amber text-accent-foreground font-semibold"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Logout */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2 w-full" disabled={loggingOut}>
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Logging out..." : "Log Out"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your session will be ended and you will need to log in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
