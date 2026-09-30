export const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

/** "today", "yesterday", "5 days ago", then a date. */
export function timeAgo(iso: string | null | undefined) {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return formatDate(iso);
}

export const daysSince = (iso: string | null | undefined) => (iso ? (Date.now() - new Date(iso).getTime()) / 86_400_000 : Infinity);

export const percent = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0);

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "Beginner", "Intermediate", "Advanced" */
export const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "25 minutes", "1 hr 25 min", or "About 6 hours" for longer courses measured in hours. */
export function durationLabel(minutes: number | undefined, hours?: number) {
  if (minutes) {
    if (minutes < 60) return `${minutes} minutes`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h} hr ${m} min` : `${h} ${h === 1 ? "hour" : "hours"}`;
  }
  return hoursLabel(hours);
}

export function hoursLabel(hours: number | undefined) {
  if (!hours) return "In preparation";
  return `About ${hours} hours`;
}
