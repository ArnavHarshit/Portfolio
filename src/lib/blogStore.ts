import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { BLOG_DIR, getAllPostsIncludingDrafts, parsePost, SLUG_RE, type Post } from "./blog";

/**
 * Where posts are saved when you publish from /admin:
 * - "github": commits content/blog/<slug>.md to your repo (production). Vercel redeploys automatically.
 * - "local":  writes the file straight to disk (only while running `npm run dev`).
 */
const GH = {
  token: process.env.GITHUB_TOKEN,
  repo: process.env.GITHUB_REPO, // "username/repo"
  branch: process.env.GITHUB_BRANCH || "main",
};

export type StorageMode = "github" | "local" | "none";
export function storageMode(): StorageMode {
  if (GH.token && GH.repo) return "github";
  if (process.env.NODE_ENV === "development") return "local";
  return "none";
}

const ghPath = (slug: string) => `content/blog/${slug}.md`;

async function gh(pathname: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${GH.repo}/contents/${pathname}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${GH.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  return res;
}

async function ghSha(slug: string): Promise<string | undefined> {
  const r = await gh(`${ghPath(slug)}?ref=${GH.branch}`);
  if (r.status === 404) return undefined;
  if (!r.ok) throw new Error(`GitHub read failed (${r.status})`);
  return (await r.json()).sha;
}

export async function listPostsForAdmin(): Promise<Post[]> {
  if (storageMode() !== "github") return getAllPostsIncludingDrafts();
  const r = await gh(`content/blog?ref=${GH.branch}`);
  if (r.status === 404) return [];
  if (!r.ok) throw new Error(`GitHub list failed (${r.status})`);
  const files = ((await r.json()) as { name: string; type: string }[]).filter(
    (f) => f.type === "file" && f.name.endsWith(".md") && SLUG_RE.test(f.name.slice(0, -3))
  );
  const posts = await Promise.all(
    files.map(async (f) => {
      const fr = await gh(`content/blog/${f.name}?ref=${GH.branch}`);
      const j = await fr.json();
      return parsePost(f.name.slice(0, -3), Buffer.from(j.content, "base64").toString("utf8"));
    })
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function savePost(slug: string, markdown: string) {
  if (!SLUG_RE.test(slug)) throw new Error("Invalid slug");
  const mode = storageMode();
  if (mode === "local") {
    await fs.mkdir(BLOG_DIR, { recursive: true });
    await fs.writeFile(path.join(BLOG_DIR, `${slug}.md`), markdown, "utf8");
    return;
  }
  if (mode === "github") {
    const sha = await ghSha(slug);
    const r = await gh(ghPath(slug), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `blog: ${sha ? "update" : "add"} ${slug}`,
        content: Buffer.from(markdown, "utf8").toString("base64"),
        branch: GH.branch,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!r.ok) throw new Error(`GitHub save failed (${r.status})`);
    return;
  }
  throw new Error("Saving isn't configured. Set GITHUB_TOKEN and GITHUB_REPO.");
}

export async function deletePost(slug: string) {
  if (!SLUG_RE.test(slug)) throw new Error("Invalid slug");
  const mode = storageMode();
  if (mode === "local") {
    await fs.rm(path.join(BLOG_DIR, `${slug}.md`), { force: true });
    return;
  }
  if (mode === "github") {
    const sha = await ghSha(slug);
    if (!sha) return;
    const r = await gh(ghPath(slug), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `blog: delete ${slug}`, sha, branch: GH.branch }),
    });
    if (!r.ok) throw new Error(`GitHub delete failed (${r.status})`);
    return;
  }
  throw new Error("Deleting isn't configured. Set GITHUB_TOKEN and GITHUB_REPO.");
}
