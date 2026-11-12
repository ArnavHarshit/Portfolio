"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { education, experience, profile, projects, skills } from "@/data/resume";
import { scrollToId, toggleTheme } from "@/lib/client";

type Line = { kind: "in" | "out" | "err" | "ai"; text: string };

const HELP = [
  "Ask me anything about Arnav in plain English, e.g. 'what did he build at UnifyApps?'",
  "",
  "Or use a command:",
  "  about       who is Arnav?",
  "  projects    list projects  (open <n> to view one)",
  "  experience  work history",
  "  skills      tech stack",
  "  education   academics",
  "  contact     how to reach me",
  "  resume      open resume page",
  "  blog        read my blog",
  "  theme       toggle light/dark",
  "  goto <sec>  scroll to a section",
  "  clear       clear the screen",
];

/** A tiny fake shell visitors can type into. */
export default function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: "arnav-os v1.0 · type 'help' to get started." }]);
  const [aiOn, setAiOn] = useState(false);

  useEffect(() => {
    fetch("/api/ask")
      .then((r) => r.json())
      .then((j) => {
        if (!j?.enabled) return;
        setAiOn(true);
        setLines([
          { kind: "out", text: "arnav-os v1.0 · AI assistant online." },
          { kind: "out", text: "Ask me anything about Arnav, or type 'help' for commands." },
        ]);
      })
      .catch(() => {});
  }, []);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const body = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const chat = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const askAI = async (question: string) => {
    setBusy(true);
    chat.current.push({ role: "user", content: question });
    setLines((l) => [...l, { kind: "in", text: question }, { kind: "ai", text: "" }]);
    const write = (fn: (t: string) => string) =>
      setLines((l) => {
        const copy = [...l];
        for (let i = copy.length - 1; i >= 0; i--)
          if (copy[i].kind === "ai") {
            copy[i] = { ...copy[i], text: fn(copy[i].text) };
            break;
          }
        return copy;
      });
    let answer = "";
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chat.current }),
      });
      if (!res.ok || !res.body) {
        const msg = (await res.text()) || "AI is unavailable right now.";
        write(() => `${msg} Type 'help' for commands.`);
        chat.current.pop();
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        answer += chunk;
        write((t) => t + chunk);
      }
      chat.current.push({ role: "assistant", content: answer });
      chat.current = chat.current.slice(-10);
    } catch {
      write(() => "Network error. Type 'help' for offline commands.");
      chat.current.pop();
    } finally {
      setBusy(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [lines]);

  const exec = (raw: string) => {
    const cmd = raw.trim();
    const [c, ...args] = cmd.split(/\s+/);
    const out = (t: string | string[], kind: Line["kind"] = "out") =>
      (Array.isArray(t) ? t : [t]).map((text) => ({ kind, text }));
    let res: Line[] = [];

    switch ((c || "").toLowerCase()) {
      case "":
        break;
      case "help":
        res = out(aiOn ? HELP : HELP.slice(3));
        break;
      case "about":
      case "whoami":
        res = out(profile.about);
        break;
      case "projects":
      case "ls":
        res = out([...projects.map((p, i) => `  [${i + 1}] ${p.title}  (${p.metric.value} ${p.metric.label})`), "Type 'open 1' to read more."]);
        break;
      case "open":
      case "cat": {
        const n = parseInt(args[0], 10);
        const p = projects[n - 1];
        if (p) {
          res = out(`Opening ${p.title}…`);
          setTimeout(() => router.push(`/projects/${p.slug}`), 400);
        } else res = out(`open: expected a number 1–${projects.length}`, "err");
        break;
      }
      case "experience":
      case "work":
        res = out(experience.map((e) => `  ${e.period.padEnd(18)} ${e.role} @ ${e.company}${e.badge ? `  ★ ${e.badge}` : ""}`));
        break;
      case "skills":
        res = out(skills.map((s) => `  ${s.group.padEnd(18)} ${s.items.join(", ")}`));
        break;
      case "education":
        res = out(education.map((e) => `  ${e.year.padEnd(16)} ${e.degree}, ${e.place} (${e.score})`));
        break;
      case "contact":
        res = out([
          `  email      ${profile.email}`,
          `  college    ${profile.emailAlt}`,
          `  github     ${profile.socials.github}`,
          `  linkedin   ${profile.socials.linkedin}`,
          `  instagram  @i_m_arnavharshit`,
        ]);
        break;
      case "blog":
        res = out("Opening blog…");
        setTimeout(() => router.push("/blog"), 400);
        break;
      case "resume":
        res = out("Opening resume…");
        setTimeout(() => router.push("/resume"), 400);
        break;
      case "theme":
        toggleTheme();
        res = out("Theme toggled.");
        break;
      case "goto":
      case "cd":
        if (args[0]) {
          scrollToId(args[0].replace(/^#/, "").toLowerCase());
          res = out(`→ #${args[0]}`);
        } else res = out("usage: goto <home|about|experience|projects|skills|achievements|contact>", "err");
        break;
      case "sudo":
        res = out("Nice try. This incident will be reported. 🚨", "err");
        break;
      case "hire":
        res = out(["Excellent decision.", `Send an offer to ${profile.email} ✉`]);
        break;
      case "clear":
        setLines([]);
        chat.current = [];
        return;
      case "ask":
        if (!aiOn) {
          res = out("AI answers aren't switched on yet. Try 'about', 'projects' or 'contact'.", "err");
          break;
        }
        if (args.length) askAI(args.join(" "));
        else res = out("usage: ask <your question>", "err");
        if (args.length) return;
        break;
      default:
        if (aiOn) {
          askAI(cmd);
          return;
        }
        res = out(`command not found: ${c}. Try 'help'.`, "err");
    }
    setLines((l) => [...l, { kind: "in", text: cmd }, ...res]);
  };

  return (
    <div
      className="card overflow-hidden font-mono text-[13px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <div className="flex items-center gap-2 border-b border-line bg-fg/[0.03] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-muted">arnav@portfolio: ~</span>
      </div>
      <div ref={body} data-lenis-prevent className="h-72 overflow-y-auto p-4 leading-relaxed" aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap break-words ${l.kind === "err" ? "text-pink" : l.kind === "in" ? "text-fg" : "text-muted"}`}>
            {l.kind === "in" && <span className="text-lime">❯ </span>}
            {l.kind === "ai" && <span className="text-violet">bit ✦ </span>}
            {l.kind === "ai" ? <span className={`text-fg ${busy && i === lines.length - 1 ? "caret" : ""}`}>{l.text || (busy ? "thinking…" : "")}</span> : l.text}
          </div>
        ))}
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (busy) return;
            exec(input);
            if (input.trim()) setHist((h) => [input, ...h]);
            setHIdx(-1);
            setInput("");
          }}
        >
          <span className="text-lime">❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && hist.length) {
                e.preventDefault();
                const n = Math.min(hIdx + 1, hist.length - 1);
                setHIdx(n);
                setInput(hist[n]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = hIdx - 1;
                setHIdx(Math.max(n, -1));
                setInput(n < 0 ? "" : hist[n]);
              }
            }}
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={busy ? "Bit is typing…" : aiOn ? "ask me anything, or type 'help'" : "type 'help'"}
            className="w-full bg-transparent text-fg caret-cyan outline-none placeholder:text-muted/50"
          />
        </form>
      </div>
    </div>
  );
}
