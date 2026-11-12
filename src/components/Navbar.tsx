"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections, profile } from "@/data/resume";
import { scrollToId } from "@/lib/client";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Highlight the section currently in view.
  useEffect(() => {
    if (!onHome) return;
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    if (!onHome) return; // let the link navigate to /#id
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav
        aria-label="Primary"
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled ? "card mx-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] xl:mx-auto" : "border border-transparent"
        }`}
      >
        <Link href="/" onClick={go("home")} className="group flex items-center gap-2 font-mono text-sm" aria-label="Home">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line-strong bg-surface-solid text-cyan transition-colors group-hover:border-cyan">
            {"</>"}
          </span>
          <span className="hidden sm:inline">
            <span className="text-muted">~/</span>
            {profile.handle}
            <span className="text-cyan">.dev</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {sections.slice(1).map((s) => {
            const isActive = onHome && active === s.id;
            return (
              <li key={s.id}>
                <Link
                  href={`/#${s.id}`}
                  onClick={go(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg border border-line-strong bg-fg/5"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {s.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/blog"
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                pathname.startsWith("/blog") ? "text-cyan" : "text-muted hover:text-fg"
              }`}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/resume"
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                pathname === "/resume" ? "text-cyan" : "text-muted hover:text-fg"
              }`}
            >
              Resume
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            className="hidden items-center gap-2 rounded-lg border border-line-strong px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-cyan hover:text-fg md:flex"
            aria-label="Open command menu"
          >
            <span>Search</span>
            <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-line-strong lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-[1.5px] w-4 bg-fg transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-fg transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-[1.5px] w-4 bg-fg transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 -z-10 bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex h-full flex-col justify-center gap-2 px-8">
              {[...sections, { id: "blog", label: "Blog" }, { id: "resume", label: "Resume" }].map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={s.id === "resume" || s.id === "blog" ? `/${s.id}` : `/#${s.id}`}
                    onClick={s.id === "resume" || s.id === "blog" ? () => setOpen(false) : go(s.id)}
                    className="flex items-baseline gap-4 py-2 text-3xl font-semibold"
                  >
                    <span className="font-mono text-sm text-cyan">{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
