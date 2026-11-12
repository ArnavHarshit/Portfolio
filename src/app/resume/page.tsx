import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/resume";

export const metadata: Metadata = { title: "Resume", description: `Resume of ${profile.name}` };

export default function ResumePage() {
  return (
    <section className="px-4 pb-20 pt-32 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-cyan">
              <span className="text-muted">$</span> cat resume.pdf
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Resume</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={profile.resume}
              download
              className="rounded-xl bg-cyan px-5 py-3 font-semibold text-bg shadow-[0_0_30px_var(--glow)] transition-transform hover:scale-[1.03]"
            >
              Download PDF ↓
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="rounded-xl border border-line-strong px-5 py-3 font-semibold hover:border-cyan hover:text-cyan">
              Open in new tab ↗
            </a>
          </div>
        </div>
        <div className="card overflow-hidden p-2">
          <object data={`${profile.resume}#view=FitH`} type="application/pdf" className="h-[80vh] min-h-[500px] w-full rounded-lg bg-white" aria-label="Resume PDF">
            <div className="p-10 text-center text-muted">
              Your browser can&apos;t show PDFs inline.{" "}
              <a href={profile.resume} className="text-cyan underline">Download it here.</a>
            </div>
          </object>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Prefer the interactive version? <Link href="/" className="text-cyan hover:underline">Back to the site →</Link>
        </p>
      </div>
    </section>
  );
}
