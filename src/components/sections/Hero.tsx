"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { profile } from "@/data/resume";
import { scrollToId } from "@/lib/client";
import Robot from "../Robot";
import { Magnetic, Scramble, Typewriter } from "../ui";
import { CodeforcesIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from "../Icons";

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden className="absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-violet/20 blur-[120px]" />
      <div aria-hidden className="absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-cyan/15 blur-[120px]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1.5 font-mono text-xs text-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            Open to opportunities · {profile.location}
          </motion.div>

          <p className="mb-2 font-mono text-sm text-cyan">
            <span className="text-muted">$</span> whoami
          </p>
          <h1 className="text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight">
            <Scramble text="Arnav" />
            <br />
            <Scramble text="Harshit" className="text-gradient" delay={0.25} />
          </h1>

          <p className="mt-6 h-7 font-mono text-base text-fg sm:text-lg">
            <span className="text-violet">&gt;</span> <Typewriter words={profile.roles} />
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <button
                onClick={() => scrollToId("projects")}
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 font-semibold text-bg shadow-[0_0_30px_var(--glow)] transition-transform hover:scale-[1.03]"
              >
                View my work
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </Magnetic>
            <Magnetic>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-surface px-5 py-3 font-semibold transition-colors hover:border-cyan hover:text-cyan"
              >
                Resume
              </Link>
            </Magnetic>
            <div className="ml-1 flex items-center gap-1">
              {[
                { href: profile.socials.github, label: "GitHub", Icon: GitHubIcon },
                { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                { href: profile.socials.codeforces, label: "Codeforces", Icon: CodeforcesIcon },
                { href: profile.socials.instagram, label: "Instagram", Icon: InstagramIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-xl text-muted transition-colors hover:bg-fg/5 hover:text-cyan"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 lg:pt-0"
        >
          <Robot />
        </motion.div>
      </div>

      <button
        onClick={() => scrollToId("about")}
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:flex"
      >
        scroll
        <span className="flex h-9 w-5 justify-center rounded-full border border-line-strong pt-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-cyan" />
        </span>
      </button>
    </section>
  );
}
