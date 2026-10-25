import { describe, expect, it } from "vitest";
import { contactEmail, parseContact } from "@/lib/contact";

const good = { name: "Sam Lee", org: "Example Pty Ltd", email: "sam@example.com", what: "A booking system.", when: "In the next month", ref: "" };

describe("parseContact", () => {
  it("accepts a complete enquiry", () => {
    const r = parseContact(good);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.when).toBe("In the next month");
  });
  it("rejects a missing name, a bad email and an empty message", () => {
    expect(parseContact({ ...good, name: " " })).toEqual({ ok: false, error: "name" });
    expect(parseContact({ ...good, email: "not an email" })).toEqual({ ok: false, error: "email" });
    expect(parseContact({ ...good, what: "" })).toEqual({ ok: false, error: "what" });
  });
  it("rejects bodies that are not objects", () => {
    expect(parseContact(null).ok).toBe(false);
    expect(parseContact("x").ok).toBe(false);
  });
  it("falls back to Not sure yet for an unknown timing and trims long fields", () => {
    const r = parseContact({ ...good, when: "tomorrow", name: "a".repeat(500) });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.when).toBe("Not sure yet");
      expect(r.data.name.length).toBe(120);
    }
  });
  it("keeps the honeypot so the route can drop bots quietly", () => {
    const r = parseContact({ ...good, website: "http://spam" });
    expect(r.ok && r.data.website).toBe("http://spam");
  });
});

describe("line fields", () => {
  it("flattens newlines so the subject cannot carry a header", () => {
    const r = parseContact({ ...good, name: "Sam\r\nBcc: x@y.z", org: "A\tB" });
    expect(r.ok && r.data.name).toBe("Sam Bcc: x@y.z");
    expect(r.ok && r.data.org).toBe("A B");
    expect(r.ok && contactEmail(r.data).subject.includes("\n")).toBe(false);
  });
  it("keeps newlines in the message body", () => {
    const r = parseContact({ ...good, what: "line one\nline two" });
    expect(r.ok && r.data.what).toBe("line one\nline two");
  });
});

describe("contactEmail", () => {
  it("writes a plain subject and body", () => {
    const r = parseContact(good);
    if (!r.ok) throw new Error("parse failed");
    const m = contactEmail(r.data);
    expect(m.subject).toBe("Website enquiry from Sam Lee, Example Pty Ltd");
    expect(m.text).toContain("Email: sam@example.com");
    expect(m.text).toContain("A booking system.");
  });
});
