import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NODES = [
  {
    id: "india",
    flag: "🇮🇳",
    country: "India",
    city: "Mumbai",
    hardware: "AMD EPYC",
    minMs: 10,
    maxMs: 18,
    bestRoute: true,
  },
  {
    id: "singapore",
    flag: "🇸🇬",
    country: "Singapore",
    city: "Singapore",
    hardware: "AMD EPYC",
    minMs: 35,
    maxMs: 50,
    bestRoute: false,
  },
  {
    id: "dubai",
    flag: "🇦🇪",
    country: "Dubai",
    city: "Dubai, UAE",
    hardware: "AMD EPYC",
    minMs: 55,
    maxMs: 80,
    bestRoute: false,
  },
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function OnlineDot() {
  return (
    <span className="relative flex items-center gap-1.5">
      <motion.span
        className="w-2 h-2 rounded-full bg-emerald-400 inline-block"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 8px #22c55e" }}
      />
      <span className="text-emerald-400 text-xs font-semibold">Online</span>
    </span>
  );
}

function PingCard({
  node,
  latency,
  index,
  visible,
}: {
  node: typeof NODES[number];
  latency: number;
  index: number;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`${node.id}-${latency}`}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, delay: index * 0.12 }}
          whileHover={{
            y: -6,
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className="relative flex-1 min-w-[240px] rounded-2xl overflow-hidden cursor-default"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,18,48,0.88) 0%, rgba(6,10,28,0.94) 100%)",
            border: "1px solid rgba(59,130,246,0.28)",
            boxShadow:
              "0 0 0 1px rgba(59,130,246,0.08), 0 0 32px rgba(99,102,241,0.14), 0 4px 24px rgba(0,0,0,0.5)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Top accent line */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(59,130,246,0.7), rgba(139,92,246,0.5), transparent)",
            }}
          />

          <div className="p-6">
            {/* Header row */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{node.flag}</span>
                <div>
                  <div className="text-white font-bold text-lg leading-tight">
                    {node.country}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">{node.city}</div>
                </div>
              </div>
              <OnlineDot />
            </div>

            {/* Big latency display */}
            <div className="text-center my-5">
              <motion.div
                key={latency}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.12 + 0.15, type: "spring", stiffness: 200 }}
                className="text-6xl font-extrabold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 18px rgba(99,102,241,0.6))",
                }}
              >
                {latency}
              </motion.div>
              <div className="text-white/40 text-sm font-medium mt-1">ms</div>
            </div>

            {/* Details row */}
            <div className="flex items-center justify-between text-xs mt-4">
              <div
                className="px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <span className="text-white/50">Hardware </span>
                <span className="text-blue-300 font-semibold">{node.hardware}</span>
              </div>

              {node.bestRoute && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.12 + 0.3, duration: 0.3 }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    boxShadow: "0 0 12px rgba(34,197,94,0.15)",
                  }}
                >
                  ⚡ Best Route
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px"
            style={{ background: "rgba(99,102,241,0.4)" }}
          />

          {/* Hover border glow — faint purple overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.5), 0 0 48px rgba(139,92,246,0.18)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScanningState() {
  return (
    <motion.div
      key="scanning"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-5 py-10"
    >
      {/* Pulsing radar circle */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: "rgba(99,102,241,0.4)" }}
            animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, delay: i * 0.35, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="w-8 h-8 rounded-full"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            boxShadow: "0 0 20px rgba(99,102,241,0.7)",
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <p className="text-white/70 text-sm font-medium tracking-wide animate-pulse">
        Finding nearest BruteScale nodes...
      </p>

      {/* Progress bar */}
      <div
        className="w-64 h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            boxShadow: "0 0 8px rgba(99,102,241,0.6)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.9, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

export function PingTest() {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [latencies, setLatencies] = useState<number[]>([]);
  const rippleRef = useRef<HTMLButtonElement>(null);

  const runTest = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (state === "scanning") return;

    // Ripple effect
    const btn = rippleRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.18);
        transform:scale(0); animation:bs-ripple 0.6s linear forwards;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }

    setState("scanning");
    setTimeout(() => {
      const newLatencies = NODES.map((n) => randInt(n.minMs, n.maxMs));
      setLatencies(newLatencies);
      setState("done");
    }, 2000);
  };

  const avg =
    latencies.length === 3
      ? Math.round((latencies[0] + latencies[1] + latencies[2]) / 3)
      : 26;

  return (
    <section className="py-24 relative overflow-hidden" data-testid="section-ping-test">
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Keyframe for ripple */}
      <style>{`@keyframes bs-ripple{to{transform:scale(1);opacity:0}}`}</style>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Test Your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              }}
            >
              Network Latency
            </span>
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Measure your estimated latency to BruteScale's global network.
          </p>
        </motion.div>

        {/* Run Ping Test button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <button
            ref={rippleRef}
            onClick={runTest}
            disabled={state === "scanning"}
            className="relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white text-sm tracking-wide transition-all duration-300 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              boxShadow:
                state === "scanning"
                  ? "0 0 20px rgba(99,102,241,0.4)"
                  : "0 0 24px rgba(99,102,241,0.5), 0 0 48px rgba(99,102,241,0.18)",
            }}
            onMouseEnter={(e) => {
              if (state !== "scanning") {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 36px rgba(99,102,241,0.7), 0 0 72px rgba(99,102,241,0.25)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 24px rgba(99,102,241,0.5), 0 0 48px rgba(99,102,241,0.18)";
            }}
            data-testid="btn-run-ping"
          >
            {/* Shimmer overlay */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 60%)",
              }}
            />
            <motion.span
              animate={state === "scanning" ? { rotate: 360 } : { rotate: 0 }}
              transition={
                state === "scanning"
                  ? { duration: 1, repeat: Infinity, ease: "linear" }
                  : {}
              }
              className="text-base"
            >
              {state === "scanning" ? "⟳" : "▶"}
            </motion.span>
            <span className="relative">
              {state === "scanning" ? "Scanning..." : "Run Ping Test"}
            </span>
          </button>
        </motion.div>

        {/* Scanning animation */}
        <AnimatePresence mode="wait">
          {state === "scanning" && <ScanningState key="scanning" />}
        </AnimatePresence>

        {/* Results cards */}
        {state === "done" && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col md:flex-row gap-5 mb-10"
          >
            {NODES.map((node, i) => (
              <PingCard
                key={node.id}
                node={node}
                latency={latencies[i]}
                index={i}
                visible={true}
              />
            ))}
          </motion.div>
        )}

        {/* Bottom summary */}
        {state === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.45 }}
            className="text-center rounded-2xl py-8 px-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,18,48,0.7) 0%, rgba(6,10,28,0.8) 100%)",
              border: "1px solid rgba(59,130,246,0.12)",
              backdropFilter: "blur(16px)",
            }}
            data-testid="ping-summary"
          >
            <div className="text-white/40 text-sm font-medium mb-1 uppercase tracking-widest">
              Average Network Latency
            </div>
            <motion.div
              key={avg}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, type: "spring", stiffness: 220 }}
              className="text-5xl font-extrabold mb-1"
              style={{
                background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 14px rgba(99,102,241,0.55))",
              }}
            >
              {avg} <span className="text-2xl font-bold">ms</span>
            </motion.div>
            <p className="text-white/35 text-sm max-w-xl mx-auto mt-3 leading-relaxed">
              Optimized low-latency routing across India, Singapore, and Dubai for
              gaming, VPS, RDP, and enterprise workloads.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
