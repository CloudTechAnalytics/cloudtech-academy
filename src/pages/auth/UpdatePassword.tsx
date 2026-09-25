import { useState } from "react";
import { useNavigate } from "react-router";
import { useSeo } from "@/lib/seo";
import { useAuth } from "@/lib/auth";
import { getBackend } from "@/lib/backend";
import { Button } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AuthShell } from "./AuthShell";

/** Where the password reset email lands. Supabase signs the user in from the link first. */
export default function UpdatePassword() {
  useSeo({ title: "Choose a new password | CloudTech Academy", description: "Choose a new password.", noindex: true });
  const auth = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      await (await getBackend()).updatePassword(password);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update your password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Choose a new password" redirectIfSignedIn={false}>
      {auth.status === "signed-out" ? (
        <Alert tone="error">This link has expired or was already used. Request a new one from the reset password page.</Alert>
      ) : (
        <form
          className="space-y-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <TextField label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 8 characters." />
          <TextField label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <div aria-live="polite">{error && <Alert tone="error">{error}</Alert>}</div>
          <Button type="submit" loading={busy} disabled={auth.status === "loading"} className="w-full">
            Save password
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
