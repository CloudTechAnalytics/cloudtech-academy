import type { Course } from "@/content/types";
import type { Difficulty } from "@/content/catalog";
import { divisionOf } from "@/content/catalog";
import { isPaid } from "./commerce";

/**
 * A course appears in the catalogue unless it is archived, or it only exists inside a programme (paid with no price of its
 * own). People already enrolled in an archived course still reach it by its link.
 */
export const inCatalogue = (c: Course) => c.published && !c.archived && !(isPaid(c) && (c.price === null || c.price === undefined));

const RANK: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };

/** True when a course covers the level: a "Beginner to Intermediate" course matches both. */
export const matchesLevel = (c: Course, want: Difficulty) => RANK[want] >= RANK[c.difficulty] && RANK[want] <= RANK[c.difficultyMax ?? c.difficulty];

export const DURATIONS = [
  { id: "", label: "Any length" },
  { id: "short", label: "Under 10 hours" },
  { id: "self", label: "10 hours or more, self-paced" },
  { id: "2m", label: "Up to 2 months" },
  { id: "3m", label: "About 3 months" },
] as const;

/** Which length filter a course falls under. Programme-style courses use their weeks; the others use their hours. */
export function durationBucket(c: Course): "short" | "self" | "2m" | "3m" {
  const w = c.durationWeeks;
  if (w) return w <= 8 ? "2m" : "3m";
  return (c.estimatedHours ?? 0) <= 10 || c.format === "short" ? "short" : "self";
}

export const courseDivision = (c: Course) => divisionOf(c.categoryId);
