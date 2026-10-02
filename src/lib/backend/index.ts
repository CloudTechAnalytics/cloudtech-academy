import type { Backend } from "./types";

export * from "./types";

/**
 * The live Academy's Supabase project. Both values are public by design (they ship in the
 * site's JavaScript; row-level security protects the data). Production builds fall back to
 * them when the environment variables are missing or empty, so a blank variable in the
 * hosting settings can't silently switch the live site into demo mode. Local development
 * without variables stays in demo mode.
 */
const LIVE_URL = "https://dwrulmgzgkfzrtayomvy.supabase.co";
const LIVE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnVsbWd6Z2tmenJ0YXlvbXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjA2NzcsImV4cCI6MjEwNjMzNjY3N30.1sQWy0hJqQl-qzAewhtjKvJjvtJeTPhuhV6qJDLtS1g";

const env = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const SUPABASE_URL = env(import.meta.env.VITE_SUPABASE_URL) ?? (import.meta.env.PROD ? LIVE_URL : undefined);
const SUPABASE_KEY = env(import.meta.env.VITE_SUPABASE_ANON_KEY) ?? (import.meta.env.PROD ? LIVE_ANON_KEY : undefined);

/** True when Supabase is configured; otherwise the Academy runs in browser-only demo mode. */
export const IS_LIVE = Boolean(SUPABASE_URL && SUPABASE_KEY);

let instance: Backend | null = null;

/**
 * The backend is created lazily in the browser. It is never used while prerendering
 * (pages render bundled content on the server), so Supabase isn't imported on the server.
 */
export async function getBackend(): Promise<Backend> {
  if (instance) return instance;
  if (IS_LIVE) {
    const { createSupabaseBackend } = await import("./supabase");
    instance = createSupabaseBackend(SUPABASE_URL!, SUPABASE_KEY!);
  } else if (!import.meta.env.PROD) {
    // Demo mode exists for local development only. Loading it this way keeps it, and the practice
    // project answer keys it grades with, out of production builds, which always use Supabase.
    const { createDemoBackend } = await import("./demo");
    instance = createDemoBackend();
  } else {
    throw new Error("Supabase isn't configured.");
  }
  return instance;
}
