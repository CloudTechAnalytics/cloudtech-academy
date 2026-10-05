import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Check, Copy, Download, ExternalLink, Plus, X } from "lucide-react";
import {
  getBackend,
  type AdminCertificate,
  type Certificate,
  type CertificateInput,
  type CertificateTemplate,
  type StudentSummary,
} from "@/lib/backend";
import type { Course } from "@/content/types";
import { PROGRAMMES } from "@/content/tracks";
import { PageLoading } from "@/lib/auth";
import { CERTIFICATE_TYPES, certificateName, inputFromCertificate, today, TRAINING_TYPES, trainingTypeLabel, certificateTypeMeta, formatDay } from "@/lib/certificates";
import { CertificateDocument, type CertificateRender } from "@/components/CertificateDocument";
import { downloadCertificatePdf } from "@/components/CertificateArtwork";
import { Alert, TextArea, TextField } from "@/components/Form";
import { Button, ButtonLink, buttonClass } from "@/components/Button";
import { AdminHeading } from "./AdminLayout";
import { certificateLink, copyText } from "./certificate-shared";

const EMPTY: CertificateInput = {
  recipientName: "",
  recipientEmail: "",
  userId: "",
  courseId: "",
  certificateTitle: "",
  programmeName: "",
  trainingType: "one_on_one",
  certificateType: "professional_training",
  instructorName: "",
  description: "",
  startDate: "",
  completionDate: today(),
  issueDate: today(),
  grade: "",
  duration: "",
  templateId: "signature",
};

type Errors = Partial<Record<keyof CertificateInput | "reason", string>>;

/** The same rules the server applies, so mistakes show next to the field. */
function validate(i: CertificateInput, reason: string | null): Errors {
  const e: Errors = {};
  if (i.recipientName.trim().length < 2) e.recipientName = "Enter the recipient's full name.";
  if (i.recipientEmail.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.recipientEmail.trim())) e.recipientEmail = "That email address doesn't look right.";
  if (!i.certificateTitle.trim()) e.certificateTitle = "Enter the certificate title.";
  if (!i.programmeName.trim()) e.programmeName = "Enter the course or programme name.";
  if (!i.completionDate) e.completionDate = "Enter the completion date.";
  if (i.startDate && i.completionDate && i.startDate > i.completionDate) e.startDate = "The start date must be on or before the completion date.";
  if (!i.issueDate) e.issueDate = "Enter the issue date.";
  else if (i.completionDate && i.issueDate < i.completionDate) e.issueDate = "The issue date can't be before the completion date.";
  else if (i.issueDate > today()) e.issueDate = "The issue date can't be in the future.";
  if (reason !== null && !reason.trim()) e.reason = "Say why the certificate is being reissued.";
  return e;
}

const selectCls =
  "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-[1rem] text-ink focus:border-ink/60 focus:outline-2 focus:outline-offset-2 focus:outline-brass-dark";

function SelectField({ label, value, onChange, children, hint }: { label: string; value: string; onChange: (v: string) => void; children: ReactNode; hint?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={hint ? `${id}-hint` : undefined} className={selectCls}>
        {children}
      </select>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

function Section({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  return (
    <fieldset className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <legend className="px-1 font-serif text-[1.25rem]">{title}</legend>
      {note && <p className="-mt-1 mb-4 text-[0.875rem] text-muted">{note}</p>}
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Find an Academy account by name or email; optional. */
function AccountPicker({ students, userId, onPick }: { students: StudentSummary[]; userId: string; onPick: (s: StudentSummary | null) => void }) {
  const [q, setQ] = useState("");
  const picked = students.find((s) => s.userId === userId);
  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? students.filter((s) => s.fullName.toLowerCase().includes(t) || s.email.toLowerCase().includes(t)).slice(0, 6) : [];
  }, [q, students]);
  if (userId)
    return (
      <div className="sm:col-span-2">
        <p className="text-[0.875rem] font-medium">Academy account</p>
        <div className="mt-1.5 flex items-center justify-between gap-3 rounded-lg border border-line-strong bg-sand/40 px-3.5 py-2.5">
          <span>
            <span className="font-semibold">{picked?.fullName || "Linked account"}</span>
            {picked?.email && <span className="ml-2 text-[0.875rem] text-muted">{picked.email}</span>}
          </span>
          <button type="button" onClick={() => onPick(null)} className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-muted hover:text-ink">
            <X aria-hidden className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
        <p className="mt-1.5 text-[0.8125rem] text-muted">The certificate also appears in their dashboard.</p>
      </div>
    );
  return (
    <div className="sm:col-span-2">
      <TextField
        label="Academy account (optional)"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search students by name or email"
        hint="Not needed. Link one only if the recipient studies on the Academy, so it shows in their dashboard."
      />
      {matches.length > 0 && (
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-lg border border-line">
          {matches.map((s) => (
            <li key={s.userId}>
              <button
                type="button"
                onClick={() => {
                  onPick(s);
                  setQ("");
                }}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-sand"
              >
                <span className="font-medium">{s.fullName || "(no name)"}</span>
                <span className="text-[0.8125rem] text-muted">{s.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {q.trim() && matches.length === 0 && <p className="mt-2 text-[0.8125rem] text-muted">No student matches. That's fine: certificates don't need an account.</p>}
    </div>
  );
}

function TemplatePicker({ templates, value, onChange }: { templates: CertificateTemplate[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="sm:col-span-2" role="radiogroup" aria-label="Certificate template">
      <p className="text-[0.875rem] font-medium">Template</p>
      <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
        {templates
          .filter((t) => t.active)
          .map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={value === t.id}
              onClick={() => onChange(t.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${value === t.id ? "border-brass-dark bg-brass-pale/40" : "border-line-strong hover:border-ink/40"}`}
            >
              <span className="flex items-center gap-2 font-semibold">
                {value === t.id && <Check aria-hidden className="h-4 w-4 text-brass-dark" />} {t.name}
              </span>
              <span className="mt-1 block text-[0.8125rem] text-muted">{t.description}</span>
            </button>
          ))}
      </div>
    </div>
  );
}

const previewOf = (i: CertificateInput): CertificateRender => ({
  recipientName: i.recipientName.trim(),
  certificateTitle: i.certificateTitle.trim() || null,
  courseTitle: i.programmeName.trim(),
  trainingType: i.trainingType,
  certificateType: i.certificateType,
  instructorName: i.instructorName.trim() || null,
  description: i.description.trim() || null,
  startDate: i.startDate || null,
  completionDate: i.completionDate || null,
  issuedAt: `${i.issueDate || today()}T12:00:00.000Z`,
  grade: i.grade.trim() || null,
  duration: i.duration.trim() || null,
  state: "preview",
});

/** Certificates → Issue certificate (and Reissue): enter, preview, generate. */
export function AdminCertificateIssue({ mode }: { mode: "new" | "reissue" }) {
  const { certificateId = "" } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState<CertificateInput>(EMPTY);
  /** A Professional Programme picked as the starting point; it only fills in names, the certificate stays manual. */
  const [programmeId, setProgrammeId] = useState("");
  const [reason, setReason] = useState("");
  const [original, setOriginal] = useState<AdminCertificate | null>(null);
  const [step, setStep] = useState<"edit" | "preview" | "done">("edit");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [issued, setIssued] = useState<Certificate | null>(null);
  const [lists, setLists] = useState<{ templates: CertificateTemplate[]; students: StudentSummary[]; courses: Course[] } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const b = await getBackend();
        const [templates, students, courses, cert] = await Promise.all([
          b.admin.listCertificateTemplates(),
          b.admin.listStudents().catch(() => [] as StudentSummary[]),
          b.listCourses({ includeUnpublished: true }),
          mode === "reissue" ? b.admin.getCertificate(certificateId) : Promise.resolve(null),
        ]);
        if (mode === "reissue") {
          if (!cert) return setLoadError("Certificate not found.");
          if (cert.status === "replaced") return setLoadError(`This certificate was already replaced${cert.replacedBy ? ` by ${cert.replacedBy}` : ""}.`);
          setOriginal(cert);
          setInput(inputFromCertificate(cert));
        }
        setLists({ templates, students, courses: courses.slice().sort((a, b) => a.title.localeCompare(b.title)) });
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Couldn't load the form.");
      }
    })();
  }, [mode, certificateId]);

  const set = useCallback(<K extends keyof CertificateInput>(key: K, value: CertificateInput[K]) => {
    setInput((i) => ({ ...i, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }, []);

  const scrollTop = () => requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  const toPreview = () => {
    const e = validate(input, mode === "reissue" ? reason : null);
    setErrors(e);
    setServerError(null);
    if (Object.values(e).some(Boolean)) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setStep("preview");
    scrollTop();
  };

  const generate = async () => {
    setBusy(true);
    setServerError(null);
    try {
      const b = await getBackend();
      const cert = mode === "reissue" ? await b.admin.reissueCertificate(certificateId, input, reason.trim()) : await b.admin.issueCertificate(input);
      setIssued(cert);
      setStep("done");
      scrollTop();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Couldn't issue the certificate.");
    } finally {
      setBusy(false);
    }
  };

  if (loadError)
    return (
      <>
        <AdminHeading title={mode === "reissue" ? "Reissue certificate" : "Issue certificate"} />
        <Alert tone="error">{loadError}</Alert>
        <Link to="/admin/certificates" className="mt-4 inline-block font-semibold text-brass-dark">
          ← All certificates
        </Link>
      </>
    );
  if (!lists) return <PageLoading />;

  const course = lists.courses.find((c) => c.id === input.courseId);
  const courseLocked = original?.source === "course";

  return (
    <div ref={top} className="scroll-mt-24">
      <Link to={original ? `/admin/certificates/${original.certificateId}` : "/admin/certificates"} className="text-[0.875rem] text-muted hover:text-ink">
        ← {original ? original.certificateId : "All certificates"}
      </Link>
      <AdminHeading title={step === "done" ? "Certificate Issued Successfully" : mode === "reissue" ? "Reissue certificate" : "Issue certificate"} />

      {step !== "done" && (
        <ol className="mb-8 flex flex-wrap gap-2 text-[0.8125rem]" aria-label="Steps">
          {["Enter details", "Preview", "Generate"].map((label, i) => {
            const active = (step === "edit" && i === 0) || (step === "preview" && i === 1);
            return (
              <li key={label} aria-current={active ? "step" : undefined} className={`rounded-full border px-3 py-1 ${active ? "border-brass-dark bg-brass-pale/40 font-semibold" : "border-line text-muted"}`}>
                {i + 1}. {label}
              </li>
            );
          })}
        </ol>
      )}

      {step === "edit" && (
        <form
          noValidate
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            toPreview();
          }}
        >
          {mode === "reissue" && original && (
            <Alert tone="info">
              Reissuing replaces <span className="font-mono">{original.certificateId}</span> with a corrected certificate under a new ID. The original stays on record
              and its verification page will point to the replacement.
            </Alert>
          )}
          {mode === "reissue" && (
            <TextArea label="Why is it being reissued?" rows={2} value={reason} onChange={(e) => (setReason(e.target.value), setErrors((x) => ({ ...x, reason: undefined })))} error={errors.reason} maxLength={300} placeholder="e.g. Recipient's name was misspelt" />
          )}

          <Section title="Recipient">
            <TextField label="Full name, as it should appear" value={input.recipientName} onChange={(e) => set("recipientName", e.target.value)} error={errors.recipientName} autoComplete="off" maxLength={120} />
            <TextField label="Email address (optional)" type="email" value={input.recipientEmail} onChange={(e) => set("recipientEmail", e.target.value)} error={errors.recipientEmail} hint="Kept private. Never shown on verification." maxLength={200} />
            {!courseLocked && (
              <AccountPicker
                students={lists.students}
                userId={input.userId}
                onPick={(s) =>
                  setInput((i) => ({
                    ...i,
                    userId: s?.userId ?? "",
                    recipientName: s && !i.recipientName.trim() ? s.fullName : i.recipientName,
                    recipientEmail: s && !i.recipientEmail.trim() ? s.email : i.recipientEmail,
                  }))
                }
              />
            )}
          </Section>

          <Section title="Training">
            <SelectField label="Training type" value={input.trainingType} onChange={(v) => set("trainingType", v as CertificateInput["trainingType"])}>
              {TRAINING_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectField>
            <SelectField label="Certificate type" value={input.certificateType} onChange={(v) => set("certificateType", v as CertificateInput["certificateType"])}>
              {CERTIFICATE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectField>
            {!courseLocked && (
              <div className="sm:col-span-2">
                <SelectField
                  label={input.trainingType === "academy_course" ? "Academy course or programme" : "Academy course or programme (optional)"}
                  value={programmeId ? `programme:${programmeId}` : input.courseId}
                  hint="Choosing one fills in the names below. Leave it empty for training outside the Academy."
                  onChange={(v) => {
                    if (v.startsWith("programme:")) {
                      const t = PROGRAMMES.find((x) => x.id === v.slice(10));
                      if (!t) return;
                      setProgrammeId(t.id);
                      setInput((i) => ({
                        ...i,
                        courseId: "",
                        trainingType: "academy_programme",
                        certificateType: "professional_programme",
                        programmeName: t.title,
                        certificateTitle: t.programmeTitle ?? t.title,
                        description: i.description.trim() ? i.description : t.skills.join(", ").slice(0, 600),
                      }));
                      return;
                    }
                    setProgrammeId("");
                    const c = lists.courses.find((x) => x.id === v);
                    setInput((i) => ({
                      ...i,
                      courseId: v,
                      programmeName: c && (!i.programmeName.trim() || i.programmeName === course?.title) ? c.title : i.programmeName,
                      certificateTitle: c && (!i.certificateTitle.trim() || i.certificateTitle === course?.title) ? c.title : i.certificateTitle,
                    }));
                  }}
                >
                  <option value="">None</option>
                  <optgroup label="Professional Programmes">
                    {PROGRAMMES.map((t) => (
                      <option key={t.id} value={`programme:${t.id}`}>
                        {t.programmeTitle ?? t.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Courses">
                    {lists.courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </optgroup>
                </SelectField>
              </div>
            )}
            <TextField label="Certificate title" value={input.certificateTitle} onChange={(e) => set("certificateTitle", e.target.value)} error={errors.certificateTitle} placeholder="e.g. Data Analytics Professional Training" hint={errors.certificateTitle ? undefined : "The large title printed on the certificate."} maxLength={150} />
            <TextField label="Course or programme name" value={input.programmeName} onChange={(e) => set("programmeName", e.target.value)} error={errors.programmeName} placeholder="e.g. Data Analytics with Excel and Power BI" maxLength={200} />
          </Section>

          <Section title="Dates">
            <TextField label="Training start date (optional)" type="date" value={input.startDate} max={input.completionDate || undefined} onChange={(e) => set("startDate", e.target.value)} error={errors.startDate} />
            <TextField label="Training completion date" type="date" value={input.completionDate} max={today()} onChange={(e) => set("completionDate", e.target.value)} error={errors.completionDate} />
            <TextField label="Certificate issue date" type="date" value={input.issueDate} min={input.completionDate || undefined} max={today()} onChange={(e) => set("issueDate", e.target.value)} error={errors.issueDate} hint={errors.issueDate ? undefined : "Usually today."} />
          </Section>

          <Section title="Additional information" note="All optional. Whatever you fill in is printed on the certificate.">
            <TextField label="Instructor or trainer" value={input.instructorName} onChange={(e) => set("instructorName", e.target.value)} maxLength={120} />
            <TextField label="Duration" value={input.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 8 weeks, 40 hours" maxLength={60} />
            <TextField label="Grade or score" value={input.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. Distinction, 92%" maxLength={40} />
            <div className="hidden sm:block" />
            <div className="sm:col-span-2">
              <TextArea label="Description or skills covered" rows={3} value={input.description} onChange={(e) => set("description", e.target.value)} maxLength={600} placeholder="e.g. Data cleaning, pivot tables, DAX measures and dashboard design in Power BI." />
            </div>
            <TemplatePicker templates={lists.templates} value={input.templateId} onChange={(v) => set("templateId", v)} />
          </Section>

          <div className="flex flex-wrap gap-3">
            <Button type="submit">Preview certificate</Button>
            <ButtonLink to="/admin/certificates" variant="secondary">
              Cancel
            </ButtonLink>
          </div>
        </form>
      )}

      {step === "preview" && (
        <div>
          <h2 className="font-serif text-[1.5rem]">Certificate Preview</h2>
          <p className="mt-1 text-muted">Check every detail. The certificate ID and QR code are added when you generate it.</p>
          <div className="mt-5 overflow-hidden rounded-xl border border-line-strong shadow-[0_20px_50px_-30px_rgba(23,23,23,0.45)]">
            <CertificateDocument templateId={input.templateId} data={previewOf(input)} />
          </div>
          <dl className="mt-6 grid gap-x-8 gap-y-3 rounded-2xl border border-line bg-paper p-5 text-[0.9375rem] sm:grid-cols-2">
            {[
              ["Recipient", input.recipientName],
              ["Email", input.recipientEmail || "None"],
              ["Academy account", input.userId ? (lists.students.find((s) => s.userId === input.userId)?.fullName ?? "Linked") : "None"],
              ["Certificate", input.certificateTitle],
              ["Programme", input.programmeName],
              ["Training type", trainingTypeLabel(input.trainingType)],
              ["Certificate type", certificateTypeMeta(input.certificateType).label],
              ["Completed", formatDay(input.completionDate)],
              ["Issue date", formatDay(input.issueDate)],
              ...(mode === "reissue" ? [["Replaces", original?.certificateId ?? ""], ["Reason", reason]] : []),
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.8125rem] text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4" aria-live="polite">
            {serverError && <Alert tone="error">{serverError}</Alert>}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setStep("edit")}>
              <ArrowLeft aria-hidden className="h-4 w-4" /> Back to Edit
            </Button>
            <Button disabled={busy} onClick={() => void generate()}>
              {busy ? "Generating…" : mode === "reissue" ? "Generate replacement" : "Generate Certificate"}
            </Button>
          </div>
        </div>
      )}

      {step === "done" && issued && <Issued cert={issued} onAnother={() => (setInput({ ...EMPTY, issueDate: today(), completionDate: today() }), setIssued(null), setStep("edit"), navigate("/admin/certificates/new"))} />}
    </div>
  );
}

function Issued({ cert, onAnother }: { cert: Certificate; onAnother: () => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const url = certificateLink(cert.certificateId);
  const download = async () => {
    try {
      if (!svg.current) return;
      await downloadCertificatePdf(svg.current, `${cert.certificateId}.pdf`, `${certificateName(cert)} certificate`);
      void getBackend().then((b) => b.recordCertificateDownload(cert.certificateId)).catch(() => undefined);
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't create the PDF." });
    }
  };
  return (
    <div>
      <div className="rounded-2xl border border-success/40 bg-success-bg p-6 sm:p-7">
        <p className="flex items-center gap-2 font-semibold text-success">
          <Check aria-hidden className="h-5 w-5" /> Issued and verifiable now
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-[0.8125rem] text-muted">Certificate ID</dt>
            <dd className="mt-0.5 font-mono text-[1.0625rem] font-semibold">{cert.certificateId}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-muted">Recipient</dt>
            <dd className="mt-0.5 text-[1.0625rem] font-semibold">{cert.recipientName}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[0.8125rem] text-muted">Verification URL</dt>
            <dd className="mt-0.5 break-all font-mono text-[0.9375rem]">
              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-brass-dark">
                {url}
              </a>
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className={buttonClass("primary")} onClick={() => void download()}>
            <Download aria-hidden className="h-4 w-4" /> Download Certificate
          </button>
          <button
            type="button"
            className={buttonClass("secondary")}
            onClick={() => void copyText(url).then((ok) => setMsg(ok ? { tone: "success", text: "Verification link copied." } : { tone: "error", text: `Copy this link: ${url}` }))}
          >
            <Copy aria-hidden className="h-4 w-4" /> Copy Verification Link
          </button>
          <Link to={`/verify/${cert.certificateId}`} target="_blank" className={buttonClass("ghost")}>
            Open verification page <ExternalLink aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-3" aria-live="polite">
          {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-line-strong shadow-[0_20px_50px_-30px_rgba(23,23,23,0.45)]">
        <CertificateDocument ref={svg} templateId={cert.templateId} data={{ ...previewOfCert(cert) }} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink to={`/admin/certificates/${cert.certificateId}`} variant="secondary">
          View certificate record
        </ButtonLink>
        <Button variant="secondary" onClick={onAnother}>
          <Plus aria-hidden className="h-4 w-4" /> Issue another
        </Button>
        <ButtonLink to="/admin/certificates" variant="ghost">
          All certificates
        </ButtonLink>
      </div>
    </div>
  );
}

const previewOfCert = (c: Certificate): CertificateRender => ({
  recipientName: c.recipientName,
  certificateTitle: c.certificateTitle,
  courseTitle: c.courseTitle,
  trainingType: c.trainingType,
  certificateType: c.certificateType,
  instructorName: c.instructorName,
  description: c.description,
  startDate: c.startDate,
  completionDate: c.completionDate,
  issuedAt: c.issuedAt,
  grade: c.grade,
  duration: c.duration,
  certificateId: c.certificateId,
  credentialId: c.credentialId,
  state: c.status,
});

/** Certificates → Edit: only what isn't printed. Printed details change by reissuing. */
export function AdminCertificateEdit() {
  const { certificateId = "" } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState<AdminCertificate | null | undefined>(undefined);
  const [lists, setLists] = useState<{ templates: CertificateTemplate[]; students: StudentSummary[]; courses: Course[] } | null>(null);
  const [edit, setEdit] = useState({ recipientEmail: "", userId: "", courseId: "", templateId: "signature" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const b = await getBackend();
      const [c, templates, students, courses] = await Promise.all([
        b.admin.getCertificate(certificateId),
        b.admin.listCertificateTemplates(),
        b.admin.listStudents().catch(() => [] as StudentSummary[]),
        b.listCourses({ includeUnpublished: true }),
      ]);
      setCert(c);
      if (c) setEdit({ recipientEmail: c.recipientEmail ?? "", userId: c.userId ?? "", courseId: c.courseId ?? "", templateId: c.templateId });
      setLists({ templates, students, courses: courses.slice().sort((a, b) => a.title.localeCompare(b.title)) });
    })().catch((e: unknown) => setError(e instanceof Error ? e.message : "Couldn't load the certificate."));
  }, [certificateId]);

  if (error && cert === undefined) return <Alert tone="error">{error}</Alert>;
  if (cert === undefined || !lists) return <PageLoading />;
  if (!cert) return <Alert tone="error">Certificate not found.</Alert>;

  const save = async () => {
    setError(null);
    if (edit.recipientEmail.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(edit.recipientEmail.trim())) return setError("That email address doesn't look right.");
    setBusy(true);
    try {
      await (await getBackend()).admin.updateCertificate(cert.certificateId, edit);
      navigate(`/admin/certificates/${cert.certificateId}`, { state: { saved: true } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Link to={`/admin/certificates/${cert.certificateId}`} className="text-[0.875rem] text-muted hover:text-ink">
        ← {cert.certificateId}
      </Link>
      <AdminHeading title="Edit certificate" />
      {cert.status === "replaced" ? (
        <Alert tone="error">This certificate was replaced. Edit the replacement instead.</Alert>
      ) : (
        <form
          noValidate
          className="max-w-2xl space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <Alert tone="info">
            You can change details that aren't printed on the certificate here. To correct anything printed (name, title, dates, instructor), use{" "}
            <Link to={`/admin/certificates/${cert.certificateId}/reissue`} className="font-semibold underline">
              Reissue
            </Link>
            , so the original stays on record.
          </Alert>
          <Section title={`${cert.recipientName}: ${certificateName(cert)}`}>
            <div className="sm:col-span-2">
              <TextField label="Recipient email (optional)" type="email" value={edit.recipientEmail} onChange={(e) => setEdit({ ...edit, recipientEmail: e.target.value })} hint="Kept private." />
            </div>
            {cert.source === "manual" ? (
              <>
                <AccountPicker students={lists.students} userId={edit.userId} onPick={(s) => setEdit({ ...edit, userId: s?.userId ?? "" })} />
                <div className="sm:col-span-2">
                  <SelectField label="Academy course (optional)" value={edit.courseId} onChange={(v) => setEdit({ ...edit, courseId: v })}>
                    <option value="">None</option>
                    {lists.courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </SelectField>
                </div>
              </>
            ) : (
              <p className="text-[0.875rem] text-muted sm:col-span-2">A course certificate stays linked to its learner and course.</p>
            )}
            <TemplatePicker templates={lists.templates} value={edit.templateId} onChange={(v) => setEdit({ ...edit, templateId: v })} />
          </Section>
          {error && <Alert tone="error">{error}</Alert>}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
            <ButtonLink to={`/admin/certificates/${cert.certificateId}`} variant="secondary">
              Cancel
            </ButtonLink>
          </div>
        </form>
      )}
    </div>
  );
}
