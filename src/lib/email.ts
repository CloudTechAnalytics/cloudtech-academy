/**
 * Opening a message in the admin's own mail: Gmail in the browser, or the default mail app.
 * Recipients go in BCC so learners never see each other's addresses.
 */
export type Draft = { to?: string[]; bcc?: string[]; subject: string; body: string };

// Browsers and Gmail start failing somewhere past ~8,000 characters of URL.
const MAX_URL = 7500;

export function gmailUrl({ to = [], bcc = [], subject, body }: Draft): string | null {
  // encodeURIComponent, not URLSearchParams: Gmail shows "+" literally instead of a space.
  const q = [`view=cm`, `fs=1`, `su=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`];
  if (to.length) q.push(`to=${to.map(encodeURIComponent).join(",")}`);
  if (bcc.length) q.push(`bcc=${bcc.map(encodeURIComponent).join(",")}`);
  const url = `https://mail.google.com/mail/?${q.join("&")}`;
  return url.length <= MAX_URL ? url : null;
}

export function mailtoUrl({ to = [], bcc = [], subject, body }: Draft): string | null {
  const q = [`subject=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`];
  if (bcc.length) q.unshift(`bcc=${bcc.map(encodeURIComponent).join(",")}`);
  const url = `mailto:${to.map(encodeURIComponent).join(",")}?${q.join("&")}`;
  return url.length <= MAX_URL ? url : null;
}
