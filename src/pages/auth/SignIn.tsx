import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSeo } from "@/lib/seo";
import { getBackend } from "@/lib/backend";
import { Button } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AuthShell, useNext } from "./AuthShell";

export default function SignIn() {
  useSeo({ title: "Sign in | CloudTech Academy", description: "Sign in to CloudTech Academy to continue learning.", noindex: true });
  const next = useNext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      await (await getBackend()).signIn(email.trim(), password);
      navigate(next, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't sign you in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      intro={
        <>
          New here?{" "}
          <Link to={`/sign-up?next=${encodeURIComponent(next)}`} className="font-semibold text-brass-dark underline-offset-2 hover:underline">
            Create a free account
          </Link>
          .
        </>
      }
    >
      <form
        className="space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div aria-live="polite">{error && <Alert tone="error">{error}</Alert>}</div>
        <Button type="submit" loading={busy} className="w-full">
          Sign in
        </Button>
        <p className="text-center text-[0.875rem]">
          <Link to="/reset-password" className="text-muted underline-offset-2 hover:text-ink hover:underline">
            Forgot your password?
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
