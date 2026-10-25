/* Contact form: one place for the rules, used by the route and the tests. */

export const WHEN = ["Not sure yet", "In the next month", "One to three months", "Later this year"] as const;

export type Contact = {
  name: string;
  org: string;
  email: string;
  what: string;
  when: (typeof WHEN)[number];
  ref: string;
  website: string; // honeypot, must stay empty
};

export type Parsed = { ok: true; data: Contact } | { ok: false; error: string };

/* One line fields: control characters become a space so nothing reaches an email header. */
const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n\t\0]+/g, " ").trim().slice(0, max) : "");
const text = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\0/g, "").trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function parseContact(body: unknown): Parsed {
  if (!body || typeof body !== "object") return { ok: false, error: "bad_request" };
  const b = body as Record<string, unknown>;
  const name = str(b.name, 120);
  const email = str(b.email, 200);
  const what = text(b.what, 4000);
  const when = str(b.when, 40);
  if (!name) return { ok: false, error: "name" };
  if (!EMAIL.test(email)) return { ok: false, error: "email" };
  if (!what) return { ok: false, error: "what" };
  const data: Contact = {
    name,
    org: str(b.org, 200),
    email,
    what,
    when: (WHEN as readonly string[]).includes(when) ? (when as Contact["when"]) : "Not sure yet",
    ref: str(b.ref, 200),
    website: str(b.website, 200),
  };
  return { ok: true, data };
}

export function contactEmail(d: Contact): { subject: string; text: string } {
  const subject = `Website enquiry from ${d.name}${d.org ? `, ${d.org}` : ""}`;
  const text = [
    `Name: ${d.name}`,
    `Company: ${d.org || "(not given)"}`,
    `Email: ${d.email}`,
    `When: ${d.when}`,
    `Who sent them: ${d.ref || "(not given)"}`,
    "",
    "What they need:",
    d.what,
  ].join("\n");
  return { subject, text };
}
