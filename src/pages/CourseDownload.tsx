import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Download } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useCourse } from "@/lib/data";
import { PageLoading, RequireAuth, useAuth } from "@/lib/auth";
import { getBackend } from "@/lib/backend";
import { publishedLessons } from "@/lib/certificates";
import { SITE } from "@/lib/site";
import { AcademyLogo, Mark } from "@/components/Logo";
import { LessonContent } from "@/components/LessonContent";
import { Alert } from "@/components/Form";
import { buttonClass } from "@/components/Button";
import NotFound from "./NotFound";

/**
 * The whole course as one printable document, saved with the browser's "Save as PDF" so the
 * text stays sharp and searchable. Shown only when an admin has switched downloads on for the
 * course. Every page carries a faint CloudTech Academy watermark and the learner's name and
 * email; practice blocks show their questions but never the answers.
 */

const HOST = SITE.url.replace(/^https?:\/\//, "");

/** Print rules for the document. Headers and footers repeat on every page through the table's thead and tfoot. */
const PRINT_CSS = `
.course-pdf { background: #fff; color: #171717; }
.course-pdf .lesson { font-size: 15px; line-height: 1.65; }
.course-pdf .lesson h2 { font-size: 1.45rem; break-after: avoid; }
.course-pdf .lesson h3 { break-after: avoid; }
.course-pdf .code-block { background: #f4f1ea; color: #171717; border: 1px solid #d6cdb9; overflow: visible; }
.course-pdf pre, .course-pdf figure, .course-pdf tr, .course-pdf aside { break-inside: avoid; }
.course-pdf .table-scroll { overflow: visible; }
.pdf-watermark { position: fixed; inset: 0; z-index: 0; pointer-events: none; display: flex; align-items: center; justify-content: center; }
.pdf-tile { position: fixed; inset: -20%; z-index: 0; pointer-events: none; transform: rotate(-30deg); display: grid; grid-template-columns: repeat(3, 1fr); row-gap: 120px; align-content: start; padding-top: 40px; }
.pdf-sheet { position: relative; z-index: 1; }
.pdf-running { display: none; }
@media print {
  @page { size: A4; margin: 12mm 14mm; }
  html, body { background: #fff !important; }
  .pdf-running { display: flex; position: fixed; left: 0; right: 0; z-index: 2; background: transparent; }
  .pdf-running.top { top: 0; }
  .pdf-running.bottom { bottom: 0; }
  .pdf-chapter { break-before: page; }
  .pdf-screen-only { display: none !important; }
  .pdf-frame { box-shadow: none !important; border: 0 !important; padding: 0 !important; max-width: none !important; }
}
`;

function Watermark() {
  return (
    <>
      <div className="pdf-watermark" aria-hidden>
        <div className="flex -rotate-30 flex-col items-center gap-6 opacity-[0.06]">
          <Mark className="h-[340px] w-[340px]" />
          <span className="font-serif text-[64px] font-bold tracking-[-0.01em] text-ink">CloudTech Academy</span>
        </div>
      </div>
      <div className="pdf-tile" aria-hidden>
        {Array.from({ length: 36 }, (_, i) => (
          <span key={i} className="text-center font-sans text-[13px] font-semibold uppercase tracking-[0.3em] text-ink opacity-[0.045]">
            CloudTech Academy
          </span>
        ))}
      </div>
    </>
  );
}

function Inner() {
  const { slug } = useParams();
  const { course, loading } = useCourse(slug);
  const auth = useAuth();
  const user = auth.user;
  const isAdmin = user?.role === "admin";
  const allowed = !!course && (course.downloadsEnabled || isAdmin);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);

  useSeo({ title: course ? `${course.title} | CloudTech Academy` : "Download | CloudTech Academy", description: "Download a CloudTech Academy course.", noindex: true });

  // The PDF is always printed in the light theme.
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.remove("dark");
    return () => {
      if (wasDark) root.classList.add("dark");
    };
  }, []);

  // Downloading counts as starting the course, so it shows up in My Learning.
  useEffect(() => {
    if (!course || !allowed) return;
    void getBackend()
      .then((b) => b.enroll(course.id))
      .catch(() => {})
      .finally(() => setReady(true));
  }, [course, allowed]);

  if (!course) return loading ? <PageLoading /> : <NotFound />;
  if (!allowed)
    return (
      <div className="container-page py-20">
        <h1 className="font-serif text-[2.2rem]">Downloads aren't available</h1>
        <p className="mt-3 max-w-xl text-muted">This course can't be downloaded at the moment. You can still study every lesson online, free.</p>
        <Link to={`/courses/${course.slug}`} className="mt-5 inline-block font-semibold text-brass-dark">
          Back to the course
        </Link>
      </div>
    );
  if (!ready) return <PageLoading label="Preparing your download…" />;

  const lessons = publishedLessons(course);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const owner = `${user?.fullName || "Learner"} · ${user?.email ?? ""}`;

  const save = async () => {
    setError(null);
    setPreparing(true);
    try {
      // Wait for every image so none is missing from the PDF.
      await Promise.all([...document.images].map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))));
      window.print();
    } catch {
      setError("Couldn't open the print window. Try again, or use your browser's Print menu.");
    } finally {
      setPreparing(false);
    }
  };

  return (
    <div className="course-pdf min-h-screen">
      <style>{PRINT_CSS}</style>
      <Watermark />

      <div className="pdf-screen-only sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
          <Link to={`/courses/${course.slug}`} className="inline-flex items-center gap-1.5 text-[0.875rem] text-muted hover:text-ink">
            <ArrowLeft aria-hidden className="h-4 w-4" /> Back to the course
          </Link>
          <p className="min-w-0 flex-1 text-[0.875rem] text-muted">
            Choose <strong className="text-ink">Save as PDF</strong> as the printer in the window that opens.
          </p>
          <button type="button" onClick={() => void save()} disabled={preparing} className={buttonClass("primary")}>
            <Download aria-hidden className="h-4 w-4" /> {preparing ? "Preparing…" : "Save as PDF"}
          </button>
        </div>
        {(error || (isAdmin && !course.downloadsEnabled)) && (
          <div className="container-page pb-3">
            {error && <Alert tone="error">{error}</Alert>}
            {isAdmin && !course.downloadsEnabled && <Alert tone="info">Downloads are off for learners on this course. You can see this preview because you're an admin.</Alert>}
          </div>
        )}
      </div>

      {/* Repeated on every printed page. */}
      <div className="pdf-running top items-center justify-between border-b border-line pb-1.5 text-[9px] text-muted" aria-hidden>
        <AcademyLogo size="sm" />
        <span className="max-w-[60%] truncate">{course.title}</span>
      </div>
      <div className="pdf-running bottom items-center justify-between border-t border-line pt-1.5 text-[8.5px] text-muted" aria-hidden>
        <span>
          Licensed to {owner} · {date}
        </span>
        <span>© {SITE.name} · {HOST} · Personal study only, not for sharing or resale</span>
      </div>

      <div className="pdf-sheet">
        <div className="pdf-frame mx-auto my-8 max-w-[52rem] rounded-2xl border border-line bg-white/90 px-6 print:my-0 print:bg-transparent py-10 shadow-[0_30px_60px_-45px_rgba(23,23,23,0.45)] sm:px-12">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <td>
                  <div className="h-0 print:h-[14mm]" />
                </td>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>
                  <div className="h-0 print:h-[10mm]" />
                </td>
              </tr>
            </tfoot>
            <tbody>
              <tr>
                <td className="align-top">
                  <section className="flex min-h-[70vh] flex-col justify-between print:min-h-[240mm]">
                    {/* On paper the running header already carries the logo. */}
                    <div className="print:hidden">
                      <AcademyLogo size="lg" />
                    </div>
                    <div className="py-16">
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-brass-dark">Course notes</p>
                      <h1 className="mt-4 font-serif text-[2.8rem] leading-[1.05] tracking-[-0.02em]">{course.title}</h1>
                      <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-muted">{course.summary}</p>
                      <p className="mt-8 text-[0.9rem] text-ink/80">
                        {course.modules.length} modules · {lessons.length} lessons
                      </p>
                    </div>
                    <div className="border-t border-line pt-5 text-[0.85rem] leading-relaxed text-muted">
                      <p>
                        Prepared for <strong className="text-ink">{user?.fullName || "Learner"}</strong> ({user?.email}) on {date}.
                      </p>
                      <p className="mt-1">
                        © {SITE.name}, part of {SITE.parent}. This copy is for your personal study. Please don't share, upload or resell it. Take the
                        practice tasks, quizzes and final assessment at {HOST}/courses/{course.slug} to earn your badges.
                      </p>
                    </div>
                  </section>

                  <section className="pdf-chapter mt-16 print:mt-0">
                    <h2 className="font-serif text-[1.9rem]">Contents</h2>
                    <ol className="mt-5 border-t border-ink/80">
                      {course.modules.map((m, i) => (
                        <li key={m.id} className="flex gap-4 border-b border-line py-2.5 text-[0.95rem]">
                          <span className="w-7 shrink-0 font-serif text-brass-dark">{String(i + 1).padStart(2, "0")}</span>
                          <span>{m.title}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {course.modules.map((m, i) =>
                    m.lessons
                      .filter((l) => l.published)
                      .map((l) => (
                        <article key={l.id} className="pdf-chapter mt-20 border-t border-line pt-10 print:mt-0 print:border-0 print:pt-0">
                          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                            Module {i + 1} · {m.title}
                          </p>
                          <h2 className="mt-3 font-serif text-[2.1rem] leading-tight">{l.title}</h2>
                          {l.summary && <p className="mt-2 text-[1rem] text-muted">{l.summary}</p>}
                          <div className="mt-8">
                            <LessonContent body={l.body} print />
                          </div>
                        </article>
                      )),
                  )}

                  <section className="pdf-chapter mt-20 border-t border-line pt-10 print:mt-0 print:border-0 print:pt-0">
                    <AcademyLogo />
                    <h2 className="mt-8 font-serif text-[1.9rem]">Earn your badge</h2>
                    <p className="mt-3 max-w-2xl leading-relaxed text-ink/85">
                      These notes cover the lessons. The practice tasks are checked, and your badges are issued, on the course page. When you're ready,
                      take the final assessment at <strong>{HOST}/courses/{course.slug}</strong>. Learning and badges are always free.
                    </p>
                  </section>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CourseDownload() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
