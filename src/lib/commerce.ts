import type { Course } from "@/content/types";
import type { CourseSalesFields, DeliveryType } from "@/content/catalog";
import type { Track } from "@/content/tracks";

const SALES_KEYS: (keyof CourseSalesFields)[] = [
  "courseType", "access", "price", "currency", "discountPrice", "discountActive", "paymentStatus", "deliveryType", "enrollmentStatus", "enrollmentStart",
  "enrollmentEnd", "communityAccess", "instructorSupport", "durationLabel", "publishedAt", "overview", "audience", "outcomes", "included", "projectPreviews",
  "instructor", "professionalOutcome", "allowInstalments", "firstPercent", "secondDueDays",
];

/** A programme with what admins have set in the database laid over the site's built-in defaults. */
export function withSales(track: Track, saved: CourseSalesFields | undefined): Track {
  if (!saved) return track;
  const set = Object.fromEntries(SALES_KEYS.filter((k) => saved[k] !== undefined).map((k) => [k, saved[k]]));
  return { ...track, ...set };
}

/** Just the commercial fields of a programme, as admins edit them. */
export function salesOf(track: Track): CourseSalesFields {
  return Object.fromEntries(SALES_KEYS.filter((k) => track[k] !== undefined).map((k) => [k, track[k]])) as CourseSalesFields;
}

/** The courses a programme contains, required or not. */
export const programmeCourseIds = (track: Track) => track.stages.flatMap((s) => s.items).flatMap((i) => (i.kind === "course" ? [i.courseId] : []));

/** Free and professional courses, and what a learner pays. The database enforces access; this only describes it. */
export const isPaid = (c: { access?: "free" | "paid"; isFree?: boolean }) => (c.access ? c.access === "paid" : c.isFree === false);
export const isProfessional = (c: Pick<Course, "courseType">) => c.courseType === "professional";

export type CoursePrice = {
  /** What the learner pays now. */
  amount: number;
  /** The normal price, shown struck through when a discount applies. */
  listAmount: number;
  discounted: boolean;
  currency: string;
};

export function coursePrice(c: Pick<Course, "price" | "currency" | "discountPrice" | "discountActive">): CoursePrice | null {
  if (c.price === null || c.price === undefined) return null;
  const discounted = !!c.discountActive && c.discountPrice !== null && c.discountPrice !== undefined && c.discountPrice < c.price;
  return { amount: discounted ? (c.discountPrice as number) : c.price, listAmount: c.price, discounted, currency: c.currency ?? "NGN" };
}

export function formatPrice(amount: number, currency = "NGN") {
  const fractional = Number.isInteger(amount) ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency, minimumFractionDigits: fractional, maximumFractionDigits: fractional }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/** "FREE" or the price, for cards and buttons. */
export function priceLabel(c: Parameters<typeof isPaid>[0] & Parameters<typeof coursePrice>[0]) {
  if (!isPaid(c)) return "Free";
  const p = coursePrice(c);
  return p ? formatPrice(p.amount, p.currency) : "Paid";
}

export const DELIVERY_LABEL: Record<DeliveryType, string> = {
  self_paced: "Self-paced",
  instructor_led: "Instructor-led",
  hybrid: "Hybrid: self-paced and live",
};

export type EnrolmentState = "open" | "closed" | "not_started" | "ended" | "paused";

/** Whether new learners can buy this course right now. */
export function enrolmentState(c: Pick<Course, "enrollmentStatus" | "enrollmentStart" | "enrollmentEnd" | "paymentStatus">, at = new Date()): EnrolmentState {
  if (c.enrollmentStatus === "closed") return "closed";
  if (c.enrollmentStart && new Date(c.enrollmentStart) > at) return "not_started";
  if (c.enrollmentEnd && new Date(c.enrollmentEnd) < at) return "ended";
  if (c.paymentStatus === "paused") return "paused";
  return "open";
}

export const ENROLMENT_MESSAGE: Record<Exclude<EnrolmentState, "open">, string> = {
  closed: "Enrolment is closed for now.",
  not_started: "Enrolment hasn't opened yet.",
  ended: "Enrolment has ended.",
  paused: "Payments are paused. Please check back soon.",
};
