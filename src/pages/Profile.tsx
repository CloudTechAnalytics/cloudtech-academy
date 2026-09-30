import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSeo } from "@/lib/seo";
import { useAuth, RequireAuth } from "@/lib/auth";
import { getBackend } from "@/lib/backend";
import { Button } from "@/components/Button";
import { Alert, TextField } from "@/components/Form";
import { SITE } from "@/lib/site";
import { PROFILE_SLUG_RE, SLUG_HELP, profilePath, suggestSlug } from "@/lib/profile";

/** Opt-in public skills profile: one link that shows every badge and certificate the learner has earned. */
function PublicProfileSettings({ fullName }: { fullName: string }) {
  const [loaded, setLoaded] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [savedPublic, setSavedPublic] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    void getBackend()
      .then((b) => b.getPublicProfileSettings())
      .then((p) => {
        if (!live) return;
        setIsPublic(p.isPublic);
        setSlug(p.slug || suggestSlug(fullName));
        setHeadline(p.headline);
        setSavedPublic(p.isPublic ? p.slug : null);
        setLoaded(true);
      })
      .catch(() => live && setLoaded(true));
    return () => {
      live = false;
    };
    // Suggest an address from the name only once, when the settings first load.
  }, []);

  const clean = slug.trim().toLowerCase();
  const slugError = clean && !PROFILE_SLUG_RE.test(clean) ? `Use ${SLUG_HELP}` : undefined;

  const save = async () => {
    if (slugError) return;
    setBusy(true);
    setMessage(null);
    try {
      await (await getBackend()).savePublicProfileSettings({ isPublic, slug: clean, headline });
      setSlug(clean);
      setSavedPublic(isPublic ? clean : null);
      setMessage({
        tone: "success",
        text: isPublic ? "Your public profile is live." : "Saved. Your profile is private.",
      });
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save your public profile." });
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) return null;
  return (
    <form
      className="mt-8 space-y-5 rounded-2xl border border-line bg-paper p-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <div>
        <h2 className="font-serif text-[1.35rem] leading-snug">Public skills profile</h2>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">
          One link that shows every badge and certificate you've earned, each with its credential ID. Add it to your CV,
          LinkedIn or portfolio. Your email is never shown.
        </p>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line-strong p-3.5">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--color-brass-dark)]"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <span>
          <span className="block text-[0.9375rem] font-medium text-ink">Make my profile public</span>
          <span className="block text-[0.8125rem] text-muted">Off by default. You can switch it off at any time.</span>
        </span>
      </label>
      <TextField
        label="Profile address"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        error={slugError}
        autoCapitalize="none"
        spellCheck={false}
        maxLength={40}
        hint={
          <>
            {SITE.url.replace(/^https?:\/\//, "")}/learners/
            <strong className="font-semibold text-ink">{clean || "your-name"}</strong>
          </>
        }
      />
      <TextField
        label="Headline (optional)"
        value={headline}
        maxLength={120}
        placeholder="Economics student, University of Lagos · Excel and Power BI"
        onChange={(e) => setHeadline(e.target.value)}
      />
      <div aria-live="polite">{message && <Alert tone={message.tone}>{message.text}</Alert>}</div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button type="submit" loading={busy}>
          Save profile settings
        </Button>
        {savedPublic && (
          <Link to={profilePath(savedPublic)} className="text-[0.9375rem] font-semibold text-brass-dark">
            View my public profile
          </Link>
        )}
      </div>
    </form>
  );
}

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

      <PublicProfileSettings fullName={user.fullName} />

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
