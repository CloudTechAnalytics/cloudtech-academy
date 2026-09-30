import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, Download, GraduationCap, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourse, useLearner } from "@/lib/data";
import { getBackend, type Certificate, type CertificateOrder, type CertificatePrice } from "@/lib/backend";
import { PageLoading, RequireAuth, useAuth } from "@/lib/auth";
import { verifyUrl } from "@/lib/certificates";
import { formatMoney, guessCurrency } from "@/lib/currency";
import { SITE, whatsappLink } from "@/lib/site";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { Alert } from "@/components/Form";
import { CertificateArtwork, downloadCertificatePdf } from "@/components/CertificateArtwork";
import NotFound from "./NotFound";

const INCLUDES = [
  "Your name, the course and your completion date",
  "A unique certificate number and your credential ID",
  "A QR code and link anyone can use to verify it",
  "CloudTech Academy and CloudTech Analytics branding",
  "A print-ready A4 PDF, kept in My Certificates",
];

/** The optional official certificate: explain, price by currency, take payment, then download. */
function Inner() {
  const { slug } = useParams();
  const { course, loading } = useCourse(slug);
  const learner = useLearner(course);
  const auth = useAuth();
  const [prices, setPrices] = useState<CertificatePrice[] | null>(null);
  const [currency, setCurrency] = useState(guessCurrency);
  const [order, setOrder] = useState<CertificateOrder | null>(null);
  const [issued, setIssued] = useState<Certificate | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [confirming, setConfirming] = useState(false);
  /** Set when card payment isn't available in the chosen currency. */
  const [unsupported, setUnsupported] = useState<string | null>(null);
  const art = useRef<SVGSVGElement>(null);

  useSeo({ title: course ? `Official certificate | ${course.title}` : "Official certificate", description: "Optional official verified certificate", noindex: true });

  useEffect(() => {
    void getBackend().then(async (b) => {
      setPaymentsEnabled(b.paymentsEnabled);
      setSimulated(!!b.simulatePayment);
      const list = await b.listCertificatePrices();
      setPrices(list);
      setCurrency((c) => (list.some((p) => p.currency === c) ? c : (list[0]?.currency ?? c)));
    });
  }, []);

  // Back from Paystack: ?reference=… (and trxref). Confirm the payment on the server.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") ?? params.get("trxref");
    if (!reference) return;
    setConfirming(true);
    void getBackend()
      .then((b) => {
        if (!b.confirmPayment) throw new Error("Online payment isn't available.");
        return b.confirmPayment(reference);
      })
      .then((cert) => {
        setIssued(cert);
        window.history.replaceState(null, "", window.location.pathname);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't confirm the payment."))
      .finally(() => setConfirming(false));
  }, []);

  if (!course) return loading ? <PageLoading /> : <NotFound />;
  if (learner.loading || !prices) return <PageLoading />;
  if (confirming) return <PageLoading label="Confirming your payment with Paystack…" />;

  const completion = learner.completion;
  const certificate = issued ?? learner.certificate;
  const price = prices.find((p) => p.currency === currency);

  const back = (
    <Link to={`/courses/${course.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
      ← {course.title}
    </Link>
  );

  if (!completion)
    return (
      <div className="container-page max-w-2xl py-14 sm:py-20">
        {back}
        <h1 className="mt-4 font-serif text-[2.3rem] leading-tight">Complete the course first</h1>
        <p className="mt-3 text-[1.0625rem] text-muted">
          The official certificate is available once you've completed {course.title} and earned your free course completion badge.
        </p>
        <ButtonLink to={`/courses/${course.slug}`} className="mt-6">
          Continue the course
        </ButtonLink>
      </div>
    );

  const data = {
    recipientName: certificate?.recipientName ?? completion.recipientName,
    courseTitle: course.title,
    issuedAt: certificate?.issuedAt ?? completion.issuedAt,
    certificateId: certificate?.certificateId,
    credentialId: completion.credentialId,
    verifyUrl: certificate ? verifyUrl(SITE.url, certificate.certificateId) : `${SITE.url}/verify`,
  };

  const startOrder = async (pay = currency) => {
    setBusy(true);
    setError(null);
    setUnsupported(null);
    try {
      const b = await getBackend();
      const o = await b.startCertificateOrder(course.id, pay);
      setOrder(o);
      if (b.simulatePayment) setIssued(await b.simulatePayment(o.id));
      else if (b.startCheckout) {
        try {
          window.location.assign(await b.startCheckout(o.id, `${window.location.origin}/courses/${course.slug}/certificate`));
          return; // leaving for Paystack's payment page
        } catch (e) {
          const msg = e instanceof Error ? e.message : "";
          if (msg.startsWith("currency_unsupported:")) setUnsupported(msg.slice("currency_unsupported:".length));
          else throw e;
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start the order.");
    }
    setBusy(false);
  };
  const naira = prices.find((p) => p.currency === "NGN");

  const download = async () => {
    if (!art.current || !certificate) return;
    try {
      await downloadCertificatePdf(art.current, `${certificate.certificateId}.pdf`, `${course.title} certificate`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't create the PDF.");
    }
  };

  return (
    <div className="container-page max-w-6xl py-12 sm:py-16">
      {back}
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-line-strong bg-paper shadow-[0_40px_80px_-50px_rgba(23,23,23,0.55)]">
          <CertificateArtwork ref={art} data={data} />
        </div>

        <div>
          {certificate ? (
            <>
              <p className="flex items-center gap-2 font-semibold text-success">
                <CheckCircle2 aria-hidden className="h-5 w-5" /> {issued ? "Payment successful" : "You have the official certificate"}
              </p>
              <h1 className="mt-3 font-serif text-[2.2rem] leading-tight">Your official certificate is ready.</h1>
              <p className="mt-3 text-muted">
                Certificate number <span className="font-mono text-ink">{certificate.certificateId}</span>. It's saved in My Certificates, and anyone can
                verify it by scanning the QR code.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => void download()}>
                  <Download aria-hidden className="h-4 w-4" /> Download Certificate
                </Button>
                <ButtonLink to={`/dashboard/certificates/${certificate.certificateId}`} variant="secondary">
                  My Certificates
                </ButtonLink>
              </div>
            </>
          ) : order && (!paymentsEnabled || unsupported) ? (
            <>
              <p className="kicker">Order {order.id.slice(0, 8).toUpperCase()}</p>
              <h1 className="mt-3 font-serif text-[2.1rem] leading-tight">Complete your payment</h1>
              {unsupported && (
                <div className="mt-4 rounded-xl border border-line-strong bg-paper p-4">
                  <p className="text-[0.9375rem]">{unsupported}</p>
                  {naira && (
                    <Button
                      className="mt-3"
                      loading={busy}
                      onClick={() => {
                        setCurrency("NGN");
                        void startOrder("NGN");
                      }}
                    >
                      Pay {formatMoney(naira.amount, "NGN")} by card instead
                    </Button>
                  )}
                  <p className="mt-2 text-[0.8125rem] text-muted">International Visa and Mastercard cards work in naira; your bank converts it. Or pay by transfer:</p>
                </div>
              )}
              <p className="mt-3 text-muted">
                Online card payment is being set up. For now, pay {formatMoney(order.amount, order.currency)} by bank transfer: message us with your order
                reference and we'll send the account details. Your certificate is issued as soon as the payment is confirmed, usually the same day.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappLink(
                    `Hello CloudTech Academy, I'd like to pay for my official certificate.\nCourse: ${course.title}\nOrder: ${order.id.slice(0, 8).toUpperCase()}\nName: ${completion.recipientName}\nEmail: ${auth.user?.email ?? ""}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("primary")}
                >
                  <MessageCircle aria-hidden className="h-4 w-4" /> Message us on WhatsApp
                </a>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Certificate order ${order.id.slice(0, 8).toUpperCase()}`)}&body=${encodeURIComponent(`Course: ${course.title}\nName: ${completion.recipientName}\nEmail: ${auth.user?.email ?? ""}`)}`}
                  className={buttonClass("secondary")}
                >
                  <Mail aria-hidden className="h-4 w-4" /> Email us
                </a>
              </div>
              <p className="mt-4 text-[0.8125rem] text-muted">Once it's issued, it appears in My Certificates on your dashboard.</p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 text-[0.875rem] font-semibold text-brass-dark">
                <GraduationCap aria-hidden className="h-4 w-4" /> Official Verified Certificate · Optional
              </p>
              <h1 className="mt-3 font-serif text-[2.2rem] leading-tight">Get the official certificate</h1>
              <p className="mt-3 text-[1.0625rem] leading-relaxed">
                Your course completion credential has already been earned, and it stays free. The official certificate is a downloadable PDF document for{" "}
                <strong className="font-semibold">{course.title}</strong>, for when you want something formal to print or attach.
              </p>
              <ul className="mt-5 space-y-2">
                {INCLUDES.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[0.9375rem]">
                    <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {i}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-line-strong bg-paper p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-serif text-[2rem] leading-none">{price ? formatMoney(price.amount, price.currency) : "—"}</p>
                  {prices.length > 1 && (
                    <div role="radiogroup" aria-label="Currency" className="flex rounded-lg border border-line-strong p-0.5">
                      {prices.map((p) => (
                        <button
                          key={p.currency}
                          type="button"
                          role="radio"
                          aria-checked={p.currency === currency}
                          onClick={() => setCurrency(p.currency)}
                          className={`rounded-md px-3 py-1.5 text-[0.8125rem] font-semibold ${p.currency === currency ? "bg-ink text-ivory" : "text-muted hover:text-ink"}`}
                        >
                          {p.currency}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-[0.8125rem] text-muted">One-off payment for the PDF certificate. Nothing else is charged.</p>
                <Button onClick={() => void startOrder()} loading={busy} disabled={!price} className="mt-4 w-full">
                  {paymentsEnabled ? `Pay ${price ? formatMoney(price.amount, price.currency) : ""}` : "Continue"}
                </Button>
                {paymentsEnabled && (
                  <p className="mt-2 text-center text-[0.75rem] text-muted">
                    {simulated ? "Demo mode: the payment is simulated and nothing is charged." : "Secure card, bank transfer or USSD payment by Paystack."}
                  </p>
                )}
              </div>
              <p className="mt-4 text-[0.8125rem] text-muted">
                Not now? That's fine: your badge and{" "}
                <Link to={`/credentials/${completion.credentialId}`} className="font-medium text-brass-dark">
                  credential
                </Link>{" "}
                are yours either way.
              </p>
            </>
          )}
          <div className="mt-5" aria-live="polite">
            {error && <Alert tone="error">{error}</Alert>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificatePurchase() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
