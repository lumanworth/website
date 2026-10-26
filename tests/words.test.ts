import { describe, expect, it } from "vitest";
import { ASKS, EVENTS, MAP_STEPS, NETWORKS } from "@/lib/words";

/* What we do: every example has to add up. */
describe("what we do examples", () => {
  it("office time adds up to 33 minutes mapped and 5 redesigned", () => {
    expect(MAP_STEPS.reduce((n, s) => n + s.mins, 0)).toBe(33);
    expect(MAP_STEPS.reduce((n, s) => n + (s.after?.mins ?? 0), 0)).toBe(5);
    expect(MAP_STEPS.filter((s) => !s.after)).toHaveLength(4);
    MAP_STEPS.forEach((s) => { if (s.after) expect(s.after.mins).toBeLessThanOrEqual(s.mins); });
  });

  it("the record runs in time order with one offline completion", () => {
    const mins = EVENTS.map(({ t }) => {
      const [, h, m, ap] = /^(\d+):(\d\d) (am|pm)$/.exec(t)!;
      return ((+h % 12) + (ap === "pm" ? 12 : 0)) * 60 + +m;
    });
    mins.forEach((m, i) => { if (i) expect(m).toBeGreaterThanOrEqual(mins[i - 1]); });
    expect(EVENTS.filter((e) => e.off)).toHaveLength(1);
    expect(EVENTS.findIndex((e) => e.off)).toBeLessThan(EVENTS.findIndex((e) => e.e === "sync.applied"));
  });

  it("only the unsourced question is withheld", () => {
    ASKS.forEach((x) => {
      const withheld = x.trace.at(-1) === "answer withheld";
      expect(x.src.startsWith("Source: "), x.q).toBe(!withheld);
      expect(x.trace.at(-1) === "citation check passed", x.q).toBe(!withheld);
    });
    expect(ASKS.filter((x) => x.trace.at(-1) === "answer withheld")).toHaveLength(1);
  });

  it("words land before the page completes on each network", () => {
    Object.values(NETWORKS).forEach((n) => expect(n.words).toBeLessThan(n.done));
  });
});
