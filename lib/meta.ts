/* Open Graph fields every page carries. Next replaces the layout's openGraph whole when a page sets its own, so each page spreads this in. */
/* The share image, public/og.png (1200 by 630, made by og/shot.mjs). Set here because a page's own openGraph does not inherit a root opengraph-image file. */
export const SHARE_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Lumanworth. Built to last. Yours to keep. A Perth software company." };

export const OG_BASE = { type: "website" as const, siteName: "Lumanworth", locale: "en_AU", images: [SHARE_IMAGE] };

/* The Home share line; the layout uses it too, as the fallback for any page without its own. */
export const TAGLINE = "Built to last. Yours to keep. A Perth software company.";
