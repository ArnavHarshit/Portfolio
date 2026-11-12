import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getPosts } from "@/lib/blog";
import { Reveal } from "@/components/ui";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on distributed systems, databases, ML and competitive programming by Arnav Harshit.",
};

export default function BlogIndex() {
  const posts = getPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <section className="relative px-4 pb-24 pt-32 sm:px-6">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 h-[60vh]" />
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="font-mono text-sm text-cyan">
            <span className="text-muted">$</span> ls ~/blog
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-none tracking-tight">
            Writing &amp; <span className="text-gradient">notes.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Things I learn building systems, training models and solving problems, written down so I understand them twice.
          </p>
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </Reveal>

        <div className="mt-14 space-y-4">
          {posts.length === 0 && (
            <div className="card p-10 text-center font-mono text-sm text-muted">No posts yet. Something good is compiling…</div>
          )}
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 6) * 0.06}>
              <Link href={`/blog/${p.slug}`} data-cursor="Read" className="card glow-border group block p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <span>·</span>
                  <span>{p.readingMins} min read</span>
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-cyan">#{t}</span>
                  ))}
                </div>
                <h2 className="mt-3 text-2xl font-semibold leading-snug transition-colors group-hover:text-cyan">{p.title}</h2>
                {p.summary && <p className="mt-3 leading-relaxed text-muted">{p.summary}</p>}
                <span className="mt-5 inline-flex items-center gap-1 text-sm">
                  Read post <ArrowIcon className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
