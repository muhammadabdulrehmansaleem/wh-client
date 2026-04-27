import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URLS } from "@/config/api.urls";

export default function ResetPassword() {
  const navigate          = useNavigate();
  const [params]          = useSearchParams();
  const token             = params.get("token");

  const [newPw, setNewPw]               = useState("");
  const [confirmPw, setConfirmPw]       = useState("");
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_URLS.AUTH.VERIFY_FORGOT_PASSWORD, {
        token,
        new_password:     newPw,
        confirm_password: confirmPw,
      });
      toast.success("Password reset successfully. Please log in.");
      navigate("/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Invalid / missing token ─────────────────────────────────────────── */
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl gradient-amber flex items-center justify-center shadow-md">
                <span className="text-lg font-extrabold text-accent-foreground">W</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Work<span className="text-amber-500">Hive</span>
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-lg p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-xl font-bold">Invalid reset link</h1>
            <p className="text-sm text-muted-foreground">
              This password reset link is missing or invalid. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Reset form ──────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-amber flex items-center justify-center shadow-md">
              <span className="text-lg font-extrabold text-accent-foreground">W</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Work<span className="text-amber-500">Hive</span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-lg p-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
            <p className="text-sm text-muted-foreground">
              Choose a strong password you haven't used before.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New password */}
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="h-11 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your new password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="h-11 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-amber text-accent-foreground font-semibold"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
