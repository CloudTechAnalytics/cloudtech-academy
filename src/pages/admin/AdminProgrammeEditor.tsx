import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import type { CourseSalesFields } from "@/content/catalog";
import { Badge } from "@/components/CourseCard";
import { Button } from "@/components/Button";
import { Alert, TextArea, TextField } from "@/components/Form";
import { useProgrammes } from "@/lib/data";
import { isPaid, priceLabel, programmeCourseIds, salesOf, withSales } from "@/lib/commerce";
import { TRACKS } from "@/content/tracks";
import NotFound from "../NotFound";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

const selectCls = "mt-1.5 block w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[1rem]";
const lines = (v: string) => v.split("\n");
const clean = (xs: string[] | undefined) => (xs ?? []).map((x) => x.trim()).filter(Boolean);
const localInput = (iso: string | null | undefined) => (iso ? new Date(new Date(iso).getTime() - new Date(iso).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "");

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-[0.9375rem]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--color-brass-dark)]" />
      {label}
    </label>
  );
}

/** The Professional Programmes: price, access and what each one's page says. */
export function AdminProgrammes() {
  const programmes = useProgrammes();
  return (
    <>
      <AdminHeading title="Programmes" />
      <p className="mb-6 max-w-2xl text-[0.9375rem] text-muted">
        A programme is a career route sold as one product. Enrolling opens every professional course it contains; the free courses inside stay free. Prices and settings are yours to
        change here.
      </p>
      <div className="table-scroll rounded-2xl border border-line bg-paper">
        <table>
          <thead>
            <tr>
              <th>Programme</th>
              <th>Access</th>
              <th>Price</th>
              <th>Enrolment</th>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            {programmes.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link to={`/admin/programmes/${t.slug}`} className="font-semibold hover:text-brass-dark">
                    {t.programmeName ?? t.title}
                  </Link>
                  <span className="block text-[0.75rem] text-muted">/{t.slug}</span>
                </td>
                <td>
                  <Badge tone={isPaid(t) ? "neutral" : "free"}>{isPaid(t) ? "Professional" : "Free"}</Badge>
                </td>
                <td>{isPaid(t) ? (t.price ? priceLabel(t) : "Not set") : "—"}</td>
                <td>{isPaid(t) ? (t.enrollmentStatus === "closed" ? "Closed (opens soon)" : "Open") : "—"}</td>
                <td>{programmeCourseIds(t).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AdminProgrammeEditor() {
  const { slug } = useParams();
  const base = TRACKS.find((t) => t.slug === slug);
  const { data: saved, error, reload } = useAdminData(async () => (await getBackend()).listProgrammeSales());
  const track = base ? withSales(base, saved?.[base.id]) : undefined;
  const [c, setC] = useState<CourseSalesFields | null>(null);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // Start from what is saved, falling back to the site's defaults for a programme the database has no settings for yet.
  useEffect(() => {
    if (base && saved) setC(salesOf(withSales(base, saved[base.id])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  if (!track) return <NotFound />;
  if (error) return <Alert tone="error">{error}</Alert>;
  if (!c) return <PageLoading />;

  const set = <K extends keyof CourseSalesFields>(k: K, v: CourseSalesFields[K]) => setC((x) => ({ ...(x as CourseSalesFields), [k]: v }));
  const paid = (c.access ?? "free") === "paid";

  const save = async () => {
    setMsg(null);
    if (paid && !(c.price && c.price > 0) && c.enrollmentStatus !== "closed") return setMsg({ tone: "error", text: "Set a price above zero, or close enrolment until you have one." });
    if (c.discountPrice != null && (c.discountPrice <= 0 || (c.price != null && c.discountPrice >= c.price))) return setMsg({ tone: "error", text: "The discount price must be above zero and below the price." });
    if (c.enrollmentStart && c.enrollmentEnd && new Date(c.enrollmentEnd) <= new Date(c.enrollmentStart)) return setMsg({ tone: "error", text: "Enrolment must end after it starts." });
    setBusy(true);
    try {
      await (await getBackend()).admin.saveProgramme(track.id, {
        ...c,
        audience: clean(c.audience),
        included: clean(c.included),
        projectPreviews: (c.projectPreviews ?? []).filter((p) => p.title.trim()),
      });
      await reload();
      setMsg({ tone: "success", text: "Saved." });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHeading title={track.programmeName ?? track.title}>
        <Link to="/admin/programmes" className="text-[0.9375rem] font-semibold text-brass-dark">
          All programmes
        </Link>
      </AdminHeading>
      <form
        className="space-y-5 rounded-2xl border border-line bg-paper p-5 sm:p-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[0.875rem] font-medium" htmlFor="pg-access">
              Access
            </label>
            <select id="pg-access" className={selectCls} value={c.access ?? "free"} onChange={(e) => setC((x) => ({ ...(x as CourseSalesFields), access: e.target.value as "free" | "paid", courseType: e.target.value === "paid" ? "professional" : "free" }))}>
              <option value="free">Free learning path</option>
              <option value="paid">Professional programme (paid)</option>
            </select>
            <p className="mt-1 text-[0.8125rem] text-muted">Paid programmes open their professional courses when a learner enrolls.</p>
          </div>
          <div>
            <label className="text-[0.875rem] font-medium" htmlFor="pg-delivery">
              Delivery
            </label>
            <select id="pg-delivery" className={selectCls} value={c.deliveryType ?? "self_paced"} onChange={(e) => set("deliveryType", e.target.value as NonNullable<CourseSalesFields["deliveryType"]>)}>
              <option value="self_paced">Self-paced</option>
              <option value="instructor_led">Instructor-led</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <TextField label="Duration (shown to learners)" value={c.durationLabel ?? ""} onChange={(e) => set("durationLabel", e.target.value || undefined)} hint="For example 3 months." />
        </div>

        {paid && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField label="Price" type="number" min={0} value={c.price ?? ""} onChange={(e) => set("price", e.target.value ? Number(e.target.value) : null)} />
              <TextField label="Currency" value={c.currency ?? "NGN"} maxLength={3} onChange={(e) => set("currency", e.target.value.toUpperCase())} hint="NGN for naira." />
              <TextField label="Discount price" type="number" min={0} value={c.discountPrice ?? ""} onChange={(e) => set("discountPrice", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Check label="Discount is available now" checked={!!c.discountActive} onChange={(v) => set("discountActive", v)} />
              <Check label="Payments are paused" checked={c.paymentStatus === "paused"} onChange={(v) => set("paymentStatus", v ? "paused" : "active")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-[0.875rem] font-medium" htmlFor="pg-enrol">
                  Enrolment
                </label>
                <select id="pg-enrol" className={selectCls} value={c.enrollmentStatus ?? "open"} onChange={(e) => set("enrollmentStatus", e.target.value as "open" | "closed")}>
                  <option value="open">Open</option>
                  <option value="closed">Closed (shows "opens soon")</option>
                </select>
              </div>
              <TextField label="Enrolment opens" type="datetime-local" value={localInput(c.enrollmentStart)} onChange={(e) => set("enrollmentStart", e.target.value ? new Date(e.target.value).toISOString() : null)} />
              <TextField label="Enrolment closes" type="datetime-local" value={localInput(c.enrollmentEnd)} onChange={(e) => set("enrollmentEnd", e.target.value ? new Date(e.target.value).toISOString() : null)} />
            </div>
            <div className="space-y-3 rounded-xl border border-line p-4">
              <Check label="Learners can pay in two parts" checked={!!c.allowInstalments} onChange={(v) => set("allowInstalments", v)} />
              {c.allowInstalments && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="First part (percent of the price)" type="number" min={10} max={90} value={c.firstPercent ?? 50} onChange={(e) => set("firstPercent", Number(e.target.value) || 50)} hint="The programme opens when this part is confirmed." />
                  <TextField label="Second part due after (days)" type="number" min={1} max={365} value={c.secondDueDays ?? 30} onChange={(e) => set("secondDueDays", Number(e.target.value) || 30)} hint="Counted from when the first part is confirmed." />
                </div>
              )}
            </div>
            <Alert tone="info">
              Changing which courses a programme contains happens in the site's content. Learners who already enrolled keep access to everything in the programme.
            </Alert>
          </>
        )}

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Check label="Instructor support is included" checked={!!c.instructorSupport} onChange={(v) => set("instructorSupport", v)} />
          <Check label="Community access is included" checked={!!c.communityAccess} onChange={(v) => set("communityAccess", v)} />
        </div>

        {paid && (
          <div className="space-y-4 border-t border-line pt-4">
            <p className="text-[0.875rem] font-semibold">Programme page</p>
            <TextArea label="Programme overview" rows={4} value={c.overview ?? ""} onChange={(e) => set("overview", e.target.value || undefined)} />
            <TextArea label="Who it is for (one per line)" rows={3} value={(c.audience ?? []).join("\n")} onChange={(e) => set("audience", lines(e.target.value))} />
            <TextArea label="Also included (one per line)" rows={3} value={(c.included ?? []).join("\n")} onChange={(e) => set("included", lines(e.target.value))} />
            <p className="-mt-2 text-[0.8125rem] text-muted">Only list what you really provide. Courses, capstone, certificate, support and community are added automatically from the settings.</p>
            <TextArea
              label="Projects (one per line: Title | what the learner builds)"
              rows={3}
              value={(c.projectPreviews ?? []).map((p) => (p.summary ? `${p.title} | ${p.summary}` : p.title)).join("\n")}
              onChange={(e) =>
                set(
                  "projectPreviews",
                  lines(e.target.value).map((l) => {
                    const [title, ...rest] = l.split("|");
                    return { title, summary: rest.join("|").trim() };
                  }),
                )
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Instructor name" value={c.instructor?.name ?? ""} onChange={(e) => set("instructor", { name: e.target.value, title: c.instructor?.title ?? "", bio: c.instructor?.bio ?? "" })} />
              <TextField label="Instructor title" value={c.instructor?.title ?? ""} onChange={(e) => set("instructor", { name: c.instructor?.name ?? "", title: e.target.value, bio: c.instructor?.bio ?? "" })} />
            </div>
            <TextArea label="Instructor bio" rows={2} value={c.instructor?.bio ?? ""} onChange={(e) => set("instructor", { name: c.instructor?.name ?? "", title: c.instructor?.title ?? "", bio: e.target.value })} />
            <TextArea label="Professional outcome" rows={2} value={c.professionalOutcome ?? ""} onChange={(e) => set("professionalOutcome", e.target.value || undefined)} />
          </div>
        )}

        <div aria-live="polite">{msg && <Alert tone={msg.tone}>{msg.text}</Alert>}</div>
        <Button type="submit" loading={busy}>
          Save programme
        </Button>
      </form>
    </>
  );
}
