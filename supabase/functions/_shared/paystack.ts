// Shared by the certificate payment functions. Runs on Supabase Edge Functions (Deno).
//
// Secrets (Supabase → Edge Functions → Secrets):
//   PAYSTACK_SECRET_KEY  sk_test_… or sk_live_…   (never in the site's code)
// Provided by Supabase automatically: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

export const paystackKey = () => {
  const k = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!k) throw new Error("PAYSTACK_SECRET_KEY is not set.");
  return k;
};

/** Service-role client: bypasses row-level security. Only used on the server. */
export const admin = (): SupabaseClient =>
  createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

/** The signed-in learner making the request, from their access token. */
export async function requestUser(req: Request) {
  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    auth: { persistSession: false },
  });
  const { data } = await client.auth.getUser();
  return data.user;
}

/** Amount in the smallest unit (kobo, cents), as Paystack expects. */
export const minorUnits = (amount: number) => Math.round(Number(amount) * 100);

type PaystackTransaction = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata?: { order_id?: string } | string | null;
};

export async function verifyTransaction(reference: string): Promise<PaystackTransaction | null> {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${paystackKey()}` },
  });
  const body = await res.json().catch(() => null);
  return body?.status ? (body.data as PaystackTransaction) : null;
}

const orderIdOf = (t: PaystackTransaction) => {
  const m = typeof t.metadata === "string" ? JSON.parse(t.metadata || "{}") : t.metadata;
  return (m?.order_id as string | undefined) ?? null;
};

/**
 * Completes the order a successful Paystack transaction was for, after checking it matches exactly (amount and
 * currency): issues the certificate for a certificate order, or enrols the learner for a course order.
 * Safe to call more than once for the same payment.
 */
export async function settle(t: PaystackTransaction, expectUserId?: string) {
  if (t.status !== "success") return { ok: false as const, error: "The payment wasn't successful." };
  const orderId = orderIdOf(t);
  if (!orderId) return { ok: false as const, error: "This payment isn't for an order." };
  const db = admin();
  const { data: order } = await db.from("certificate_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) {
    const { data: courseOrder } = await db.from("course_orders").select("*").eq("id", orderId).maybeSingle();
    if (!courseOrder) return { ok: false as const, error: "Order not found." };
    return settleCourse(db, courseOrder, t, expectUserId);
  }
  if (expectUserId && order.user_id !== expectUserId) return { ok: false as const, error: "This order belongs to another account." };
  if (t.currency !== order.currency || t.amount !== minorUnits(order.amount)) {
    return { ok: false as const, error: "The amount paid doesn't match the order." };
  }
  if (order.status === "granted") {
    const target = order.track_id ? { track_id: order.track_id, source: "programme" } : { course_id: order.course_id, source: "course" };
    const { data: cert } = await db.from("certificates").select("*").eq("user_id", order.user_id).match(target).eq("status", "valid").maybeSingle();
    return { ok: true as const, certificate: cert, courseId: null as string | null, trackId: null as string | null };
  }
  const { data: cert, error } = await db.rpc("complete_certificate_order", { p_order_id: order.id, p_provider: "paystack", p_reference: t.reference });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, certificate: cert, courseId: null as string | null, trackId: null as string | null };
}

// deno-lint-ignore no-explicit-any
async function settleCourse(db: SupabaseClient, order: any, t: PaystackTransaction, expectUserId?: string) {
  if (expectUserId && order.user_id !== expectUserId) return { ok: false as const, error: "This order belongs to another account." };
  if (t.currency !== order.currency || t.amount !== minorUnits(order.amount)) {
    return { ok: false as const, error: "The amount paid doesn't match the order." };
  }
  const { error } = await db.rpc("complete_course_order", { p_order_id: order.id, p_provider: "paystack", p_reference: t.reference });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, certificate: null, courseId: (order.course_id ?? null) as string | null, trackId: (order.track_id ?? null) as string | null };
}
