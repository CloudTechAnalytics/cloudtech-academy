import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, Clock } from "lucide-react";
import { getBackend, type ManualOrder } from "@/lib/backend";
import { useCourses, useProgrammes } from "@/lib/data";
import { formatPrice } from "@/lib/commerce";
import { formatDate } from "@/lib/format";
import { isOverdue } from "./ManualCheckout";

/** On the dashboard: payments still to make or waiting for confirmation, so a second part is never forgotten. */
export function PaymentReminders() {
  const [orders, setOrders] = useState<ManualOrder[]>([]);
  const courses = useCourses();
  const programmes = useProgrammes();
  useEffect(() => {
    void getBackend()
      .then((b) => b.listMyManualOrders())
      .then((o) => setOrders(o.filter((x) => x.order.status === "pending" || x.order.status === "partial")))
      .catch(() => {});
  }, []);
  if (!orders.length) return null;
  return (
    <section className="mt-10" aria-labelledby="my-payments">
      <h2 id="my-payments" className="font-serif text-[1.4rem]">
        Your payments
      </h2>
      <ul className="mt-3 space-y-3">
        {orders.map(({ order, payments }) => {
          const programme = programmes.find((t) => t.id === order.trackId);
          const course = courses.find((c) => c.id === order.courseId);
          const title = programme ? (programme.programmeName ?? programme.title) : (course?.title ?? "Your order");
          const to = programme ? `/programmes/${programme.slug}/enroll` : course ? `/courses/${course.slug}/enroll` : "/dashboard";
          const next = payments.find((p) => p.status !== "confirmed");
          if (!next) return null;
          const late = isOverdue(next);
          return (
            <li key={order.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${late ? "border-danger/40 bg-danger/10" : "border-line bg-paper"}`}>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[0.875rem] text-muted">
                  {late ? <AlertTriangle aria-hidden className="h-4 w-4 text-danger" /> : <Clock aria-hidden className="h-4 w-4" />}
                  {next.status === "submitted"
                    ? `${formatPrice(next.amount, next.currency)} sent, waiting for confirmation`
                    : `${payments.length > 1 ? `Part ${next.part}: ` : ""}${formatPrice(next.amount, next.currency)} to pay${next.dueAt ? `, due ${formatDate(next.dueAt)}` : ""}${late ? " (overdue)" : ""}`}
                </p>
              </div>
              <Link to={to} className="text-[0.9375rem] font-semibold text-brass-dark hover:text-ink">
                {next.status === "submitted" ? "View" : "Pay now"} →
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
