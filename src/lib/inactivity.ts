/**
 * An unfinished course that hasn't been touched for this many days starts over (lessons,
 * tasks and assessment attempts are cleared; earned badges stay). The server applies the
 * same rule in apply_inactivity_resets(); keep the two in step.
 */
export const RESET_AFTER_DAYS = 14;
/** The dashboard warns learners this many days before a reset. */
export const WARN_DAYS = 4;

const DAY = 24 * 60 * 60 * 1000;

/** Whole days left before an unfinished course resets, or null when no warning is needed. */
export function daysUntilReset(lastActiveAt: string | null | undefined, now = Date.now()): number | null {
  if (!lastActiveAt) return null;
  const left = Math.ceil((new Date(lastActiveAt).getTime() + RESET_AFTER_DAYS * DAY - now) / DAY);
  return left <= WARN_DAYS ? Math.max(left, 0) : null;
}

/** True when an unfinished course is past the inactivity limit. */
export const isStale = (lastActiveAt: string | null | undefined, now = Date.now()) =>
  !!lastActiveAt && now - new Date(lastActiveAt).getTime() > RESET_AFTER_DAYS * DAY;
