import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Award, CheckCircle2, GraduationCap, CircleDashed, Clock, FolderKanban, Hourglass, PlayCircle } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";
import { useCourses } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { getBackend, type Certificate, type Credential, type Enrollment } from "@/lib/backend";
import { courseMinutes } from "@/lib/certificates";
import { durationLabel } from "@/lib/format";
import { capstoneOf, LEVELS, programmeCertificateAvailable, requiredCourses, TRACKS, type TrackItem } from "@/content/tracks";
import { PRACTICE_PROJECTS } from "@/content/projects";
import type { Course } from "@/content/types";
import { Badge } from "@/components/CourseCard";
import { Button, ButtonLink } from "@/components/Button";
import { TrackCard } from "@/components/TrackCard";
import NotFound from "./NotFound";

/** How long a course takes, as shown on its card. */
const courseLength = (c: Course) => (c.format === "short" ? durationLabel(courseMinutes(c)) : durationLabel(undefined, c.estimatedHours));

/** /programmes: every Professional Programme. */
export function TracksList() {
  const courses = useCourses();
  useSeo({
    title: "Professional Programmes | CloudTech Academy",
    description: "Complete routes from no experience to job-ready: courses in order, a capstone project, and an official Professional Certificate for the whole programme.",
    jsonLd: breadcrumbs([["Professional Programmes", "/programmes"]]),
  });
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-5xl py-16 sm:py-20">
          <p className="kicker">Professional programmes</p>
          <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">Learn skills. Build projects. Earn credentials.</h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">
            A programme is a whole career route: the right courses in the right order, ending in a capstone project. Finish it and you earn a free programme badge, then
            can claim one official Professional Certificate that covers everything you learned, verifiable by anyone.
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
      <section className="container-page max-w-5xl py-14">
        <ul className="grid gap-5 sm:grid-cols-2">
          {TRACKS.map((t) => (
            <li key={t.id}>
              <TrackCard track={t} courses={courses} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

type Mine = { enrollments: Enrollment[]; credentials: Credential[]; certificates: Certificate[] } | null;

function ItemCard({ item, courses, mine }: { item: TrackItem; courses: Course[]; mine: Mine }) {
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
        <Badge tone={c.format === "short" ? "neutral" : "free"}>{c.format === "short" ? "Short course" : c.level === 4 ? "Capstone" : "Professional course"}</Badge>
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

/** /programmes/:slug: one programme's stages, the learner's progress, the programme badge and the Professional Certificate. */
export function TrackDetail() {
  const { slug } = useParams();
  const track = TRACKS.find((t) => t.slug === slug);
  const courses = useCourses();
  const auth = useAuth();
  const [mine, setMine] = useState<Mine>(null);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: track ? `${track.programmeTitle ?? track.title} | Professional Programmes | CloudTech Academy` : "Programme not found | CloudTech Academy",
    description: track?.summary ?? "",
    noindex: !track,
    jsonLd: track
      ? breadcrumbs([
          ["Professional Programmes", "/programmes"],
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

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-5xl py-16 sm:py-20">
          <Link to="/programmes" className="text-[0.875rem] text-muted hover:text-ink">
            ← Professional programmes
          </Link>
          <p className="kicker mt-6">Professional Programme · {track.outcome}</p>
          <h1 className="mt-3 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-[3.4rem]">{track.programmeTitle ?? track.title}</h1>
          <p className="mt-5 max-w-3xl text-[1.125rem] leading-relaxed text-muted">{track.summary}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-[0.875rem] font-semibold">What you'll be able to do</p>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {track.skills.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[0.9375rem]">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brass-dark" /> {s}
                  </li>
                ))}
              </ul>
            </div>
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
          </div>
        </div>
      </section>

      <section className="container-page max-w-5xl py-14">
        <ol className="space-y-12">
          {track.stages.map((stage, i) => (
            <li key={stage.title}>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-[1.1rem] text-brass-dark">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-serif text-[1.8rem] leading-tight">{stage.title}</h2>
              </div>
              <p className="mt-1 text-muted">{stage.summary}</p>
              <ul className="mt-5 grid gap-4 md:grid-cols-2">
                {stage.items.map((item) => (
                  <li key={item.kind === "course" ? item.courseId : item.kind === "project" ? item.projectId : item.title}>
                    <ItemCard item={item} courses={courses} mine={mine} />
                  </li>
                ))}
              </ul>
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
