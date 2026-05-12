import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import {
  LogOut, Pencil, MapPin, Phone, Briefcase, X, Mail,
  Star, CheckCircle2, Lock, Eye, EyeOff, Navigation,
  Camera, ArrowLeft, Building2, Hash, Award, Shield,
} from "lucide-react";
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

const toCoord = (v: unknown): number | null => {
  if (v == null) return null;
  const n = parseFloat(String(v));
  return isNaN(n) ? null : n;
};

const buildForm = (u: AuthUser) => ({
  first_name:    u.first_name    ?? "",
  last_name:     u.last_name     ?? "",
  phone:         u.phone         ?? "",
  address_line1: u.address_line1 ?? "",
  address_line2: u.address_line2 ?? "",
  city:          u.city          ?? "",
  postcode:      u.postcode      ?? "",
  latitude:      toCoord(u.latitude),
  longitude:     toCoord(u.longitude),
  category:      u.category      ?? "",
  bio:           u.bio           ?? "",
  skills:        u.skills        ?? ([] as string[]),
});

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  client:      { label: "Client",      color: "bg-blue-100 text-blue-800" },
  worker:      { label: "Worker",      color: "bg-amber-100 text-amber-800" },
  admin:       { label: "Admin",       color: "bg-purple-100 text-purple-800" },
  super_admin: { label: "Super Admin", color: "bg-rose-100 text-rose-800" },
};

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => authService.getUser());
  const [form, setForm] = useState(() => (user ? buildForm(user) : buildForm({} as AuthUser)));
  const [skillInput, setSkillInput]         = useState("");
  const [profilePic, setProfilePic]         = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [displayPicture, setDisplayPicture] = useState<string | null>(
    () => authService.getUser()?.profile_picture_url ?? null
  );
  const [saving, setSaving]                 = useState(false);
  const [loggingOut, setLoggingOut]         = useState(false);
  const [editOpen, setEditOpen]             = useState(false);
  const [locating, setLocating]             = useState(false);

  // Change-password dialog
  const [pwOpen, setPwOpen]             = useState(false);
  const [otpSent, setOtpSent]           = useState(false);
  const [sendingOtp, setSendingOtp]     = useState(false);
  const [otp, setOtp]                   = useState("");
  const [newPw, setNewPw]               = useState("");
  const [confirmPw, setConfirmPw]       = useState("");
  const [showNewPw, setShowNewPw]       = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPw, setChangingPw]     = useState(false);

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addSkill = () => {
    const t = skillInput.trim();
    if (t && !form.skills.includes(t)) update("skills", [...form.skills, t]);
    setSkillInput("");
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        update("latitude", latitude);
        update("longitude", longitude);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "User-Agent": "WorkHive/1.0" } }
          );
          const data = await res.json();
          if (data?.address) {
            const addr = data.address;
            const line1 = [addr.house_number, addr.road || addr.pedestrian].filter(Boolean).join(" ");
            const city  = addr.city || addr.town || addr.village || addr.county || "";
            const postcode = (addr.postcode || "").split("-")[0].trim().toUpperCase();
            if (line1) update("address_line1", line1);
            if (city)  update("city", city);
            if (postcode) update("postcode", postcode);
          }
          toast.success("Location detected and address updated!");
        } catch {
          toast.success("Location detected! Please verify the address.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED)
          toast.error("Location access denied. Allow it in browser settings.");
        else
          toast.error("Could not get location. Enter address manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      await apiClient.post(API_URLS.AUTH.SEND_RESET_OTP);
      setOtpSent(true);
      toast.success("A 6-digit code has been sent to your email.");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to send code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleChangePassword = async () => {
    if (!otp || !newPw || !confirmPw) { toast.error("Please fill in all fields."); return; }
    if (newPw !== confirmPw) { toast.error("Passwords do not match."); return; }
    setChangingPw(true);
    try {
      await apiClient.post(API_URLS.AUTH.VERIFY_RESET_PASSWORD, {
        otp, new_password: newPw, confirm_password: confirmPw,
      });
      toast.success("Password changed successfully!");
      setPwOpen(false);
      setOtpSent(false);
      setOtp(""); setNewPw(""); setConfirmPw("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPw(false);
    }
  };

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
      if (form.latitude  != null) fd.append("latitude",  String(form.latitude));
      if (form.longitude != null) fd.append("longitude", String(form.longitude));
      if (profilePic)    fd.append("profile_picture", profilePic);

      const { data } = await apiClient.patch(API_URLS.USERS.UPDATE_PROFILE, fd);
      const updatedUser = { ...data.user, profile_picture_url: data.profile_picture_url ?? null };
      authService.setUser(updatedUser);
      setUser(updatedUser);
      setForm(buildForm(updatedUser));
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
    } catch { /* clear regardless */ } finally {
      authService.clear();
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  // ── Derived display values ──────────────────────────────────────────────
  const displayName = user.full_name ?? (`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email);
  const initials = [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("").toUpperCase() || user.email[0].toUpperCase();
  const roleInfo = ROLE_LABELS[user.role ?? ""] ?? null;
  const dashHome = user.role === "worker" ? "/worker" : user.role === "admin" || user.role === "super_admin" ? "/admin" : "/client";

  return (
    <div className="min-h-screen bg-background">

      {/* ── Top nav bar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 h-14 border-b bg-card/80 backdrop-blur-sm flex items-center px-4 sm:px-6 gap-3">
        <Link to={dashHome}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        </Link>
        <div className="flex-1" />
        {/* Quick action buttons in header */}
        <Sheet open={editOpen} onOpenChange={setEditOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="gradient-amber text-accent-foreground gap-1.5 font-semibold">
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </SheetTrigger>
          {/* Edit Sheet — defined here, rendered by portal */}
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Edit Profile</SheetTitle>
            </SheetHeader>

            <div className="space-y-5 pb-10">

              {/* Profile picture upload */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-border">
                    {(profilePreview || displayPicture) ? (
                      <img
                        src={profilePreview ?? displayPicture!}
                        alt="avatar"
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{initials}</span>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="edit-profile-pic"
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-card border border-border shadow-sm hover:bg-muted transition-colors"
                  >
                    <Camera className="h-3 w-3" />
                  </label>
                  <input
                    id="edit-profile-pic"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setProfilePic(file);
                      setProfilePreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <label htmlFor="edit-profile-pic" className="mt-1 cursor-pointer inline-block text-xs text-amber-500 hover:text-amber-400 font-medium">
                    {profilePreview ? "Change photo" : displayPicture ? "Change photo" : "Upload photo"}
                  </label>
                </div>
              </div>

              <Separator />

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

              <Separator />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Address</p>

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

              {/* GPS */}
              <div className={`rounded-xl border-2 p-3 transition-colors ${
                form.latitude != null ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-dashed border-border bg-muted/30"
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {form.latitude != null ? "Precise location saved" : "Pin precise location"}
                    </p>
                    {form.latitude != null ? (
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        {form.latitude.toFixed(5)}, {form.longitude?.toFixed(5)}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Used to match nearby {user.role === "worker" ? "jobs" : "workers"}</p>
                    )}
                  </div>
                  <Button
                    type="button" size="sm"
                    variant={form.latitude != null ? "outline" : "default"}
                    onClick={useMyLocation} disabled={locating}
                    className={form.latitude == null ? "gradient-amber text-accent-foreground border-0 shrink-0" : "shrink-0"}
                  >
                    <Navigation className="mr-1.5 h-3.5 w-3.5" />
                    {locating ? "Locating..." : form.latitude != null ? "Re-detect" : "Use My Location"}
                  </Button>
                </div>
              </div>

              {/* Worker-only */}
              {user.role === "worker" && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Work Details</p>

                  <div className="space-y-1.5">
                    <Label>Trade Category</Label>
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
                    <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} className="resize-none" placeholder="Tell clients about your experience…" />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
                        placeholder="Press Enter or comma to add"
                      />
                      <Button type="button" variant="outline" onClick={addSkill} disabled={!skillInput.trim()}>Add</Button>
                    </div>
                    {form.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
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
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5" disabled={loggingOut}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{loggingOut ? "Logging out…" : "Sign out"}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out?</AlertDialogTitle>
              <AlertDialogDescription>Your session will end and you'll need to log in again.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sign Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      {/* ── Page body ───────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Hero card ────────────────────────────────────────────────── */}
        <div className="rounded-2xl border bg-card shadow-sm">
          {/* Cover strip — avatar is anchored inside here so it straddles the bottom edge */}
          <div className="relative h-36 gradient-amber rounded-t-2xl">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 60%, white 0%, transparent 55%)" }} />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 24px, rgba(255,255,255,0.15) 24px, rgba(255,255,255,0.15) 25px)"
            }} />

            {/* Avatar — absolute, translates 50% below the cover bottom */}
            <div className="absolute bottom-0 left-6 translate-y-1/2 z-10">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl border-4 border-card shadow-lg overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600">
                  {displayPicture ? (
                    <img
                      src={displayPicture}
                      alt="profile"
                      className="h-full w-full object-cover"
                      onError={() => setDisplayPicture(null)}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{initials}</span>
                    </div>
                  )}
                </div>
                {/* Online dot */}
                <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card" />
              </div>
            </div>
          </div>

          {/* Content — pt-14 leaves room for the avatar that bleeds down from the cover */}
          <div className="px-6 pb-6 pt-14">
            {/* Name + role row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              {/* Name + role */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{displayName}</h1>
                  {user.is_verified && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  )}
                  {roleInfo && (
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {user.email}
                </p>
              </div>

              {/* Auth provider badge */}
              <div className="shrink-0">
                {user.auth_provider === "google" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1">
                    <Shield className="h-3.5 w-3.5" />
                    Password Login
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-amber-400 pl-3 mt-1">
                {user.bio}
              </p>
            )}

            {/* Worker stats row */}
            {user.role === "worker" && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/50 border px-4 py-3 text-center">
                  <Star className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                  <p className="text-xl font-bold">{user.rating ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="rounded-xl bg-muted/50 border px-4 py-3 text-center">
                  <Award className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                  <p className="text-xl font-bold">{user.completed_jobs_count}</p>
                  <p className="text-xs text-muted-foreground">Jobs Done</p>
                </div>
                <div className="rounded-xl bg-muted/50 border px-4 py-3 text-center">
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-green-500" />
                  <p className="text-xl font-bold">{user.is_verified ? "Yes" : "No"}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Two-column body ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column — contact & address */}
          <div className="lg:col-span-2 space-y-4">

            {/* Contact info card */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email address</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>

                {user.phone ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{user.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 opacity-40">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Phone className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-muted-foreground">No phone added</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address card */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Address</h2>
              {(user.address_line1 || user.city) ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 mt-0.5">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      {user.address_line1 && <p className="text-sm font-medium">{user.address_line1}</p>}
                      {user.address_line2 && <p className="text-sm text-muted-foreground">{user.address_line2}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">City</p>
                      <p className="text-sm font-medium">{user.city}</p>
                    </div>
                  </div>
                  {user.postcode && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600">
                        <Hash className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Postcode</p>
                        <p className="text-sm font-medium font-mono">{user.postcode}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No address added yet</p>
                  <button onClick={() => setEditOpen(true)} className="text-xs text-amber-500 hover:text-amber-400 mt-1 font-medium">Add address →</button>
                </div>
              )}
            </div>

            {/* Worker: trade & skills */}
            {user.role === "worker" && (
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Trade & Skills</h2>
                {user.category && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Trade category</p>
                      <p className="text-sm font-medium">{user.category}</p>
                    </div>
                  </div>
                )}
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs px-3 py-1">{s}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Right column — account actions */}
          <div className="space-y-4">

            {/* Account card */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Account</h2>
              <div className="space-y-2.5">

                {/* Member since */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">{new Date(user.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${user.is_active ? "text-green-600" : "text-muted-foreground"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-muted-foreground"}`} />
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Verified */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Verified</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${user.is_verified ? "text-green-600" : "text-muted-foreground"}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {user.is_verified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <Separator className="my-1" />

                {/* Login method */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sign-in method</span>
                  <span className="text-xs font-medium capitalize">{user.auth_provider}</span>
                </div>
              </div>
            </div>

            {/* Security card */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Security</h2>

              {user.auth_provider !== "google" ? (
                <Dialog open={pwOpen} onOpenChange={(o) => { setPwOpen(o); if (!o) { setOtpSent(false); setOtp(""); setNewPw(""); setConfirmPw(""); } }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2" size="sm">
                      <Lock className="h-4 w-4" /> Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      {!otpSent ? (
                        <>
                          <p className="text-sm text-muted-foreground">
                            We'll send a 6-digit code to <strong>{user.email}</strong> to verify it's you.
                          </p>
                          <Button className="w-full gradient-amber text-accent-foreground font-semibold" onClick={handleSendOtp} disabled={sendingOtp}>
                            {sendingOtp ? "Sending…" : "Send Verification Code"}
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground">Enter the code sent to <strong>{user.email}</strong> and your new password.</p>
                          <div className="space-y-1.5">
                            <Label>Verification Code</Label>
                            <Input placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="tracking-widest text-center font-mono text-lg h-11" />
                          </div>
                          <div className="space-y-1.5">
                            <Label>New Password</Label>
                            <div className="relative">
                              <Input type={showNewPw ? "text" : "password"} placeholder="Min 8 chars, 1 uppercase…" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="h-11 pr-10" />
                              <button type="button" tabIndex={-1} onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label>Confirm New Password</Label>
                            <div className="relative">
                              <Input type={showConfirmPw ? "text" : "password"} placeholder="Repeat new password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="h-11 pr-10" />
                              <button type="button" tabIndex={-1} onClick={() => setShowConfirmPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => { setOtpSent(false); setOtp(""); }}>Resend Code</Button>
                            <Button className="flex-1 gradient-amber text-accent-foreground font-semibold" onClick={handleChangePassword} disabled={changingPw}>
                              {changingPw ? "Saving…" : "Save Password"}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground">Password managed by <strong>Google</strong></p>
                </div>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5" disabled={loggingOut}>
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Logging out…" : "Sign Out"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out?</AlertDialogTitle>
                    <AlertDialogDescription>Your session will end and you'll need to log in again.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sign Out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
