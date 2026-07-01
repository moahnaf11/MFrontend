export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface EmailVerification {
  token: string;
  url: string;
  expiresAt: string;
}

export interface RegisterResponse {
  user: AuthUser;
  emailVerification: EmailVerification;
}

export type UserRole = "CUSTOMER" | "ADMIN" | "SELLER" | "SUPPORT";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  emailVerifiedAt: Date | null;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  errors: FieldError[];
}

export interface RequestEmailVerificationPayload {
  email: string;
}

export interface GenericAuthMessage {
  message: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}
