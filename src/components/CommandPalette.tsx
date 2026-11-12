"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { profile, projects, sections } from "@/data/resume";
import { scrollToId, toggleTheme } from "@/lib/client";

type Action = { id: string; group: string; label: string; hint?: string; run: () => void };

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const actions: Action[] = useMemo(
    () => [
      ...sections.map((s) => ({
        id: `s-${s.id}`,
        group: "Jump to",
        label: s.label,
        hint: `#${s.id}`,
        run: () => (location.pathname === "/" ? scrollToId(s.id) : router.push(`/#${s.id}`)),
      })),
      ...projects.map((p) => ({
        id: `p-${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: p.tags[0],
        run: () => router.push(`/projects/${p.slug}`),
      })),
      { id: "blog", group: "Pages", label: "Read the blog", hint: "/blog", run: () => router.push("/blog") },
      { id: "resume", group: "Pages", label: "View resume", hint: "/resume", run: () => router.push("/resume") },
      { id: "gh", group: "Links", label: "GitHub", hint: "↗", run: () => window.open(profile.socials.github, "_blank") },
      { id: "li", group: "Links", label: "LinkedIn", hint: "↗", run: () => window.open(profile.socials.linkedin, "_blank") },
      { id: "cf", group: "Links", label: "Codeforces", hint: "↗", run: () => window.open(profile.socials.codeforces, "_blank") },
      { id: "ig", group: "Links", label: "Instagram", hint: "@i_m_arnavharshit", run: () => window.open(profile.socials.instagram, "_blank") },
      {
        id: "email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(() => {
            setToast("Email copied to clipboard");
            setTimeout(() => setToast(""), 2000);
          });
        },
      },
      { id: "theme", group: "Actions", label: "Toggle light / dark theme", hint: "◐", run: toggleTheme },
    ],
    [router]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return actions;
    return actions.filter((a) => `${a.group} ${a.label} ${a.hint ?? ""}`.toLowerCase().includes(s));
  }, [q, actions]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      window.__lenis?.stop();
      setTimeout(() => input.current?.focus(), 10);
    } else window.__lenis?.start();
  }, [open]);

  useEffect(() => setIdx(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${idx}"]`)?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  const run = (a?: Action) => {
    if (!a) return;
    setOpen(false);
    setTimeout(a.run, 60);
  };

  let lastGroup = "";
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-surface-solid shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <span className="font-mono text-cyan">❯</span>
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setIdx((i) => Math.min(i + 1, filtered.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setIdx((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter") run(filtered[idx]);
                  }}
                  placeholder="Type a command or search…"
                  className="h-14 w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[idx] ? `pa-${filtered[idx].id}` : undefined}
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
              </div>
              <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
                {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No results for “{q}”</li>}
                {filtered.map((a, i) => {
                  const header = a.group !== lastGroup;
                  lastGroup = a.group;
                  return (
                    <li key={a.id}>
                      {header && (
                        <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted">{a.group}</div>
                      )}
                      <button
                        id={`pa-${a.id}`}
                        role="option"
                        aria-selected={i === idx}
                        data-idx={i}
                        onMouseMove={() => setIdx(i)}
                        onClick={() => run(a)}
                        className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          i === idx ? "bg-cyan/10 text-fg" : "text-muted"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`font-mono text-xs ${i === idx ? "text-cyan" : "text-transparent"}`}>→</span>
                          {a.label}
                        </span>
                        {a.hint && <span className="truncate font-mono text-xs text-muted">{a.hint}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex gap-4 border-t border-line px-4 py-2 font-mono text-[10px] text-muted">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 z-[85] -translate-x-1/2 rounded-full border border-cyan/40 bg-surface-solid px-4 py-2 font-mono text-xs text-cyan shadow-lg"
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
