import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/features/auth/hooks";

import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Mail,
  RotateCcw,
} from "lucide-react";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const forgotPasswordForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const { control, handleSubmit } = forgotPasswordForm;
  const forgotPasswordMutation = useForgotPassword();

  function onForgotSubmit(data: ForgotPasswordSchema) {
    forgotPasswordMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        if (error.errors) {
          error.errors.forEach(
            ({ field, message }: { field: string; message: string }) => {
              forgotPasswordForm.setError(field as keyof ForgotPasswordSchema, {
                message,
              });
            }
          );
        }
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 md:p-16 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-20">
        <div className="w-150 h-150 rounded-full blur-[120px] bg-blue-600/30" />
      </div>

      <main className="w-full max-w-100 flex flex-col gap-12 relative z-10">
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-md bg-muted border border-border flex items-center justify-center mb-1">
            <RotateCcw className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex gap-3 items-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Forgot Password?
            </h1>
            <span className="">
              <ThemeToggle />
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-75 leading-relaxed">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </header>

        {/* Form Card */}
        <section className="w-full bg-card border border-border rounded-md p-6 shadow-sm">
          {forgotPasswordMutation.isSuccess ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="h-10 w-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs mt-1">
                  {forgotPasswordMutation.data.message}
                </p>
              </div>
            </div>
          ) : (
            <form
              id="signin-form"
              onSubmit={handleSubmit(onForgotSubmit)}
              className="space-y-4 flex-1"
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="forgot-email">
                        Email address
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                        <Input
                          {...field}
                          id="forgot-email"
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="you@company.com"
                          autoComplete="email"
                          className="pl-11"
                        />
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
                disabled={forgotPasswordMutation.isPending}
                className="group relative w-full py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
              >
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span> Please wait...</span>
                  </>
                ) : forgotPasswordMutation.isSuccess ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={3} />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          )}
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-3 text-center">
          <Link
            to="/login"
            className="text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Sign In
          </Link>
        </footer>
      </main>
    </div>
  );
}
