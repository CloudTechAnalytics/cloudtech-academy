import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, Download, GraduationCap, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { getBackend, type Certificate, type CertificateOrder, type CertificatePrice, type Credential } from "@/lib/backend";
import { PageLoading, RequireAuth, useAuth } from "@/lib/auth";
import { certificateName } from "@/lib/certificates";
import { formatMoney, guessCurrency } from "@/lib/currency";
import { SITE, whatsappLink } from "@/lib/site";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { Alert } from "@/components/Form";
import { downloadCertificatePdf } from "@/components/CertificateArtwork";
import { CertificateDocument, type CertificateRender } from "@/components/CertificateDocument";
import { programmeCertificateAvailable, TRACKS } from "@/content/tracks";
import NotFound from "./NotFound";

const INCLUDES = [
  "Your name and the programme you completed, with every skill it covers",
  "A unique certificate number and your programme badge credential ID",
  "A QR code and link anyone can use to verify it",
  "CloudTech Academy and CloudTech Analytics branding",
  "A print-ready A4 PDF, kept in My Certificates",
];

/** The official Professional Certificate for a whole programme: explain, price by currency, take payment, then download. */
function Inner() {
  const { slug } = useParams();
  const track = TRACKS.find((t) => t.slug === slug);
  const auth = useAuth();
  const [badge, setBadge] = useState<Credential | null | undefined>(undefined);
  const [held, setHeld] = useState<Certificate | null | undefined>(undefined);
  /** True when the learner holds this programme as a paid enrolment, which includes the certificate. */
  const [included, setIncluded] = useState(false);
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

  useSeo({ title: track ? `Professional Certificate | ${track.title}` : "Professional Certificate", description: "Official verified programme certificate", noindex: true });

  useEffect(() => {
    void getBackend().then(async (b) => {
      setPaymentsEnabled(b.paymentsEnabled);
      setSimulated(!!b.simulatePayment);
      const [list, creds, certs, mine, sales] = await Promise.all([b.listCertificatePrices("programme"), b.listMyCredentials(), b.listMyCertificates(), b.listMyProgrammes(), b.listProgrammeSales()]);
      setIncluded(!!track && mine.some((m) => m.trackId === track.id) && sales[track.id]?.access === "paid");
      setPrices(list);
      setBadge(creds.find((c) => c.kind === "track_completion" && c.trackId === track?.id && c.status === "valid") ?? null);
      setHeld(certs.find((c) => c.source === "programme" && c.trackId === track?.id && c.status === "valid") ?? null);
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

  if (!track) return <NotFound />;
  if (!prices || badge === undefined || held === undefined) return <PageLoading />;
  if (confirming) return <PageLoading label="Confirming your payment with Paystack…" />;

  const completion = badge;
  const certificate = issued ?? held;
  const price = prices.find((p) => p.currency === currency);

  const back = (
    <Link to={`/programmes/${track.slug}`} className="text-[0.875rem] text-muted hover:text-ink">
      ← {track.programmeTitle ?? track.title}
    </Link>
  );

  if (!programmeCertificateAvailable(track))
    return (
      <div className="container-page max-w-2xl py-14 sm:py-20">
        {back}
        <h1 className="mt-4 font-serif text-[2.3rem] leading-tight">Not open yet</h1>
        <p className="mt-3 text-[1.0625rem] text-muted">
          The Professional Certificate for this programme opens when its capstone project is released. Your courses and badges count towards it in the meantime.
        </p>
      </div>
    );

  if (!completion)
    return (
      <div className="container-page max-w-2xl py-14 sm:py-20">
        {back}
        <h1 className="mt-4 font-serif text-[2.3rem] leading-tight">Complete the programme first</h1>
        <p className="mt-3 text-[1.0625rem] text-muted">
          The Professional Certificate is available once you've completed every required course and the capstone project, and claimed your free programme badge.
        </p>
        <ButtonLink to={`/programmes/${track.slug}`} className="mt-6">
          See your progress
        </ButtonLink>
      </div>
    );

  const data: CertificateRender = {
    recipientName: certificate?.recipientName ?? completion.recipientName,
    certificateTitle: certificate?.certificateTitle ?? track.programmeTitle ?? track.title,
    courseTitle: track.title,
    trainingType: "academy_programme",
    certificateType: "professional_programme",
    instructorName: certificate?.instructorName ?? null,
    description: certificate?.description ?? track.skills.join(", ").slice(0, 600),
    startDate: null,
    completionDate: certificate?.completionDate ?? completion.issuedAt.slice(0, 10),
    issuedAt: certificate?.issuedAt ?? completion.issuedAt,
    grade: null,
    duration: null,
    certificateId: certificate?.certificateId,
    credentialId: completion.credentialId,
    state: certificate ? "valid" : "preview",
  };

  const claimIncluded = async () => {
    setBusy(true);
    setError(null);
    try {
      setIssued(await (await getBackend()).claimProgrammeCertificate(track.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't issue the certificate.");
    }
    setBusy(false);
  };

  const startOrder = async (pay = currency) => {
    setBusy(true);
    setError(null);
    setUnsupported(null);
    try {
      const b = await getBackend();
      const o = await b.startProgrammeOrder(track.id, pay);
      setOrder(o);
      if (b.simulatePayment) setIssued(await b.simulatePayment(o.id));
      else if (b.startCheckout) {
        try {
          window.location.assign(await b.startCheckout(o.id, `${window.location.origin}/programmes/${track.slug}/certificate`));
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
      await downloadCertificatePdf(art.current, `${certificate.certificateId}.pdf`, `${certificateName(certificate)} certificate`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't create the PDF.");
    }
  };

  return (
    <div className="container-page max-w-6xl py-12 sm:py-16">
      {back}
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-line-strong bg-paper shadow-[0_40px_80px_-50px_rgba(23,23,23,0.55)]">
          <CertificateDocument ref={art} templateId="signature" data={data} />
        </div>

        <div>
          {certificate ? (
            <>
              <p className="flex items-center gap-2 font-semibold text-success">
                <CheckCircle2 aria-hidden className="h-5 w-5" /> {issued ? (included ? "Certificate issued" : "Payment successful") : "You have the official certificate"}
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
                    `Hello CloudTech Academy, I'd like to pay for my Professional Certificate.\nProgramme: ${track.title}\nOrder: ${order.id.slice(0, 8).toUpperCase()}\nName: ${completion.recipientName}\nEmail: ${auth.user?.email ?? ""}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("primary")}
                >
                  <MessageCircle aria-hidden className="h-4 w-4" /> Message us on WhatsApp
                </a>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Certificate order ${order.id.slice(0, 8).toUpperCase()}`)}&body=${encodeURIComponent(`Programme: ${track.title}\nName: ${completion.recipientName}\nEmail: ${auth.user?.email ?? ""}`)}`}
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
                <GraduationCap aria-hidden className="h-4 w-4" /> Professional Certificate · Official
              </p>
              <h1 className="mt-3 font-serif text-[2.2rem] leading-tight">Get your Professional Certificate</h1>
              <p className="mt-3 text-[1.0625rem] leading-relaxed">
                You've completed the whole programme, and your programme badge stays free. The Professional Certificate is the official, verifiable document for{" "}
                <strong className="font-semibold">{track.programmeTitle ?? track.title}</strong>: every course and the capstone project, on one certificate.
              </p>
              <ul className="mt-5 space-y-2">
                {INCLUDES.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[0.9375rem]">
                    <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {i}
                  </li>
                ))}
              </ul>

              {included ? (
                <div className="mt-6 rounded-2xl border border-line-strong bg-paper p-5">
                  <p className="font-serif text-[1.5rem] leading-tight">Included with your enrolment</p>
                  <p className="mt-1 text-[0.9375rem] text-muted">The Professional Certificate is part of the programme you enrolled in. There is nothing more to pay.</p>
                  <Button onClick={() => void claimIncluded()} loading={busy} className="mt-4 w-full">
                    Claim your Professional Certificate
                  </Button>
                </div>
              ) : (
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
                <p className="mt-1 text-[0.8125rem] text-muted">One-off payment for the programme certificate. Nothing else is charged.</p>
                <Button onClick={() => void startOrder()} loading={busy} disabled={!price} className="mt-4 w-full">
                  {paymentsEnabled ? `Pay ${price ? formatMoney(price.amount, price.currency) : ""}` : "Continue"}
                </Button>
                {paymentsEnabled && (
                  <p className="mt-2 text-center text-[0.75rem] text-muted">
                    {simulated ? "Demo mode: the payment is simulated and nothing is charged." : "Secure card, bank transfer or USSD payment by Paystack."}
                  </p>
                )}
              </div>
              )}
              <p className="mt-4 text-[0.8125rem] text-muted">
                Not now? That's fine: your programme badge and{" "}
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
