import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Monitor, Shield, Zap, HardDrive, Globe, CheckCircle2,
  ArrowLeft, Server, Cpu, RefreshCw, Network, Database,
  TerminalSquare, ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import * as Accordion from "@radix-ui/react-accordion";

// ─── Plan data ─────────────────────────────────────────────────────────────────
const RDP_PLANS = ["RDP Nano","RDP Basic","RDP Lite","RDP Pro","RDP Elite","RDP Extreme","RDP God Tier"];
const RDP_RAM   = [4, 8, 16, 24, 32, 48, 64];
const RDP_SSD   = [120, 240, 480, 720, 960, 1440, 2048];
const POPULAR_IDX = 3; // RDP Pro (24GB)

type CpuKey = "xeon" | "epyc" | "ryzen";

const PRICES: Record<CpuKey, number[]> = {
  xeon:  [299,  549,  949,  1249, 1499, 1749, 1999],
  epyc:  [349,  649,  1149, 1449, 1699, 1999, 2299],
  ryzen: [449,  849,  1449, 1849, 2149, 2449, 2599],
};

const CPU_TABS: { key: CpuKey; label: string; emoji: string; badge?: string }[] = [
  { key:"xeon",  label:"Intel Xeon",  emoji:"🔵" },
  { key:"epyc",  label:"AMD EPYC",    emoji:"🟣", badge:"Enterprise Performance" },
  { key:"ryzen", label:"AMD Ryzen",   emoji:"🟢", badge:"Flagship Performance" },
];

const CARD_FEATURES = [
  "Windows Server 2022",
  "Administrator Access",
  "Remote Desktop Enabled",
  "Intel Xeon / AMD EPYC / Ryzen CPU",
  "NVMe Gen4 SSD",
  "Dedicated Resources",
  "Instant Deployment",
  "1 Dedicated IPv4",
  "Enterprise DDoS Protection",
  "Automatic Backups",
  "99.99% Uptime",
  "24/7 Premium Support",
];

// ─── Hero Canvas — Windows server / datacenter vibe ─────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    type Particle = { x:number; y:number; vx:number; vy:number; r:number; color:string; a:number; pulse:number };
    type Line = { x1:number; y1:number; x2:number; y2:number; prog:number; speed:number; col:string };
    type Win = { x:number; y:number; w:number; h:number; alpha:number; blink:number };

    let particles: Particle[] = [];
    let lines: Line[] = [];
    let wins: Win[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const W = canvas.width, H = canvas.height;

      particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random()-0.5)*0.3, vy: -(Math.random()*0.2+0.04),
        r: Math.random()*2+1,
        color: ["#3b82f6","#8b5cf6","#06b6d4","#00a4ef","#a78bfa"][Math.floor(Math.random()*5)],
        a: Math.random()*0.4+0.1, pulse: Math.random()*Math.PI*2,
      }));

      lines = Array.from({ length: 14 }, () => ({
        x1:Math.random()*W, y1:Math.random()*H,
        x2:Math.random()*W, y2:Math.random()*H,
        prog:Math.random(), speed:0.002+Math.random()*0.004,
        col:["#3b82f6","#8b5cf6","#00a4ef"][Math.floor(Math.random()*3)],
      }));

      // Windows logo-inspired floating squares
      wins = Array.from({ length: 8 }, (_, i) => ({
        x: (W/9)*(i+0.8)+(Math.random()-0.5)*60,
        y: H*0.6+Math.random()*H*0.25,
        w: 18+Math.random()*14,
        h: 18+Math.random()*14,
        alpha: 0.02+Math.random()*0.05,
        blink: Math.random()*Math.PI*2,
      }));
    };

    const draw = () => {
      if (document.hidden) { animId = requestAnimationFrame(draw); return; }
      t += 0.008;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Ambient orbs
      [
        { cx:W*0.22, cy:H*0.42, r:230, col:"20,60,200",  o:0.07 },
        { cx:W*0.78, cy:H*0.48, r:210, col:"90,20,200",  o:0.06 },
        { cx:W*0.5,  cy:H*0.75, r:170, col:"0,100,200",  o:0.04 },
      ].forEach(orb => {
        const p = 0.87+0.13*Math.sin(t*0.5);
        const g = ctx.createRadialGradient(orb.cx,orb.cy,0,orb.cx,orb.cy,orb.r*p);
        g.addColorStop(0,`rgba(${orb.col},${orb.o})`);
        g.addColorStop(1,`rgba(${orb.col},0)`);
        ctx.beginPath(); ctx.arc(orb.cx,orb.cy,orb.r*p,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
      });

      // Grid
      ctx.save(); ctx.globalAlpha=0.03; ctx.strokeStyle="#4488ff"; ctx.lineWidth=1;
      for(let gx=0;gx<W;gx+=48){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
      for(let gy=0;gy<H;gy+=48){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}
      ctx.restore();

      // Floating Windows-style quad-squares
      wins.forEach(w => {
        const alpha = w.alpha*(0.7+0.3*Math.sin(t*0.9+w.blink));
        const gap = 3;
        const sq = (w.w-gap)/2;
        const colors = ["#00a4ef","#7fba00","#f25022","#ffb900"];
        const offsets = [[0,0],[sq+gap,0],[0,sq+gap],[sq+gap,sq+gap]];
        offsets.forEach(([ox,oy],ci) => {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = colors[ci];
          ctx.shadowBlur = 6; ctx.shadowColor = colors[ci];
          ctx.fillRect(w.x+ox, w.y+oy, sq, sq);
          ctx.restore();
        });
      });

      // Data lines + packets
      lines.forEach(ln => {
        ln.prog += ln.speed;
        if(ln.prog>1) ln.prog=0;
        const px = ln.x1+(ln.x2-ln.x1)*ln.prog;
        const py = ln.y1+(ln.y2-ln.y1)*ln.prog;
        ctx.save();
        ctx.strokeStyle=ln.col; ctx.globalAlpha=0.055; ctx.lineWidth=1;
        ctx.setLineDash([4,10]);
        ctx.beginPath(); ctx.moveTo(ln.x1,ln.y1); ctx.lineTo(ln.x2,ln.y2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha=0.6; ctx.shadowBlur=7; ctx.shadowColor=ln.col;
        ctx.beginPath(); ctx.arc(px,py,2.5,0,Math.PI*2);
        ctx.fillStyle=ln.col; ctx.fill();
        ctx.restore();
      });

      // Particles
      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.y<-10){p.y=H+10;p.x=Math.random()*W;}
        if(p.x<-10) p.x=W+10; if(p.x>W+10) p.x=-10;
        const tw=0.5+0.5*Math.sin(t*1.7+p.pulse);
        ctx.save();
        ctx.globalAlpha=p.a*tw; ctx.shadowBlur=8; ctx.shadowColor=p.color;
        ctx.fillStyle=p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        ctx.restore();
      });

      animId=requestAnimationFrame(draw);
    };

    window.addEventListener("resize",resize);
    resize(); draw();
    return ()=>{ cancelAnimationFrame(animId); window.removeEventListener("resize",resize); };
  },[]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{opacity:0.9}} />
  );
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────
function RdpPlanCard({ name, ram, ssd, price, popular, index }: {
  name:string; ram:number; ssd:number; price:number; popular:boolean; index:number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-10 }}
      transition={{ duration:0.3, delay:index*0.04 }}
      whileHover={{ y:-8, scale:1.03, transition:{ duration:0.25 } }}
      className={`relative flex flex-col rounded-2xl ${popular ? "plan-card-glow-popular" : "plan-card-glow"}`}
      style={{
        background: popular
          ? "linear-gradient(135deg, rgba(14,24,60,0.97) 0%, rgba(8,14,44,0.99) 100%)"
          : "linear-gradient(135deg, rgba(8,14,36,0.88) 0%, rgba(5,9,24,0.93) 100%)",
        border: popular ? "1px solid rgba(99,130,255,0.55)" : "1px solid rgba(59,100,220,0.2)",
        backdropFilter:"blur(20px)",
      }}
      data-testid={`rdp-card-${index}`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className="px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
            style={{ background:"linear-gradient(90deg,hsl(215 90% 50%) 0%,hsl(265 80% 55%) 100%)", boxShadow:"0 0 18px rgba(99,130,255,0.55)" }}
          >
            Most Popular
          </div>
        </div>
      )}
      <div className="h-px w-full" style={{
        background: popular
          ? "linear-gradient(90deg,transparent,rgba(99,130,255,0.85),rgba(150,80,255,0.65),transparent)"
          : "linear-gradient(90deg,transparent,rgba(50,80,200,0.25),transparent)",
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

        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.15)" }}>
            <HardDrive size={12} className="text-blue-400 shrink-0" />
            <span className="text-blue-300 font-bold text-xs">{ram}GB RAM</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background:"rgba(0,164,239,0.07)", border:"1px solid rgba(0,164,239,0.14)" }}>
            <Database size={12} className="text-sky-400 shrink-0" />
            <span className="text-sky-300 font-bold text-xs">{ssd}GB</span>
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
            background: popular ? "linear-gradient(135deg,hsl(215 90% 48%) 0%,hsl(265 80% 52%) 100%)" : "rgba(59,130,246,0.11)",
            border: popular ? "none" : "1px solid rgba(59,130,246,0.22)",
            boxShadow: popular ? "0 0 22px rgba(80,120,255,0.32)" : "none",
          }}
          data-testid={`btn-deploy-rdp-${index}`}
        >
          Deploy Now
          {popular && <span className="absolute inset-0 pointer-events-none" style={{ background:"linear-gradient(to bottom,rgba(255,255,255,0.1) 0%,transparent 60%)" }} />}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Perfect For section ──────────────────────────────────────────────────────
const PERFECT_FOR = [
  { emoji:"💹", label:"Forex & Crypto Trading",  desc:"Run MT4/MT5, trading bots and signal tools around the clock" },
  { emoji:"🤖", label:"Automation Bots",          desc:"Keep Python, Node.js and Selenium scripts running 24/7" },
  { emoji:"🎮", label:"Game Development",         desc:"Run Unity, Unreal or your game server on Windows hardware" },
  { emoji:"💻", label:"Remote Office",            desc:"Your full Windows desktop accessible from anywhere on earth" },
  { emoji:"🎬", label:"Video Rendering",          desc:"Offload After Effects, Premiere, Blender renders to the cloud" },
  { emoji:"🖥️", label:"24/7 Applications",        desc:"Serve apps, dashboards or bots that can never go offline" },
];

// ─── Windows Features section ─────────────────────────────────────────────────
const WIN_FEATURES = [
  { icon: Monitor,    label:"Windows Server 2022",   color:"#00a4ef" },
  { icon: Monitor,    label:"Windows 11",             color:"#00a4ef" },
  { icon: Shield,     label:"Administrator Access",   color:"#7fba00" },
  { icon: Cpu,        label:"GPU Ready",              color:"#f25022" },
  { icon: Server,     label:"Remote Desktop Enabled", color:"#8b5cf6" },
  { icon: RefreshCw,  label:"Automatic Updates",      color:"#06b6d4" },
  { icon: Network,    label:"High Speed Network",     color:"#3b82f6" },
  { icon: Zap,        label:"Instant Deployment",     color:"#ffb900" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const RDP_FAQ = [
  {
    q:"How quickly will my RDP server be online?",
    a:"Provisioning is fully automated — your Windows RDP server is live in under 60 seconds after checkout. No manual setup, no waiting in a queue.",
  },
  {
    q:"Which Windows versions are available?",
    a:"We offer Windows Server 2022 and Windows 11 images. All are pre-licensed, pre-activated, and optimised for remote desktop performance out of the box.",
  },
  {
    q:"Do I get full Administrator access?",
    a:"Yes. Every plan includes a dedicated Administrator account. You have complete control — install any software, configure services, manage users, and modify every system setting.",
  },
  {
    q:"Can I use it for Forex / crypto trading bots?",
    a:"Absolutely. RDP servers are a perfect environment for MT4, MT5, cTrader, and custom trading bots. Low-latency connectivity to financial exchanges and 24/7 uptime ensure your strategies never miss a trade.",
  },
  {
    q:"What is the difference between Intel Xeon, AMD EPYC, and AMD Ryzen plans?",
    a:"Intel Xeon is our dependable value tier for general workloads. AMD EPYC delivers higher core counts and memory bandwidth for compute-intensive tasks. AMD Ryzen provides the highest single-core clock speeds — ideal for trading software and latency-sensitive applications.",
  },
  {
    q:"Is DDoS protection included?",
    a:"Yes. All RDP plans include enterprise-grade DDoS mitigation with 480Gbps+ network-level filtering. Your server remains online and accessible even during large volumetric attacks.",
  },
  {
    q:"Can I upgrade my plan without losing data?",
    a:"Yes. Upgrades are instant and prorated, with zero data loss. Your files, applications, and settings are preserved throughout the process.",
  },
  {
    q:"Is there a money-back guarantee?",
    a:"We offer a 3-day money-back guarantee on all RDP hosting plans. Contact support within 3 days of purchase for a full refund, no questions asked.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RdpHosting() {
  const [activeCpu, setActiveCpu] = useState<CpuKey>("xeon");
  const [openFaq, setOpenFaq] = useState<string>("");
  const prices   = PRICES[activeCpu];
  const activeTab = CPU_TABS.find(t=>t.key===activeCpu)!;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="page-rdp-hosting">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[590px] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden text-center" data-testid="section-rdp-hero">
        <HeroCanvas />
        <div className="absolute inset-0 pointer-events-none" style={{ background:"linear-gradient(to bottom,rgba(3,4,15,0.55) 0%,transparent 40%,rgba(3,4,15,0.65) 100%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.45}}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8">
              <ArrowLeft size={14}/> Back to Home
            </Link>
          </motion.div>

          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.08}}>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/8 px-4 py-1.5 text-sm font-medium text-sky-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" style={{boxShadow:"0 0 6px #00a4ef"}} />
              Windows Server 2022 • Full Administrator Access • KVM
            </div>
          </motion.div>

          <motion.h1
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.14}}
            className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight"
          >
            Enterprise{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage:"linear-gradient(135deg,#00a4ef 0%,#3b82f6 40%,#8b5cf6 100%)" }}>
              Windows RDP
            </span>
            {" "}Hosting
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.2}} className="text-base md:text-lg text-white/45 mb-2 font-medium">
            Ultra-Fast Remote Desktop Servers
          </motion.p>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.26}} className="text-sm text-white/38 max-w-xl mx-auto mb-8 leading-relaxed">
            Deploy powerful Windows Remote Desktop servers within seconds. Powered by Intel Xeon, AMD EPYC, and AMD Ryzen hardware with blazing-fast NVMe SSD storage and enterprise-grade networking.
          </motion.p>

          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.32}} className="flex flex-wrap gap-3 justify-center mb-8">
            {["99.99% Uptime","Windows Server 2022","Administrator Access","DDoS Protected","Instant Deploy","1 Dedicated IPv4"].map(pill=>(
              <span key={pill} className="px-3 py-1 rounded-full text-xs font-medium text-white/58" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"}}>{pill}</span>
            ))}
          </motion.div>

          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.38}} className="flex flex-wrap gap-3 justify-center">
            <a href="#plans" className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{background:"linear-gradient(135deg,#00a4ef 0%,hsl(215 90% 48%) 40%,hsl(265 80% 52%) 100%)",boxShadow:"0 0 24px rgba(0,164,239,0.32)"}}>
              Deploy RDP
            </a>
            <a href="#plans" className="px-6 py-3 rounded-xl text-sm font-semibold text-white/65 hover:text-white transition-colors" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)"}}>
              View Plans
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CPU TABS + PRICING ────────────────────────────────────────────── */}
      <section id="plans" className="relative py-16 px-6" data-testid="section-rdp-plans">
        <div className="container mx-auto max-w-7xl">

          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Choose Your{" "}
              <span className="bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(90deg,#00a4ef,#8b5cf6)"}}>CPU Platform</span>
            </h2>
            <p className="text-white/38 text-sm">Switch between processors instantly — same enterprise infrastructure, different performance profiles.</p>
          </motion.div>

          {/* Tab selector */}
          <motion.div
            initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            className="flex flex-col sm:flex-row gap-3 mb-4 p-1.5 rounded-2xl w-fit mx-auto"
            style={{background:"rgba(8,14,36,0.82)",border:"1px solid rgba(50,80,160,0.22)",backdropFilter:"blur(16px)"}}
          >
            {CPU_TABS.map(tab=>(
              <button
                key={tab.key}
                onClick={()=>setActiveCpu(tab.key)}
                className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-250"
                style={{
                  background: activeCpu===tab.key ? "linear-gradient(135deg,rgba(0,164,239,0.2) 0%,rgba(139,92,246,0.18) 100%)" : "transparent",
                  border: activeCpu===tab.key ? "1px solid rgba(0,164,239,0.38)" : "1px solid transparent",
                  color: activeCpu===tab.key ? "white" : "rgba(255,255,255,0.42)",
                  boxShadow: activeCpu===tab.key ? "0 0 20px rgba(0,164,239,0.12)" : "none",
                }}
                data-testid={`tab-rdp-${tab.key}`}
              >
                <span className="text-base">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Badge */}
          <AnimatePresence mode="wait">
            {activeTab.badge ? (
              <motion.div key={activeCpu+"-badge"} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.22}} className="text-center mb-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: activeCpu==="epyc" ? "rgba(139,92,246,0.14)" : "rgba(34,197,94,0.10)",
                    border:     activeCpu==="epyc" ? "1px solid rgba(139,92,246,0.32)" : "1px solid rgba(34,197,94,0.28)",
                    color:      activeCpu==="epyc" ? "#a78bfa" : "#4ade80",
                  }}
                >
                  ⭐ {activeTab.badge}
                </span>
              </motion.div>
            ) : <div key={activeCpu+"-nobadge"} className="mb-10" />}
          </AnimatePresence>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCpu} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {RDP_PLANS.map((name,i)=>(
                <RdpPlanCard key={name+activeCpu} name={name} ram={RDP_RAM[i]} ssd={RDP_SSD[i]} price={prices[i]} popular={i===POPULAR_IDX} index={i}/>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── PERFECT FOR ───────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6" data-testid="section-rdp-perfect-for">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Perfect{" "}
              <span className="bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(90deg,#00a4ef,#8b5cf6)"}}>For</span>
            </h2>
            <p className="text-white/38 text-sm">Whatever your workload, our RDP servers handle it 24/7 without breaking a sweat.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERFECT_FOR.map(({emoji,label,desc},i)=>(
              <motion.div
                key={label}
                initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                transition={{duration:0.35,delay:i*0.07}}
                whileHover={{y:-5,transition:{duration:0.18}}}
                className="rounded-2xl p-6 flex flex-col gap-4 group cursor-default"
                style={{
                  background:"linear-gradient(135deg,rgba(8,14,36,0.85) 0%,rgba(5,9,24,0.92) 100%)",
                  border:"1px solid rgba(50,80,160,0.2)",
                  backdropFilter:"blur(14px)",
                }}
                data-testid={`perfect-for-${i}`}
              >
                <span className="text-4xl">{emoji}</span>
                <div>
                  <div className="text-white font-bold text-base mb-1 group-hover:text-sky-300 transition-colors">{label}</div>
                  <div className="text-white/40 text-sm leading-relaxed">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WINDOWS FEATURES ──────────────────────────────────────────────── */}
      <section className="relative py-16 px-6" data-testid="section-rdp-win-features">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Windows{" "}
              <span className="bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(90deg,#00a4ef,#8b5cf6)"}}>Features</span>
            </h2>
            <p className="text-white/38 text-sm">Enterprise-grade Windows environment, ready the moment you deploy.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {WIN_FEATURES.map(({icon:Icon,label,color},i)=>(
              <motion.div
                key={label}
                initial={{opacity:0,scale:0.92}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}
                transition={{duration:0.3,delay:i*0.05}}
                whileHover={{y:-4,transition:{duration:0.18}}}
                className="rounded-xl p-5 flex flex-col items-center gap-3 group cursor-default"
                style={{
                  background:"linear-gradient(135deg,rgba(8,14,36,0.82) 0%,rgba(5,9,24,0.9) 100%)",
                  border:`1px solid ${color}28`,
                  backdropFilter:"blur(12px)",
                }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow=`0 0 22px ${color}28`;}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}
                data-testid={`win-feature-${i}`}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_0_18px_rgba(0,164,239,0.3)]"
                  style={{background:`${color}14`,border:`1px solid ${color}25`}}>
                  <Icon size={18} style={{color}} />
                </div>
                <span className="text-white/72 text-sm font-semibold text-center leading-tight">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 pb-28" data-testid="section-rdp-faq">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Frequently Asked{" "}
              <span className="bg-clip-text text-transparent" style={{backgroundImage:"linear-gradient(90deg,#00a4ef,#8b5cf6)"}}>Questions</span>
            </h2>
            <p className="text-white/38 text-sm">Everything you need to know before deploying your Windows RDP server.</p>
          </motion.div>

          <Accordion.Root type="single" collapsible value={openFaq} onValueChange={setOpenFaq} className="space-y-3">
            {RDP_FAQ.map(({q,a},i)=>(
              <motion.div key={i} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.3,delay:i*0.04}}>
                <Accordion.Item
                  value={String(i)}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background:"linear-gradient(135deg,rgba(8,14,36,0.82) 0%,rgba(5,9,24,0.9) 100%)",
                    border: openFaq===String(i) ? "1px solid rgba(0,164,239,0.32)" : "1px solid rgba(50,70,140,0.18)",
                    backdropFilter:"blur(12px)",
                  }}
                >
                  <Accordion.Trigger className="w-full flex items-center justify-between px-5 py-4 text-left group">
                    <span className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors">{q}</span>
                    <motion.div animate={{rotate:openFaq===String(i)?180:0}} transition={{duration:0.22}} className="shrink-0 ml-4">
                      <ChevronDown size={16} className="text-white/30 group-hover:text-sky-400 transition-colors" />
                    </motion.div>
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                    <div className="px-5 pb-5">
                      <div className="h-px w-full mb-4" style={{background:"linear-gradient(90deg,transparent,rgba(0,164,239,0.2),transparent)"}} />
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
