import type { ForgotPasswordSchema, ResetSchema } from "./schemas";
import type {
  AuthResponse,
  GenericAuthMessage,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  RequestEmailVerificationPayload,
  ValidationErrorResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw errorBody;
  }

  return response.json();
}

export async function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw errorBody as ValidationErrorResponse;
  }

  return response.json();
}

export async function requestEmailVerification(
  payload: RequestEmailVerificationPayload
): Promise<GenericAuthMessage> {
  const response = await fetch(`${BASE_URL}/auth/email-verification/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw errorBody;
  }

  return response.json();
}

export async function verifyEmail(
  payload: VerifyEmailPayload
): Promise<VerifyEmailResponse> {
  const response = await fetch(`${BASE_URL}/auth/email-verification/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw errorBody;
  }

  return response.json();
}

export async function forgotPassword(
  email: ForgotPasswordSchema
): Promise<GenericAuthMessage> {
  const res = await fetch(`${BASE_URL}/auth/password/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

export async function resetPassword(
  data: ResetSchema
): Promise<GenericAuthMessage> {
  const res = await fetch(`${BASE_URL}/auth/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}
