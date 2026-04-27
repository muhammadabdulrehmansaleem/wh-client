import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URLS } from "@/config/api.urls";

export default function ForgotPassword() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await axios.post(API_URLS.AUTH.FORGOT_PASSWORD, { email });
    } catch {
      // Intentionally swallow errors — always show the success message
      // so we don't leak whether the email exists in our system.
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

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
          {submitted ? (
            /* ── Success state ─────────────────────────────────── */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="h-14 w-14 text-amber-500" />
              </div>
              <h1 className="text-xl font-bold">Check your email</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If an account exists for <strong>{email}</strong>, you'll receive a
                password reset link shortly. Check your spam folder if you don't see it.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors mt-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </Link>
            </div>
          ) : (
            /* ── Form ──────────────────────────────────────────── */
            <>
              <div className="mb-6 space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 gradient-amber text-accent-foreground font-semibold"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
