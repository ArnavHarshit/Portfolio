import { education, profile } from "@/data/resume";
import { Counter, Reveal, SectionHeading } from "../ui";
import Terminal from "../Terminal";

export default function About() {
  return (
    <section id="about" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" kicker="about" title={<>Engineer by curiosity, <span className="text-gradient">builder by habit.</span></>} />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            {profile.about.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-lg leading-relaxed text-muted">{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="mt-8 space-y-3">
                <p className="font-mono text-xs uppercase tracking-widest text-cyan">Education</p>
                {education.map((e) => (
                  <div key={e.degree} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-line pb-3">
                    <div>
                      <p className="font-medium">{e.degree}</p>
                      <p className="text-sm text-muted">
                        {e.place} · {e.year}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-cyan">{e.score}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <Terminal />
            <p className="mt-3 text-center font-mono text-xs text-muted">↑ it&apos;s real. Ask it anything about me</p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {profile.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="card glow-border h-full p-5 sm:p-6">
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
