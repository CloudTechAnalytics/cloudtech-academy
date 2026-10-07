import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { Check, ExternalLink, MessageCircle } from "lucide-react";
import { getBackend, type CommunitySettings } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { useCommunity } from "@/lib/community";
import { WHATSAPP_URL_RE } from "@/lib/events";
import { Alert, TextArea, TextField } from "@/components/Form";
import { Button, buttonClass } from "@/components/Button";
import { CheckField } from "@/components/FormExtras";
import { AdminHeading } from "./AdminLayout";

type Errors = Partial<Record<"name" | "description" | "whatsappUrl" | "welcomeMessage" | "buttonText" | "isActive", string>>;

function validate(c: CommunitySettings): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 3) e.name = "Give the community a name.";
  if (c.description.trim().length < 10) e.description = "Add a short description (at least 10 characters).";
  if (c.whatsappUrl && !WHATSAPP_URL_RE.test(c.whatsappUrl.trim())) e.whatsappUrl = "Use a WhatsApp invite link, such as https://chat.whatsapp.com/…";
  if (c.isActive && !c.whatsappUrl?.trim()) e.isActive = "Add the WhatsApp invite link before switching the community on.";
  if (c.welcomeMessage.trim().length < 5) e.welcomeMessage = "Add a welcome message.";
  if (!c.buttonText.trim()) e.buttonText = "Add the button text, e.g. Join Community.";
  return e;
}

/** Admin Dashboard → Settings → Community. Everything the Academy shows about the community comes from here. */
export default function AdminSettings() {
  const { refresh } = useCommunity();
  const [saved, setSaved] = useState<CommunitySettings | null>(null);
  const [form, setForm] = useState<CommunitySettings | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getBackend()
      .then((b) => b.admin.getCommunitySettings())
      .then((s) => (setSaved(s), setForm(s)))
      .catch((e: unknown) => setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't load the settings." }));
  }, []);

  if (!form || !saved) return msg ? <Alert tone="error">{msg.text}</Alert> : <PageLoading />;

  const set = <K extends keyof CommunitySettings>(k: K, v: CommunitySettings[K]) => {
    setForm({ ...form, [k]: v });
    setErrors((e) => ({ ...e, [k]: undefined }));
    setMsg(null);
  };
  const changed = JSON.stringify(form) !== JSON.stringify(saved);

  const save = async () => {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setBusy(true);
    try {
      const clean = { ...form, whatsappUrl: form.whatsappUrl?.trim() || null };
      await (await getBackend()).admin.saveCommunitySettings(clean);
      setSaved(clean);
      setForm(clean);
      await refresh(); // every Community button and link now uses the new settings
      setMsg({ tone: "success", text: clean.isActive ? "Saved. Every Community button across the Academy now uses this link." : "Saved. The community is switched off, so its buttons and links are hidden." });
    } catch (err) {
      setMsg({ tone: "error", text: err instanceof Error ? err.message : "Couldn't save." });
    } finally {
      setBusy(false);
    }
  };

  const tab = (isActive: boolean) => `-mb-px border-b-2 px-1 pb-2.5 text-[0.9375rem] ${isActive ? "border-brass-dark font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`;

  return (
    <>
      <AdminHeading title="Settings" />
      <nav aria-label="Settings sections" className="-mt-4 mb-8 flex gap-6 border-b border-line">
        <NavLink to="/admin/settings/community" className={({ isActive }) => tab(isActive)}>
          Community
        </NavLink>
        <NavLink to="/admin/settings/tracking" className={({ isActive }) => tab(isActive)}>
          Tracking and search
        </NavLink>
      </nav>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <form
          noValidate
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <fieldset className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <legend className="px-1 font-serif text-[1.25rem]">The WhatsApp community</legend>
            <div className="mt-2 space-y-4">
              <TextField label="Community name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} maxLength={80} />
              <TextArea label="Short description" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} error={errors.description} maxLength={300} />
              <TextField
                label="WhatsApp Community invite link"
                type="url"
                value={form.whatsappUrl ?? ""}
                onChange={(e) => set("whatsappUrl", e.target.value)}
                error={errors.whatsappUrl}
                placeholder="https://chat.whatsapp.com/…"
                hint={
                  <>
                    In WhatsApp: Community → Invite via link. Change it any time: all buttons update automatically.{" "}
                    {form.whatsappUrl && WHATSAPP_URL_RE.test(form.whatsappUrl.trim()) && (
                      <a href={form.whatsappUrl.trim()} target="_blank" rel="noopener noreferrer" className="font-semibold text-brass-dark">
                        Test it <ExternalLink aria-hidden className="inline h-3 w-3" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </>
                }
              />
              <TextArea label="Welcome message" rows={3} value={form.welcomeMessage} onChange={(e) => set("welcomeMessage", e.target.value)} error={errors.welcomeMessage} maxLength={400} />
              <TextField label="Button text" value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} error={errors.buttonText} maxLength={40} hint="Default: Join Community" />
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <legend className="px-1 font-serif text-[1.25rem]">Status</legend>
            <div className="mt-2 space-y-2">
              <CheckField
                label="Community is active"
                checked={form.isActive}
                onChange={(v) => set("isActive", v)}
                hint="When active, the Join button appears on the homepage, the welcome step after sign-up and the learner dashboard, and the Community link shows in the menu. When inactive, none of these show."
              />
              {errors.isActive && (
                <p role="alert" className="text-[0.8125rem] text-danger">
                  {errors.isActive}
                </p>
              )}
            </div>
          </fieldset>

          <div aria-live="polite">{msg && <Alert tone={msg.tone}>{msg.text}</Alert>}</div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={busy || !changed}>
              {busy ? "Saving…" : "Save settings"}
            </Button>
            {!changed && !msg && <span className="inline-flex items-center gap-1.5 text-[0.875rem] text-muted"><Check aria-hidden className="h-4 w-4" /> All changes saved</span>}
          </div>
        </form>

        <aside aria-label="Preview" className="xl:sticky xl:top-24 xl:self-start">
          <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-muted">What learners see</p>
          <div className={`rounded-2xl border border-line bg-paper p-6 ${form.isActive ? "" : "opacity-60"}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-pale/70 text-brass-dark">
              <MessageCircle aria-hidden className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-serif text-[1.35rem] leading-snug">{form.name || "Community name"}</h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{form.description}</p>
            <span className={`${buttonClass("secondary")} mt-5 pointer-events-none`}>
              <MessageCircle aria-hidden className="h-4 w-4" /> {form.buttonText || "Join Community"}
            </span>
          </div>
          {!form.isActive && <p className="mt-2 text-[0.8125rem] text-muted">Inactive: learners don't see this.</p>}
        </aside>
      </div>
    </>
  );
}
