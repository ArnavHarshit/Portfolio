"use client";

import { useState } from "react";
import { profile } from "@/data/resume";
import { Magnetic, Reveal, SectionHeading } from "../ui";
import { CodeforcesIcon, GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon } from "../Icons";

/**
 * Contact form. With no backend it opens the visitor's mail app with the
 * message pre-filled. To receive messages directly, set
 * NEXT_PUBLIC_FORMSPREE_ID (free at formspree.io) and it will POST there instead.
 */
const FORMSPREE = process.env.NEXT_PUBLIC_FORMSPREE_ID;

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    if (FORMSPREE) {
      setStatus("sending");
      try {
        const r = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        setStatus(r.ok ? "sent" : "error");
        if (r.ok) (e.target as HTMLFormElement).reset();
      } catch {
        setStatus("error");
      }
      return;
    }
    const subject = encodeURIComponent(`Hello from ${name || "your portfolio"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ""}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const copy = (addr: string) => {
    navigator.clipboard?.writeText(addr).then(() => {
      setCopied(addr);
      setTimeout(() => setCopied(""), 1800);
    });
  };

  const field =
    "w-full rounded-xl border border-line-strong bg-fg/[0.03] px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-cyan";

  return (
    <section id="contact" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="06"
          kicker="contact"
          title={<>Let&apos;s build something <span className="text-gradient">together.</span></>}
          sub="Whether it's a role, a research idea or a hard problem, my inbox is open. I usually reply within a day."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="space-y-3">
              {[
                { addr: profile.email, label: "Personal email" },
                { addr: profile.emailAlt, label: "IIT Kanpur email" },
              ].map(({ addr, label }) => (
                <button
                  key={addr}
                  onClick={() => copy(addr)}
                  className="card glow-border group flex w-full items-center gap-4 p-5 text-left"
                  data-cursor={copied === addr ? "Copied!" : "Copy"}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan/10 text-cyan">
                    <MailIcon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-muted">{label}</span>
                    <span className="block truncate font-medium">{addr}</span>
                  </span>
                  <span className="font-mono text-xs text-muted group-hover:text-cyan">{copied === addr ? "✓ copied" : "copy"}</span>
                </button>
              ))}
              {[
                { href: profile.socials.linkedin, label: "LinkedIn", sub: "Let's connect", Icon: LinkedInIcon },
                { href: profile.socials.github, label: "GitHub", sub: "@ArnavHarshit", Icon: GitHubIcon },
                { href: profile.socials.codeforces, label: "Codeforces", sub: "DangerWizz · Expert", Icon: CodeforcesIcon },
                { href: profile.socials.instagram, label: "Instagram", sub: "@i_m_arnavharshit", Icon: InstagramIcon },
              ].map(({ href, label, sub, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="card glow-border group flex items-center gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-fg/5 text-muted transition-colors group-hover:text-cyan">
                    <Icon />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{label}</span>
                    <span className="block text-sm text-muted">{sub}</span>
                  </span>
                  <span className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-cyan">→</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8">
              <p className="font-mono text-sm text-muted">
                <span className="text-cyan">POST</span> /api/hello-arnav
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-muted">Name</span>
                  <input name="name" required autoComplete="name" placeholder="Ada Lovelace" className={field} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-muted">Email</span>
                  <input name="email" type="email" required autoComplete="email" placeholder="ada@example.com" className={field} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Message</span>
                <textarea name="message" required rows={5} placeholder="Hi Arnav, I'd love to talk about…" className={`${field} resize-y`} />
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="rounded-xl bg-cyan px-6 py-3 font-semibold text-bg shadow-[0_0_30px_var(--glow)] transition-transform hover:scale-[1.03] disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send message →"}
                  </button>
                </Magnetic>
                <p role="status" className="font-mono text-xs">
                  {status === "sent" && <span className="text-lime">✓ 200 OK, message delivered.</span>}
                  {status === "error" && <span className="text-pink">✗ Something broke. Email me directly instead.</span>}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
