import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/features/auth/hooks";
import { resetSchema, type ResetSchema } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();

  const resetPasswordForm = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
    defaultValues: {
      token: token ?? "",
      password: "",
      confirmPassword: "",
    },
  });
  const { control, handleSubmit } = resetPasswordForm;
  const resetPasswordMutation = useResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function onResetPassword(data: ResetSchema) {
    resetPasswordMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        if (error.errors) {
          error.errors.forEach(({ field, message }) => {
            resetPasswordForm.setError(field as keyof ResetSchema, {
              message,
            });
          });
        } else {
          toast.error(error.message || "Invalid credentials");
        }
      },
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-xl font-semibold mb-1">Reset Password</h2>
            <span className="">
              <ThemeToggle />
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Create a new, strong password for your account.
          </p>
        </div>

        {resetPasswordMutation.isSuccess ? (
          <div className="text-center space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 px-4 py-6">
              <p className="font-medium text-foreground">
                Password reset successfully!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You can now sign in with your new password.
              </p>
            </div>
            <footer className="flex flex-col items-center gap-3 text-center">
              <Link
                to="/login"
                className="text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Sign In
              </Link>
            </footer>
          </div>
        ) : (
          <form
            id="reset-form"
            onSubmit={handleSubmit(onResetPassword)}
            className="space-y-4 flex-1"
          >
            <FieldGroup>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reset-password">Password</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                      <Input
                        {...field}
                        id="reset-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="pl-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reset-confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                      <Input
                        {...field}
                        id="reset-confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="pl-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="group relative w-full py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : resetPasswordMutation.isSuccess ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={3} />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
