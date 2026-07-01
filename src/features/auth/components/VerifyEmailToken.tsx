import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useVerifyEmail } from "../hooks";

const VerifyEmailToken = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const { isPending, isError, isSuccess, error } = useVerifyEmail(token);
  console.log(isPending, isError, isSuccess, error);

  if (isPending) {
    return (
      <div
        className="min-h-dvh w-full flex flex-col items-center justify-center antialiased gap-4"
        style={{ backgroundColor: "#faf8ff", color: "#131b2e" }}
      >
        <Loader2
          className="w-10 h-10 animate-spin"
          style={{ color: "#0052dc" }}
        />
        <p className="text-[16px]" style={{ color: "#555c72" }}>
          Verification in progress...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-h-dvh w-full flex flex-col items-center justify-center antialiased gap-4 px-4 text-center"
        style={{ backgroundColor: "#faf8ff", color: "#131b2e" }}
      >
        <h2 className="text-[22px] font-bold">Verification Failed</h2>
        <p className="text-[16px]" style={{ color: "#555c72" }}>
          This link may be invalid or expired. Please request a new one.
        </p>
        <Button onClick={() => navigate({ to: "/verify-email" })}>
          Back to Verify Email
        </Button>
        <Button onClick={() => navigate({ to: "/login" })}>
          Back to Sign In
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div
        className="min-h-dvh w-full flex flex-col items-center antialiased"
        style={{ backgroundColor: "#faf8ff", color: "#131b2e" }}
      >
        <main className="flex-1 w-full flex flex-col items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm flex flex-col items-center gap-8">
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center animate-[scale-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]"
              style={{ backgroundColor: "#dbe4ff" }}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{
                  backgroundColor: "#a8bcff",
                  animationDuration: "2.4s",
                }}
              />
              <CheckCircle2
                size={52}
                strokeWidth={2}
                style={{ color: "#0052dc" }}
              />
            </div>

            <div className="text-center flex flex-col gap-3 w-full animate-[fade-up_0.6s_ease-out_0.25s_forwards]">
              <h2
                className="text-[22px] font-bold leading-[1.3] tracking-[-0.01em]"
                style={{ color: "#131b2e" }}
              >
                Verification Successful
              </h2>
              <p
                className="text-[16px] leading-[1.6] px-2"
                style={{ color: "#555c72" }}
              >
                Your email has been verified. You can now access all features of
                the marketplace.
              </p>
            </div>

            <div className="w-full animate-[fade-up_0.6s_ease-out_0.45s_forwards] pt-2">
              <Button
                onClick={() => navigate({ to: "/" })}
                className="w-full h-14 text-[16px] font-semibold rounded-[6px] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-sm"
                style={{
                  backgroundColor: "#0052dc",
                  color: "#ffffff",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#0044c0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#0052dc";
                }}
              >
                Continue to MarketPlace
                <ArrowRight size={18} strokeWidth={2.2} />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default VerifyEmailToken;
