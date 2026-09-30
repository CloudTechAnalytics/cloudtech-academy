// Starts a Paystack checkout for the learner's own pending certificate order and returns the
// payment page URL. The amount and currency come from the order in the database, never from
// the browser.
import { admin, cors, json, minorUnits, paystackKey, requestUser } from "../_shared/paystack.ts";

/** Where Paystack may send the learner back to. */
const ALLOWED_RETURN = [/^https:\/\/academy\.cloudtechanalytics\.com\//, /^https:\/\/cloudtech-academy-one\.vercel\.app\//, /^http:\/\/localhost:\d+\//];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const user = await requestUser(req);
    if (!user?.email) return json({ error: "Please sign in first." }, 401);
    const { orderId, returnUrl } = await req.json();
    if (typeof returnUrl !== "string" || !ALLOWED_RETURN.some((r) => r.test(returnUrl))) return json({ error: "Invalid return address." }, 400);

    const { data: order } = await admin().from("certificate_orders").select("*").eq("id", orderId).eq("user_id", user.id).maybeSingle();
    if (!order) return json({ error: "Order not found." }, 404);
    if (order.status !== "pending") return json({ error: "This order is already settled." }, 409);

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${paystackKey()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        amount: minorUnits(order.amount),
        currency: order.currency,
        // A new reference per attempt; the order is carried in the metadata.
        reference: `CTA-${order.id.slice(0, 8)}-${Date.now()}`,
        callback_url: returnUrl,
        metadata: { order_id: order.id, course_id: order.course_id, cancel_action: returnUrl },
      }),
    });
    const body = await res.json().catch(() => null);
    if (!body?.status) {
      const message = String(body?.message ?? "Paystack didn't accept the payment request.");
      const unsupported = /currency/i.test(message);
      return json({ error: unsupported ? `Card payment in ${order.currency} isn't available yet.` : message, code: unsupported ? "currency_unsupported" : "provider_error" }, 400);
    }
    return json({ url: body.data.authorization_url, reference: body.data.reference });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Couldn't start the payment." }, 500);
  }
});
