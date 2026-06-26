import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Cpu, Server, Shield, Zap, HardDrive, Globe, CheckCircle2,
  ArrowLeft, Database, Key, TerminalSquare, RefreshCw, Network,
  MonitorCog, Code2, Layers,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import * as Accordion from "@radix-ui/react-accordion";

// ─── Plan data ─────────────────────────────────────────────────────────────────
const VPS_PLANS = [
  "VPS Nano", "VPS Basic", "VPS Lite", "VPS Pro",
  "VPS Elite", "VPS Extreme", "VPS God Tier",
];
const VPS_RAM   = [4, 8, 16, 24, 32, 48, 64];
const VPS_STORAGE = [80, 160, 320, 480, 640, 960, 1280]; // GB NVMe
const POPULAR_IDX = 3; // VPS Pro (24GB)

type CpuKey = "xeon" | "epyc" | "ryzen";

const PRICES: Record<CpuKey, number[]> = {
  xeon:  [214, 399, 699, 949, 1199, 1399, 1499],
  epyc:  [249, 499, 849, 1149, 1399, 1649, 1799],
  ryzen: [349, 649, 1149, 1599, 1999, 2399, 2599],
};

const CPU_TABS: { key: CpuKey; label: string; emoji: string; badge?: string }[] = [
  { key: "xeon",  label: "Intel Xeon",  emoji: "🔵" },
  { key: "epyc",  label: "AMD EPYC",    emoji: "🟣", badge: "Enterprise Performance" },
  { key: "ryzen", label: "AMD Ryzen",   emoji: "🟢", badge: "Maximum Single-Core Performance" },
];

const CARD_FEATURES = [
  "Full Root Access",
  "Linux & Windows Support",
  "NVMe Gen4 SSD",
  "KVM Virtualization",
  "Dedicated Resources",
  "Instant Deployment",
  "1 Dedicated IPv4",
  "Enterprise DDoS Protection",
  "Automatic Backups",
  "99.99% Uptime SLA",
  "24/7 Expert Support",
  "API Access",
];

// ─── Hero Canvas (datacenter aesthetic) ────────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; opacity: number; pulse: number };
    type Rack = { x: number; y: number; w: number; h: number; alpha: number };
    type DataLine = { x1: number; y1: number; x2: number; y2: number; prog: number; speed: number; color: string };

    let particles: Particle[] = [];
    let racks: Rack[] = [];
    let lines: DataLine[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const W = canvas.width, H = canvas.height;

      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.25 + 0.05),
        size: Math.random() * 2.5 + 1,
        color: ["#3b82f6","#8b5cf6","#06b6d4","#a78bfa"][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      }));

      racks = Array.from({ length: 6 }, (_, i) => ({
        x: (W / 7) * (i + 0.5) + (Math.random() - 0.5) * 40,
        y: H * 0.55 + Math.random() * H * 0.2,
        w: 32 + Math.random() * 20,
        h: 80 + Math.random() * 60,
        alpha: 0.03 + Math.random() * 0.04,
      }));

      lines = Array.from({ length: 12 }, () => ({
        x1: Math.random() * W, y1: Math.random() * H,
        x2: Math.random() * W, y2: Math.random() * H,
        prog: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        color: ["#3b82f6","#8b5cf6","#06b6d4"][Math.floor(Math.random() * 3)],
      }));
    };

    const draw = () => {
      if (document.hidden) { animId = requestAnimationFrame(draw); return; }
      t += 0.008;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Ambient orbs
      [
        { cx: W * 0.25, cy: H * 0.45, r: 220, col: "30,60,200",  o: 0.07 },
        { cx: W * 0.75, cy: H * 0.5,  r: 200, col: "100,20,200", o: 0.05 },
        { cx: W * 0.5,  cy: H * 0.7,  r: 160, col: "6,100,180",  o: 0.04 },
      ].forEach(orb => {
        const pulse = 0.88 + 0.12 * Math.sin(t * 0.5);
        const g = ctx.createRadialGradient(orb.cx, orb.cy, 0, orb.cx, orb.cy, orb.r * pulse);
        g.addColorStop(0, `rgba(${orb.col},${orb.o})`);
        g.addColorStop(1, `rgba(${orb.col},0)`);
        ctx.beginPath(); ctx.arc(orb.cx, orb.cy, orb.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      // Subtle grid
      ctx.save();
      ctx.globalAlpha = 0.035;
      ctx.strokeStyle = "#4488ff";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 50) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 50) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
      ctx.restore();

      // Server rack silhouettes
      racks.forEach(rack => {
        ctx.save();
        ctx.globalAlpha = rack.alpha + 0.01 * Math.sin(t + rack.x);
        ctx.fillStyle = "#4488ff";
        ctx.fillRect(rack.x - rack.w / 2, rack.y - rack.h, rack.w, rack.h);
        for (let row = 8; row < rack.h; row += 12) {
          ctx.globalAlpha = rack.alpha * 0.6;
          ctx.fillStyle = "#00ccff";
          ctx.fillRect(rack.x - rack.w / 2 + 4, rack.y - rack.h + row, rack.w - 8, 5);
        }
        ctx.restore();
      });

      // Data flow lines
      lines.forEach(line => {
        line.prog += line.speed;
        if (line.prog > 1) { line.prog = 0; }
        const px = line.x1 + (line.x2 - line.x1) * line.prog;
        const py = line.y1 + (line.y2 - line.y1) * line.prog;
        ctx.save();
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = 0.06;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.beginPath(); ctx.moveTo(line.x1, line.y1); ctx.lineTo(line.x2, line.y2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.55;
        ctx.shadowBlur = 6; ctx.shadowColor = line.color;
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = line.color; ctx.fill();
        ctx.restore();
      });

      // Floating particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.6 + p.pulse);
        ctx.save();
        ctx.globalAlpha = p.opacity * tw;
        ctx.shadowBlur = 8; ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize(); draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}

// ─── VPS Plan Card ─────────────────────────────────────────────────────────────
function VpsPlanCard({ name, ram, storage, price, popular, index }: {
  name: string; ram: number; storage: number; price: number; popular: boolean; index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.25 } }}
      className={`relative flex flex-col rounded-2xl ${popular ? "plan-card-glow-popular" : "plan-card-glow"}`}
      style={{
        background: popular
          ? "linear-gradient(135deg, rgba(14,24,60,0.97) 0%, rgba(8,14,44,0.99) 100%)"
          : "linear-gradient(135deg, rgba(8,14,36,0.88) 0%, rgba(5,9,24,0.93) 100%)",
        border: popular
          ? "1px solid rgba(99,130,255,0.55)"
          : "1px solid rgba(59,100,220,0.2)",
        backdropFilter: "blur(20px)",
      }}
      data-testid={`vps-card-${index}`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className="px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
            style={{
              background: "linear-gradient(90deg, hsl(215 90% 50%) 0%, hsl(265 80% 55%) 100%)",
              boxShadow: "0 0 18px rgba(99,130,255,0.55)",
            }}
          >
            Most Popular
          </div>
        </div>
      )}

      <div className="h-px w-full" style={{
        background: popular
          ? "linear-gradient(90deg, transparent, rgba(99,130,255,0.85), rgba(150,80,255,0.65), transparent)"
          : "linear-gradient(90deg, transparent, rgba(50,80,200,0.25), transparent)",
      }} />

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <div className="text-white/45 text-xs font-semibold uppercase tracking-widest mb-1">{name}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-white/55 text-sm font-medium">₹</span>
            <span className="text-3xl font-bold text-white">{price}</span>
            <span className="text-white/35 text-xs">/mo</span>
          </div>
        </div>

        {/* Specs pills */}
        <div className="flex gap-2 mb-4">
          <div
            className="flex-1 flex items-center gap-1.5 rounded-lg px-2 py-1.5"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}
          >
            <HardDrive size={12} className="text-blue-400 shrink-0" />
            <span className="text-blue-300 font-bold text-xs">{ram}GB</span>
          </div>
          <div
            className="flex-1 flex items-center gap-1.5 rounded-lg px-2 py-1.5"
            style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.14)" }}
          >
            <Database size={12} className="text-purple-400 shrink-0" />
            <span className="text-purple-300 font-bold text-xs">{storage}GB</span>
          </div>
        </div>

        <ul className="space-y-1.5 mb-5 flex-1">
          {CARD_FEATURES.map(f => (
            <li key={f} className="flex items-center gap-2 text-xs text-white/52">
              <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <button
          className="w-full h-10 rounded-xl text-sm font-semibold text-white transition-all duration-200 relative overflow-hidden"
          style={{
            background: popular
              ? "linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 52%) 100%)"
              : "rgba(59,130,246,0.11)",
            border: popular ? "none" : "1px solid rgba(59,130,246,0.22)",
            boxShadow: popular ? "0 0 22px rgba(80,120,255,0.32)" : "none",
          }}
          data-testid={`btn-deploy-vps-${index}`}
        >
          Deploy Now
          {popular && (
            <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── OS Section ───────────────────────────────────────────────────────────────
const OS_LIST = [
  { name: "Ubuntu",        color: "#e84d1c", emoji: "🟠" },
  { name: "Debian",        color: "#a80030", emoji: "🔴" },
  { name: "AlmaLinux",     color: "#0f4880", emoji: "🔵" },
  { name: "Rocky Linux",   color: "#10b981", emoji: "🟢" },
  { name: "CentOS",        color: "#932279", emoji: "🟣" },
  { name: "Fedora",        color: "#3c6eb4", emoji: "🔵" },
  { name: "Windows Server",color: "#00a4ef", emoji: "🪟" },
  { name: "Arch Linux",    color: "#1793d1", emoji: "🔷" },
];

// ─── Feature list ─────────────────────────────────────────────────────────────
const FEATURE_LIST = [
  { icon: Layers,        label: "KVM Virtualization",       desc: "True hardware isolation — no noisy neighbours" },
  { icon: Key,           label: "Full Root Access",          desc: "Complete control over every layer of your VPS" },
  { icon: Cpu,           label: "Xeon / EPYC / Ryzen CPUs", desc: "Enterprise-grade processors on every tier" },
  { icon: HardDrive,     label: "NVMe Gen4 SSD Storage",    desc: "10x faster than standard SSDs, zero IOPS limits" },
  { icon: Server,        label: "Dedicated Resources",       desc: "No CPU bursting or shared RAM — yours alone" },
  { icon: Shield,        label: "Enterprise DDoS Protection",desc: "480Gbps+ network-level mitigation, always on" },
  { icon: Zap,           label: "Instant Deployment",        desc: "VPS is live in under 60 seconds after checkout" },
  { icon: MonitorCog,    label: "Linux & Windows Templates", desc: "8 OS images, one-click ready to go" },
  { icon: Network,       label: "IPv4 Included",             desc: "Dedicated public IP on every plan, no extras" },
  { icon: RefreshCw,     label: "Automated Backups",         desc: "Daily snapshots, 7-day retention included" },
  { icon: Code2,         label: "API Access",                desc: "Manage your VPS programmatically via REST API" },
  { icon: Globe,         label: "24/7 Expert Support",       desc: "Real engineers, average < 3 min response time" },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const VPS_FAQ = [
  {
    q: "How quickly can I deploy a VPS?",
    a: "Your VPS is fully provisioned and live in under 60 seconds after checkout. Automated deployment means zero wait time — your server is ready before you finish your coffee.",
  },
  {
    q: "Do I get full root access?",
    a: "Yes. Every VPS plan comes with complete root access. Install any software, configure the kernel, run custom daemons — there are zero restrictions on what you can do.",
  },
  {
    q: "Which operating systems are supported?",
    a: "We offer Ubuntu, Debian, AlmaLinux, Rocky Linux, CentOS, Fedora, Windows Server, and Arch Linux. All images are pre-optimised for performance and can be reinstalled in one click.",
  },
  {
    q: "What is the difference between Intel Xeon, AMD EPYC, and AMD Ryzen plans?",
    a: "Intel Xeon is our value tier — reliable, stable, great for most workloads. AMD EPYC offers more cores and memory bandwidth for compute-heavy tasks. AMD Ryzen delivers the highest single-core clock speeds, ideal for latency-sensitive applications and game servers.",
  },
  {
    q: "Is DDoS protection included?",
    a: "All VPS plans include enterprise-grade DDoS protection with 480Gbps+ network-level scrubbing. Attacks are filtered upstream before they touch your server — your uptime and latency are unaffected.",
  },
  {
    q: "Can I upgrade or downgrade my VPS plan?",
    a: "Upgrades are instant and prorated — you only pay the difference. Downgrades take effect at the next billing cycle. Both operations are done with zero data loss and minimal downtime.",
  },
  {
    q: "What does KVM virtualization mean for my VPS?",
    a: "KVM (Kernel-based Virtual Machine) gives your VPS dedicated, hardware-level isolation. Unlike OpenVZ containers, you get your own kernel, guaranteed resources, and the ability to load kernel modules — essential for things like Docker, WireGuard, and custom networking.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes — we offer a 3-day money-back guarantee on all VPS plans. If you're not satisfied for any reason within 3 days of purchase, contact support for a full refund, no questions asked.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VpsHosting() {
  const [activeCpu, setActiveCpu] = useState<CpuKey>("xeon");
  const [openFaq, setOpenFaq] = useState<string>("");

  const prices     = PRICES[activeCpu];
  const activeTab  = CPU_TABS.find(t => t.key === activeCpu)!;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="page-vps-hosting">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[580px] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden text-center"
        data-testid="section-vps-hero"
      >
        <HeroCanvas />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(3,4,15,0.55) 0%, transparent 40%, rgba(3,4,15,0.65) 100%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" data-testid="link-back-home">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.08 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/8 px-4 py-1.5 text-sm font-medium text-blue-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ boxShadow:"0 0 6px #3b82f6" }} />
              KVM Virtualization • NVMe Gen4 • Full Root Access
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.14 }}
            className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight"
          >
            High Performance{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 55%, #06b6d4 100%)" }}
            >
              VPS Hosting
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.2 }}
            className="text-base md:text-lg text-white/45 mb-3 font-medium tracking-wide"
          >
            Enterprise Virtual Private Servers Built for Developers
          </motion.p>

          <motion.p
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.26 }}
            className="text-sm text-white/38 max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Deploy lightning-fast Linux or Windows VPS instances on enterprise-grade hardware powered by Intel Xeon, AMD EPYC, and AMD Ryzen processors.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.32 }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            {["99.99% Uptime","KVM Virtualization","Root Access","DDoS Protected","Instant Deploy","API Access"].map(pill => (
              <span
                key={pill}
                className="px-3 py-1 rounded-full text-xs font-medium text-white/58"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}
              >
                {pill}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.38 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <a
              href="#plans"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 52%) 100%)",
                boxShadow: "0 0 24px rgba(80,120,255,0.35)",
              }}
            >
              Deploy VPS
            </a>
            <a
              href="#plans"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white/70 transition-all duration-200 hover:text-white"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              View Plans
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CPU TABS + PRICING ────────────────────────────────────────────── */}
      <section id="plans" className="relative py-16 px-6" data-testid="section-vps-plans">
        <div className="container mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Choose Your{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage:"linear-gradient(90deg,#3b82f6,#8b5cf6)" }}>
                CPU Platform
              </span>
            </h2>
            <p className="text-white/38 text-sm">Switch between processors below — same great infrastructure, different performance profiles.</p>
          </motion.div>

          {/* Tab selector */}
          <motion.div
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-4 p-1.5 rounded-2xl w-fit mx-auto"
            style={{ background:"rgba(8,14,36,0.82)", border:"1px solid rgba(50,80,160,0.22)", backdropFilter:"blur(16px)" }}
          >
            {CPU_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCpu(tab.key)}
                className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-250"
                style={{
                  background: activeCpu === tab.key
                    ? "linear-gradient(135deg, rgba(59,130,246,0.22) 0%, rgba(139,92,246,0.18) 100%)"
                    : "transparent",
                  border: activeCpu === tab.key ? "1px solid rgba(99,130,255,0.38)" : "1px solid transparent",
                  color: activeCpu === tab.key ? "white" : "rgba(255,255,255,0.42)",
                  boxShadow: activeCpu === tab.key ? "0 0 20px rgba(80,120,255,0.12)" : "none",
                }}
                data-testid={`tab-cpu-${tab.key}`}
              >
                <span className="text-base">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Badge */}
          <AnimatePresence mode="wait">
            {activeTab.badge ? (
              <motion.div
                key={activeCpu + "-badge"}
                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                transition={{ duration:0.22 }}
                className="text-center mb-10"
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: activeCpu === "epyc" ? "rgba(139,92,246,0.14)" : "rgba(34,197,94,0.10)",
                    border:     activeCpu === "epyc" ? "1px solid rgba(139,92,246,0.32)" : "1px solid rgba(34,197,94,0.28)",
                    color:      activeCpu === "epyc" ? "#a78bfa" : "#4ade80",
                  }}
                >
                  ⭐ {activeTab.badge}
                </span>
              </motion.div>
            ) : (
              <div key={activeCpu + "-nobadge"} className="mb-10" />
            )}
          </AnimatePresence>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCpu}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {VPS_PLANS.map((name, i) => (
                <VpsPlanCard
                  key={name + activeCpu}
                  name={name}
                  ram={VPS_RAM[i]}
                  storage={VPS_STORAGE[i]}
                  price={prices[i]}
                  popular={i === POPULAR_IDX}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6" data-testid="section-vps-features">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Enterprise Infrastructure,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage:"linear-gradient(90deg,#3b82f6,#8b5cf6)" }}>
                Developer Friendly
              </span>
            </h2>
            <p className="text-white/38 max-w-lg mx-auto text-sm">Every feature included on every plan. No hidden upsells, no gotchas.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {FEATURE_LIST.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.35, delay: i * 0.04 }}
                whileHover={{ y:-4, transition:{ duration:0.18 } }}
                className="rounded-xl p-5 group"
                style={{
                  background:"linear-gradient(135deg, rgba(8,14,36,0.82) 0%, rgba(5,9,24,0.9) 100%)",
                  border:"1px solid rgba(50,80,160,0.18)",
                  backdropFilter:"blur(12px)",
                }}
                data-testid={`vps-feature-${i}`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-blue-400 transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  style={{ background:"rgba(59,130,246,0.09)", border:"1px solid rgba(59,130,246,0.14)" }}
                >
                  <Icon size={18} />
                </div>
                <div className="text-white font-semibold text-sm mb-1">{label}</div>
                <div className="text-white/38 text-xs leading-relaxed">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATING SYSTEMS ─────────────────────────────────────────────── */}
      <section className="relative py-16 px-6" data-testid="section-vps-os">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Supported{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage:"linear-gradient(90deg,#3b82f6,#8b5cf6)" }}>
                Operating Systems
              </span>
            </h2>
            <p className="text-white/38 text-sm">One-click OS reinstall. Switch anytime, any plan.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {OS_LIST.map(({ name, color, emoji }, i) => (
              <motion.div
                key={name}
                initial={{ opacity:0, scale:0.92 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
                transition={{ duration:0.3, delay: i * 0.05 }}
                whileHover={{ y:-4, transition:{ duration:0.18 } }}
                className="rounded-xl p-5 flex flex-col items-center gap-3 group cursor-default"
                style={{
                  background:"linear-gradient(135deg, rgba(8,14,36,0.82) 0%, rgba(5,9,24,0.88) 100%)",
                  border:`1px solid rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.22)`,
                  backdropFilter:"blur(12px)",
                  boxShadow:`0 0 0 0 ${color}`,
                  transition:"box-shadow 0.25s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 22px ${color}28`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent"; }}
                data-testid={`os-card-${i}`}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-white/75 text-sm font-semibold text-center">{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 pb-28" data-testid="section-vps-faq">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Frequently Asked{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage:"linear-gradient(90deg,#3b82f6,#8b5cf6)" }}>
                Questions
              </span>
            </h2>
            <p className="text-white/38 text-sm">Everything you need to know before you deploy your VPS.</p>
          </motion.div>

          <Accordion.Root
            type="single"
            collapsible
            value={openFaq}
            onValueChange={setOpenFaq}
            className="space-y-3"
          >
            {VPS_FAQ.map(({ q, a }, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.3, delay: i * 0.04 }}
              >
                <Accordion.Item
                  value={String(i)}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background:"linear-gradient(135deg, rgba(8,14,36,0.82) 0%, rgba(5,9,24,0.9) 100%)",
                    border: openFaq === String(i)
                      ? "1px solid rgba(99,130,255,0.35)"
                      : "1px solid rgba(50,70,140,0.18)",
                    backdropFilter:"blur(12px)",
                  }}
                >
                  <Accordion.Trigger className="w-full flex items-center justify-between px-5 py-4 text-left group">
                    <span className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors">{q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === String(i) ? 180 : 0 }}
                      transition={{ duration:0.22 }}
                      className="shrink-0 ml-4"
                    >
                      <TerminalSquare size={16} className="text-white/30 group-hover:text-blue-400 transition-colors" />
                    </motion.div>
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                    <div className="px-5 pb-5">
                      <div className="h-px w-full mb-4" style={{ background:"linear-gradient(90deg, transparent, rgba(99,130,255,0.2), transparent)" }} />
                      <p className="text-sm text-white/48 leading-relaxed">{a}</p>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </div>
      </section>

      <Footer />
    </div>
  );
}
