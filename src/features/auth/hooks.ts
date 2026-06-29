import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "./api";
import { useAuthStore } from "./store";
import { toast } from "sonner";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ValidationErrorResponse,
} from "./types";
import { useNavigate } from "@tanstack/react-router";

interface LoginErrorResponse {
  statusCode: number;
  message: string;
}

export type LoginError = LoginErrorResponse & ValidationErrorResponse;

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
