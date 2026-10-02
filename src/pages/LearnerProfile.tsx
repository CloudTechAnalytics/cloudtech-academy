import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Award, BadgeCheck, Check, ExternalLink, FileBadge, FolderKanban, Link2, ShieldCheck, UserRound } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useAuth } from "@/lib/auth";
import { getBackend, IS_LIVE, type PublicCredential, type PublicProfile } from "@/lib/backend";
import { formatDate, plural } from "@/lib/format";
import { SITE } from "@/lib/site";
import { profilePath } from "@/lib/profile";
import { BUNDLED_COURSES } from "@/content";
import { findProject } from "@/content/projects";
import { ProjectCover } from "@/components/ProjectCover";
import { badgeIcon } from "@/components/BadgeIcon";
import { ButtonLink } from "@/components/Button";

type CourseGroup = {
  courseId: string;
  courseTitle: string;
  completion: PublicCredential | null;
  badges: PublicCredential[];
};

/** Group a learner's credentials by course, newest course first. */
function byCourse(credentials: PublicCredential[]): CourseGroup[] {
  const groups = new Map<string, CourseGroup>();
  for (const c of credentials) {
    if (!c.courseId) continue;
    const g = groups.get(c.courseId) ?? {
      courseId: c.courseId,
      courseTitle: c.courseTitle,
      completion: null,
      badges: [],
    };
    if (c.kind === "course_completion") g.completion = c;
    else g.badges.push(c);
    groups.set(c.courseId, g);
  }
  return [...groups.values()];
}

function BadgeTile({ cred }: { cred: PublicCredential }) {
  const course = BUNDLED_COURSES.find((c) => c.id === cred.courseId);
  const module = course?.modules.find((m) => m.title === cred.moduleTitle || m.badge === cred.badgeName);
  const completion = cred.kind === "course_completion";
  const Icon = badgeIcon({ code: module?.badgeCode, categoryId: course?.categoryId, completion });
  return (
    <li>
      <Link
        to={`/credentials/${encodeURIComponent(cred.credentialId)}`}
        className={`group flex h-full items-start gap-3 rounded-xl border p-4 transition-colors hover:border-brass ${completion ? "border-brass/50 bg-brass-pale/40" : "border-line bg-paper"}`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${completion ? "bg-ink text-ivory" : "bg-brass-pale text-brass-dark"}`}
        >
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold leading-snug text-ink group-hover:text-brass-dark">
            {cred.badgeName}
          </span>
          <span className="mt-0.5 block text-[0.8125rem] text-muted">
            {completion ? "Course completion" : "Module badge"} · {formatDate(cred.issuedAt)}
          </span>
          <span className="mt-1 block font-mono text-[0.75rem] text-subtle">{cred.credentialId}</span>
        </span>
      </Link>
    </li>
  );
}

/** A project badge, with the learner's work: the part of the profile employers care about most. */
function ProjectTile({ cred }: { cred: PublicCredential }) {
  const project = findProject(cred.projectId ?? undefined);
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-line bg-paper">
      {project && <ProjectCover cover={project.cover} className="h-16 w-full" />}
      <div className="flex flex-1 flex-col p-4">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-semibold leading-snug">{cred.badgeName}</span>
          {cred.reviewed && (
            <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success-bg px-2 py-0.5 text-[0.75rem] font-semibold text-success">
              <ShieldCheck aria-hidden className="h-3.5 w-3.5" /> Reviewed by CloudTech
            </span>
          )}
        </p>
        <p className="mt-0.5 text-[0.8125rem] text-muted">
          {project ? `${project.company} · ` : ""}Project badge · {formatDate(cred.issuedAt)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-[0.875rem]">
          {cred.workUrl && (
            <a href={cred.workUrl} target="_blank" rel="noopener noreferrer nofollow ugc" className="inline-flex items-center gap-1 font-semibold text-brass-dark hover:text-ink">
              View the work <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
          )}
          <Link to={`/credentials/${encodeURIComponent(cred.credentialId)}`} className="font-mono text-[0.75rem] text-subtle hover:text-ink">
            {cred.credentialId}
          </Link>
        </div>
      </div>
    </li>
  );
}

/** A learner's public skills profile: every valid badge and certificate, grouped by course. Only shown if the learner switched it on. */
export default function LearnerProfile() {
  const { slug = "" } = useParams();
  const auth = useAuth();
  const [profile, setProfile] = useState<PublicProfile | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useSeo({
    title: profile ? `${profile.name} | Skills profile | CloudTech Academy` : "Skills profile | CloudTech Academy",
    description: profile
      ? `${profile.name} has earned ${plural(profile.credentials.length, "credential")} from CloudTech Academy. Each one can be checked with its credential ID.`
      : "A learner's verified skills profile on CloudTech Academy.",
    noindex: true,
  });

  useEffect(() => {
    let alive = true;
    void getBackend()
      .then((b) => b.getPublicProfile(slug))
      .then((p) => alive && setProfile(p))
      .catch(() => alive && setProfile(null));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (profile === undefined)
    return (
      <div className="container-page py-24 text-center text-muted" aria-live="polite">
        Loading profile…
      </div>
    );

  if (!profile)
    return (
      <div className="container-page max-w-2xl py-20">
        <p className="flex items-center gap-2 font-semibold text-muted">
          <UserRound aria-hidden className="h-5 w-5" /> Profile not found
        </p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-tight">This profile doesn't exist or is private</h1>
        <p className="mt-3 text-muted">
          Learners choose whether to share their profile. Check the address, or ask them for their credential IDs
          instead.
        </p>
        {!IS_LIVE && (
          <p className="mt-3 text-[0.875rem] text-muted">
            This is the demo version of the Academy: profiles can only be viewed in the browser that created them.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to="/certificates#verify" variant="secondary">
            Check a credential
          </ButtonLink>
          <ButtonLink to="/students">Explore free student courses</ButtonLink>
        </div>
      </div>
    );

  const groups = byCourse(profile.credentials);
  const badges = profile.credentials.filter((c) => c.kind === "module_badge").length;
  const completions = profile.credentials.filter((c) => c.kind === "course_completion").length;
  const projects = profile.credentials.filter((c) => c.kind === "project_badge");
  const url = `${SITE.url}${profilePath(profile.slug)}`;
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const mine = auth.status === "signed-in" && auth.user.fullName.trim() === profile.name;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: the address is shown on the page to copy by hand. */
    }
  };

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page max-w-5xl py-12 sm:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span
              aria-hidden
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-[2rem] text-ivory"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <p className="kicker">Verified skills profile</p>
              <h1 className="mt-2 font-serif text-[2.4rem] leading-[1.08] sm:text-[2.8rem]">{profile.name}</h1>
              {profile.headline && <p className="mt-2 text-[1.0625rem] text-muted">{profile.headline}</p>}
              <p className="mt-2 text-[0.875rem] text-muted">
                Learning with CloudTech Academy since {formatDate(profile.memberSince)}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
            {[
              { label: "Badges", value: badges, Icon: BadgeCheck },
              { label: "Projects", value: projects.length, Icon: FolderKanban },
              { label: "Courses completed", value: completions, Icon: Award },
              { label: "Certificates", value: profile.certificates.length, Icon: FileBadge },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-xl border border-line bg-paper p-4">
                <Icon aria-hidden className="h-4 w-4 text-brass-dark" />
                <p className="mt-2 font-serif text-[1.9rem] leading-none">{value}</p>
                <p className="mt-1 text-[0.8125rem] text-muted">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.875rem]">
            <button
              type="button"
              onClick={() => void copy()}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 font-semibold text-ink hover:border-ink"
            >
              {copied ? (
                <Check aria-hidden className="h-4 w-4 text-success" />
              ) : (
                <Link2 aria-hidden className="h-4 w-4" />
              )}
              {copied ? "Link copied" : "Copy profile link"}
            </button>
            <span className="break-all text-muted">{url.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </section>

      <section className="container-page max-w-5xl py-12">
        {groups.length === 0 && projects.length === 0 && profile.certificates.length === 0 ? (
          <div className="rounded-2xl border border-line bg-paper p-8 text-center">
            <p className="font-serif text-[1.4rem]">No badges yet</p>
            <p className="mt-2 text-muted">
              {mine
                ? "Pass a module check to earn your first badge. It will appear here."
                : "Badges will appear here as they're earned."}
            </p>
            {mine && (
              <ButtonLink to="/students" className="mt-5">
                Find a course
              </ButtonLink>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {projects.length > 0 && (
              <div>
                <h2 className="font-serif text-[1.5rem]">Projects</h2>
                <p className="mt-1 text-[0.9375rem] text-muted">Real analysis on business data, with the work attached.</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((c) => (
                    <ProjectTile key={c.credentialId} cred={c} />
                  ))}
                </ul>
              </div>
            )}

            {profile.certificates.length > 0 && (
              <div>
                <h2 className="font-serif text-[1.5rem]">Official certificates</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.certificates.map((c) => (
                    <li key={c.certificateId}>
                      <Link
                        to={`/verify/${encodeURIComponent(c.certificateId)}`}
                        className="flex items-start gap-3 rounded-xl border border-ink/30 bg-paper p-4 hover:border-brass"
                      >
                        <FileBadge aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brass-dark" />
                        <span>
                          <span className="block font-semibold">{c.courseTitle}</span>
                          <span className="block text-[0.8125rem] text-muted">
                            Issued {formatDate(c.issuedAt)} · <span className="font-mono">{c.certificateId}</span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {groups.map((g) => {
              const course = BUNDLED_COURSES.find((c) => c.id === g.courseId);
              return (
                <div key={g.courseId}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-serif text-[1.5rem]">
                      {course ? (
                        <Link to={`/courses/${course.slug}`} className="hover:text-brass-dark">
                          {g.courseTitle}
                        </Link>
                      ) : (
                        g.courseTitle
                      )}
                    </h2>
                    {course && course.modules.some((m) => m.badge) && (
                      <p className="text-[0.8125rem] text-muted">
                        {g.badges.length} of {course.modules.filter((m) => m.badge).length} module badges
                        {g.completion ? " · completed" : ""}
                      </p>
                    )}
                  </div>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {g.completion && <BadgeTile cred={g.completion} />}
                    {g.badges.map((c) => (
                      <BadgeTile key={c.credentialId} cred={c} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-12 border-t border-line pt-6 text-[0.875rem] text-muted">
          Every badge and certificate on this page was issued by{" "}
          <strong className="font-semibold text-ink">CloudTech Academy</strong> after the learner passed the required
          checks. Select any of them to see its credential page.
        </p>
        {!mine && (
          <div className="mt-8 rounded-2xl border border-line bg-sand/50 p-6">
            <p className="font-serif text-[1.3rem]">Build your own skills profile</p>
            <p className="mt-1.5 text-muted">Free short courses for students, with a badge for every module.</p>
            <ButtonLink to="/students" className="mt-4" arrow>
              See the Student Starter courses
            </ButtonLink>
          </div>
        )}
      </section>
    </>
  );
}
