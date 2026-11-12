import Link from "next/link";
import Robot from "@/components/Robot";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center px-4 pt-24 sm:px-6">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-pink">Error 404</p>
          <h1 className="mt-3 text-[clamp(3rem,10vw,6rem)] font-bold leading-none tracking-tight">
            Lost in <span className="text-gradient">the void.</span>
          </h1>
          <p className="mt-5 font-mono text-sm text-muted">
            <span className="text-lime">❯</span> cd {"<this page>"}
            <br />
            <span className="text-pink">bash: no such file or directory</span>
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-cyan px-5 py-3 font-semibold text-bg shadow-[0_0_30px_var(--glow)] transition-transform hover:scale-[1.03]"
          >
            ← Take me home
          </Link>
        </div>
        <div className="max-w-xs justify-self-center">
          <Robot />
        </div>
      </div>
    </section>
  );
}
