import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();

  if (!token) {
    // no token = just registered, show "check your inbox" state
    return <div>We've sent a verification link to your email.</div>;
  }

  // token present = user clicked the link from their email
  return <div>Email verified</div>;
}
