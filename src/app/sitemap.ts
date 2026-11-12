import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { projects } from "@/data/resume";
import { getPosts } from "@/lib/blog";

export const dynamic = "force-static";


export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/resume`, priority: 0.8 },
    { url: `${SITE_URL}/blog`, priority: 0.8 },
    ...getPosts().map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.date, priority: 0.6 })),
    ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, priority: 0.7 })),
  ];
}
