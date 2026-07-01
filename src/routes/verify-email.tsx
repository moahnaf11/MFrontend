import { Button } from "@/components/ui/button";
import VerifyEmailToken from "@/features/auth/components/VerifyEmailToken";
import { useRequestEmailVerification } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: VerifyEmailPage,
});

const RESEND_COOLDOWN_SECONDS = 60;
function VerifyEmailPage() {
  const user = useAuthStore((state) => state.user);
  const resendMutation = useRequestEmailVerification();
  const navigate = useNavigate();

  const { token } = Route.useSearch();
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleResend = () => {
    if (!user?.email) {
      toast.error("No email found, please log in again.");
      return;
    }

    resendMutation.mutate(
      { email: user.email },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          startCooldown();
        },
        onError: () => {
          toast.error("Couldn't resend verification email. Try again later.");
        },
      }
    );
  };

  const isDisabled = resendMutation.isPending || cooldown > 0;

  if (!token) {
    // no token = just registered, show "check your inbox" state
    return (
      <div className="min-h-dvh bg-[#faf8ff] text-[#131b2e] flex flex-col antialiased">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-16 pb-8">
          <div className="w-full max-w-100 flex flex-col items-center">
            {/* Icon */}
            <div className="mb-8 sm:mb-10">
              <div className="w-24 h-24 rounded-full bg-[#eaedff] border border-[#c2c6d9]/40 flex items-center justify-center relative shadow-sm">
                <Mail
                  className="text-[#004bca]"
                  size={44}
                  strokeWidth={1.8}
                  fill="none"
                />
                {/* Unread dot */}
                <span className="absolute top-5 right-5 w-3.5 h-3.5 rounded-full bg-[#004bca] border-2 border-[#eaedff]" />
              </div>
            </div>

            {/* Text content */}
            <div className="text-center mb-8 sm:mb-10 px-2">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-[#131b2e] mb-3 leading-tight">
                Verify your email
              </h1>
              <p className="text-[#424656] text-base leading-relaxed max-w-[320px] mx-auto">
                We&apos;ve sent a verification link to your inbox. Please click
                the link to activate your account. If you don&apos;t see it,
                please check your spam folder.
              </p>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={handleResend}
                disabled={isDisabled}
                className="w-full h-12 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 bg-[#004bca] hover:bg-[#003ea8] active:scale-[0.98] text-white shadow-md shadow-[#004bca]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {resendMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span> Sending link...</span>
                  </>
                ) : (
                  <span> Resend link</span>
                )}
              </Button>
              {cooldown > 0 && (
                <p className="text-center text-xs text-[#424656]">
                  You can resend in {cooldown}s
                </p>
              )}

              <Button
                onClick={() => navigate({ to: "/login" })}
                variant="ghost"
                className="w-full h-12 rounded-xl text-sm font-medium text-[#424656] hover:bg-[#eafff1] hover:text-[#131b2e] active:bg-[#dae2fd] transition-all duration-150 gap-2"
              >
                <ArrowLeft size={16} strokeWidth={2} />
                Back to Sign In
              </Button>
            </div>

            {/* Success message */}
            {resendMutation.isSuccess && (
              <p className="mt-4 text-sm text-[#004bca] text-center font-medium animate-pulse">
                {resendMutation.data.message}
              </p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // token present = user clicked the link from their email
  return <VerifyEmailToken token={token}></VerifyEmailToken>;
}
