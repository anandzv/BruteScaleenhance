import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Mercator projection (normalized 0→1):  x=(lon+180)/360  y=(90-lat)/180
const LOCATIONS = [
  {
    id: "india",
    label: "India",
    flag: "🇮🇳",
    city: "Mumbai",
    x: 0.717,   // 78°E
    y: 0.389,   // 20°N
    color: "#22c55e",
    ping: "<12ms",
    uptime: "99.99%",
    specs: ["AMD EPYC CPUs", "DDR5 Memory", "NVMe Gen4 SSD", "10Gbps Uplink"],
  },
  {
    id: "dubai",
    label: "Dubai",
    flag: "🇦🇪",
    city: "Dubai, UAE",
    x: 0.653,   // 55°E
    y: 0.361,   // 25°N
    color: "#22c55e",
    ping: "<18ms",
    uptime: "99.99%",
    specs: ["Enterprise Network", "DDoS Protected", "10Gbps Uplink", "Tier 3+ Facility"],
  },
  {
    id: "singapore",
    label: "Singapore",
    flag: "🇸🇬",
    city: "Singapore",
    x: 0.786,   // 103°E
    y: 0.494,   // 1°N
    color: "#22c55e",
    ping: "<8ms",
    uptime: "99.99%",
    specs: ["Premium Peering", "Low Latency Asia", "Automatic Backups", "BGP Anycast"],
  },
];

const CONNECTIONS = [
  [0, 1], // India ↔ Dubai
  [1, 2], // Dubai ↔ Singapore
  [0, 2], // India ↔ Singapore
];

const LIVE_STATS = [
  { icon: "🟢", value: "99.99%", label: "Global Uptime" },
  { icon: "⚡", value: "<15ms", label: "Avg Latency" },
  { icon: "🌍", value: "3", label: "Active Datacenters" },
  { icon: "🛡", value: "480Gbps", label: "DDoS Protection" },
  { icon: "🚀", value: "10Gbps", label: "Network Speed" },
  { icon: "💚", value: "100%", label: "Systems Operational" },
];

// ─── Animated counter ────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, triggered: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);
  return val;
}

// ─── World map canvas ─────────────────────────────────────────────────────────
function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const packetsRef = useRef<{ t: number; connIdx: number; speed: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Initialize data packets
    packetsRef.current = CONNECTIONS.flatMap((_, ci) =>
      Array.from({ length: 3 }, (__, i) => ({
        t: (i / 3) + Math.random() * 0.3,
        connIdx: ci,
        speed: 0.0012 + Math.random() * 0.0008,
      }))
    );

    const getPixel = (nx: number, ny: number) => ({
      px: nx * canvas.width,
      py: ny * canvas.height,
    });

    let time = 0;

    const draw = () => {
      if (document.hidden) { animId = requestAnimationFrame(draw); return; }
      time += 0.012;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // ── Dot grid (world map feel) ──
      ctx.save();
      const gridSpacing = 18;
      for (let gx = 0; gx < W; gx += gridSpacing) {
        for (let gy = 0; gy < H; gy += gridSpacing) {
          const pulse = 0.7 + 0.3 * Math.sin(time * 0.5 + (gx + gy) * 0.02);
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(50,80,160,${0.18 * pulse})`;
          ctx.fill();
        }
      }
      ctx.restore();

      // ── Continent silhouettes (simplified, glowing outlines) ──
      // Drawn as rough filled shapes on a normalized W×H canvas
      drawContinents(ctx, W, H, time);

      // ── Connection lines ──
      CONNECTIONS.forEach(([a, b]) => {
        const pa = getPixel(LOCATIONS[a].x, LOCATIONS[a].y);
        const pb = getPixel(LOCATIONS[b].x, LOCATIONS[b].y);

        // Glow line
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(34,197,94,0.6)";
        ctx.strokeStyle = "rgba(34,197,94,0.25)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 8]);
        ctx.lineDashOffset = -time * 15;
        ctx.beginPath();
        ctx.moveTo(pa.px, pa.py);
        ctx.lineTo(pb.px, pb.py);
        ctx.stroke();
        ctx.restore();

        // Bright solid line (thinner, crisp)
        ctx.save();
        ctx.strokeStyle = "rgba(34,197,94,0.5)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(pa.px, pa.py);
        ctx.lineTo(pb.px, pb.py);
        ctx.stroke();
        ctx.restore();
      });

      // ── Data packets ──
      packetsRef.current.forEach(pkt => {
        pkt.t += pkt.speed;
        if (pkt.t > 1) pkt.t -= 1;

        const [a, b] = CONNECTIONS[pkt.connIdx];
        const pa = getPixel(LOCATIONS[a].x, LOCATIONS[a].y);
        const pb = getPixel(LOCATIONS[b].x, LOCATIONS[b].y);
        const t = pkt.t;
        const px = pa.px + (pb.px - pa.px) * t;
        const py = pa.py + (pb.py - pa.py) * t;

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(34,197,94,1)";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        // Tail
        for (let i = 1; i <= 4; i++) {
          const tt = Math.max(0, t - i * 0.015);
          const tx = pa.px + (pb.px - pa.px) * tt;
          const ty = pa.py + (pb.py - pa.py) * tt;
          ctx.beginPath();
          ctx.arc(tx, ty, 2 - i * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34,197,94,${0.5 - i * 0.1})`;
          ctx.fill();
        }
        ctx.restore();
      });

      // ── Location markers ──
      LOCATIONS.forEach((loc) => {
        const { px, py } = getPixel(loc.x, loc.y);
        const pulse = 0.5 + 0.5 * Math.sin(time * 2);
        const outerR = 14 + pulse * 6;

        // Outer pulse ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, outerR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34,197,94,${0.3 - pulse * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Mid ring
        ctx.save();
        ctx.shadowBlur = 16;
        ctx.shadowColor = "rgba(34,197,94,0.9)";
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(34,197,94,0.7)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Core dot
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#22c55e";
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#22c55e";
        ctx.fill();
        ctx.restore();

        // Label
        ctx.save();
        ctx.font = "bold 11px 'Space Grotesk', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        const labelX = px + 14;
        const labelY = py - 10;
        ctx.fillText(loc.label, labelX, labelY);
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    const resize = () => {
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: 340 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

// Very simplified continent outlines for atmosphere
function drawContinents(ctx: CanvasRenderingContext2D, W: number, H: number, time: number) {
  ctx.save();
  ctx.globalAlpha = 0.06;

  const regions = [
    // Europe
    { pts: [[0.46,0.26],[0.50,0.22],[0.55,0.20],[0.57,0.24],[0.55,0.30],[0.49,0.32],[0.46,0.29]] },
    // Africa
    { pts: [[0.46,0.33],[0.52,0.31],[0.57,0.34],[0.57,0.55],[0.52,0.65],[0.47,0.60],[0.44,0.50],[0.44,0.38]] },
    // Asia (simplified - includes Middle East and India area)
    { pts: [[0.55,0.20],[0.70,0.18],[0.82,0.22],[0.86,0.30],[0.82,0.40],[0.74,0.50],[0.70,0.52],[0.65,0.42],[0.60,0.38],[0.57,0.34],[0.57,0.24]] },
    // SE Asia blobs
    { pts: [[0.76,0.42],[0.80,0.40],[0.84,0.44],[0.82,0.52],[0.77,0.54],[0.74,0.50]] },
    // North America
    { pts: [[0.12,0.18],[0.26,0.16],[0.30,0.22],[0.28,0.36],[0.22,0.42],[0.16,0.40],[0.10,0.30],[0.10,0.22]] },
    // South America
    { pts: [[0.24,0.44],[0.30,0.42],[0.33,0.50],[0.31,0.64],[0.26,0.72],[0.22,0.68],[0.20,0.56],[0.21,0.48]] },
    // Australia
    { pts: [[0.78,0.56],[0.88,0.54],[0.92,0.62],[0.88,0.70],[0.79,0.68],[0.76,0.62]] },
  ];

  regions.forEach(({ pts }) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0] * W, pts[0][1] * H);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * W, pts[i][1] * H);
    ctx.closePath();
    ctx.fillStyle = "rgba(60,120,220,1)";
    ctx.fill();
    ctx.strokeStyle = `rgba(80,140,255,0.4)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  ctx.restore();
}

// ─── Location Card ────────────────────────────────────────────────────────────
function LocationCard({ loc, delay }: { loc: typeof LOCATIONS[number]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative rounded-2xl overflow-hidden flex-1 min-w-[260px]"
      style={{
        background: "linear-gradient(135deg, rgba(10,18,40,0.85) 0%, rgba(6,10,24,0.9) 100%)",
        border: "1px solid rgba(34,197,94,0.2)",
        boxShadow: "0 0 30px rgba(34,197,94,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
      data-testid={`card-datacenter-${loc.id}`}
    >
      {/* Top accent bar */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)" }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{loc.flag}</span>
          <div>
            <div className="text-white font-bold text-lg leading-tight">{loc.label}</div>
            <div className="text-white/40 text-xs">{loc.city}</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ boxShadow: "0 0 8px #22c55e" }}
            />
            <span className="text-emerald-400 text-xs font-semibold">Online</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg p-3" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)" }}>
            <div className="text-emerald-400 font-bold text-base">{loc.uptime}</div>
            <div className="text-white/40 text-xs">Uptime</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
            <div className="text-blue-400 font-bold text-base">{loc.ping}</div>
            <div className="text-white/40 text-xs">Avg Latency</div>
          </div>
        </div>

        {/* Specs */}
        <div className="space-y-1.5">
          {loc.specs.map((spec) => (
            <div key={spec} className="flex items-center gap-2 text-sm">
              <div className="w-1 h-1 rounded-full bg-emerald-400/70 shrink-0" />
              <span className="text-white/60">{spec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px" style={{ background: "rgba(34,197,94,0.4)" }} />
    </motion.div>
  );
}

// ─── Stat Item ────────────────────────────────────────────────────────────────
function StatItem({ icon, value, label, delay, triggered }: { icon: string; value: string; label: string; delay: number; triggered: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={triggered ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center gap-1 text-center"
      data-testid={`stat-infra-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span className="text-xl">{icon}</span>
      <div className="text-white font-bold text-lg leading-tight">{value}</div>
      <div className="text-white/40 text-xs">{label}</div>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export function GlobalInfrastructure() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <section
      id="network"
      className="relative py-24 overflow-hidden"
      style={{ background: "transparent" }}
      data-testid="section-global-infrastructure"
    >
      {/* Subtle section background tint */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(3,4,15,0.4) 0%, rgba(0,20,10,0.08) 50%, rgba(3,4,15,0.4) 100%)" }} />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ boxShadow: "0 0 6px #22c55e" }}
            />
            All Systems Operational
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Global{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6)" }}
            >
              Infrastructure
            </span>
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Powered by Premium Datacenters Worldwide
          </p>
          <p className="text-sm text-white/35 max-w-lg mx-auto mt-2">
            Ultra-low latency, enterprise networking, and 99.99% uptime across our global edge locations.
          </p>
        </motion.div>

        {/* ── World Map ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative rounded-2xl mb-10 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(6,10,24,0.9) 0%, rgba(3,8,20,0.95) 100%)",
            border: "1px solid rgba(59,130,246,0.12)",
            boxShadow: "0 0 60px rgba(34,197,94,0.04), inset 0 1px 0 rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(34,197,94,0.3), transparent)" }} />
          <WorldMap />
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)" }} />

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 py-3 px-6">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-4 h-px" style={{ background: "rgba(34,197,94,0.6)" }} />
              <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #22c55e" }} />
              Network Link
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-2 h-2 rounded-full bg-emerald-300" style={{ boxShadow: "0 0 8px #22c55e" }} />
              Data Packet
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-3 h-3 rounded-full border border-emerald-400/60" />
              Edge Location
            </div>
          </div>
        </motion.div>

        {/* ── Datacenter Cards ── */}
        <div className="flex flex-col md:flex-row gap-5 mb-12">
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.id} loc={loc} delay={i * 0.12} />
          ))}
        </div>

        {/* ── Live Stats ── */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl py-8 px-6"
          style={{
            background: "linear-gradient(135deg, rgba(10,18,40,0.7) 0%, rgba(6,10,24,0.8) 100%)",
            border: "1px solid rgba(59,130,246,0.1)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            {LIVE_STATS.map((s, i) => (
              <StatItem
                key={s.label}
                icon={s.icon}
                value={s.value}
                label={s.label}
                delay={i * 0.08}
                triggered={statsInView}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
