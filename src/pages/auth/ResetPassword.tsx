import { useState } from "react";
import { Link } from "react-router";
import { useSeo } from "@/lib/seo";
import { getBackend, IS_LIVE } from "@/lib/backend";
import { Button } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AuthShell } from "./AuthShell";

export default function ResetPassword() {
  useSeo({ title: "Reset your password | CloudTech Academy", description: "Reset your CloudTech Academy password.", noindex: true });
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      await (await getBackend()).requestPasswordReset(email.trim());
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send the reset email.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Reset your password" intro="Enter the email you signed up with and we'll send you a link to choose a new password.">
      {sent ? (
        <div className="space-y-4">
          <Alert tone="success">If an account exists for {email.trim()}, a reset link is on its way. Check your inbox and spam folder.</Alert>
          <Link to="/sign-in" className="inline-block font-semibold text-brass-dark">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form
          className="space-y-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          {!IS_LIVE && <Alert>Demo mode can't send emails. Reset links work once the Academy is connected to Supabase.</Alert>}
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div aria-live="polite">{error && <Alert tone="error">{error}</Alert>}</div>
          <Button type="submit" loading={busy} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
