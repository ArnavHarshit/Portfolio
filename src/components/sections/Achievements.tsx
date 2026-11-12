import { achievements, finals } from "@/data/resume";
import { Reveal, SectionHeading } from "../ui";

const ring = { violet: "from-violet via-pink to-violet", cyan: "from-cyan via-violet to-cyan" } as const;
const text = { violet: "text-violet", cyan: "text-cyan" } as const;
const dot = { violet: "bg-violet", cyan: "bg-cyan" } as const;

export default function Achievements() {
  return (
    <section id="achievements" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="05" kicker="wins" title={<>Achievements &amp; <span className="text-gradient">leadership.</span></>} />

        {/* Finalist spotlight */}
        <div className="mb-5 grid gap-5 lg:grid-cols-2">
          {finals.map((f, i) => (
            <Reveal key={f.event} delay={i * 0.12}>
              <article className="finalist group relative h-full rounded-2xl p-px">
                <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-surface-solid p-6 sm:p-8">
                  {/* Watermark */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-4 -top-6 select-none text-[7rem] font-black leading-none tracking-tighter text-fg/[0.04] sm:text-[9rem]"
                  >
                    {f.org.toUpperCase()}
                  </span>
                  <div aria-hidden className={`absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${ring[f.accent]} opacity-15 blur-3xl`} />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">{f.org}</p>
                      <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{f.event}</h3>
                    </div>
                    <span className="trophy grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line-strong bg-fg/[0.03] text-3xl">
                      🏆
                    </span>
                  </div>

                  <p className={`relative mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-current/30 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest ${text[f.accent]}`}>
                    <span className="shimmer">★ {f.title}</span>
                  </p>

                  <p className="relative mt-4 flex-1 leading-relaxed text-muted">{f.detail}</p>

                  {/* Stage tracker */}
                  <ol className="relative mt-8 grid grid-cols-3" aria-label="Competition stages cleared">
                    {f.stages.map((s, n) => {
                      const last = n === f.stages.length - 1;
                      return (
                        <li key={s} className="relative flex flex-col items-center text-center">
                          {n > 0 && (
                            <span aria-hidden className={`absolute right-1/2 top-[11px] h-0.5 w-full bg-gradient-to-r ${ring[f.accent]} opacity-70`} />
                          )}
                          <span
                            className={`relative z-10 grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold text-bg ${dot[f.accent]} ${last ? "pulse-ring" : ""}`}
                          >
                            {last ? "★" : "✓"}
                          </span>
                          <span className={`mt-2 font-mono text-[11px] leading-tight ${last ? `${text[f.accent]} font-semibold` : "text-muted"}`}>{s}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => {
            const inner = (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-line-strong bg-fg/[0.03] text-xl text-cyan transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  {a.icon}
                </span>
                <h3 className="mt-5 text-lg font-semibold">
                  {a.title}
                  {a.href && <span className="ml-1 text-cyan">↗</span>}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.detail}</p>
              </>
            );
            return (
              <Reveal key={a.title} delay={(i % 3) * 0.08}>
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noreferrer" className="card glow-border group block h-full p-6">
                    {inner}
                  </a>
                ) : (
                  <div className="card glow-border group h-full p-6">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
