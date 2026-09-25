import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSeo } from "@/lib/seo";
import { getBackend } from "@/lib/backend";
import { Button } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { AuthShell, useNext } from "./AuthShell";

type Errors = Partial<Record<"fullName" | "email" | "password", string>>;

export default function SignUp() {
  useSeo({ title: "Create an account | CloudTech Academy", description: "Create a free CloudTech Academy account to track your progress and earn certificates.", noindex: true });
  const next = useNext();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (fullName.trim().length < 2) e.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email address.";
    if (password.length < 8) e.password = "Use at least 8 characters.";
    return e;
  };

  const submit = async () => {
    setError(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const { needsConfirmation } = await (await getBackend()).signUp({ fullName: fullName.trim(), email: email.trim(), password });
      if (needsConfirmation) setConfirm(true);
      else navigate(next, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create your account.");
    } finally {
      setBusy(false);
    }
  };

  if (confirm)
    return (
      <AuthShell title="Check your email" redirectIfSignedIn={false}>
        <p className="leading-relaxed">
          We've sent a confirmation link to <strong className="font-semibold">{email}</strong>. Open it to activate your account, then sign in.
        </p>
        <Link to={`/sign-in?next=${encodeURIComponent(next)}`} className="mt-5 inline-block font-semibold text-brass-dark">
          Go to sign in
        </Link>
      </AuthShell>
    );

  return (
    <AuthShell
      title="Create your free account"
      intro={
        <>
          Save your progress, take assessments and earn verifiable certificates. Already registered?{" "}
          <Link to={`/sign-in?next=${encodeURIComponent(next)}`} className="font-semibold text-brass-dark underline-offset-2 hover:underline">
            Sign in
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
        <TextField
          label="Full name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          hint="This is the name printed on your certificates."
        />
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <TextField label="Password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} hint="At least 8 characters." />
        <div aria-live="polite">{error && <Alert tone="error">{error}</Alert>}</div>
        <Button type="submit" loading={busy} className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
