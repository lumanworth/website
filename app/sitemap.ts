import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-10-25");
  return [
    { url: "https://lumanworth.com/", lastModified: updated, priority: 1 },
    { url: "https://lumanworth.com/security", lastModified: new Date("2026-10-26"), priority: 0.7 },
    { url: "https://lumanworth.com/privacy", lastModified: updated, priority: 0.3 },
    { url: "https://lumanworth.com/terms", lastModified: updated, priority: 0.3 },
  ];
}
