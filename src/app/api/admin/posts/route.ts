import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { SLUG_RE, serializePost } from "@/lib/blog";
import { deletePost, listPostsForAdmin, savePost, storageMode } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Not signed in." }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    return NextResponse.json({ mode: storageMode(), posts: await listPostsForAdmin() });
  } catch (e) {
    return NextResponse.json({ mode: storageMode(), posts: [], error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const slug = String(b.slug ?? "").trim();
  const title = String(b.title ?? "").trim().slice(0, 200);
  const content = String(b.content ?? "");
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(b.date)) ? String(b.date) : new Date().toISOString().slice(0, 10);
  if (!SLUG_RE.test(slug) || slug.length > 80) return NextResponse.json({ error: "Slug must be lowercase letters, numbers and dashes." }, { status: 400 });
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  if (content.length > 200_000) return NextResponse.json({ error: "Post is too long." }, { status: 400 });

  const md = serializePost({
    title,
    date,
    summary: String(b.summary ?? "").trim().slice(0, 400),
    tags: (Array.isArray(b.tags) ? b.tags : []).map((t: unknown) => String(t).trim()).filter(Boolean).slice(0, 10),
    draft: b.draft === true,
    content,
  });
  try {
    await savePost(slug, md);
    return NextResponse.json({ ok: true, mode: storageMode() });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  try {
    await deletePost(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
