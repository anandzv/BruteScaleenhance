import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Cpu, Server, Shield, Zap, HardDrive, Globe, CheckCircle2,
  Upload, Database, Package, ChevronDown, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import * as Accordion from "@radix-ui/react-accordion";

// ─── Plan data ─────────────────────────────────────────────────────────────────
const PLAN_NAMES = [
  "Game Nano","Game Micro","Game Basic","Game Lite","Game Standard",
  "Game Plus","Game Advanced","Game Pro","Game Elite","Game Ultra",
  "Game Extreme","Game God Tier",
];
const RAM_LIST = [2,4,6,8,10,12,14,16,18,20,22,24];
const POPULAR_IDX = 7; // Game Pro (16GB)

type CpuKey = "xeon" | "epyc" | "ryzen";

const PRICES: Record<CpuKey, number[]> = {
  xeon:  [69,149,249,349,449,549,649,749,849,949,1099,1199],
  epyc:  [89,189,299,419,549,679,809,939,1069,1199,1349,1499],
  ryzen: [120,279,439,599,759,919,1079,1239,1399,1559,1679,1799],
};

const CPU_TABS: { key: CpuKey; label: string; emoji: string; color: string; badge?: string }[] = [
  { key:"xeon",  label:"Intel Xeon",  emoji:"🔵", color:"from-blue-600 to-blue-400",   },
  { key:"epyc",  label:"AMD EPYC",    emoji:"🟣", color:"from-purple-600 to-purple-400", badge:"Enterprise Performance" },
  { key:"ryzen", label:"AMD Ryzen",   emoji:"🟢", color:"from-emerald-600 to-emerald-400", badge:"Highest Single-Core Performance" },
];

const CARD_FEATURES = [
  "NVMe SSD Storage",
  "Unlimited Bandwidth",
  "Free Subdomain",
  "DDoS Protection",
  "Instant Deployment",
  "Pterodactyl Panel",
  "24/7 Expert Support",
  "One Click Modpacks",
];

// ─── Hero Canvas ───────────────────────────────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    type Voxel = { x:number; y:number; sz:number; vx:number; vy:number; color:string; opacity:number; twinkle:number };
    let voxels: Voxel[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      voxels = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        sz: Math.random() * 5 + 3,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.2 + 0.05),
        color: ["#3b82f6","#8b5cf6","#06b6d4","#22c55e"][Math.floor(Math.random()*4)],
        opacity: Math.random() * 0.35 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      if (document.hidden) { animId = requestAnimationFrame(draw); return; }
      t += 0.01;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Ambient orbs
      [
        { cx: W*0.3, cy: H*0.4, r: 200, col:"30,80,200", o:0.06 },
        { cx: W*0.7, cy: H*0.5, r: 180, col:"100,20,180", o:0.05 },
      ].forEach(o => {
        const pulse = 0.85 + 0.15 * Math.sin(t * 0.6);
        const g = ctx.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r * pulse);
        g.addColorStop(0, `rgba(${o.col},${o.o})`);
        g.addColorStop(1, `rgba(${o.col},0)`);
        ctx.beginPath(); ctx.arc(o.cx, o.cy, o.r * pulse, 0, Math.PI*2);
        ctx.fillStyle = g; ctx.fill();
      });

      // Voxel squares
      voxels.forEach(v => {
        v.x += v.vx; v.y += v.vy;
        if (v.y < -10) { v.y = H + 10; v.x = Math.random() * W; }
        if (v.x < -10) v.x = W + 10;
        if (v.x > W+10) v.x = -10;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.8 + v.twinkle);
        ctx.save();
        ctx.globalAlpha = v.opacity * tw;
        ctx.shadowBlur = 8; ctx.shadowColor = v.color;
        ctx.fillStyle = v.color;
        ctx.fillRect(v.x - v.sz/2, v.y - v.sz/2, v.sz, v.sz);
        ctx.restore();
      });

      // Subtle grid
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = "#4466ff";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
      ctx.restore();

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

// ─── Pricing Card ─────────────────────────────────────────────────────────────
function PlanCard({ name, ram, price, popular, index }: {
  name: string; ram: number; price: number; popular: boolean; index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.25 } }}
      className={`relative flex flex-col rounded-2xl ${popular ? "plan-card-glow-popular" : "plan-card-glow"}`}
      style={{
        background: popular
          ? "linear-gradient(135deg, rgba(14,24,60,0.95) 0%, rgba(8,14,40,0.98) 100%)"
          : "linear-gradient(135deg, rgba(8,14,36,0.9) 0%, rgba(5,9,24,0.95) 100%)",
        border: popular
          ? "1px solid rgba(99,130,255,0.55)"
          : "1px solid rgba(59,100,220,0.2)",
        backdropFilter: "blur(20px)",
      }}
      data-testid={`plan-card-${index}`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className="px-4 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: "linear-gradient(90deg, hsl(215 90% 50%) 0%, hsl(265 80% 55%) 100%)", boxShadow: "0 0 16px rgba(99,130,255,0.5)" }}
          >
            Most Popular
          </div>
        </div>
      )}

      {/* Top accent */}
      <div className="h-px w-full" style={{
        background: popular
          ? "linear-gradient(90deg, transparent, rgba(99,130,255,0.8), rgba(150,80,255,0.6), transparent)"
          : "linear-gradient(90deg, transparent, rgba(50,80,200,0.3), transparent)"
      }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-4">
          <div className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">{name}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-white/60 text-sm font-medium">₹</span>
            <span className="text-3xl font-bold text-white">{price}</span>
            <span className="text-white/40 text-xs">/mo</span>
          </div>
        </div>

        {/* RAM pill */}
        <div
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 mb-4 w-full"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          <HardDrive size={14} className="text-blue-400 shrink-0" />
          <span className="text-blue-300 font-bold text-sm">{ram}GB RAM</span>
          <span className="text-white/30 text-xs ml-auto">NVMe SSD</span>
        </div>

        {/* Features */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {CARD_FEATURES.map(f => (
            <li key={f} className="flex items-center gap-2 text-xs text-white/55">
              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="w-full h-10 rounded-xl text-sm font-semibold text-white transition-all duration-200 relative overflow-hidden"
          style={{
            background: popular
              ? "linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 52%) 100%)"
              : "rgba(59,130,246,0.12)",
            border: popular ? "none" : "1px solid rgba(59,130,246,0.25)",
            boxShadow: popular ? "0 0 20px rgba(80,120,255,0.3)" : "none",
          }}
          data-testid={`btn-deploy-${index}`}
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

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FEATURE_LIST = [
  { icon: Cpu,          label: "Xeon / EPYC / Ryzen",  desc: "Premium CPU hardware for every budget" },
  { icon: HardDrive,    label: "NVMe Gen4 SSD",         desc: "10x faster than standard SSDs" },
  { icon: Zap,          label: "Instant Setup",          desc: "Server live in under 60 seconds" },
  { icon: Package,      label: "One Click Modpacks",    desc: "Forge, Fabric, Paper & more" },
  { icon: Upload,       label: "Full FTP Access",        desc: "Complete control over your files" },
  { icon: Database,     label: "Free Backups",           desc: "Daily automated snapshots" },
  { icon: Server,       label: "Unlimited Slots",        desc: "No player cap on any plan" },
  { icon: Shield,       label: "DDoS Protection",        desc: "480Gbps+ network-level mitigation" },
  { icon: Package,      label: "Plugin Support",         desc: "Bukkit, Spigot, Paper ready" },
  { icon: Cpu,          label: "Mod Support",            desc: "All major modloaders supported" },
  { icon: Upload,       label: "Custom JAR Upload",      desc: "Run any server software you want" },
  { icon: Globe,        label: "Global Network",         desc: "India, Dubai & Singapore nodes" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const MC_FAQ = [
  { q: "How quickly can I deploy my Minecraft server?", a: "Your server goes live in under 60 seconds after checkout. No waiting, no queue — instant automated provisioning on enterprise hardware." },
  { q: "Which Minecraft versions are supported?", a: "We support all versions from 1.8 through the latest release, including Java Edition. Paper, Spigot, Bukkit, Forge, Fabric, Purpur, and Waterfall are all available via one-click install." },
  { q: "Can I upload my own server JAR or modpack?", a: "Absolutely. You get full FTP/SFTP access to upload any custom JAR, modpack, world, or plugin. There are zero restrictions on what you can run." },
  { q: "What DDoS protection is included?", a: "All plans include enterprise-grade DDoS protection with 480Gbps+ network-level mitigation. Attacks are filtered automatically — your players never notice." },
  { q: "Can I upgrade my plan at any time?", a: "Yes, upgrades take effect instantly. You'll only pay the prorated difference for the remaining billing period. Downgrading is also possible at renewal." },
  { q: "What control panel do you use?", a: "We use Pterodactyl Panel — the industry-standard open-source game server control panel. Manage your server, console, files, schedules, and databases from one clean interface." },
  { q: "Is there a money-back guarantee?", a: "Yes. We offer a 3-day money-back guarantee on all Minecraft hosting plans. If you're not satisfied for any reason, contact support within 3 days for a full refund." },
  { q: "Which datacenter locations are available?", a: "You can deploy in Mumbai (India), Dubai (UAE), or Singapore. All locations feature 10Gbps uplinks, AMD/Intel hardware, and NVMe SSD storage." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MinecraftHosting() {
  const [activeCpu, setActiveCpu] = useState<CpuKey>("xeon");
  const [openFaq, setOpenFaq] = useState<string>("");

  const prices = PRICES[activeCpu];
  const activeCpuTab = CPU_TABS.find(t => t.key === activeCpu)!;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="page-minecraft-hosting">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[540px] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden text-center"
        data-testid="section-mc-hero"
      >
        <HeroCanvas />
        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(3,4,15,0.5) 0%, transparent 40%, rgba(3,4,15,0.6) 100%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" data-testid="link-back-home">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.08 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/8 px-4 py-1.5 text-sm font-medium text-blue-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ boxShadow:"0 0 6px #3b82f6" }} />
              Powered by NVMe Gen4 • Pterodactyl Panel
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.15 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Premium{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage:"linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #22c55e 100%)" }}
            >
              Minecraft Hosting
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.22 }}
            className="text-lg text-white/50 max-w-2xl mx-auto mb-8"
          >
            Deploy your Minecraft server instantly on enterprise hardware with ultra-low latency, DDoS protection, NVMe SSDs, and powerful CPUs.
          </motion.p>

          {/* Quick trust pills */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.3 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {["99.99% Uptime","<15ms Latency","DDoS Protected","Instant Deploy","Pterodactyl Panel"].map(pill => (
              <span
                key={pill}
                className="px-3 py-1 rounded-full text-xs font-medium text-white/60"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CPU TABS + PRICING ────────────────────────────────────────────── */}
      <section id="plans" className="relative py-16 px-6" data-testid="section-mc-plans">
        <div className="container mx-auto max-w-7xl">

          {/* Tab selector */}
          <motion.div
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-4 p-1.5 rounded-2xl w-fit mx-auto"
            style={{ background:"rgba(8,14,36,0.8)", border:"1px solid rgba(50,80,160,0.2)", backdropFilter:"blur(16px)" }}
          >
            {CPU_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCpu(tab.key)}
                className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-250"
                style={{
                  background: activeCpu === tab.key
                    ? "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.2) 100%)"
                    : "transparent",
                  border: activeCpu === tab.key ? "1px solid rgba(99,130,255,0.4)" : "1px solid transparent",
                  color: activeCpu === tab.key ? "white" : "rgba(255,255,255,0.45)",
                  boxShadow: activeCpu === tab.key ? "0 0 20px rgba(80,120,255,0.12)" : "none",
                }}
                data-testid={`tab-cpu-${tab.key}`}
              >
                <span className="text-base">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Badge under tabs */}
          <AnimatePresence mode="wait">
            {activeCpuTab.badge && (
              <motion.div
                key={activeCpu + "-badge"}
                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                transition={{ duration:0.25 }}
                className="text-center mb-8"
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: activeCpu === "epyc" ? "rgba(139,92,246,0.15)" : "rgba(34,197,94,0.12)",
                    border: activeCpu === "epyc" ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(34,197,94,0.3)",
                    color: activeCpu === "epyc" ? "#a78bfa" : "#4ade80",
                  }}
                >
                  ⭐ {activeCpuTab.badge}
                </span>
              </motion.div>
            )}
            {!activeCpuTab.badge && <div key={activeCpu+"-nobadge"} className="mb-8" />}
          </AnimatePresence>

          {/* Cards grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCpu}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {PLAN_NAMES.map((name, i) => (
                <PlanCard
                  key={name + activeCpu}
                  name={name}
                  ram={RAM_LIST[i]}
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
      <section className="relative py-20 px-6" data-testid="section-mc-features">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Everything Included,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage:"linear-gradient(90deg, #3b82f6, #8b5cf6)" }}>
                Zero Compromises
              </span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">All features included on every plan. No upsells, no gotchas.</p>
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
                  background:"linear-gradient(135deg, rgba(8,14,36,0.8) 0%, rgba(5,9,24,0.9) 100%)",
                  border:"1px solid rgba(50,80,160,0.2)",
                  backdropFilter:"blur(12px)",
                }}
                data-testid={`feature-card-${i}`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-blue-400 transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.15)" }}
                >
                  <Icon size={18} />
                </div>
                <div className="text-white font-semibold text-sm mb-1">{label}</div>
                <div className="text-white/40 text-xs leading-relaxed">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 pb-28" data-testid="section-mc-faq">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Frequently Asked <span className="bg-clip-text text-transparent" style={{ backgroundImage:"linear-gradient(90deg, #3b82f6, #8b5cf6)" }}>Questions</span>
            </h2>
            <p className="text-white/40">Everything you need to know before you deploy.</p>
          </motion.div>

          <Accordion.Root
            type="single"
            collapsible
            value={openFaq}
            onValueChange={setOpenFaq}
            className="space-y-3"
          >
            {MC_FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.35, delay: i * 0.05 }}
              >
                <Accordion.Item
                  value={`faq-${i}`}
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    background:"linear-gradient(135deg, rgba(8,14,36,0.85) 0%, rgba(5,9,24,0.9) 100%)",
                    border: openFaq === `faq-${i}` ? "1px solid rgba(99,130,255,0.4)" : "1px solid rgba(50,80,160,0.2)",
                    boxShadow: openFaq === `faq-${i}` ? "0 0 20px rgba(80,120,255,0.08)" : "none",
                  }}
                  data-testid={`faq-item-${i}`}
                >
                  <Accordion.Trigger
                    className="flex items-center justify-between w-full px-6 py-4 text-left group"
                    data-testid={`faq-trigger-${i}`}
                  >
                    <span className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors pr-4">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-blue-400 shrink-0 transition-transform duration-300"
                      style={{ transform: openFaq === `faq-${i}` ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="px-6 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-3">
                      {item.a}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mt-14"
          >
            <p className="text-white/40 text-sm mb-4">Ready to launch your server?</p>
            <button
              className="inline-flex h-12 items-center gap-2 px-8 rounded-xl text-sm font-semibold text-white"
              style={{
                background:"linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 52%) 100%)",
                boxShadow:"0 0 25px rgba(80,120,255,0.35), 0 0 60px rgba(80,120,255,0.12)",
              }}
              data-testid="btn-bottom-cta"
              onClick={() => document.getElementById("plans")?.scrollIntoView({ behavior:"smooth" })}
            >
              <Zap size={16} /> View All Plans
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
