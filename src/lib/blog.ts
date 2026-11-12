import "server-only";
import fs from "node:fs";
import path from "node:path";

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  draft: boolean;
  readingMins: number;
};
export type Post = PostMeta & { content: string };

/**
 * Frontmatter is one `key: <JSON value>` per line between `---` fences, e.g.
 *   title: "My first post"
 *   tags: ["systems", "raft"]
 */
export function parsePost(slug: string, raw: string): Post {
  const meta: Record<string, unknown> = {};
  let content = raw;
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (m) {
    content = raw.slice(m[0].length);
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i < 0) continue;
      const key = line.slice(0, i).trim();
      const val = line.slice(i + 1).trim();
      try {
        meta[key] = JSON.parse(val);
      } catch {
        meta[key] = val.replace(/^["']|["']$/g, "");
      }
    }
  }
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: String(meta.title ?? slug),
    date: String(meta.date ?? "1970-01-01"),
    summary: String(meta.summary ?? ""),
    tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
    draft: meta.draft === true,
    readingMins: Math.max(1, Math.round(words / 220)),
    content,
  };
}

export function serializePost(p: Pick<Post, "title" | "date" | "summary" | "tags" | "draft" | "content">) {
  return [
    "---",
    `title: ${JSON.stringify(p.title)}`,
    `date: ${JSON.stringify(p.date)}`,
    `summary: ${JSON.stringify(p.summary)}`,
    `tags: ${JSON.stringify(p.tags)}`,
    `draft: ${p.draft ? "true" : "false"}`,
    "---",
    "",
    p.content.trim(),
    "",
  ].join("\n");
}

function readAll(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && SLUG_RE.test(f.slice(0, -3)))
    .map((f) => parsePost(f.slice(0, -3), fs.readFileSync(path.join(BLOG_DIR, f), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Published posts only, newest first. */
export function getPosts(): Post[] {
  return readAll().filter((p) => !p.draft);
}

export function getPost(slug: string): Post | null {
  if (!SLUG_RE.test(slug)) return null;
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const p = parsePost(slug, fs.readFileSync(file, "utf8"));
  return p.draft ? null : p;
}

export function getAllPostsIncludingDrafts(): Post[] {
  return readAll();
}

export function formatDate(d: string) {
  const dt = new Date(`${d}T00:00:00`);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
