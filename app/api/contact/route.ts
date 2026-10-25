import { NextResponse } from "next/server";
import { contactEmail, parseContact } from "@/lib/contact";

export const runtime = "nodejs";

/* Sends the enquiry to the support mailbox through an email delivery API when the keys are set.
   Without them it answers 503 and the page tells the visitor to email instead. Nothing is stored here. */
export async function POST(req: Request) {
  /* Browsers always send Origin on a cross site post; when it is present it must be this site. */
  const origin = req.headers.get("origin");
  if (origin) {
    let host = "";
    try { host = new URL(origin).host; } catch {}
    const self = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
    if (host !== self) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const parsed = parseContact(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // a bot filled the hidden field

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO ?? "support@lumanworth.com";
  if (!key || !from) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { subject, text } = contactEmail(parsed.data);
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: parsed.data.email, subject, text }),
  });
  if (!r.ok) {
    console.error(`contact: email API answered ${r.status}`);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
