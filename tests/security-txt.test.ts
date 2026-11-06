import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const text = readFileSync(fileURLToPath(new URL("../public/.well-known/security.txt", import.meta.url)), "utf8");
const field = (name: string) => text.split("\n").find((l) => l.startsWith(`${name}: `))?.slice(name.length + 2);

/* RFC 9116. Expires is a real date: this test fails once it passes, which is the prompt to renew the file. */
describe("security.txt", () => {
  it("names the contact, language and canonical address", () => {
    expect(field("Contact")).toBe("mailto:support@lumanworth.com");
    expect(field("Preferred-Languages")).toBe("en");
    expect(field("Canonical")).toBe("https://lumanworth.com/.well-known/security.txt");
  });

  it("expires in the future, in ISO 8601", () => {
    const expires = field("Expires");
    expect(expires).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
    expect(new Date(expires!).getTime()).toBeGreaterThan(Date.now());
  });
});
