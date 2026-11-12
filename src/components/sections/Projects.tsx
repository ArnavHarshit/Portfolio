import Link from "next/link";
import { projects } from "@/data/resume";
import { Reveal, SectionHeading, Tilt } from "../ui";
import { ArrowIcon, GitHubIcon } from "../Icons";

export const accentText = {
  cyan: "text-cyan",
  violet: "text-violet",
  lime: "text-lime",
  pink: "text-pink",
} as const;

export const accentBg = {
  cyan: "from-cyan/25",
  violet: "from-violet/25",
  lime: "from-lime/25",
  pink: "from-pink/25",
} as const;

export default function Projects() {
  return (
    <section id="projects" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          kicker="projects"
          title={<>Things I&apos;ve <span className="text-gradient">built from scratch.</span></>}
          sub="Consensus protocols, database engines and ML that holds up under noise. Click any card for the full story."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.1} className={i === 0 ? "md:col-span-2" : ""}>
              <Tilt className="h-full">
                <Link
                  href={`/projects/${p.slug}`}
                  data-cursor="Open"
                  className="card glow-border group relative flex h-full flex-col overflow-hidden p-6 sm:p-8"
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${accentBg[p.accent]} to-transparent blur-2xl transition-transform duration-500 group-hover:scale-125`}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-muted">
                        {p.kind} · {p.period}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{p.title}</h3>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-2xl font-bold sm:text-3xl ${accentText[p.accent]}`}>{p.metric.value}</p>
                      <p className="font-mono text-[11px] text-muted">{p.metric.label}</p>
                    </div>
                  </div>
                  <p className="relative mt-4 flex-1 leading-relaxed text-muted">{p.summary}</p>
                  <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-md bg-fg/5 px-2 py-1 font-mono text-[11px] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-3 text-muted">
                      <GitHubIcon size={16} />
                      <span className="inline-flex items-center gap-1 text-sm text-fg transition-colors group-hover:text-cyan">
                        Case study
                        <ArrowIcon className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </div>
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
