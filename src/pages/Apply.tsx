import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Award, BookOpen, CalendarDays, CheckCircle2, Clock, Copy, MapPin, MessageCircle, ShieldCheck, Users, Wallet } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useAuth } from "@/lib/auth";
import { useProgrammes, useCourses } from "@/lib/data";
import { getBackend, type ApplicationReceipt, type Experience, type Occupation, type ProgrammeBatch } from "@/lib/backend";
import { DELIVERY_LABEL, ENROLMENT_MESSAGE, coursePrice, enrolmentState, formatPrice, isPaid, programmeCourseIds } from "@/lib/commerce";
import { whatsappLink } from "@/lib/site";
import { capstoneOf, type Track } from "@/content/tracks";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import NotFound from "./NotFound";

/**
 * The shareable enrolment form for a Professional Programme: /apply/<programme>. No account needed. It shows the
 * next batches, the fee and the payment plan, takes the application, and then shows how to pay and a WhatsApp
 * button to send the proof. An admin records the payment, which opens the programme.
 */

const selectCls = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-[1rem] text-ink";

const OCCUPATIONS: [Occupation, string][] = [
  ["student", "Student"],
  ["professional", "Working professional"],
  ["business_owner", "Business owner"],
  ["job_seeker", "Looking for a job"],
  ["other", "Something else"],
];
const EXPERIENCE: [Experience, string][] = [
  ["none", "New to this"],
  ["some", "I know a little"],
  ["experienced", "I already work with it"],
];
const HEARD = ["WhatsApp", "Instagram", "Facebook", "LinkedIn", "TikTok", "X (Twitter)", "A friend or colleague", "Google search", "An event or class", "Other"];

const date = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
const MODE = { online: "Online", physical: "In person", hybrid: "Hybrid (online and in person)" } as const;

function BatchCard({ b, selected, onSelect, single }: { b: ProgrammeBatch; selected: boolean; onSelect: () => void; single: boolean }) {
  const left = b.seats === null ? null : Math.max(0, b.seats - b.seatsTaken);
  const full = left === 0;
  const body = (
    <span className="block">
      <span className="block font-semibold text-ink">{b.name}</span>
      <span className="mt-1.5 grid gap-1 text-[0.875rem] text-ink/80">
        {b.startsOn && (
          <span className="flex items-center gap-2">
            <CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-brass-dark" /> Starts {date(b.startsOn)}
          </span>
        )}
        {b.schedule && (
          <span className="flex items-center gap-2">
            <Clock aria-hidden className="h-4 w-4 shrink-0 text-brass-dark" /> {b.schedule}
          </span>
        )}
        <span className="flex items-center gap-2">
          <MapPin aria-hidden className="h-4 w-4 shrink-0 text-brass-dark" /> {MODE[b.mode]}
          {b.location && b.mode !== "online" ? `: ${b.location}` : ""}
        </span>
        {(left !== null || b.applyBy) && (
          <span className="flex items-center gap-2">
            <Users aria-hidden className="h-4 w-4 shrink-0 text-brass-dark" />
            {[left !== null ? (full ? "Full" : `${left} ${left === 1 ? "seat" : "seats"} left`) : null, b.applyBy ? `apply by ${date(b.applyBy)}` : null].filter(Boolean).join(" · ")}
          </span>
        )}
      </span>
    </span>
  );
  if (single) return <div className="rounded-xl border border-brass bg-brass-pale/30 p-4">{body}</div>;
  return (
    <label className={`flex gap-3 rounded-xl border p-4 ${full ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${selected ? "border-brass bg-brass-pale/30" : "border-line-strong"}`}>
      <input type="radio" name="batch" checked={selected} disabled={full} onChange={onSelect} className="mt-1 h-4 w-4 accent-(--color-brass-dark)" />
      {body}
    </label>
  );
}

function Receipt({ r }: { r: ApplicationReceipt }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* the number is on screen to copy by hand */
    }
  };
  const due = r.plan === "two_part" && r.firstAmount !== null ? r.firstAmount : r.amount;
  const message = [
    "Hello CloudTech Academy,",
    `I've applied for ${r.programme}.`,
    `Reference: ${r.reference}`,
    `Name: ${r.fullName}`,
    ...(r.batch ? [`Batch: ${r.batch}`] : []),
    `Payment: ${formatPrice(due, r.currency)}${r.plan === "two_part" ? " (first part)" : ""}`,
    "Here is my proof of payment:",
  ].join("\n");
  return (
    <div className="container-page py-12 sm:py-16">
      <p className="flex items-center gap-2 font-semibold text-success">
        <CheckCircle2 aria-hidden className="h-5 w-5" /> Application received
      </p>
      <h1 className="mt-3 font-serif text-[2.3rem] leading-tight">Thank you, {r.fullName.split(" ")[0]}</h1>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">
        Your place in {r.programme} is reserved once you pay. We've also sent these details to <strong className="text-ink">{r.email}</strong>.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="rounded-2xl border border-line-strong bg-paper p-6">
        <p className="kicker">Your reference</p>
        <p className="mt-1 font-mono text-[1.6rem] font-semibold tracking-wide">{r.reference}</p>
        <p className="mt-1 text-[0.875rem] text-muted">Use it as the narration when you transfer, and when you message us.</p>
        <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-[0.9375rem] sm:grid-cols-2">
          <div>
            <dt className="text-muted">Programme</dt>
            <dd className="font-medium">{r.programme}</dd>
          </div>
          <div>
            <dt className="text-muted">Batch</dt>
            <dd className="font-medium">{r.batch ?? "Next batch (we'll confirm the dates)"}</dd>
          </div>
          <div>
            <dt className="text-muted">Programme fee</dt>
            <dd className="font-medium">
              {formatPrice(r.amount, r.currency)}
              {r.listAmount > r.amount && <s className="ml-2 text-subtle">{formatPrice(r.listAmount, r.currency)}</s>}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Pay now</dt>
            <dd className="font-serif text-[1.4rem] leading-tight">{formatPrice(due, r.currency)}</dd>
            {r.plan === "two_part" && r.secondAmount !== null && (
              <dd className="text-[0.8125rem] text-muted">
                Then {formatPrice(r.secondAmount, r.currency)} within {r.secondDueDays} days.
              </dd>
            )}
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-line-strong bg-paper p-6">
        <h2 className="flex items-center gap-2 font-serif text-[1.5rem]">
          <Wallet aria-hidden className="h-5 w-5 text-brass-dark" /> How to pay
        </h2>
        {r.accounts.length ? (
          <ul className="mt-4 space-y-3">
            {r.accounts.map((a) => (
              <li key={`${a.label}${a.accountNumber}`} className="rounded-xl border border-line p-4">
                <p className="font-semibold">{a.label}</p>
                {a.bankName && <p className="mt-1 text-[0.9375rem]">{a.bankName}</p>}
                {a.accountName && <p className="text-[0.9375rem]">{a.accountName}</p>}
                {a.accountNumber && (
                  <p className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[1.25rem] font-semibold tracking-wider">{a.accountNumber}</span>
                    <button type="button" onClick={() => void copy(a.accountNumber!)} className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-brass-dark">
                      <Copy aria-hidden className="h-3.5 w-3.5" /> {copied === a.accountNumber ? "Copied" : "Copy"}
                    </button>
                  </p>
                )}
                {a.instructions && <p className="mt-2 text-[0.875rem] text-muted">{a.instructions}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[0.9375rem] text-muted">Message us on WhatsApp and we'll send the account details.</p>
        )}
        {r.instructions && <p className="mt-4 whitespace-pre-line text-[0.9375rem] text-ink/85">{r.instructions}</p>}
        <ol className="mt-5 list-decimal space-y-1.5 pl-5 text-[0.9375rem] text-ink/85">
          <li>
            Transfer {formatPrice(due, r.currency)} with <strong>{r.reference}</strong> as the narration.
          </li>
          <li>Send us your proof of payment on WhatsApp.</li>
          <li>We confirm your place and email you a link to start.</li>
        </ol>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={`${buttonClass("primary")} mt-6 w-full sm:w-auto`}>
          <MessageCircle aria-hidden className="h-4 w-4" /> Send proof on WhatsApp
        </a>
      </div>
      </div>
    </div>
  );
}

function ApplyForm({ track }: { track: Track }) {
  const auth = useAuth();
  const courses = useCourses();
  const [batches, setBatches] = useState<ProgrammeBatch[] | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [occupation, setOccupation] = useState<Occupation | "">("");
  const [experience, setExperience] = useState<Experience | "">("");
  const [plan, setPlan] = useState<"full" | "two_part">("full");
  const [heardFrom, setHeardFrom] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);

  useEffect(() => {
    let alive = true;
    void getBackend()
      .then((b) => b.listProgrammeBatches(track.id))
      .then((list) => {
        if (!alive) return;
        setBatches(list);
        const firstOpen = list.find((b) => b.seats === null || b.seatsTaken < b.seats);
        setBatchId(firstOpen?.id ?? null);
      })
      .catch(() => alive && setBatches([]));
    return () => {
      alive = false;
    };
  }, [track.id]);

  useEffect(() => {
    if (auth.user) {
      setFullName((v) => v || auth.user!.fullName);
      setEmail((v) => v || auth.user!.email);
    }
  }, [auth.user]);

  useEffect(() => {
    if (receipt) window.scrollTo(0, 0);
  }, [receipt]);

  if (receipt) return <Receipt r={receipt} />;

  const name = track.programmeName ?? track.title;
  const price = coursePrice(track);
  const state = enrolmentState(track);
  const open = !!price && state === "open";
  const first = price && track.allowInstalments ? Math.round(price.amount * (track.firstPercent ?? 50)) / 100 : null;
  const capstone = capstoneOf(track);
  const count = programmeCourseIds(track).filter((id) => courses.some((c) => c.id === id)).length;
  const facts = [
    ...(track.durationLabel ? [`${track.durationLabel}`] : []),
    ...(track.deliveryType ? [DELIVERY_LABEL[track.deliveryType]] : []),
    `${count} courses in one structured programme`,
    ...(capstone ? ["Capstone project for your portfolio"] : []),
    ...(track.instructorSupport ? ["Instructor support"] : []),
    ...(track.communityAccess ? ["CloudTech WhatsApp community"] : []),
    ...(track.included ?? []),
  ];

  const submit = async () => {
    setError(null);
    if (fullName.trim().length < 3) return setError("Enter your full name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (whatsapp.replace(/[^0-9]/g, "").length < 7) return setError("Enter your WhatsApp number.");
    if (!occupation) return setError("Tell us what you do now.");
    if (!experience) return setError("Tell us your experience level.");
    if (batches?.length && !batchId) return setError("Choose the batch you want to join.");
    setBusy(true);
    try {
      const r = await (await getBackend()).submitProgrammeApplication({
        trackId: track.id,
        batchId,
        fullName,
        email,
        whatsapp,
        occupation,
        experience,
        plan,
        heardFrom,
        message,
      });
      setReceipt(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send your application. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const chosen = batches?.find((b) => b.id === batchId) ?? null;
  const dueNow = price ? (plan === "two_part" && first !== null ? first : price.amount) : 0;
  const chips = [
    ...(track.durationLabel ? [{ icon: Clock, label: track.durationLabel }] : []),
    ...(track.deliveryType ? [{ icon: MapPin, label: DELIVERY_LABEL[track.deliveryType] }] : []),
    { icon: BookOpen, label: `${count} courses` },
    ...(capstone ? [{ icon: Award, label: "Capstone project" }] : []),
    ...(track.instructorSupport ? [{ icon: Users, label: "Instructor support" }] : []),
  ];
  const step = (n: number, title: string, note?: string) => (
    <legend className="flex w-full items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brass text-[0.875rem] font-semibold text-on-brass">{n}</span>
      <span>
        <span className="block font-serif text-[1.4rem] leading-tight">{title}</span>
        {note && <span className="block text-[0.8125rem] text-muted">{note}</span>}
      </span>
    </legend>
  );

  return (
    <>
      {/* Programme banner */}
      <section className="border-b border-line bg-night text-cream">
        <div className="container-page grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:py-16 xl:grid-cols-[minmax(0,1fr)_28rem]">
          <div>
            <Link to={`/programmes/${track.slug}`} className="text-[0.875rem] text-cream/70 hover:text-cream">
              ← About the programme
            </Link>
            <p className="mt-6 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brass-light">Professional Programme · Enrolment</p>
            <h1 className="mt-3 font-serif text-[2.6rem] leading-[1.05] sm:text-[3.4rem]">{name}</h1>
            <p className="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-cream/75">{track.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <li key={c.label} className="flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3.5 py-1.5 text-[0.875rem]">
                  <c.icon aria-hidden className="h-4 w-4 text-brass-light" /> {c.label}
                </li>
              ))}
            </ul>
          </div>
          {price && (
            <div className="rounded-2xl border border-cream/15 bg-cream/5 p-6">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-cream/60">Programme fee</p>
              <p className="mt-2 flex flex-wrap items-baseline gap-3">
                <span className="font-serif text-[2.6rem] leading-none">{formatPrice(price.amount, price.currency)}</span>
                {price.discounted && <s className="text-cream/50">{formatPrice(price.listAmount, price.currency)}</s>}
                {price.label && <span className="rounded-full bg-brass px-2.5 py-0.5 text-[0.75rem] font-semibold text-on-brass">{price.label}</span>}
              </p>
              {first !== null && (
                <p className="mt-3 text-[0.9375rem] text-cream/80">
                  Or two parts: <strong className="text-cream">{formatPrice(first, price.currency)}</strong> to start, then {formatPrice(price.amount - first, price.currency)} within{" "}
                  {track.secondDueDays ?? 30} days.
                </p>
              )}
              <p className="mt-4 flex items-center gap-2 border-t border-cream/15 pt-4 text-[0.875rem] text-cream/70">
                <CheckCircle2 aria-hidden className="h-4 w-4 text-brass-light" /> Takes about 3 minutes. No account needed.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="container-page py-10 lg:py-14">
        {/* How it works */}
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ["Apply", "Choose your batch and payment plan, and tell us a little about you."],
            ["Pay", "Transfer the fee (or the first part) with your reference, and send us the proof."],
            ["Start learning", "We confirm your place and open your classroom: courses, live classes and assignments."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4 rounded-2xl border border-line bg-paper p-5">
              <span className="font-serif text-[1.8rem] leading-none text-brass-dark">{i + 1}</span>
              <span>
                <span className="block font-semibold">{t}</span>
                <span className="mt-0.5 block text-[0.875rem] text-muted">{d}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div className="rounded-2xl border border-line-strong bg-paper p-6 shadow-[0_30px_60px_-45px_rgba(23,23,23,0.45)] sm:p-8">
            {!open ? (
              <>
                <h2 className="font-serif text-[1.6rem]">Applications aren't open right now</h2>
                <p className="mt-2 text-muted">{state !== "open" ? ENROLMENT_MESSAGE[state] : "Enrolment opens soon."} Message us on WhatsApp and we'll tell you when the next batch opens.</p>
                <a href={whatsappLink(`Hello CloudTech Academy, I'm interested in ${name}. When does the next batch start?`)} target="_blank" rel="noopener noreferrer" className={`${buttonClass("primary")} mt-5`}>
                  <MessageCircle aria-hidden className="h-4 w-4" /> Message us on WhatsApp
                </a>
              </>
            ) : (
              <form
                noValidate
                className="space-y-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <fieldset>
                  {step(1, "Choose your batch", "When you'll start and how classes run.")}
                  {batches === null ? (
                    <p className="mt-4 text-muted">Loading batches…</p>
                  ) : batches.length ? (
                    <div className={`mt-4 grid gap-3 ${batches.length > 1 ? "md:grid-cols-2" : ""}`}>
                      {batches.map((b) => (
                        <BatchCard key={b.id} b={b} single={batches.length === 1} selected={batchId === b.id} onSelect={() => setBatchId(b.id)} />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-xl border border-line bg-sand/60 p-4 text-[0.9375rem] text-ink/85">
                      Next batch: dates announced soon. Apply now to reserve your place, and we'll confirm the start date and class times with you on WhatsApp.
                    </p>
                  )}
                </fieldset>

                <fieldset>
                  {step(2, "Your details", "We'll send your reference and payment details to your email.")}
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextField label="Full name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <TextField label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField
                      label="WhatsApp number"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="0803 000 0000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      hint="Add your country code if you're outside Nigeria, e.g. +44."
                    />
                    <div>
                      <label htmlFor="occupation" className="text-[0.875rem] font-medium">
                        What do you do now?
                      </label>
                      <select id="occupation" className={selectCls} value={occupation} onChange={(e) => setOccupation(e.target.value as Occupation)}>
                        <option value="">Choose one</option>
                        {OCCUPATIONS.map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="experience" className="text-[0.875rem] font-medium">
                        Your experience with this field
                      </label>
                      <select id="experience" className={selectCls} value={experience} onChange={(e) => setExperience(e.target.value as Experience)}>
                        <option value="">Choose one</option>
                        {EXPERIENCE.map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="heard" className="text-[0.875rem] font-medium">
                        How did you hear about us? <span className="font-normal text-muted">(optional)</span>
                      </label>
                      <select id="heard" className={selectCls} value={heardFrom} onChange={(e) => setHeardFrom(e.target.value)}>
                        <option value="">Choose one</option>
                        {HEARD.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </fieldset>

                {price && (
                  <fieldset>
                    {step(3, "How you'll pay")}
                    <div className={`mt-4 grid gap-3 ${first !== null ? "md:grid-cols-2" : ""}`}>
                      <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-5 ${plan === "full" ? "border-brass bg-brass-pale/30" : "border-line-strong hover:border-ink/40"}`}>
                        <input type="radio" name="plan" checked={plan === "full"} onChange={() => setPlan("full")} className="mt-1 h-4 w-4 accent-(--color-brass-dark)" />
                        <span>
                          <span className="block font-semibold">Pay in full</span>
                          <span className="mt-1 block font-serif text-[1.5rem] leading-none">{formatPrice(price.amount, price.currency)}</span>
                          <span className="mt-1 block text-[0.875rem] text-muted">One payment.</span>
                        </span>
                      </label>
                      {first !== null && (
                        <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-5 ${plan === "two_part" ? "border-brass bg-brass-pale/30" : "border-line-strong hover:border-ink/40"}`}>
                          <input type="radio" name="plan" checked={plan === "two_part"} onChange={() => setPlan("two_part")} className="mt-1 h-4 w-4 accent-(--color-brass-dark)" />
                          <span>
                            <span className="block font-semibold">Pay in two parts</span>
                            <span className="mt-1 block font-serif text-[1.5rem] leading-none">{formatPrice(first, price.currency)} now</span>
                            <span className="mt-1 block text-[0.875rem] text-muted">
                              Then {formatPrice(price.amount - first, price.currency)} within {track.secondDueDays ?? 30} days.
                            </span>
                          </span>
                        </label>
                      )}
                    </div>
                  </fieldset>
                )}

                <fieldset>
                  {step(price ? 4 : 3, "Anything else?", "Optional.")}
                  <div className="mt-4">
                    <TextArea label="Your goals, questions, or the best time to reach you" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>
                </fieldset>

                <div className="space-y-3 border-t border-line pt-6">
                  <div aria-live="polite">{error && <Alert tone="error">{error}</Alert>}</div>
                  <Button type="submit" loading={busy} className="w-full sm:w-auto sm:px-10">
                    Submit application
                  </Button>
                  <p className="text-[0.8125rem] text-muted">Next, you'll see your reference and exactly how to pay.</p>
                </div>
              </form>
            )}
          </div>

          {/* Summary */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-2xl border border-line-strong bg-paper p-6">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-muted">Your enrolment</p>
              <p className="mt-2 font-serif text-[1.3rem] leading-snug">{name}</p>
              <dl className="mt-4 space-y-3 border-t border-line pt-4 text-[0.9375rem]">
                <div>
                  <dt className="text-[0.8125rem] text-muted">Batch</dt>
                  <dd className="font-medium">
                    {chosen ? (
                      <>
                        {chosen.name}
                        {chosen.startsOn && <span className="block text-[0.875rem] font-normal text-muted">Starts {date(chosen.startsOn)}</span>}
                      </>
                    ) : (
                      "Next batch (dates to be confirmed)"
                    )}
                  </dd>
                </div>
                {price && (
                  <>
                    <div>
                      <dt className="text-[0.8125rem] text-muted">Payment plan</dt>
                      <dd className="font-medium">{plan === "two_part" ? "Two parts" : "In full"}</dd>
                    </div>
                    <div className="flex items-end justify-between gap-3 border-t border-line pt-3">
                      <dt className="text-[0.875rem] text-muted">Pay now</dt>
                      <dd className="font-serif text-[1.8rem] leading-none">{formatPrice(dueNow, price.currency)}</dd>
                    </div>
                    {plan === "two_part" && first !== null && (
                      <p className="text-[0.8125rem] text-muted">
                        Then {formatPrice(price.amount - first, price.currency)} within {track.secondDueDays ?? 30} days.
                      </p>
                    )}
                  </>
                )}
              </dl>
            </section>
            <section className="rounded-2xl border border-line bg-paper p-6">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-muted">What's included</p>
              <ul className="mt-3 space-y-2">
                {facts.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.9375rem]">
                    <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {f}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-line bg-paper p-6">
              <p className="font-semibold">Questions before you apply?</p>
              <p className="mt-1 text-[0.875rem] text-muted">We reply on WhatsApp, usually within a few hours.</p>
              <a href={whatsappLink(`Hello CloudTech Academy, I have a question about ${name}.`)} target="_blank" rel="noopener noreferrer" className={`${buttonClass("secondary")} mt-4 w-full`}>
                <MessageCircle aria-hidden className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}

/** /apply/:slug is the form; /apply lists the programmes taking applications. */
export default function Apply() {
  const { slug } = useParams();
  const programmes = useProgrammes();
  const paid = programmes.filter((t) => isPaid(t));
  const track = slug ? paid.find((t) => t.slug === slug) : null;
  useSeo({
    title: track ? `Apply | ${track.programmeName ?? track.title} | CloudTech Academy` : "Apply for a Professional Programme | CloudTech Academy",
    description: track ? `Enrol in ${track.programmeName ?? track.title}: batches, fees and payment plans.` : "Apply for a CloudTech Academy Professional Programme.",
  });

  if (slug) return track ? <ApplyForm track={track} /> : <NotFound />;

  return (
    <div className="container-page py-12 sm:py-16">
      <p className="kicker">Professional Programmes</p>
      <h1 className="mt-3 font-serif text-[2.4rem] leading-tight">Apply for a programme</h1>
      <p className="mt-3 text-[1.0625rem] text-muted">Choose your programme to see the next batch, the fee and the payment plans.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {paid.map((t) => {
          const price = coursePrice(t);
          const open = !!price && enrolmentState(t) === "open";
          return (
            <li key={t.id} className="flex flex-col rounded-2xl border border-line-strong bg-paper p-5">
              <p className="font-serif text-[1.35rem] leading-snug">{t.programmeName ?? t.title}</p>
              <p className="mt-1 text-[0.9375rem] text-muted">{t.outcome}</p>
              <p className="mt-3 text-[0.9375rem]">
                {open ? (
                  <>
                    <strong>{formatPrice(price!.amount, price!.currency)}</strong>
                    {t.durationLabel ? ` · ${t.durationLabel}` : ""}
                  </>
                ) : (
                  <span className="text-muted">Opens soon</span>
                )}
              </p>
              <div className="mt-auto pt-4">
                {open ? (
                  <ButtonLink to={`/apply/${t.slug}`} className="w-full">
                    Apply now
                  </ButtonLink>
                ) : (
                  <ButtonLink to={`/programmes/${t.slug}`} variant="secondary" className="w-full">
                    About the programme
                  </ButtonLink>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
