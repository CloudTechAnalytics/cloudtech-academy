import { useCallback, useEffect, useState } from "react";
import type { Course } from "@/content/types";
import { getBackend, type CourseInput } from "@/lib/backend";

/** Loads admin data and exposes a reload; errors are kept for display. */
export function useAdminData<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reload = useCallback(() => load().then(setData, (e: unknown) => setError(e instanceof Error ? e.message : String(e))), deps);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { data, error, reload };
}

export const useAdminCourses = () => useAdminData(async () => (await getBackend()).listCourses({ includeUnpublished: true }));

export const useAdminCourse = (slug: string | undefined) =>
  useAdminData<Course | null>(async () => (slug ? (await getBackend()).getCourse(slug, { includeUnpublished: true }) : null), [slug]);

export const randomId = () => Math.random().toString(36).slice(2, 8);

export const slugOk = (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);

/** A course without its modules, as the backend's saveCourse expects. */
export function courseInput(c: Course): CourseInput {
  const { modules: _modules, ...rest } = c;
  return rest;
}
