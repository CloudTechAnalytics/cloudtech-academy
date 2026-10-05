import { useCallback, useEffect, useState } from "react";
import { getBackend, type AcademyEvent, type EventRegistration } from "./backend";

/** Loads every public (non-draft) event. `events` is null while loading. */
export function useEvents() {
  const [events, setEvents] = useState<AcademyEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => {
    try {
      setEvents(await (await getBackend()).listEvents());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load events.");
      setEvents((x) => x ?? []);
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { events, error, reload };
}

/** The signed-in learner's active registrations. Empty when signed out. */
export function useMyRegistrations(enabled = true) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const reload = useCallback(async () => {
    if (!enabled) return setRegistrations([]);
    try {
      setRegistrations(await (await getBackend()).listMyRegistrations());
    } catch {
      setRegistrations([]);
    }
  }, [enabled]);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { registrations, reload };
}
