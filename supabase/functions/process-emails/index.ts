// Sends the queued emails (email_outbox) through Resend.
//
// Two ways to connect, either is enough:
//   1. Gmail: an admin enters the Gmail address and an app password on the Admin → Emails page (stored in email_settings).
//   2. Resend: secrets RESEND_API_KEY (re_…) and EMAIL_FROM (an address on a domain verified in Resend).
// Resend is used when both of its secrets are set; otherwise Gmail.
// Called by the database after it queues an email (header x-email-secret), and by admins from the Emails page.
import { admin, cors, json, requestUser } from "../_shared/paystack.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Plain text to simple branded HTML: paragraphs, line breaks and clickable links. */
function html(body: string) {
  const paras = esc(body)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6">${p.replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#8a6a1f">$1</a>')}</p>`)
    .join("");
  return `<div style="background:#f7f4ee;padding:24px"><div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4d9c3;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#1e1d1b;font-size:15px"><div style="background:#1e1d1b;color:#e8cf96;padding:16px 24px;font-weight:bold;letter-spacing:.04em">CloudTech Academy</div><div style="padding:24px">${paras}</div><div style="padding:14px 24px;background:#f7f4ee;color:#6b665c;font-size:12px">CloudTech Academy · a product of CloudTech Analytics</div></div></div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const db = admin();
    const secret = req.headers.get("x-email-secret");
    let allowed = false;
    if (secret) {
      const { data } = await db.from("email_settings").select("secret").eq("id", 1).maybeSingle();
      allowed = !!data && data.secret === secret;
    } else {
      const user = await requestUser(req);
      if (user) {
        const { data } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
        allowed = data?.role === "admin";
      }
    }
    if (!allowed) return json({ error: "Not allowed." }, 401);

    const { data: cfg } = await db.from("email_settings").select("enabled, from_name, reply_to, smtp_user, smtp_pass").eq("id", 1).maybeSingle();
    const key = Deno.env.get("RESEND_API_KEY");
    const resendFrom = Deno.env.get("EMAIL_FROM");
    const useResend = !!key && !!resendFrom;
    const useGmail = !useResend && !!cfg?.smtp_user && !!cfg?.smtp_pass;
    const configured = useResend || useGmail;
    const from = useResend ? resendFrom! : useGmail ? `${cfg!.from_name || "CloudTech Academy"} <${cfg!.smtp_user}>` : null;
    const body = await req.json().catch(() => ({}));
    if (body?.check) return json({ configured, from, provider: useResend ? "resend" : useGmail ? "gmail" : null });
    if (!configured) return json({ configured: false, sent: 0, failed: 0 });
    if (cfg && !cfg.enabled) return json({ configured, sent: 0, failed: 0, paused: true });

    const { data: rows } = await db.from("email_outbox").select("*").eq("status", "queued").order("created_at").limit(25);
    const smtp = useGmail
      ? new SMTPClient({ connection: { hostname: "smtp.gmail.com", port: 465, tls: true, auth: { username: cfg!.smtp_user, password: cfg!.smtp_pass } } })
      : null;
    let sent = 0;
    let failed = 0;
    for (const r of rows ?? []) {
      // Claim the row first so two workers can't send the same email.
      const { data: claimed } = await db.from("email_outbox").update({ status: "skipped" }).eq("id", r.id).eq("status", "queued").select("id");
      if (!claimed?.length) continue;
      try {
        if (smtp) {
          await smtp.send({ from: from!, to: r.to_email, subject: r.subject, content: r.body, html: html(r.body), ...(cfg?.reply_to ? { replyTo: cfg.reply_to } : {}) });
        } else {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from, to: [r.to_email], subject: r.subject, text: r.body, html: html(r.body), ...(cfg?.reply_to ? { reply_to: cfg.reply_to } : {}) }),
          });
          if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
        }
        await db.from("email_outbox").update({ status: "sent", sent_at: new Date().toISOString(), error: null }).eq("id", r.id);
        sent++;
      } catch (e) {
        await db.from("email_outbox").update({ status: "failed", error: e instanceof Error ? e.message : String(e) }).eq("id", r.id);
        failed++;
      }
    }
    try {
      await smtp?.close();
    } catch {
      // Already closed.
    }
    return json({ configured, sent, failed, more: (rows?.length ?? 0) === 25 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Couldn't send the emails." }, 500);
  }
});
