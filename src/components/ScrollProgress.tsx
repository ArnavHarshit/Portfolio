"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => scrollYProgress.on("change", (v) => setShowTop(v > 0.15)), [scrollYProgress]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-cyan via-violet to-pink"
      />
      <button
        aria-label="Back to top"
        onClick={() => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
        className={`fixed bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-surface-solid font-mono text-cyan shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan ${
          showTop ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        ↑
      </button>
    </>
  );
}
