import type { Backend } from "./types";
import { createDemoBackend } from "./demo";

export * from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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
  } else {
    instance = createDemoBackend();
  }
  return instance;
}
