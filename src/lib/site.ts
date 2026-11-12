/**
 * The site's public address, used for link previews, the sitemap and robots.txt.
 * Order: an explicit NEXT_PUBLIC_SITE_URL, then the production domain Vercel
 * provides automatically (switches to a custom domain once you add one),
 * then the live Vercel URL, then localhost for development.
 */
const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelProd ? `https://${vercelProd}` : "") ||
  (process.env.NODE_ENV === "production" ? "https://portfolio-tau-flax-39.vercel.app" : "http://localhost:3000")
).replace(/\/+$/, "");
