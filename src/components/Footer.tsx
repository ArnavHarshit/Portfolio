import Link from "next/link";
import { profile } from "@/data/resume";
import { CodeforcesIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-line px-4 py-10 sm:px-6" style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-mono text-sm">
            <span className="text-muted">~/</span>
            {profile.handle}
            <span className="text-cyan">.dev</span>
          </p>
          <p className="mt-1 text-xs text-muted">
            Designed &amp; built by {profile.name} · © {new Date().getFullYear()}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
          <Link href="/#projects" className="hover:text-cyan">Projects</Link>
          <Link href="/blog" className="hover:text-cyan">Blog</Link>
          <Link href="/resume" className="hover:text-cyan">Resume</Link>
          <Link href="/#contact" className="hover:text-cyan">Contact</Link>
          <span className="hidden font-mono text-xs sm:inline">
            press <kbd className="rounded border border-line px-1">Ctrl K</kbd>
          </span>
        </nav>
        <div className="flex gap-1">
          {[
            { href: profile.socials.github, label: "GitHub", Icon: GitHubIcon },
            { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
            { href: profile.socials.codeforces, label: "Codeforces", Icon: CodeforcesIcon },
            { href: profile.socials.instagram, label: "Instagram", Icon: InstagramIcon },
          ].map(({ href, label, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:text-cyan">
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
