import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/resume";
import { Reveal } from "@/components/ui";
import { ArrowIcon, GitHubIcon } from "@/components/Icons";
import { accentBg, accentText } from "@/components/sections/Projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <article className="relative px-4 pb-24 pt-32 sm:px-6">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 h-[60vh]" />
      <div aria-hidden className={`absolute right-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-bl ${accentBg[p.accent]} to-transparent blur-3xl`} />

      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="font-mono text-sm text-muted">
          <Link href="/" className="hover:text-cyan">~</Link>
          <span> / </span>
          <Link href="/#projects" className="hover:text-cyan">projects</Link>
          <span> / </span>
          <span className="text-fg">{p.slug}</span>
        </nav>

        <Reveal>
          <p className="mt-10 font-mono text-sm text-muted">
            {p.kind} · {p.period}
          </p>
          <h1 className="mt-3 text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-tight">{p.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{p.summary}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 font-semibold text-bg shadow-[0_0_30px_var(--glow)] transition-transform hover:scale-[1.03]"
            >
              <GitHubIcon /> View source <ArrowIcon />
            </a>
            <div className="card px-5 py-2.5">
              <span className={`text-2xl font-bold ${accentText[p.accent]}`}>{p.metric.value}</span>{" "}
              <span className="font-mono text-xs text-muted">{p.metric.label}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {[
          { h: "The problem", body: <p className="text-lg leading-relaxed text-muted">{p.problem}</p> },
          {
            h: "How I built it",
            body: (
              <ol className="space-y-4">
                {p.approach.map((a, n) => (
                  <li key={a} className="card flex gap-4 p-5">
                    <span className={`font-mono text-sm ${accentText[p.accent]}`}>0{n + 1}</span>
                    <span className="leading-relaxed text-muted">{a}</span>
                  </li>
                ))}
              </ol>
            ),
          },
          {
            h: "Results",
            body: (
              <ul className="space-y-3">
                {p.results.map((r) => (
                  <li key={r} className="flex gap-3 text-lg leading-relaxed">
                    <span className="text-lime">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            ),
          },
        ].map((s, n) => (
          <Reveal key={s.h} delay={0.05 * n}>
            <section className="mt-16">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
                <span className="rounded-full border border-cyan/40 bg-cyan/10 px-2.5 py-0.5 font-mono text-xs tabular-nums text-cyan">
                  0{n + 1}
                </span>
                {s.h}
              </h2>
              {s.body}
            </section>
          </Reveal>
        ))}

        <nav aria-label="More projects" className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
          <Link href={`/projects/${prev.slug}`} className="card glow-border group p-5">
            <span className="font-mono text-xs text-muted">← previous</span>
            <span className="mt-1 block font-medium group-hover:text-cyan">{prev.title}</span>
          </Link>
          <Link href={`/projects/${next.slug}`} className="card glow-border group p-5 text-right">
            <span className="font-mono text-xs text-muted">next →</span>
            <span className="mt-1 block font-medium group-hover:text-cyan">{next.title}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
