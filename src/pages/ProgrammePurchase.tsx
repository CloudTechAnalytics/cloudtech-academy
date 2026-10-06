import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, Lock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useMyProgrammes, useProgrammes, useCourses } from "@/lib/data";
import { getBackend, type CourseOrder } from "@/lib/backend";
import { PageLoading, RequireAuth, useAuth } from "@/lib/auth";
import { ENROLMENT_MESSAGE, DELIVERY_LABEL, coursePrice, enrolmentState, formatPrice, isPaid, programmeCourseIds } from "@/lib/commerce";
import { SITE, whatsappLink } from "@/lib/site";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { Alert } from "@/components/Form";
import { ManualCheckout } from "@/components/ManualCheckout";
import { capstoneOf, programmeCertificateAvailable } from "@/content/tracks";
import NotFound from "./NotFound";

/** Pay for a Professional Programme. Its professional courses open only once the payment is confirmed by the server. */
function Inner() {
  const { slug } = useParams();
  const tracks = useProgrammes();
  const course = tracks.find((t) => t.slug === slug) ?? null;
  const { held, loading: holdLoading } = useMyProgrammes();
  const courses = useCourses();
  const auth = useAuth();
  const [order, setOrder] = useState<CourseOrder | null>(null);
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  /** "manual": pay into the Academy's account and wait for an admin to confirm. null until known. */
  const [mode, setMode] = useState<"manual" | "paystack" | null>(null);

  useSeo({ title: course ? `Enroll | ${course.programmeName ?? course.title}` : "Enroll", description: "Enroll in a professional programme", noindex: true });

  useEffect(() => {
    void getBackend().then(async (b) => {
      setOnline(b.paymentsEnabled);
      setMode((await b.getPaymentSettings()).mode);
    });
  }, []);

  // Back from Paystack: ?reference=… The server checks the payment before access is granted.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") ?? params.get("trxref");
    if (!reference) return;
    setConfirming(true);
    void getBackend()
      .then((b) => {
        if (!b.confirmCoursePayment) throw new Error("Online payment isn't available.");
        return b.confirmCoursePayment(reference);
      })
      .then(() => {
        setPaid(true);
        window.history.replaceState(null, "", window.location.pathname);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't confirm the payment."))
      .finally(() => setConfirming(false));
  }, []);

  if (!course) return <NotFound />;
  if (holdLoading || mode === null) return <PageLoading />;
  if (confirming) return <PageLoading label="Confirming your payment…" />;
  if (!isPaid(course)) return <NotFound />;

  const name = course.programmeName ?? course.title;
  const firstId = programmeCourseIds(course).find((id) => courses.some((c) => c.id === id && isPaid(c)));
  const start = `/programmes/${course.slug}`;
  const included = [
    `${programmeCourseIds(course).length} courses in one structured programme`,
    ...(course.deliveryType ? [DELIVERY_LABEL[course.deliveryType]] : []),
    ...(capstoneOf(course) ? ["Capstone project"] : []),
    ...(programmeCertificateAvailable(course) ? ["Professional certificate included when you earn the programme badge"] : []),
    ...(course.instructorSupport ? ["Instructor support"] : []),
    ...(course.communityAccess ? ["CloudTech WhatsApp community access"] : []),
    ...(course.included ?? []),
  ];
  void firstId;
  const price = coursePrice(course);
  const state = enrolmentState(course);
  const back = (
    <Link to={`/programmes/${course.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
      ← {name}
    </Link>
  );

  if (paid || held?.includes(course.id))
    return (
      <div className="container-page max-w-2xl py-14 sm:py-20">
        {back}
        <p className="mt-6 flex items-center gap-2 font-semibold text-success">
          <CheckCircle2 aria-hidden className="h-5 w-5" /> {paid ? "Payment confirmed" : "You are enrolled"}
        </p>
        <h1 className="mt-3 font-serif text-[2.3rem] leading-tight">Welcome to {name}</h1>
        <p className="mt-3 text-[1.0625rem] text-muted">Your professional courses are unlocked. You'll find them in My Learning on your dashboard.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to={start}>Open the programme</ButtonLink>
          <ButtonLink to="/dashboard" variant="secondary">
            My Learning
          </ButtonLink>
        </div>
        {mode === "manual" && (
          <div className="mt-8 rounded-2xl border border-line-strong bg-paper p-6">
            <ManualCheckout kind="programme" id={course.id} title={name} price={price ?? { amount: 0, listAmount: 0, discounted: false, currency: "NGN" }} instalments={null} openTo={start} openLabel="Open the programme" onlyExisting />
          </div>
        )}
      </div>
    );

  if (state !== "open" || !price)
    return (
      <div className="container-page max-w-2xl py-14 sm:py-20">
        {back}
        <h1 className="mt-4 font-serif text-[2.2rem] leading-tight">{name}</h1>
        <p className="mt-3 text-[1.0625rem] text-muted">{state === "open" ? "Enrolment opens soon." : ENROLMENT_MESSAGE[state]}</p>
      </div>
    );

  const pay = async () => {
    setBusy(true);
    setError(null);
    try {
      const b = await getBackend();
      const o = await b.startProgrammePurchase(course.id);
      setOrder(o);
      if (b.simulateCoursePayment) {
        await b.simulateCoursePayment(o.id);
        setPaid(true);
      } else if (b.startCourseCheckout) {
        window.location.assign(await b.startCourseCheckout(o.id, `${window.location.origin}/programmes/${course.slug}/enroll`));
        return; // leaving for Paystack's payment page
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start the payment.");
    }
    setBusy(false);
  };

  const label = price ? `Enroll Now — ${formatPrice(price.amount, price.currency)}` : "Enroll Now";
  const manual = order && !online;

  return (
    <div className="container-page max-w-5xl py-12 sm:py-16">
      {back}
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <p className="kicker">Professional Programme</p>
          <h1 className="mt-3 font-serif text-[2.3rem] leading-tight">{name}</h1>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">{course.summary}</p>
          <ul className="mt-6 space-y-2">
            {included.map((i) => (
              <li key={i} className="flex items-start gap-2.5 text-[0.9375rem]">
                <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {i}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line-strong bg-paper p-6 shadow-[0_30px_60px_-45px_rgba(23,23,23,0.45)]">
          {mode === "manual" && price ? (
            <ManualCheckout
              kind="programme"
              id={course.id}
              title={name}
              price={price}
              instalments={course.allowInstalments ? { firstPercent: course.firstPercent ?? 50, secondDueDays: course.secondDueDays ?? 30 } : null}
              openTo={start}
              openLabel="Open the programme"
            />
          ) : manual ? (
            <>
              <p className="kicker">Order {order.id.slice(0, 8).toUpperCase()}</p>
              <h2 className="mt-2 font-serif text-[1.6rem]">Complete your payment</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                Online card payment is being set up. Pay {formatPrice(order.amount, order.currency)} by bank transfer: message us with your order reference and we'll send the
                account details. You're enrolled as soon as the payment is confirmed.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={whatsappLink(`Hello CloudTech Academy, I'd like to pay for ${name}.\nOrder: ${order.id.slice(0, 8).toUpperCase()}\nEmail: ${auth.user?.email ?? ""}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("primary")}
                >
                  <MessageCircle aria-hidden className="h-4 w-4" /> Message us on WhatsApp
                </a>
                <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Enrolment ${order.id.slice(0, 8).toUpperCase()}`)}`} className={buttonClass("secondary")}>
                  <Mail aria-hidden className="h-4 w-4" /> Email us
                </a>
              </div>
            </>
          ) : (
            <>
              {price ? (
                <p className="flex flex-wrap items-baseline gap-3">
                  <span className="font-serif text-[2.2rem] leading-none">{formatPrice(price.amount, price.currency)}</span>
                  {price.discounted && <s className="text-subtle">{formatPrice(price.listAmount, price.currency)}</s>}
                </p>
              ) : null}
              <p className="mt-1 text-[0.8125rem] text-muted">One-off payment. Lessons unlock once the payment is confirmed.</p>
              <Button onClick={() => void pay()} loading={busy} disabled={!price} className="mt-5 w-full">
                {label}
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.75rem] text-muted">
                <Lock aria-hidden className="h-3 w-3" /> {online ? "Secure card, bank transfer or USSD payment by Paystack." : "Payment details are sent after you continue."}
              </p>
            </>
          )}
          <div className="mt-4" aria-live="polite">
            {error && <Alert tone="error">{error}</Alert>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgrammePurchase() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
