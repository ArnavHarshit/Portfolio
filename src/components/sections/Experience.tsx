"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { experience } from "@/data/resume";
import { Reveal, SectionHeading } from "../ui";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="experience" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          kicker="experience"
          title={<>Where I&apos;ve <span className="text-gradient">shipped.</span></>}
          sub="Three internships across AI agents, backend security tooling and offline-first mobile networking."
        />

        <div ref={ref} className="relative pl-8 md:pl-12">
          {/* Timeline rail, filling as you scroll */}
          <div aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-[11px]" />
          <motion.div
            aria-hidden
            style={{ scaleY }}
            className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-gradient-to-b from-cyan via-violet to-pink md:left-[11px]"
          />

          <div className="space-y-10">
            {experience.map((job, i) => (
              <Reveal key={job.company} delay={i * 0.05}>
                <article className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-8 top-6 grid h-4 w-4 place-items-center rounded-full border-2 border-cyan bg-bg md:-left-12 md:h-6 md:w-6"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan md:h-2 md:w-2" />
                  </span>
                  <div className="card glow-border p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold sm:text-2xl">{job.role}</h3>
                        <p className="mt-1 text-cyan">@ {job.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-mono text-xs text-muted sm:text-sm">{job.period}</span>
                        {job.badge && (
                          <span className="rounded-full border border-lime/40 bg-lime/10 px-2.5 py-0.5 font-mono text-[11px] text-lime">
                            ★ {job.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {job.points.map((p) => (
                        <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                          <span className="mt-1 font-mono text-xs text-cyan">▹</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.tags.map((t) => (
                        <span key={t} className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
