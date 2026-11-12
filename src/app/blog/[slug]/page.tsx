import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { profile } from "@/data/resume";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  return p ? { title: p.title, description: p.summary, openGraph: { type: "article", title: p.title, description: p.summary } } : {};
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const html = await marked.parse(post.content, { gfm: true });

  const all = getPosts();
  const i = all.findIndex((p) => p.slug === slug);
  const newer = all[i - 1];
  const older = all[i + 1];

  return (
    <article className="relative px-4 pb-24 pt-32 sm:px-6">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 h-[50vh]" />
      <div className="mx-auto max-w-2xl">
        <nav aria-label="Breadcrumb" className="font-mono text-sm text-muted">
          <Link href="/" className="hover:text-cyan">~</Link> / <Link href="/blog" className="hover:text-cyan">blog</Link> /{" "}
          <span className="text-fg">{post.slug}</span>
        </nav>

        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingMins} min read</span>
            {post.tags.map((t) => (
              <span key={t} className="text-cyan">#{t}</span>
            ))}
          </div>
          <h1 className="mt-4 text-[clamp(2.1rem,6vw,3.25rem)] font-bold leading-[1.1] tracking-tight">{post.title}</h1>
          {post.summary && <p className="mt-5 text-lg leading-relaxed text-muted">{post.summary}</p>}
          <div className="mt-6 flex items-center gap-3 border-y border-line py-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan to-violet font-bold text-bg">AH</span>
            <div className="text-sm">
              <p className="font-medium">{profile.name}</p>
              <p className="text-muted">Systems &amp; AI Engineer</p>
            </div>
          </div>
        </header>

        <div className="prose-blog mt-10" dangerouslySetInnerHTML={{ __html: html }} />

        <nav aria-label="More posts" className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
          {older ? (
            <Link href={`/blog/${older.slug}`} className="card glow-border group p-5">
              <span className="font-mono text-xs text-muted">← older</span>
              <span className="mt-1 block font-medium group-hover:text-cyan">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={`/blog/${newer.slug}`} className="card glow-border group p-5 text-right">
              <span className="font-mono text-xs text-muted">newer →</span>
              <span className="mt-1 block font-medium group-hover:text-cyan">{newer.title}</span>
            </Link>
          ) : (
            <Link href="/blog" className="card glow-border group p-5 text-right">
              <span className="font-mono text-xs text-muted">all posts →</span>
              <span className="mt-1 block font-medium group-hover:text-cyan">Back to the blog</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
