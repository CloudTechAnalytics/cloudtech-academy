// Called when the learner comes back from Paystack. Asks Paystack whether the payment really
// succeeded, checks it matches the order, then issues the certificate.
import { cors, json, requestUser, settle, verifyTransaction } from "../_shared/paystack.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const user = await requestUser(req);
    if (!user) return json({ error: "Please sign in first." }, 401);
    const { reference } = await req.json();
    if (typeof reference !== "string" || !/^[A-Za-z0-9._-]{6,100}$/.test(reference)) return json({ error: "Invalid payment reference." }, 400);
    const t = await verifyTransaction(reference);
    if (!t) return json({ error: "We couldn't find that payment with Paystack." }, 404);
    const result = await settle(t, user.id);
    return result.ok ? json({ certificate: result.certificate }) : json({ error: result.error }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Couldn't confirm the payment." }, 500);
  }
});
