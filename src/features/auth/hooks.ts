import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  loginUser,
  registerUser,
  requestEmailVerification,
  resetPassword,
} from "./api";
import { useAuthStore } from "./store";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "./api";
import type { VerifyEmailResponse } from "./types";
import type {
  AuthResponse,
  GenericAuthMessage,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  RequestEmailVerificationPayload,
  ValidationErrorResponse,
} from "./types";
import { useNavigate } from "@tanstack/react-router";
import type { ForgotPasswordSchema, ResetSchema } from "./schemas";

interface ErrorResponse {
  statusCode: number;
  message: string;
}

export type LoginError = ErrorResponse & ValidationErrorResponse;

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation<AuthResponse, LoginError, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("You have logged in");
      navigate({ to: "/" });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation<
    RegisterResponse,
    ValidationErrorResponse,
    RegisterPayload
  >({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser(data.user);
      navigate({ to: "/verify-email" });
      toast.success("You have registered");
    },
  });
}

export function useRequestEmailVerification() {
  return useMutation<
    GenericAuthMessage,
    Error,
    RequestEmailVerificationPayload
  >({
    mutationFn: requestEmailVerification,
  });
}

export function useVerifyEmail(token: string) {
  return useQuery<VerifyEmailResponse, ErrorResponse>({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail({ token }),
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useForgotPassword() {
  return useMutation<
    GenericAuthMessage,
    ValidationErrorResponse,
    ForgotPasswordSchema
  >({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation<GenericAuthMessage, LoginError, ResetSchema>({
    mutationFn: resetPassword,
  });
}
