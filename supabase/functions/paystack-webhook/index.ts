// Paystack calls this when a payment succeeds, even if the learner closed the tab before
// coming back. The request is trusted only if its signature matches our secret key, and the
// transaction is re-checked with Paystack before anything is issued.
// Deployed without JWT verification (Paystack doesn't send one); set this URL in
// Paystack → Settings → API Keys & Webhooks.
import { json, paystackKey, settle, verifyTransaction } from "../_shared/paystack.ts";

async function signatureOk(raw: string, signature: string | null) {
  if (!signature) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(paystackKey()), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw)));
  const hex = [...mac].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (hex.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const raw = await req.text();
  if (!(await signatureOk(raw, req.headers.get("x-paystack-signature")))) return json({ error: "Invalid signature" }, 401);
  const event = JSON.parse(raw);
  if (event?.event !== "charge.success") return json({ received: true });
  // Re-check with Paystack rather than trusting the event body alone.
  const t = await verifyTransaction(event.data?.reference);
  if (!t) return json({ received: true, note: "transaction not found" });
  const result = await settle(t);
  // Always 200 so Paystack doesn't retry payments that aren't ours to settle.
  return json({ received: true, settled: result.ok, ...(result.ok ? {} : { note: result.error }) });
});
