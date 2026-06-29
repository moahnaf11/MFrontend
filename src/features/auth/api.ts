import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ValidationErrorResponse,
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
