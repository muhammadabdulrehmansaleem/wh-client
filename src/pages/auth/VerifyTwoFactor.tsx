import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import authService from "@/services/auth.service";
import { API_URLS } from "@/config/api.urls";

export default function VerifyTwoFactor() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Handle digit input
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const updated = [...code];
    updated[index] = value.slice(-1);
    setCode(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.post(API_URLS.AUTH.VERIFY_TWO_FACTOR, {
        email,
        code: fullCode,
      });

      authService.setAccessToken(data.accessToken);
      const userWithPicture = { ...data.user, profile_picture_url: data.profile_picture_url ?? null };
      authService.setUser(userWithPicture);

      toast.success("Verified! Redirecting...");

      const user = data.user;
      if (!user.profile_complete) {
        navigate("/complete-profile", { replace: true });
      } else if (user.role === "worker") {
        navigate("/worker", { replace: true });
      } else if (user.role === "admin" || user.role === "super_admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/client", { replace: true });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Verification failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await apiClient.post(API_URLS.AUTH.RESEND_TWO_FACTOR_CODE, { email });

      setCode(["", "", "", "", "", ""]);
      setCountdown(120);
      inputRefs.current[0]?.focus();
      toast.success("New verification code sent to your email.");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to resend code.";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg gradient-amber">
            <span className="text-sm font-bold text-accent-foreground">WH</span>
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Check your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>
          </p>
        </div>

        {/* Code inputs */}
        <div className="flex justify-center gap-3 my-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <Input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-12 text-center text-xl font-bold border-2 focus:border-amber-500 focus-visible:ring-amber-400"
            />
          ))}
        </div>

        {/* Timer */}
        <p className="text-center text-sm text-muted-foreground mb-6">
          {countdown > 0 ? (
            <>Code expires in <span className="font-semibold text-amber-600">{formatTime(countdown)}</span></>
          ) : (
            <span className="text-destructive">Code expired. Please resend.</span>
          )}
        </p>

        {/* Verify button */}
        <Button
          onClick={handleVerify}
          disabled={loading || code.join("").length < 6}
          className="w-full gradient-amber text-accent-foreground font-semibold hover:opacity-90"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>

        {/* Resend */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it?{" "}
            <button
              onClick={handleResend}
              disabled={resendLoading || countdown > 0}
              className="font-medium text-accent hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "Resend code"}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link to="/signup" className="font-medium text-accent hover:underline">
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
}
