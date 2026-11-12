"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";

type Mood = "idle" | "happy" | "surprised" | "sleep";

const LINES = [
  "Hi! I'm Bit, Arnav's sidekick 👋",
  "Try pressing Ctrl + K. It's like a terminal for this site.",
  "Fun fact: Arnav's Raft store serves 105K+ GETs/sec.",
  "Beep boop. Codeforces Expert detected.",
  "Scroll down, the projects are the good part.",
  "Psst… he has a PPO already. Just saying.",
  "Stop poking me 😤 …okay, one more time.",
];

/**
 * Bit: an SVG robot puppet. Eyes and head follow the cursor (or finger),
 * it blinks, gets happy when you hover, waves and talks when clicked,
 * looks around when idle and falls asleep if left alone.
 */
export default function Robot() {
  const wrap = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>("idle");
  const [blink, setBlink] = useState(false);
  const [waving, setWaving] = useState(false);
  const [line, setLine] = useState<string | null>(null);
  const clicks = useRef(0);
  const lastMove = useRef(Date.now());
  const hovering = useRef(false);
  const lineTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Gaze in [-1, 1], smoothed with springs.
  const gx = useSpring(0, { stiffness: 120, damping: 14, mass: 0.6 });
  const gy = useSpring(0, { stiffness: 120, damping: 14, mass: 0.6 });

  const eyeX = useTransform(gx, (v) => v * 11);
  const eyeY = useTransform(gy, (v) => v * 8);
  const headX = useTransform(gx, (v) => v * 9);
  const headY = useTransform(gy, (v) => v * 5);
  const headR = useTransform(gx, (v) => v * 7);
  const bodyX = useTransform(gx, (v) => v * 3);
  const antennaR = useTransform(gx, (v) => -v * 14);

  const say = useCallback((text: string, ms = 3200) => {
    setLine(text);
    clearTimeout(lineTimer.current);
    lineTimer.current = setTimeout(() => setLine(null), ms);
  }, []);

  // Follow pointer.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      lastMove.current = Date.now();
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.35;
      const nx = (e.clientX - cx) / Math.max(innerWidth * 0.45, 200);
      const ny = (e.clientY - cy) / Math.max(innerHeight * 0.45, 200);
      gx.set(Math.max(-1, Math.min(1, nx)));
      gy.set(Math.max(-1, Math.min(1, ny)));
      setMood((m) => (m === "sleep" ? "surprised" : m));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [gx, gy]);

  // Blink, idle look-around, sleep.
  useEffect(() => {
    let blinkT: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      blinkT = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        scheduleBlink();
      }, 2200 + Math.random() * 3000);
    };
    scheduleBlink();

    const tick = setInterval(() => {
      const idle = Date.now() - lastMove.current;
      if (idle > 15000) {
        setMood("sleep");
        gx.set(0);
        gy.set(0.4);
      } else if (idle > 4000) {
        gx.set(Math.random() * 1.6 - 0.8);
        gy.set(Math.random() * 1 - 0.5);
      }
    }, 1800);

    return () => {
      clearTimeout(blinkT);
      clearInterval(tick);
    };
  }, [gx, gy]);

  // Surprised → back to normal.
  useEffect(() => {
    if (mood !== "surprised") return;
    const t = setTimeout(() => setMood(hovering.current ? "happy" : "idle"), 900);
    return () => clearTimeout(t);
  }, [mood]);

  // Greeting on load.
  useEffect(() => {
    const t = setTimeout(() => say("Hi! I'm Bit 👋 Click me!", 3500), 1400);
    return () => clearTimeout(t);
  }, [say]);

  const poke = () => {
    lastMove.current = Date.now();
    setWaving(true);
    setMood("happy");
    setTimeout(() => setWaving(false), 1300);
    say(LINES[clicks.current % LINES.length]);
    clicks.current++;
  };

  const eyesClosed = blink || mood === "sleep";

  return (
    <div ref={wrap} className="relative mx-auto w-full max-w-[340px] select-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {line && (
          <motion.div
            key={line}
            role="status"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="absolute -top-6 left-1/2 z-10 w-max max-w-[260px] -translate-x-1/2 rounded-xl border border-cyan/40 bg-surface-solid px-3.5 py-2 text-center font-mono text-xs leading-relaxed text-fg shadow-[0_0_30px_var(--glow)]"
          >
            {line}
            <span className="absolute -bottom-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-cyan/40 bg-surface-solid" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow behind */}
      <div aria-hidden className="absolute inset-[15%] rounded-full bg-cyan/20 blur-3xl" />

      <button
        type="button"
        onClick={poke}
        onPointerEnter={() => {
          hovering.current = true;
          setMood((m) => (m === "sleep" ? "surprised" : "happy"));
        }}
        onPointerLeave={() => {
          hovering.current = false;
          setMood((m) => (m === "happy" ? "idle" : m));
        }}
        data-cursor="Poke"
        aria-label="Bit the robot. Click to make it talk."
        className="relative block w-full animate-float rounded-[40%] focus-visible:outline-offset-8"
      >
        <svg viewBox="0 0 300 360" className="w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--surface-solid)" />
              <stop offset="1" stopColor="var(--bg-2)" />
            </linearGradient>
            <linearGradient id="visor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0d1424" />
              <stop offset="1" stopColor="#05070d" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ground shadow */}
          <ellipse cx="150" cy="345" rx="70" ry="8" fill="var(--fg)" opacity="0.08" />

          {/* Body */}
          <motion.g style={{ x: bodyX }}>
            {/* Left arm */}
            <motion.g style={{ originX: 1, originY: 0 }} animate={{ rotate: waving ? 0 : [0, 4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <path d="M92 222 Q62 250 66 292" stroke="var(--line-strong)" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M92 222 Q62 250 66 292" stroke="url(#metal)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <circle cx="66" cy="298" r="11" fill="url(#metal)" stroke="var(--line-strong)" strokeWidth="2" />
            </motion.g>
            {/* Right arm (waves) */}
            <motion.g
              style={{ originX: 0, originY: 0 }}
              animate={{ rotate: waving ? [0, -150, -115, -150, -115, 0] : [0, -4, 0] }}
              transition={waving ? { duration: 1.3, ease: "easeInOut" } : { duration: 3, repeat: Infinity }}
            >
              <path d="M208 222 Q238 250 234 292" stroke="var(--line-strong)" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M208 222 Q238 250 234 292" stroke="url(#metal)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <circle cx="234" cy="298" r="11" fill="url(#metal)" stroke="var(--line-strong)" strokeWidth="2" />
            </motion.g>

            {/* Neck */}
            <rect x="134" y="180" width="32" height="28" rx="6" fill="url(#metal)" stroke="var(--line-strong)" strokeWidth="2" />
            {/* Torso */}
            <rect x="84" y="200" width="132" height="118" rx="34" fill="url(#metal)" stroke="var(--line-strong)" strokeWidth="2" />
            {/* Chest screen with heartbeat */}
            <rect x="108" y="226" width="84" height="50" rx="12" fill="url(#visor)" />
            <polyline
              points="114,252 132,252 138,240 146,264 154,234 160,252 186,252"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              strokeDasharray="120"
              className={mood === "sleep" ? "" : "[animation:dash_1.6s_linear_infinite]"}
            />
            <circle cx="120" cy="296" r="4" fill="#a3e635" opacity={mood === "sleep" ? 0.3 : 1} />
            <circle cx="134" cy="296" r="4" fill="#f472b6" opacity="0.8" />
            <rect x="150" y="292" width="30" height="8" rx="4" fill="var(--line-strong)" />
          </motion.g>

          {/* Head */}
          <motion.g style={{ x: headX, y: headY, rotate: headR, originX: 0.5, originY: 0.9 }}>
            {/* Antenna */}
            <motion.g style={{ rotate: antennaR, originX: 0.5, originY: 1 }}>
              <line x1="150" y1="30" x2="150" y2="62" stroke="var(--line-strong)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="150" cy="26" r="8" fill={mood === "sleep" ? "#475569" : "#22d3ee"} filter="url(#glow)">
                {mood !== "sleep" && <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />}
              </circle>
            </motion.g>
            {/* Ears */}
            <rect x="52" y="100" width="18" height="44" rx="8" fill="url(#metal)" stroke="var(--line-strong)" strokeWidth="2" />
            <rect x="230" y="100" width="18" height="44" rx="8" fill="url(#metal)" stroke="var(--line-strong)" strokeWidth="2" />
            {/* Skull */}
            <rect x="64" y="58" width="172" height="128" rx="44" fill="url(#metal)" stroke="var(--line-strong)" strokeWidth="2" />
            {/* Visor */}
            <rect x="82" y="78" width="136" height="88" rx="30" fill="url(#visor)" />
            <path d="M98 88 Q120 82 150 82" stroke="white" strokeOpacity="0.12" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Face (moves with gaze) */}
            <motion.g style={{ x: eyeX, y: eyeY }} filter="url(#glow)">
              {mood === "happy" ? (
                <>
                  <path d="M110 126 Q122 108 134 126" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M166 126 Q178 108 190 126" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" fill="none" />
                </>
              ) : eyesClosed ? (
                <>
                  <line x1="110" y1="122" x2="134" y2="122" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
                  <line x1="166" y1="122" x2="190" y2="122" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
                </>
              ) : mood === "surprised" ? (
                <>
                  <circle cx="122" cy="120" r="13" fill="none" stroke="#22d3ee" strokeWidth="5" />
                  <circle cx="178" cy="120" r="13" fill="none" stroke="#22d3ee" strokeWidth="5" />
                </>
              ) : (
                <>
                  <rect x="112" y="106" width="20" height="28" rx="10" fill="#22d3ee" />
                  <rect x="168" y="106" width="20" height="28" rx="10" fill="#22d3ee" />
                  <circle cx="126" cy="113" r="3.5" fill="white" opacity="0.9" />
                  <circle cx="182" cy="113" r="3.5" fill="white" opacity="0.9" />
                </>
              )}

              {/* Mouth */}
              {mood === "surprised" ? (
                <ellipse cx="150" cy="150" rx="6" ry="7" fill="none" stroke="#22d3ee" strokeWidth="3.5" />
              ) : mood === "sleep" ? (
                <path d="M142 150 h16" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
              ) : (
                <path
                  d={mood === "happy" ? "M136 145 Q150 160 164 145" : "M140 148 Q150 154 160 148"}
                  stroke="#22d3ee"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </motion.g>

            {/* Cheeks */}
            <ellipse cx="100" cy="146" rx="9" ry="5" fill="#f472b6" opacity={mood === "happy" ? 0.55 : 0} style={{ transition: "opacity .3s" }} />
            <ellipse cx="200" cy="146" rx="9" ry="5" fill="#f472b6" opacity={mood === "happy" ? 0.55 : 0} style={{ transition: "opacity .3s" }} />
          </motion.g>

          {/* Zzz */}
          {mood === "sleep" && (
            <g fontFamily="var(--font-mono)" fill="var(--violet)" fontWeight="700">
              <text x="232" y="64" fontSize="18" className="[animation:zz_2.4s_ease-in-out_infinite]">z</text>
              <text x="248" y="44" fontSize="24" className="[animation:zz_2.4s_ease-in-out_.6s_infinite]">z</text>
              <text x="268" y="20" fontSize="30" className="[animation:zz_2.4s_ease-in-out_1.2s_infinite]">Z</text>
            </g>
          )}
        </svg>
      </button>

      <style>{`
        @keyframes dash { from { stroke-dashoffset: 240 } to { stroke-dashoffset: 0 } }
        @keyframes zz { 0%,100% { opacity: 0; transform: translateY(6px) } 50% { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
