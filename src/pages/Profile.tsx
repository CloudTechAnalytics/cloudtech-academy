import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSeo } from "@/lib/seo";
import { useAuth, RequireAuth } from "@/lib/auth";
import { getBackend } from "@/lib/backend";
import { Button } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";

function ProfileInner() {
  const auth = useAuth();
  const navigate = useNavigate();
  const user = auth.status === "signed-in" ? auth.user : null;
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  useSeo({ title: "Profile | CloudTech Academy", description: "Your account details.", noindex: true });
  if (!user) return null;

  const save = async () => {
    if (fullName.trim().length < 2) return setMessage({ tone: "error", text: "Enter your full name." });
    setBusy(true);
    setMessage(null);
    try {
      await (await getBackend()).updateProfile({ fullName: fullName.trim() });
      setMessage({ tone: "success", text: "Saved. New certificates will use this name." });
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save your profile." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page max-w-xl py-12 sm:py-16">
      <p className="kicker">Account</p>
      <h1 className="mt-3 font-serif text-[2.3rem] leading-tight">Profile</h1>
      <form
        className="mt-8 space-y-5 rounded-2xl border border-line bg-paper p-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <TextField label="Full name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} hint="Printed on certificates you earn from now on. Certificates already issued keep the name they were issued with." />
        <TextField label="Email" type="email" value={user.email} disabled hint="Your sign-in email can't be changed here." />
        <div aria-live="polite">{message && <Alert tone={message.tone}>{message.text}</Alert>}</div>
        <Button type="submit" loading={busy}>
          Save changes
        </Button>
      </form>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem]">
        <Link to="/reset-password" className="font-semibold text-brass-dark">
          Change password
        </Link>
        <button
          type="button"
          className="font-semibold text-muted hover:text-ink"
          onClick={() =>
            void getBackend()
              .then((b) => b.signOut())
              .then(() => navigate("/"))
          }
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  );
}
