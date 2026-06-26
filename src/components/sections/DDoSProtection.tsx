import { useState } from "react";
import { motion } from "framer-motion";

const SX = 382;
const SY = 192;
const VX = 688;
const VY = 192;
const AX = 72;
const AYS = [80, 192, 304];

const ATTACK_PARTICLES = AYS.flatMap((ay, pi) =>
  Array.from({ length: 5 }, (_, i) => ({
    id: `a-${pi}-${i}`,
    path: `M ${AX + 30} ${ay} L ${SX - 56} ${SY}`,
    delay: i * 0.44 + pi * 0.19,
    dur: 2.0,
  }))
);

const CLEAN_PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: `c-${i}`,
  path: `M ${SX + 56} ${SY} L ${VX - 34} ${VY}`,
  delay: i * 0.36,
  dur: 1.45,
}));

const SPARKS = [0, 55, 110, 165, 220, 275].map((deg, i) => {
  const rad = (deg * Math.PI) / 180;
  return { id: `sp-${i}`, dx: Math.cos(rad) * 48, dy: Math.sin(rad) * 48, delay: i * 0.5 };
});

function Laptop({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  return (
    <g>
      <rect x={cx - 26} y={cy - 34} width={52} height={38} rx="3"
        fill="rgba(15,15,30,0.95)" stroke="#ef444455" strokeWidth="1.5" />
      <rect x={cx - 20} y={cy - 28} width={40} height={24} rx="2"
        fill="rgba(239,68,68,0.08)" />
      <circle cx={cx} cy={cy - 16} r="8" fill="rgba(239,68,68,0.18)" />
      <circle cx={cx} cy={cy - 16} r="4.5" fill="#ef4444" opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.4;0.85" dur="1.6s" repeatCount="indefinite"
          begin={`${label.slice(-1) === "1" ? "0" : label.slice(-1) === "2" ? "0.5" : "1"}s`} />
      </circle>
      <rect x={cx - 30} y={cy + 5} width={60} height={9} rx="2"
        fill="rgba(15,15,30,0.95)" stroke="#ef444433" strokeWidth="1" />
      <rect x={cx - 10} y={cy + 7} width={20} height={5} rx="1" fill="#ef444422" />
      <text x={cx} y={cy + 26} textAnchor="middle" fill="#ef4444cc" fontSize="9.5" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function Shield({ hovered }: { hovered: boolean }) {
  return (
    <g transform={`translate(${SX}, ${SY})`}>
      <defs>
        <radialGradient id="shieldBg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="55%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
        <filter id="sGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={hovered ? "10" : "6"} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sPulse" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="18" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Pulse rings */}
      <circle cx="0" cy="0" r="78" fill="none" stroke="#3b82f622" strokeWidth="1">
        <animate attributeName="r" values="68;90;68" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="0" r="60" fill="none" stroke="#8b5cf622" strokeWidth="1">
        <animate attributeName="r" values="54;74;54" dur="3s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" begin="1s" />
      </circle>

      {/* Shield glow halo */}
      <path d="M 0,-60 L 52,-34 L 52,20 Q 52,72 0,86 Q -52,72 -52,20 L -52,-34 Z"
        fill="#3b82f6" opacity="0.15" filter="url(#sPulse)">
        <animate attributeName="opacity" values="0.12;0.28;0.12" dur="2.8s" repeatCount="indefinite" />
      </path>

      {/* Shield body */}
      <path d="M 0,-58 L 50,-32 L 50,18 Q 50,70 0,84 Q -50,70 -50,18 L -50,-32 Z"
        fill="url(#shieldBg)"
        stroke={hovered ? "#60a5fa" : "#3b82f6"}
        strokeWidth={hovered ? "2.5" : "1.8"}
        filter="url(#sGlow)"
        transform={hovered ? "scale(1.06)" : "scale(1)"}
        style={{ transition: "all 0.3s ease" }}>
        <animate attributeName="stroke-opacity" values="0.7;1;0.7" dur="2.8s" repeatCount="indefinite" />
      </path>

      {/* Inner shield bevel */}
      <path d="M 0,-44 L 37,-24 L 37,14 Q 37,53 0,64 Q -37,53 -37,14 L -37,-24 Z"
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      {/* BS monogram */}
      <text x="0" y="-10" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold"
        fontFamily="'Courier New', monospace" letterSpacing="2">BS</text>

      {/* BruteScale name */}
      <text x="0" y="10" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="7.5"
        fontFamily="sans-serif" fontWeight="600" letterSpacing="0.8">BruteScale</text>

      {/* Sub label */}
      <text x="0" y="23" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="5.5"
        fontFamily="sans-serif">Enterprise DDoS</text>
      <text x="0" y="33" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="5.5"
        fontFamily="sans-serif">Protection</text>
    </g>
  );
}

function ServerRack({ hovered }: { hovered: boolean }) {
  return (
    <g transform={`translate(${VX}, ${VY})`}>
      {/* Server glow */}
      <rect x="-38" y="-52" width="76" height="104" rx="5"
        fill="#22c55e" opacity={hovered ? "0.12" : "0.05"}
        style={{ transition: "opacity 0.3s ease", filter: "blur(12px)" }}>
        <animate attributeName="opacity" values={hovered ? "0.12;0.22;0.12" : "0.04;0.1;0.04"} dur="3.5s" repeatCount="indefinite" />
      </rect>

      {/* 3 rack units */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0, ${i * 32 - 32})`}>
          <rect x="-34" y="-11" width="68" height="22" rx="3.5"
            fill="rgba(10,28,18,0.95)"
            stroke={hovered ? "#22c55e66" : "#22c55e33"}
            strokeWidth="1.5"
            style={{ transition: "stroke 0.3s ease" }} />
          {/* Vents */}
          {[0, 1, 2, 3].map((v) => (
            <line key={v}
              x1={-26 + v * 7} y1="-5" x2={-26 + v * 7} y2="5"
              stroke="#22c55e22" strokeWidth="1" />
          ))}
          {/* LED */}
          <circle cx="24" cy="0" r="3.5" fill="#22c55e" opacity="0.9">
            <animate attributeName="opacity"
              values="0.9;0.5;0.9" dur={`${1.8 + i * 0.4}s`}
              repeatCount="indefinite" />
          </circle>
          <circle cx="17" cy="0" r="2" fill="#22c55e" opacity="0.5" />
        </g>
      ))}

      {/* "Protected" hover badge */}
      {hovered && (
        <g>
          <rect x="-28" y="52" width="56" height="16" rx="8"
            fill="#22c55e" opacity="0.9" />
          <text x="0" y="63" textAnchor="middle" fill="black" fontSize="7.5"
            fontFamily="sans-serif" fontWeight="700">✓ Protected</text>
        </g>
      )}

      {/* Stand */}
      <rect x="-12" y="44" width="24" height="6" rx="2"
        fill="rgba(10,28,18,0.95)" stroke="#22c55e33" strokeWidth="1" />

      <text x="0" y="60" textAnchor="middle" fill="#22c55ecc" fontSize="9.5"
        fontFamily="monospace">User Server</text>
    </g>
  );
}

export function DDoSProtection() {
  const [shieldH, setShieldH] = useState(false);
  const [serverH, setServerH] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden" data-testid="section-ddos">
      <style>{`
        @keyframes bs-shield-float {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-7px)}
        }
      `}</style>

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">Live Traffic Visualization</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How Traffic Gets Cleaned Before It Reaches Your Server
          </h2>
          <p className="text-lg text-muted-foreground">
            480Gbps+ of inline DDoS mitigation — every packet inspected and filtered in real time.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">

          {/* Animation Panel 70% */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:w-[70%] rounded-2xl bg-card/30 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.08)] overflow-hidden"
          >
            <svg
              viewBox="0 0 760 384"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
            >
              <defs>
                <pattern id="ddos-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
                </pattern>
                <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e40af" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Background */}
              <rect width="760" height="384" fill="url(#ddos-grid)" />
              <ellipse cx="380" cy="192" rx="220" ry="180" fill="url(#bgGlow)" />

              {/* Section labels */}
              <text x={AX} y="24" textAnchor="middle" fill="#ef4444bb" fontSize="10" fontFamily="monospace" letterSpacing="1">ATTACKERS</text>
              <text x={SX} y="24" textAnchor="middle" fill="#3b82f6bb" fontSize="10" fontFamily="monospace" letterSpacing="1">MITIGATION</text>
              <text x={VX} y="24" textAnchor="middle" fill="#22c55ebb" fontSize="10" fontFamily="monospace" letterSpacing="1">PROTECTED</text>

              {/* Dashed attack lanes */}
              {AYS.map((ay, i) => (
                <line key={i}
                  x1={AX + 30} y1={ay} x2={SX - 58} y2={SY}
                  stroke="#ef444428" strokeWidth="1" strokeDasharray="5,5" />
              ))}

              {/* Clean traffic lane */}
              <line x1={SX + 58} y1={SY} x2={VX - 36} y2={VY}
                stroke="#22c55e28" strokeWidth="1.5" strokeDasharray="5,4" />

              {/* Attack flow label */}
              <text x="218" y="173" textAnchor="middle" fill="#ef4444aa" fontSize="8.5" fontFamily="monospace">Attack Traffic</text>

              {/* Clean flow label */}
              <text x="545" y="173" textAnchor="middle" fill="#22c55eaa" fontSize="8.5" fontFamily="monospace">Clean Traffic</text>

              {/* Laptops */}
              {AYS.map((ay, i) => (
                <Laptop key={i} cx={AX} cy={ay} label={`Attacker ${i + 1}`} />
              ))}

              {/* Shield (floating via CSS on wrapping group) */}
              <g style={{ cursor: "pointer", animation: "bs-shield-float 3.2s ease-in-out infinite" }}
                onMouseEnter={() => setShieldH(true)}
                onMouseLeave={() => setShieldH(false)}>
                <Shield hovered={shieldH} />
              </g>

              {/* Server */}
              <g onMouseEnter={() => setServerH(true)} onMouseLeave={() => setServerH(false)}
                style={{ cursor: "pointer" }}>
                <ServerRack hovered={serverH} />
              </g>

              {/* ─── Red attack particles ─── */}
              {ATTACK_PARTICLES.map((p) => (
                <circle key={p.id} r="0" fill="#ef4444">
                  <animateMotion
                    dur={`${p.dur}s`}
                    begin={`${p.delay}s`}
                    repeatCount="indefinite"
                    path={p.path}
                    calcMode="linear"
                  />
                  <animate attributeName="r" values="0;4.5;4.5;3;0"
                    keyTimes="0;0.08;0.65;0.85;1"
                    dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;1;0.6;0"
                    keyTimes="0;0.1;0.6;0.85;1"
                    dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {/* ─── Spark explosions at shield ─── */}
              {SPARKS.map((sp) => (
                <circle key={sp.id} r="0" fill="#f87171">
                  <animateMotion
                    dur="0.9s"
                    begin={`${sp.delay}s`}
                    repeatCount="indefinite"
                    path={`M ${SX} ${SY} L ${SX + sp.dx} ${SY + sp.dy}`}
                    calcMode="linear"
                  />
                  <animate attributeName="r" values="0;3;1.5;0"
                    keyTimes="0;0.15;0.6;1"
                    dur="0.9s" begin={`${sp.delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.9;0.4;0"
                    keyTimes="0;0.1;0.6;1"
                    dur="0.9s" begin={`${sp.delay}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {/* ─── Green clean particles ─── */}
              {CLEAN_PARTICLES.map((p) => (
                <circle key={p.id} r="0" fill="#22c55e">
                  <animateMotion
                    dur={`${p.dur}s`}
                    begin={`${p.delay}s`}
                    repeatCount="indefinite"
                    path={p.path}
                    calcMode="linear"
                  />
                  <animate attributeName="r" values="0;4;4;3;0"
                    keyTimes="0;0.08;0.75;0.9;1"
                    dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.95;0.95;0.5;0"
                    keyTimes="0;0.1;0.75;0.9;1"
                    dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
          </motion.div>

          {/* Info Panel 30% */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:w-[30%] rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.08)] p-8 flex flex-col"
          >
            {/* Title */}
            <div className="flex items-start gap-3 mb-8">
              <div className="mt-0.5 w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(59,130,246,0.2)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"
                    fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                How BruteScale Protects Your Server
              </h3>
            </div>

            {/* Bullet points */}
            <ul className="space-y-5 flex-1">
              {[
                { color: "text-blue-400", dot: "bg-blue-400", text: "Traffic is inspected before reaching your server." },
                { color: "text-violet-400", dot: "bg-violet-400", text: "Malicious attacks are detected instantly." },
                { color: "text-red-400", dot: "bg-red-400", text: "Harmful packets are filtered in real time." },
                { color: "text-green-400", dot: "bg-green-400", text: "Clean traffic reaches your server with minimal latency." },
                { color: "text-cyan-400", dot: "bg-cyan-400", text: "Enterprise-grade mitigation with 480Gbps+ protection." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-1.5 w-2 h-2 rounded-full ${item.dot} flex-shrink-0 shadow-lg`} />
                  <span className="text-sm text-white/75 leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { val: "480Gbps+", label: "Mitigation" },
                { val: "<1ms", label: "Filter Time" },
                { val: "99.99%", label: "Uptime" },
                { val: "24/7", label: "Monitoring" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                  <div className="text-base font-bold text-white">{s.val}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Status footer */}
            <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-60" />
              </div>
              <span className="text-xs text-green-400 font-mono tracking-wide">PROTECTION ACTIVE</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
