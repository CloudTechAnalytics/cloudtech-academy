export const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

export const percent = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0);

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "Beginner", "Intermediate", "Advanced" */
export const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function hoursLabel(hours: number | undefined) {
  if (!hours) return "In preparation";
  return `About ${hours} hours`;
}
