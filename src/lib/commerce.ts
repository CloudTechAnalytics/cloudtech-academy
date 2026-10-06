import type { Course } from "@/content/types";
import type { DeliveryType } from "@/content/catalog";

/** Free and professional courses, and what a learner pays. The database enforces access; this only describes it. */
export const isPaid = (c: Pick<Course, "access" | "isFree">) => (c.access ? c.access === "paid" : !c.isFree);
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
