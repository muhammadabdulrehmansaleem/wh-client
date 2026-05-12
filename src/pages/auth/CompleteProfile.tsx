import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  HardHat,
  CheckCircle2,
} from "lucide-react";
import apiClient from "@/lib/axios";
import authService from "@/services/auth.service";
import { API_URLS } from "@/config/api.urls";
import { WORKER_CATEGORIES } from "@/config/categories";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileFormData {
  role: "worker" | "client" | null;
  first_name: string;
  last_name: string;
  phone: string;
  profile_picture: File | null;
  address_line1: string;
  address_line2: string;
  city: string;
  postcode: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  bio: string;
  skills: string[];
  cnic: File | null;
  passport: File | null;
}

const INITIAL_FORM: ProfileFormData = {
  role: null,
  first_name: "",
  last_name: "",
  phone: "",
  profile_picture: null,
  address_line1: "",
  address_line2: "",
  city: "",
  postcode: "",
  latitude: null,
  longitude: null,
  category: "",
  bio: "",
  skills: [],
  cnic: null,
  passport: null,
};

// ─── Step labels (for progress display) ──────────────────────────────────────

const CLIENT_STEPS = ["Role", "Personal Info", "Address"];
const WORKER_STEPS = ["Role", "Personal Info", "Address", "Work Details", "Documents"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompleteProfile() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ProfileFormData>(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // File previews
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [cnicPreview, setCnicPreview] = useState<string | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);

  const steps = formData.role === "worker" ? WORKER_STEPS : CLIENT_STEPS;
  const totalSteps = steps.length;
  const progress = Math.round(((step + 1) / totalSteps) * 100);
  const isLastStep = (formData.role === "client" && step === 2) || step === 4;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const update = (field: keyof ProfileFormData, value: unknown) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange =
    (
      field: "profile_picture" | "cnic" | "passport",
      setPreview: (url: string | null) => void
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      update(field, file);
      setPreview(URL.createObjectURL(file));
    };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      update("skills", [...formData.skills, trimmed]);
    }
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
        // Reverse-geocode to auto-fill address fields
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "User-Agent": "WorkHive/1.0 (workhive.app)" } }
          );
          const data = await res.json();
          if (data?.address) {
            const addr = data.address;
            const line1 = [
              addr.house_number,
              addr.road || addr.pedestrian || addr.footway,
            ]
              .filter(Boolean)
              .join(" ");
            const city =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.county ||
              "";
            const postcode = (addr.postcode || "").split("-")[0].trim();
            if (line1) update("address_line1", line1);
            if (city) update("city", city);
            if (postcode) update("postcode", postcode.toUpperCase());
          }
          toast.success("Precise location detected and address filled in!");
        } catch {
          // coords already saved — address fill-in failed silently
          toast.success("Location detected! Please verify the address fields.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Location access denied. Please allow location in your browser settings.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          toast.error("Location unavailable. Please enter your address manually.");
        } else {
          toast.error("Could not get location. Please enter your address manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return formData.role !== null;
      case 1: return !!(formData.first_name && formData.last_name && formData.phone);
      case 2: return !!(formData.address_line1 && formData.city && formData.postcode);
      case 3: return !!formData.category;
      case 4: return true; // documents optional (required for admin approval, not form submission)
      default: return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (isLastStep) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("role", formData.role!);
      fd.append("first_name", formData.first_name);
      fd.append("last_name", formData.last_name);
      fd.append("phone", formData.phone);
      fd.append("address_line1", formData.address_line1);
      if (formData.address_line2) fd.append("address_line2", formData.address_line2);
      fd.append("city", formData.city);
      fd.append("postcode", formData.postcode);
      if (formData.latitude != null) fd.append("latitude", String(formData.latitude));
      if (formData.longitude != null) fd.append("longitude", String(formData.longitude));
      if (formData.category) fd.append("category", formData.category);
      if (formData.bio) fd.append("bio", formData.bio);
      if (formData.skills.length > 0) fd.append("skills", JSON.stringify(formData.skills));
      if (formData.profile_picture) fd.append("profile_picture", formData.profile_picture);
      if (formData.cnic) fd.append("cnic", formData.cnic);
      if (formData.passport) fd.append("passport", formData.passport);

      const { data } = await apiClient.put(API_URLS.USERS.COMPLETE_PROFILE, fd);
      const updatedUser = { ...data.user, profile_picture_url: data.profile_picture_url ?? null };
      authService.setUser(updatedUser);
      toast.success("Profile completed! Welcome to WorkHive.");
      // Route to role-specific home
      const role = updatedUser.role;
      if (role === "worker") navigate("/worker", { replace: true });
      else if (role === "admin" || role === "super_admin") navigate("/admin", { replace: true });
      else navigate("/client", { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to complete profile.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step renderers ───────────────────────────────────────────────────────────

  const renderStep0 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">How will you use WorkHive?</h2>
        <p className="text-muted-foreground text-sm mt-1">This cannot be changed later.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {(["client", "worker"] as const).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => update("role", role)}
            className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all text-left ${
              formData.role === role
                ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                : "border-border hover:border-amber-300"
            }`}
          >
            <div
              className={`p-3 rounded-full transition-colors ${
                formData.role === role
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {role === "client" ? (
                <Briefcase className="h-5 w-5" />
              ) : (
                <HardHat className="h-5 w-5" />
              )}
            </div>
            <div className="text-center">
              <p className="font-semibold capitalize">{role}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {role === "client"
                  ? "Post jobs & hire workers"
                  : "Find work & get paid"}
              </p>
            </div>
            {formData.role === role && (
              <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-amber-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Personal Information</h2>

      {/* Profile picture */}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0">
          {profilePreview ? (
            <img
              src={profilePreview}
              alt="Preview"
              className="h-20 w-20 rounded-full object-cover border-2 border-amber-500"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
              <Upload className="h-7 w-7 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium">Profile Picture</p>
          <p className="text-xs text-muted-foreground mb-2">Optional · JPEG, PNG, WebP</p>
          <label
            htmlFor="profile-pic-upload"
            className="cursor-pointer inline-flex items-center gap-1.5 text-xs bg-muted px-3 py-1.5 rounded-md hover:bg-muted/80 transition-colors"
          >
            <Upload className="h-3.5 w-3.5" />
            {profilePreview ? "Change Photo" : "Upload Photo"}
          </label>
          <input
            id="profile-pic-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange("profile_picture", setProfilePreview)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            placeholder="John"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => update("last_name", e.target.value)}
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">
          Phone Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+44 7700 900000"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Residential Address</h2>

      <div className="space-y-1.5">
        <Label htmlFor="address_line1">
          Address Line 1 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address_line1"
          value={formData.address_line1}
          onChange={(e) => update("address_line1", e.target.value)}
          placeholder="12 High Street"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address_line2">
          Address Line 2{" "}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <Input
          id="address_line2"
          value={formData.address_line2}
          onChange={(e) => update("address_line2", e.target.value)}
          placeholder="Flat 3B"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="London"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postcode">
            Postcode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postcode"
            value={formData.postcode}
            onChange={(e) => update("postcode", e.target.value.toUpperCase())}
            placeholder="SW1A 2AA"
            maxLength={8}
          />
        </div>
      </div>

      {/* Precise location */}
      <div
        className={`rounded-xl border-2 p-4 space-y-3 transition-colors ${
          formData.latitude != null
            ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
            : "border-dashed border-border bg-muted/30"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 p-2 rounded-full shrink-0 transition-colors ${
              formData.latitude != null
                ? "bg-amber-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <MapPin className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">
              {formData.latitude != null ? "Precise location detected" : "Use my precise location"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formData.latitude != null
                ? "Your address has been filled in automatically."
                : "Let your browser detect your exact location and auto-fill the address above."}
            </p>
            {formData.latitude != null && formData.longitude != null && (
              <p className="text-xs font-mono text-muted-foreground mt-1">
                {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant={formData.latitude != null ? "outline" : "default"}
            size="sm"
            onClick={useMyLocation}
            disabled={locating}
            className={`shrink-0 ${
              formData.latitude == null
                ? "bg-amber-500 hover:bg-amber-600 text-white border-0"
                : ""
            }`}
          >
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            {locating ? "Locating..." : formData.latitude != null ? "Re-detect" : "Allow Location"}
          </Button>
        </div>
        {formData.latitude == null && (
          <p className="text-[11px] text-muted-foreground pl-11">
            Your browser will ask for permission — this is used only to match you with nearby{" "}
            {formData.role === "worker" ? "jobs" : "workers"}.
          </p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Work Details</h2>

      <div className="space-y-1.5">
        <Label>
          Service Category <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.category}
          onValueChange={(val) => update("category", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your main service category" />
          </SelectTrigger>
          <SelectContent>
            {WORKER_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">
          Bio{" "}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="Tell clients about your experience and what makes you stand out..."
          className="resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label>
          Skills{" "}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="e.g. Boiler repair — press Enter to add"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addSkill}
            disabled={!skillInput.trim()}
          >
            Add
          </Button>
        </div>
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1.5 pr-1.5">
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "skills",
                      formData.skills.filter((s) => s !== skill)
                    )
                  }
                  className="rounded-full hover:bg-muted transition-colors p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Identity Documents</h2>
        <p className="text-muted-foreground text-sm mt-1">
          JPEG, PNG, PDF · Max 10 MB each
        </p>
      </div>

      {/* CNIC */}
      <div className="space-y-2">
        <Label>
          CNIC (National ID){" "}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <label
          htmlFor="cnic-upload"
          className={`flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            cnicPreview
              ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
              : "border-border hover:border-amber-300"
          }`}
        >
          {cnicPreview ? (
            <img
              src={cnicPreview}
              alt="CNIC"
              className="h-12 w-20 object-cover rounded"
            />
          ) : (
            <div className="h-12 w-20 bg-muted rounded flex items-center justify-center">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium">
              {cnicPreview ? "CNIC uploaded ✓" : "Upload CNIC"}
            </p>
            <p className="text-xs text-muted-foreground">Click to browse</p>
          </div>
        </label>
        <input
          id="cnic-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={handleFileChange("cnic", setCnicPreview)}
        />
      </div>

      {/* Passport */}
      <div className="space-y-2">
        <Label>
          Passport{" "}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <label
          htmlFor="passport-upload"
          className={`flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            passportPreview
              ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
              : "border-border hover:border-amber-300"
          }`}
        >
          {passportPreview ? (
            <img
              src={passportPreview}
              alt="Passport"
              className="h-12 w-20 object-cover rounded"
            />
          ) : (
            <div className="h-12 w-20 bg-muted rounded flex items-center justify-center">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium">
              {passportPreview ? "Passport uploaded ✓" : "Upload Passport"}
            </p>
            <p className="text-xs text-muted-foreground">Click to browse</p>
          </div>
        </label>
        <input
          id="passport-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={handleFileChange("passport", setPassportPreview)}
        />
      </div>

      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          You can submit now and upload documents later from your profile settings.
          Your account will remain pending until documents are verified by our team.
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 0: return renderStep0();
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Logo + heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg gradient-amber">
            <span className="text-sm font-bold text-accent-foreground">WH</span>
          </div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          {step > 0 && (
            <p className="text-muted-foreground mt-1 text-sm">
              {steps[step]} — Step {step + 1} of {totalSteps}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {step > 0 && <Progress value={progress} className="mb-6 h-1.5" />}

        {/* Step card */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="mt-5 flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep((s) => s - 1)}
              disabled={submitting}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          )}
          <Button
            className="flex-1 gradient-amber text-accent-foreground font-semibold"
            onClick={handleNext}
            disabled={!canProceed() || submitting}
          >
            {submitting ? (
              "Saving..."
            ) : isLastStep ? (
              "Complete Profile"
            ) : (
              <>
                {step === 0 ? "Get Started" : "Continue"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
