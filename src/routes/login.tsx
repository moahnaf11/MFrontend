import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  X,
  Zap,
} from "lucide-react";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  loginSchema,
  signupSchema,
  type LoginSchema,
  type SignupSchema,
} from "@/features/auth/schemas";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLogin, useRegister, type LoginError } from "@/features/auth/hooks";
import { toast } from "sonner";
import type { UseMutationResult } from "@tanstack/react-query";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ValidationErrorResponse,
} from "@/features/auth/types";

export const Route = createFileRoute("/login")({
  component: Login,
});
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
type Mode = "signin" | "signup";

function Login() {
  const [mode, setMode] = useState<Mode>("signup");
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const benefits = [
    {
      icon: TrendingUp,
      text: "Discover thousands of listed items across the UAE",
    },
    { icon: Zap, text: "List your items in under 60 seconds" },
    { icon: Shield, text: "Safe, local transactions between buyers & sellers" },
    {
      icon: Sparkles,
      text: "Find great deals on phones, laptops, furniture & more",
    },
  ];

  function onLoginSubmit(data: LoginSchema) {
    loginMutation.mutate(data, {
      onError: (error) => {
        if (error.errors) {
          error.errors.forEach(
            ({ field, message }: { field: string; message: string }) => {
              loginForm.setError(field as keyof LoginSchema, { message });
            }
          );
        } else if (error.statusCode === 401) {
          toast.error(error.message || "Invalid credentials");
        }
      },
    });
  }

  function onSignupSubmit(data: SignupSchema) {
    registerMutation.mutate(data, {
      onError(error) {
        if (error.errors) {
          error.errors.forEach(
            ({ field, message }: { field: string; message: string }) => {
              signupForm.setError(field as keyof SignupSchema, { message });
            }
          );
        }
      },
    });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl auth-transition">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] rounded-2xl bg-surface-container-lowest executive-border shadow-2xl">
          {/* Left: Brand panel */}
          <div className="relative hidden lg:flex flex-col justify-between p-10">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3">
                <>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles
                      className="w-6 h-6 text-primary"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="font-headline text-2xl font-bold tracking-tight">
                    Marketplace
                  </span>
                </>
                <span className="ml-auto">
                  <ThemeToggle />
                </span>
              </div>
            </div>

            <div className="relative space-y-8">
              <div>
                <h2 className="font-headline text-4xl font-extrabold leading-[1.1] tracking-tight">
                  Buy smarter.
                  <br />
                  <span className="text-primary">Sell faster.</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed max-w-sm">
                  Buy and sell pre-owned phones, laptops, furniture, and more,
                  safely and locally across the UAE.
                </p>
              </div>

              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                      <b.icon
                        className="w-4 h-4 text-primary"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="text-sm font-medium">{b.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-primary">
                A % of marketplace earnings will go to charity organizations
                across the UAE.
              </p>
            </div>

            <div className="relative flex items-center gap-3 pt-6 border-t border-outline-variant/40">
              <div className="flex -space-x-2">
                {[
                  "https://i.pravatar.cc/40?img=12",
                  "https://i.pravatar.cc/40?img=32",
                  "https://i.pravatar.cc/40?img=5",
                  "https://i.pravatar.cc/40?img=8",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-8 h-8 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <p className="text-xs">
                <span className="font-semibold">10,000+</span> active buyers &
                sellers in the UAE
              </p>
            </div>
          </div>

          {/* Right: Form panel */}
          <div className="relative bg-surface-container-lowest p-8 sm:p-10 flex flex-col">
            <button
              // onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" strokeWidth={2.5} />
              </div>
              <span className="font-headline text-xl font-bold">
                Marketplace
              </span>
              <span className="">
                <ThemeToggle />
              </span>
            </div>

            <div className="mb-8">
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                {mode === "signup" ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-sm">
                {mode === "signup"
                  ? "Become a buyer/seller in seconds."
                  : "Sign in to continue to the marketplace."}
              </p>
            </div>

            {/* Toggle */}
            <div className="relative flex p-1 mb-7 rounded-xl bg-surface-container-high executive-border">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-primary transition-transform duration-300 ease-out ${
                  mode === "signup"
                    ? "translate-x-0"
                    : "translate-x-[calc(100%+4px)]"
                }`}
              />
              <Button
                variant={mode === "signup" ? "default" : "ghost"}
                onClick={() => setMode("signup")}
                className="relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors"
              >
                Sign up
              </Button>
              <Button
                variant={mode === "signin" ? "default" : "ghost"}
                onClick={() => setMode("signin")}
                className="relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors"
              >
                Sign in
              </Button>
            </div>
            {mode === "signin" ? (
              <SigninForm
                form={loginForm}
                onSubmit={onLoginSubmit}
                loginMutation={loginMutation}
              />
            ) : (
              <SignupForm
                form={signupForm}
                onSubmit={onSignupSubmit}
                registerMutation={registerMutation}
              />
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-surface-container-lowest text-xs text-outline uppercase tracking-wider">
                  or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1">
              {[
                {
                  name: "Google",
                  onClick: () => {
                    window.location.href = `${BASE_URL}/auth/google`;
                  },
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  ),
                },
                // {
                //   name: "GitHub",
                //   svg: (
                //     <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                //       <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.79 1.08.79 2.18v3.24c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                //     </svg>
                //   ),
                // },
                // {
                //   name: "Apple",
                //   svg: (
                //     <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                //       <path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.13.94-3.95.94-.83 0-2.08-.92-3.42-.89-1.76.03-3.39 1.03-4.3 2.61-1.84 3.19-.47 7.9 1.31 10.49.87 1.27 1.91 2.69 3.27 2.64 1.32-.05 1.82-.85 3.41-.85 1.59 0 2.04.85 3.43.83 1.42-.03 2.31-1.29 3.17-2.56 1-1.48 1.41-2.92 1.43-3-.03-.01-2.74-1.05-2.77-4.17-.03-2.6 2.12-3.85 2.22-3.91M14.6 4.59c.73-.88 1.22-2.11 1.09-3.33-1.05.04-2.32.7-3.07 1.58-.68.78-1.27 2.04-1.11 3.23 1.17.09 2.37-.6 3.09-1.48" />
                //     </svg>
                //   ),
                // },
              ].map((p) => (
                <Button
                  onClick={p.onClick}
                  key={p.name}
                  type="button"
                  className="border border-black flex items-center justify-center py-3 rounded-xl hover:border-primary/40 transition-all"
                  aria-label={`Continue with ${p.name}`}
                >
                  {p.svg}
                </Button>
              ))}
            </div>

            <p className="mt-6 text-center text-sm">
              {mode === "signup"
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                onClick={() => {
                  setMode(mode === "signup" ? "signin" : "signup");
                  // setError("");
                }}
                className="font-semibold text-primary hover:text-primary-fixed-dim transition-colors"
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sign in form
// ---------------------------------------------------------------------------

function SigninForm({
  form,
  onSubmit,
  loginMutation,
}: {
  form: UseFormReturn<LoginSchema>;
  onSubmit: (data: LoginSchema) => void;
  loginMutation: UseMutationResult<AuthResponse, LoginError, LoginPayload>;
}) {
  const { control, handleSubmit } = form;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      id="signin-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex-1"
    >
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signin-email">Email address</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                <Input
                  {...field}
                  id="signin-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="pl-11"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary-fixed-dim transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                <Input
                  {...field}
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="group relative w-full py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span> Please wait...</span>
          </>
        ) : loginMutation.isSuccess ? (
          <>
            <Check className="w-4 h-4" strokeWidth={3} />
            <span>Success!</span>
          </>
        ) : (
          <>
            <span>Sign in</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Sign up form
// ---------------------------------------------------------------------------

function SignupForm({
  form,
  onSubmit,
  registerMutation,
}: {
  form: UseFormReturn<SignupSchema>;
  onSubmit: (data: SignupSchema) => void;
  registerMutation: UseMutationResult<
    RegisterResponse,
    ValidationErrorResponse,
    RegisterPayload
  >;
}) {
  const { control, handleSubmit } = form;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form
      id="signup-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex-1"
    >
      <FieldGroup>
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-firstName">First Name</FieldLabel>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                <Input
                  {...field}
                  id="signup-firstName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Mohammad"
                  autoComplete="given-name"
                  className="pl-11"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-lastName">Last Name</FieldLabel>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                <Input
                  {...field}
                  id="signup-lastName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ahnaf"
                  autoComplete="family-name"
                  className="pl-11"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-email">Email address</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                <Input
                  {...field}
                  id="signup-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="pl-11"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                <Input
                  {...field}
                  id="signup-password"
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-confirmPassword">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                <Input
                  {...field}
                  id="signup-confirmPassword"
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={registerMutation.isPending}
        className="group relative w-full py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Please wait...</span>
          </>
        ) : registerMutation.isSuccess ? (
          <>
            <Check className="w-4 h-4" strokeWidth={3} />
            <span>Success!</span>
          </>
        ) : (
          <>
            <span>Create account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>

      <p className="text-xs text-center leading-relaxed">
        By creating an account, you agree to our{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Terms
        </span>{" "}
        and{" "}
        <span className="text-primary hover:underline cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>
    </form>
  );
}
