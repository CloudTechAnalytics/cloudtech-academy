import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Award, CheckCircle2, ChevronDown, GraduationCap, CircleDashed, Clock, FolderKanban, Hourglass, PlayCircle, Target, UserCheck, Users } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { useCourses, useMyProgrammes, useProgrammes } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { getBackend, type Certificate, type Credential, type Enrollment } from "@/lib/backend";
import { courseMinutes } from "@/lib/certificates";
import { durationLabel } from "@/lib/format";
import { DELIVERY_LABEL, ENROLMENT_MESSAGE, coursePrice, enrolmentState, formatPrice, isPaid, programmeCourseIds } from "@/lib/commerce";
import { capstoneOf, LEVELS, programmeCertificateAvailable, requiredCourses, type Track, type TrackItem } from "@/content/tracks";
import { PRACTICE_PROJECTS } from "@/content/projects";
import type { Course } from "@/content/types";
import { Badge } from "@/components/CourseCard";
import { Button, ButtonLink } from "@/components/Button";
import { TrackCard } from "@/components/TrackCard";
import { ProfessionalByArea } from "@/components/ProfessionalByArea";
import NotFound from "./NotFound";

/** How long a course takes, as shown on its card. */
const courseLength = (c: Course) => (c.format === "short" ? durationLabel(courseMinutes(c)) : durationLabel(undefined, c.estimatedHours));

/** /programmes: the Professional Programmes (paid), then the free learning paths. */
export function TracksList() {
  const courses = useCourses();
  const tracks = useProgrammes();
  const professional = tracks.filter((t) => isPaid(t));
  const free = tracks.filter((t) => !isPaid(t));
  useSeo({
    title: "Professional Programmes | CloudTech Academy",
    description: "Professional programmes and courses from CloudTech Academy: data analytics, data science, business analysis, AI engineering, cloud, software, business, trade and logistics, project management, HR and more. Full curriculum, projects and a professional certificate.",
    jsonLd: breadcrumbs([["Professional Programmes", "/programmes"]]),
  });
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-5xl py-16 sm:py-20">
          <p className="kicker">Professional programmes</p>
          <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">Free courses help you start. Programmes help you become a professional.</h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">
            A professional programme is a complete, structured route: the full curriculum in the right order, practical projects, assessments, a capstone and a professional
            certificate. The free courses inside each one stay free, so you can start before you enroll.
          </p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-4">
            {([1, 2, 3, 4] as const).map((l) => (
              <li key={l} className="rounded-xl border border-line bg-paper p-4">
                <p className="font-serif text-[1.1rem]">
                  <span className="text-brass-dark">{l}.</span> {LEVELS[l].name}
                </p>
                <p className="mt-1 text-[0.875rem] text-muted">{LEVELS[l].description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="container-page py-14">
        <ProfessionalByArea tracks={professional} courses={courses} />
        {free.length > 0 && (
          <>
            <h2 className="mt-16 font-serif text-[1.8rem]">Free learning paths</h2>
            <p className="mt-2 max-w-2xl text-muted">Guided routes through free courses, with a free badge at the end.</p>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {free.map((t) => (
                <li key={t.id}>
                  <TrackCard track={t} courses={courses} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

type Mine = { enrollments: Enrollment[]; credentials: Credential[]; certificates: Certificate[] } | null;

function ItemCard({ item, courses, mine, inProgramme = false }: { item: TrackItem; courses: Course[]; mine: Mine; inProgramme?: boolean }) {
  if (item.kind === "upcoming")
    return (
      <div className="rounded-2xl border border-dashed border-line-strong bg-sand/40 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="soon">In preparation</Badge>
          <span className="text-[0.8125rem] text-muted">Level {item.level} · {LEVELS[item.level].name}</span>
        </div>
        <p className="mt-2 font-serif text-[1.3rem] leading-snug text-ink/80">{item.title}</p>
        <p className="mt-1 text-[0.9375rem] text-muted">{item.why}</p>
      </div>
    );
  if (item.kind === "project") {
    const p = PRACTICE_PROJECTS.find((x) => x.id === item.projectId);
    if (!p) return null;
    return (
      <div className="rounded-2xl border border-line bg-paper p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Portfolio project</Badge>
          <span className="text-[0.8125rem] text-muted">Level 4 · {LEVELS[4].name}</span>
        </div>
        <p className="mt-2 flex items-center gap-2 font-serif text-[1.3rem] leading-snug">
          <FolderKanban aria-hidden className="h-5 w-5 shrink-0 text-brass-dark" />
          <Link to={`/projects/${p.id}`} className="hover:text-brass-dark">
            {p.title}
          </Link>
        </p>
        <p className="mt-1 text-[0.9375rem] text-muted">{item.why}</p>
      </div>
    );
  }
  const c = courses.find((x) => x.id === item.courseId);
  if (!c) return null;
  const done = mine?.credentials.some((x) => x.courseId === c.id && x.kind === "course_completion" && x.status === "valid");
  const started = mine?.enrollments.some((e) => e.courseId === c.id);
  return (
    <div className={`rounded-2xl border p-5 ${done ? "border-success/40 bg-success-bg/40" : "border-line bg-paper"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={c.format === "short" ? "neutral" : "free"}>{c.format === "short" ? "Short course" : c.level === 4 ? "Capstone" : "Full course"}</Badge>
        <Badge tone={isPaid(c) ? "neutral" : "free"}>{isPaid(c) ? "Professional curriculum" : inProgramme ? "Free introduction" : "Free"}</Badge>
        <span className="text-[0.8125rem] text-muted">Level {c.level} · {LEVELS[c.level].name}</span>
        {item.required === false && <span className="text-[0.8125rem] text-muted">· Optional</span>}
      </div>
      <p className="mt-2 font-serif text-[1.3rem] leading-snug">
        <Link to={`/courses/${c.slug}`} className="hover:text-brass-dark">
          {c.title}
        </Link>
      </p>
      <p className="mt-1 text-[0.9375rem] text-muted">{item.why}</p>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-muted">
        <span className="inline-flex items-center gap-1">
          <Clock aria-hidden className="h-3.5 w-3.5" /> {courseLength(c)}
        </span>
        {mine &&
          (done ? (
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> Completed
            </span>
          ) : started ? (
            <span className="inline-flex items-center gap-1 font-semibold text-brass-dark">
              <PlayCircle aria-hidden className="h-3.5 w-3.5" /> In progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <CircleDashed aria-hidden className="h-3.5 w-3.5" /> Not started
            </span>
          ))}
      </p>
    </div>
  );
}

/** One module of a programme: a dropdown that opens to show what it teaches. */
function ProgrammeModule({ index, stage, courses, mine, open, inProgramme }: { index: number; stage: Track["stages"][number]; courses: Course[]; mine: Mine; open: boolean; inProgramme: boolean }) {
  const items = stage.items.map((item) => ({ item, course: item.kind === "course" ? courses.find((c) => c.id === item.courseId) : undefined }));
  const real = items.filter((x) => x.course);
  const done = real.filter((x) => mine?.credentials.some((c) => c.courseId === x.course!.id && c.kind === "course_completion" && c.status === "valid")).length;
  return (
    <details open={open} className="group rounded-2xl border border-line bg-paper [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 sm:p-6">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brass-pale font-serif text-[1.05rem] text-brass-dark">{index + 1}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.75rem] font-semibold uppercase tracking-wide text-brass-dark">Module {index + 1}</span>
          <span className="mt-0.5 block font-serif text-[1.35rem] leading-snug">{stage.title}</span>
          <span className="mt-1 block text-[0.9375rem] text-muted">{stage.summary}</span>
          {mine && real.length > 0 && (
            <span className="mt-2 block text-[0.8125rem] font-semibold text-muted">
              {done} of {real.length} {real.length === 1 ? "course" : "courses"} complete
            </span>
          )}
        </span>
        <ChevronDown aria-hidden className="mt-2 h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-line p-5 sm:p-6">
        {items.map(({ item, course }) =>
          course ? (
            <div key={course.id} className="rounded-xl bg-sand/40 p-4">
              <ItemCard item={item} courses={courses} mine={mine} inProgramme={inProgramme} />
              {course.modules.length > 0 && (
                <>
                  <p className="mt-4 text-[0.8125rem] font-semibold">You'll learn</p>
                  <ul className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {course.modules.map((m) => (
                      <li key={m.id} className="flex items-start gap-2 text-[0.9rem]">
                        <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {m.title}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <ItemCard key={item.kind === "project" ? item.projectId : item.kind === "upcoming" ? item.title : ""} item={item} courses={courses} mine={mine} inProgramme={inProgramme} />
          ),
        )}
      </div>
    </details>
  );
}

/** /programmes/:slug: one programme's stages, the learner's progress, the programme badge and the Professional Certificate. */
export function TrackDetail() {
  const { slug } = useParams();
  const tracks = useProgrammes();
  const track = tracks.find((t) => t.slug === slug);
  const { held } = useMyProgrammes();
  const courses = useCourses();
  const auth = useAuth();
  const [mine, setMine] = useState<Mine>(null);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: track ? `${(track.access === "paid" ? track.programmeName : undefined) ?? track.programmeTitle ?? track.title} | ${track.access === "paid" ? "Professional Programmes" : "Learning Paths"} | CloudTech Academy` : "Programme not found | CloudTech Academy",
    description: track?.summary ?? "",
    noindex: !track,
    jsonLd: track
      ? breadcrumbs([
          [track.access === "paid" ? "Professional Programmes" : "Learning Paths", "/programmes"],
          [track.title, `/programmes/${track.slug}`],
        ])
      : undefined,
  });

  useEffect(() => {
    if (auth.status !== "signed-in") {
      setMine(null);
      return;
    }
    let alive = true;
    void (async () => {
      const b = await getBackend();
      const [enrollments, credentials, certificates] = await Promise.all([b.listEnrollments(), b.listMyCredentials(), b.listMyCertificates()]);
      if (alive) setMine({ enrollments, credentials, certificates });
    })().catch(() => {});
    return () => {
      alive = false;
    };
  }, [auth.status]);

  if (!track) return <NotFound />;

  const published = new Set(courses.filter((c) => c.published && c.status === "available").map((c) => c.id));
  const required = requiredCourses(track).filter((id) => published.has(id));
  const completedIds = new Set((mine?.credentials ?? []).filter((c) => c.kind === "course_completion" && c.status === "valid").map((c) => c.courseId));
  const doneCount = required.filter((id) => completedIds.has(id)).length;
  const trackBadge = mine?.credentials.find((c) => c.kind === "track_completion" && c.trackId === track.id && c.status === "valid");
  const eligible = !!mine && required.length > 0 && doneCount === required.length;
  const certAvailable = programmeCertificateAvailable(track);
  const capstone = capstoneOf(track);
  const programmeCert = mine?.certificates.find((c) => c.source === "programme" && c.trackId === track.id && c.status === "valid");
  const firstCourse = track.stages.flatMap((s) => s.items).find((i): i is Extract<TrackItem, { kind: "course" }> => i.kind === "course");
  const nextCourse = required.find((id) => !completedIds.has(id));
  const startHere = courses.find((c) => c.id === (nextCourse ?? firstCourse?.courseId));

  const paid = isPaid(track);
  const holds = !!held?.includes(track.id);
  const price = paid ? coursePrice(track) : null;
  const state = enrolmentState(track);
  const enrollTo = auth.status === "signed-in" ? `/programmes/${track.slug}/enroll` : `/sign-up?next=${encodeURIComponent(`/programmes/${track.slug}/enroll`)}`;
  const name = (paid ? track.programmeName : undefined) ?? track.programmeTitle ?? track.title;
  const allIds = programmeCourseIds(track);
  const inTrack = courses.filter((c) => allIds.includes(c.id));
  const paidCount = inTrack.filter((c) => isPaid(c)).length;
  const includedList = [
    `${inTrack.length} courses in one structured programme${paidCount ? `, ${paidCount} of them professional-only` : ""}`,
    ...(track.deliveryType ? [DELIVERY_LABEL[track.deliveryType]] : []),
    ...(capstone ? ["Capstone project"] : []),
    ...(certAvailable ? ["Professional certificate included when you earn the programme badge"] : []),
    ...(track.instructorSupport ? ["Instructor support"] : []),
    ...(track.communityAccess ? ["CloudTech WhatsApp community access"] : []),
    ...(track.included ?? []),
  ];
  const claimIncluded = async () => {
    setClaiming(true);
    setError(null);
    try {
      const cert = await (await getBackend()).claimProgrammeCertificate(track.id);
      setMine((m) => (m ? { ...m, certificates: [...m.certificates, cert] } : m));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't issue the certificate.");
    } finally {
      setClaiming(false);
    }
  };

  const claim = async () => {
    setClaiming(true);
    setError(null);
    try {
      const cred = await (await getBackend()).issueTrackCredential(track.id);
      setMine((m) => (m ? { ...m, credentials: [...m.credentials, cred] } : m));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't issue the programme badge.");
    } finally {
      setClaiming(false);
    }
  };

  const box = (
            <div className="rounded-2xl border border-line-strong bg-paper p-5">
              <p className="flex items-center gap-2 font-semibold">
                <Award aria-hidden className="h-5 w-5 text-brass-dark" /> {track.badge}
              </p>
              {trackBadge ? (
                <>
                  <p className="mt-2 text-[0.9375rem] text-success">You've earned this programme badge.</p>
                  <ButtonLink to={`/credentials/${trackBadge.credentialId}`} className="mt-3" variant="secondary">
                    View your credential
                  </ButtonLink>
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="flex items-center gap-2 font-semibold">
                      <GraduationCap aria-hidden className="h-5 w-5 text-brass-dark" /> Professional Certificate
                    </p>
                    {programmeCert ? (
                      <>
                        <p className="mt-2 text-[0.9375rem] text-success">You hold the official certificate.</p>
                        <ButtonLink to={`/dashboard/certificates/${programmeCert.certificateId}`} className="mt-3">
                          View your certificate
                        </ButtonLink>
                      </>
                    ) : certAvailable && paid && holds ? (
                      <>
                        <p className="mt-2 text-[0.9375rem] text-muted">Your official, verifiable certificate is included with your enrolment.</p>
                        <Button onClick={() => void claimIncluded()} loading={claiming} className="mt-3">
                          Claim your Professional Certificate
                        </Button>
                      </>
                    ) : certAvailable ? (
                      <>
                        <p className="mt-2 text-[0.9375rem] text-muted">One official, verifiable certificate for the whole programme.</p>
                        <ButtonLink to={`/programmes/${track.slug}/certificate`} className="mt-3" arrow>
                          Get your Professional Certificate
                        </ButtonLink>
                      </>
                    ) : (
                      <p className="mt-2 text-[0.9375rem] text-muted">Opens when the capstone project for this programme is released.</p>
                    )}
                  </div>
                </>
              ) : mine ? (
                <>
                  <p className="mt-2 text-[0.9375rem] text-muted">
                    {doneCount} of {required.length} required courses complete{capstone ? ", including the capstone" : ""}.
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand" aria-hidden>
                    <div className="h-full rounded-full bg-brass" style={{ width: `${required.length ? (doneCount / required.length) * 100 : 0}%` }} />
                  </div>
                  {eligible ? (
                    <Button onClick={() => void claim()} loading={claiming} className="mt-4">
                      Claim your programme badge
                    </Button>
                  ) : (
                    startHere && (
                      <ButtonLink to={`/courses/${startHere.slug}`} className="mt-4" arrow>
                        {doneCount ? "Next" : "Start"}: {startHere.title}
                      </ButtonLink>
                    )
                  )}
                  {error && <p className="mt-3 text-[0.875rem] text-danger">{error}</p>}
                </>
              ) : (
                <>
                  <p className="mt-2 text-[0.9375rem] text-muted">
                    Complete every required course{capstone ? " and the capstone project" : ""} to earn the free programme badge
                    {certAvailable ? ", then claim your official Professional Certificate" : ""}.
                  </p>
                  {startHere && (
                    <ButtonLink to={`/courses/${startHere.slug}`} className="mt-4" arrow>
                      Start with {startHere.title}
                    </ButtonLink>
                  )}
                </>
              )}
            </div>
  );

  const buyCard = (
    <div className="rounded-2xl border border-brass/40 bg-paper p-6 text-ink shadow-[0_30px_60px_-35px_rgba(0,0,0,0.6)]">
      {price ? (
        <>
          <p className="flex flex-wrap items-baseline gap-3">
            <span className="font-serif text-[2.4rem] leading-none">{formatPrice(price.amount, price.currency)}</span>
            {price.discounted && <s className="text-[1.1rem] text-subtle">{formatPrice(price.listAmount, price.currency)}</s>}
          </p>
          <p className="mt-1 text-[0.8125rem] text-muted">One-off payment. Every professional course in the programme unlocks the moment your payment is confirmed.</p>
        </>
      ) : (
        <p className="font-serif text-[1.4rem]">Enrolment opens soon</p>
      )}
      <div className="mt-5">
        {price && state === "open" ? (
          <ButtonLink to={enrollTo} className="w-full">
            Enroll Now — {formatPrice(price.amount, price.currency)}
          </ButtonLink>
        ) : (
          <p className="rounded-lg border border-line-strong bg-sand px-4 py-3 text-center text-[0.9375rem] text-muted">
            {state !== "open" ? ENROLMENT_MESSAGE[state] : "Enrolment opens soon. Start with the free courses below in the meantime."}
          </p>
        )}
      </div>
      {auth.status !== "signed-in" && price && state === "open" && <p className="mt-3 text-center text-[0.8125rem] text-muted">You'll create a free account first, then pay.</p>}
      {includedList.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <p className="text-[0.875rem] font-semibold">What's included</p>
          <ul className="mt-3 space-y-2">
            {includedList.map((i) => (
              <li key={i} className="flex items-start gap-2.5 text-[0.875rem]">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {i}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <>
      <section className={paid ? "border-b border-line bg-ink text-ivory" : "border-b border-line"}>
        <div className="container-page max-w-5xl py-16 sm:py-20">
          <Link to="/programmes" className={`text-[0.875rem] ${paid ? "text-ivory/70 hover:text-ivory" : "text-muted hover:text-ink"}`}>
            ← {paid ? "Professional programmes" : "Learning paths"}
          </Link>
          <p className={`kicker mt-6 ${paid ? "!text-brass-pale" : ""}`}>{paid ? "Professional Programme · Build a career" : `Free Learning Path · ${track.outcome}`}</p>
          <h1 className="mt-3 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">{name}</h1>
          <p className={`mt-5 max-w-3xl text-[1.125rem] leading-relaxed ${paid ? "text-ivory/80" : "text-muted"}`}>{track.summary}</p>
          {paid && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem] text-ivory/90">
              {[
                ...(track.durationLabel ? [{ icon: Clock, label: track.durationLabel }] : []),
                { icon: Users, label: DELIVERY_LABEL[track.deliveryType ?? "self_paced"] },
                { icon: Target, label: `${inTrack.length} courses` },
                ...(capstone ? [{ icon: FolderKanban, label: "Capstone project" }] : []),
                ...(certAvailable ? [{ icon: GraduationCap, label: "Professional certificate" }] : []),
              ].map((f) => (
                <li key={f.label} className="flex items-center gap-2">
                  <f.icon aria-hidden className="h-4 w-4 text-brass-pale" /> {f.label}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <div className={paid ? "text-ivory" : ""}>
              <p className="text-[0.875rem] font-semibold">What you'll be able to do</p>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {track.skills.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[0.9375rem]">
                    <CheckCircle2 aria-hidden className={`mt-0.5 h-4 w-4 shrink-0 ${paid ? "text-brass-pale" : "text-brass-dark"}`} /> {s}
                  </li>
                ))}
              </ul>
            </div>
            {paid && !holds ? buyCard : box}
          </div>
        </div>
      </section>

      {paid && (
        <section className="container-page max-w-5xl pt-14">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-[1.8rem] leading-tight">Programme overview</h2>
              <p className="mt-4 whitespace-pre-line text-[1.0625rem] leading-relaxed text-ink/85">{track.overview?.trim() || track.summary}</p>
              {track.professionalOutcome || track.outcome ? (
                <div className="mt-6 rounded-xl border border-brass/40 bg-brass-pale/40 p-5">
                  <h3 className="flex items-center gap-2 font-serif text-[1.25rem]">
                    <Target aria-hidden className="h-5 w-5 text-brass-dark" /> Professional outcome
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/85">{track.professionalOutcome || `${track.outcome}.`}</p>
                </div>
              ) : null}
            </div>
            <div className="space-y-8">
              {!!track.audience?.length && (
                <div>
                  <h2 className="font-serif text-[1.5rem] leading-tight">Who this is for</h2>
                  <ul className="mt-4 space-y-2.5">
                    {track.audience.map((a) => (
                      <li key={a} className="flex items-start gap-2.5 text-[0.9375rem]">
                        <UserCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!!track.projectPreviews?.length && (
                <div>
                  <h2 className="font-serif text-[1.5rem] leading-tight">Projects you'll build</h2>
                  <ul className="mt-4 space-y-3">
                    {track.projectPreviews.map((p) => (
                      <li key={p.title} className="rounded-xl border border-line bg-paper p-4">
                        <p className="font-serif text-[1.1rem]">{p.title}</p>
                        <p className="mt-1 text-[0.9rem] leading-relaxed text-muted">{p.summary}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {track.instructor?.name && (
                <div>
                  <h2 className="font-serif text-[1.5rem] leading-tight">Your instructor</h2>
                  <div className="mt-4 rounded-xl border border-line bg-paper p-4">
                    <p className="font-serif text-[1.15rem]">{track.instructor.name}</p>
                    {track.instructor.title && <p className="text-[0.875rem] font-semibold text-brass-dark">{track.instructor.title}</p>}
                    {track.instructor.bio && <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{track.instructor.bio}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="container-page max-w-5xl py-14">
        <h2 className="font-serif text-[1.8rem] leading-tight">{paid ? "Full curriculum, module by module" : "What you'll learn, module by module"}</h2>
        <p className="mt-1 text-muted">
          {paid
            ? "Free introductions are open to everyone. The professional curriculum goes deeper, with real-world projects and assessments, and unlocks when you enroll."
            : "Work through the modules in order. Open one to see exactly what it covers."}
        </p>
        <ol className="mt-6 space-y-3">
          {track.stages.map((stage, i) => (
            <li key={stage.title}>
              <ProgrammeModule index={i} stage={stage} courses={courses} mine={mine} open={i === 0} inProgramme={paid} />
            </li>
          ))}
        </ol>
        <p className="mt-12 flex items-start gap-2 text-[0.9375rem] text-muted">
          <Hourglass aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          Courses marked "In preparation" join the programme when they're ready. If you've already earned the programme badge by then, you keep it.
        </p>
      </section>
    </>
  );
}
