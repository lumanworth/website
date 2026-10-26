/* Open Graph fields every page carries. Next replaces the layout's openGraph whole when a page sets its own, so each page spreads this in. */
export const OG_BASE = { type: "website", siteName: "Lumanworth", locale: "en_AU" } as const;

/* The Home share line; the layout uses it too, as the fallback for any page without its own. */
export const TAGLINE = "Built to last. Yours to keep. A Perth software company.";
