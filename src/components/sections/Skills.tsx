import { skills } from "@/data/resume";
import { Reveal, SectionHeading } from "../ui";

export default function Skills() {
  const all = skills.flatMap((s) => s.items);
  return (
    <section id="skills" className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading index="04" kicker="skills" title={<>The <span className="text-gradient">toolbox.</span></>} />
      </div>

      {/* Infinite marquee */}
      <div className="relative mb-14 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]" aria-hidden>
        <div className="flex w-max animate-marquee gap-3">
          {[...all, ...all].map((s, i) => (
            <span key={i} className="whitespace-nowrap rounded-full border border-line px-4 py-2 font-mono text-sm text-muted">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={(i % 3) * 0.08}>
            <div className="card glow-border group relative h-full overflow-hidden p-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line-strong bg-fg/[0.03] font-mono text-sm text-cyan transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  {g.icon}
                </span>
                <h3 className="flex-1 font-semibold">{g.group}</h3>
                <span className="rounded-full bg-fg/5 px-2 py-0.5 font-mono text-[11px] text-muted">{g.items.length}</span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-lg border border-line bg-fg/[0.03] px-3 py-1.5 text-sm transition-colors hover:border-cyan hover:text-cyan"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
