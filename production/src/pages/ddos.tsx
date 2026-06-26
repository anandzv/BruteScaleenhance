import { motion } from "framer-motion";
import { Shield, Zap, Globe, Activity, Lock, Server, CheckCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { DDoSProtection } from "@/components/sections/DDoSProtection";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const protectionFeatures = [
  {
    icon: Shield,
    title: "Layer 3/4 Protection",
    description: "Full mitigation of volumetric and protocol attacks including UDP floods, SYN floods, ICMP floods, and amplification attacks.",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    icon: Activity,
    title: "Layer 7 Application Shield",
    description: "Intelligent HTTP/S filtering that distinguishes real users from bots and scrubbers, blocking application-layer attacks in milliseconds.",
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    icon: Zap,
    title: "Instant Mitigation",
    description: "Automated detection and mitigation fires in under 10 seconds. Zero manual intervention. Zero downtime for legitimate traffic.",
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: Globe,
    title: "Global Anycast Network",
    description: "Traffic is absorbed at the edge across our global PoPs before it even approaches your infrastructure. Attacks are swallowed, not rerouted.",
    color: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    glow: "rgba(6,182,212,0.15)",
  },
  {
    icon: Lock,
    title: "Always-On, Never Optional",
    description: "DDoS protection is active 24/7 on every single plan. It's not an add-on. It's part of the infrastructure.",
    color: "from-green-500/20 to-green-600/10",
    border: "border-green-500/30",
    iconColor: "text-green-400",
    glow: "rgba(34,197,94,0.15)",
  },
  {
    icon: Server,
    title: "Bare-Metal Filtering Hardware",
    description: "Purpose-built scrubbing hardware processes packets at line rate. No shared virtual filtering — your traffic never competes.",
    color: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
    glow: "rgba(244,63,94,0.15)",
  },
];

const stats = [
  { value: "480Gbps+", label: "Peak Mitigation Capacity" },
  { value: "<10s",     label: "Attack Detection Time" },
  { value: "99.99%",  label: "Protected Uptime" },
  { value: "0ms",     label: "Added Latency" },
  { value: "24/7",    label: "Active Monitoring" },
  { value: "∞",       label: "Attack Size Limit" },
];

const whyPoints = [
  { title: "No Rate Limiting on Legit Traffic", body: "Our filtering engine only drops malicious packets. Legitimate players and users never see a blip." },
  { title: "Transparent Pricing — No Surge Fees", body: "DDoS attacks don't cost you extra. Mitigation is included in every plan, period." },
  { title: "Multi-Vector Attack Support", body: "UDP, TCP, SYN, ACK, DNS amplification, HTTP floods — our engine handles every known attack vector." },
  { title: "Real-Time Dashboard", body: "See live traffic graphs, mitigation events, and attack origins directly in your control panel." },
  { title: "Dedicated Scrubbing Centers", body: "Traffic doesn't get rerouted through overcrowded shared infrastructure. Your data goes through dedicated hardware." },
  { title: "Works With Your Existing Setup", body: "No configuration required. The protection is inline. Deploy your server and it's already shielded." },
];

const ddosFaqs = [
  {
    q: "What attack sizes can BruteScale handle?",
    a: "Our infrastructure is rated for 480Gbps+ of sustained attack traffic. In practice, we have successfully mitigated attacks exceeding that threshold thanks to our global Anycast absorption network.",
  },
  {
    q: "Does DDoS protection affect my server's performance?",
    a: "No. Filtering happens upstream, before packets reach your server. Your server only ever sees clean, legitimate traffic. Latency overhead is immeasurable — less than 0.1ms.",
  },
  {
    q: "Is DDoS protection included on all plans?",
    a: "Yes, without exception. Every Minecraft, VPS, RDP, and dedicated server plan includes full 480Gbps+ DDoS protection at no additional cost.",
  },
  {
    q: "How quickly does mitigation kick in?",
    a: "Our automated detection and mitigation pipeline fires in under 10 seconds of attack onset. Most mitigation events complete before a human operator would even notice the alert.",
  },
  {
    q: "Can I view attack logs and traffic reports?",
    a: "Yes. Your control panel includes real-time traffic graphs, historical attack summaries, mitigation event logs, and per-IP block reports.",
  },
  {
    q: "What happens if an attack exceeds your capacity?",
    a: "Our global Anycast network distributes absorption across multiple PoPs. There is no single bottleneck. We have never had a capacity-exceeded outage on a protected service.",
  },
];

export default function DDoSPage() {
  const [, navigate] = useLocation();

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="page-ddos">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,rgba(255,255,255,0.05) 0px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,rgba(255,255,255,0.05) 0px,transparent 1px,transparent 40px)",
            }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Enterprise-Grade DDoS Protection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Unbreakable{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)" }}
            >
              DDoS Shield
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-xl text-white/60 max-w-3xl mx-auto mb-10"
          >
            480Gbps+ of inline mitigation, always on, zero configuration required.
            Every BruteScale server is shielded before you even deploy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/minecraft-hosting")}
              className="inline-flex h-12 items-center justify-center px-8 rounded-xl text-sm font-semibold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 50%) 100%)",
                boxShadow: "0 0 24px rgba(59,130,246,0.4)",
              }}
            >
              Get Protected Now
            </button>
            <button
              onClick={() => {
                document.getElementById("ddos-diagram")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex h-12 items-center justify-center px-8 rounded-xl text-sm font-medium text-white/80 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              See How It Works
            </button>
          </motion.div>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {[
              { val: "480Gbps+", label: "Capacity" },
              { val: "<10s", label: "Mitigation" },
              { val: "99.99%", label: "Uptime" },
              { val: "0ms", label: "Added Latency" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2.5"
              >
                <span className="text-base font-bold text-white">{s.val}</span>
                <span className="text-xs text-white/40">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Traffic Diagram (existing component) ─────────────────────────────── */}
      <div id="ddos-diagram">
        <DDoSProtection />
      </div>

      {/* ─── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="text-center"
              >
                <div
                  className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent mb-1"
                  style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-white/40 font-medium tracking-wide uppercase">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Protection Feature Cards ─────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
        </div>
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-mono text-blue-400 uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Multi-Layer Defense
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Every Attack Vector, Covered
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Our protection stack handles L3, L4, and L7 attacks simultaneously — no attack type slips through.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {protectionFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} backdrop-blur-xl p-6 group hover:scale-[1.02] transition-transform duration-300`}
                style={{ boxShadow: `0 0 0 0 ${f.glow}` }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 30px ${f.glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <div className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 ${f.iconColor}`}>
                  <f.icon size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose BruteScale Protection ────────────────────────────────── */}
      <section className="py-24 bg-white/[0.02] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why Choose BruteScale Protection?
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Other hosts bolt on third-party mitigation. We built ours from the ground up.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {whyPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-blue-500/30 transition-colors duration-300"
              >
                <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle size={14} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{p.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold text-center text-white mb-14"
          >
            DDoS Protection FAQ
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {ddosFaqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-card/30 border border-border/50 rounded-lg px-6 hover:border-primary/50 transition-colors data-[state=open]:border-primary/50"
                >
                  <AccordionTrigger className="text-left font-semibold text-base text-white hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-background to-violet-600/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-gradient-to-r from-blue-600 to-violet-600 opacity-10 blur-[80px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-12 md:p-16"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.2))", border: "1px solid rgba(59,130,246,0.3)" }}>
                <Shield size={28} className="text-blue-400" />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Deploy, Already Protected
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
              Every BruteScale server launches with 480Gbps+ DDoS protection active.
              No setup. No upcharges. No surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/minecraft-hosting")}
                className="inline-flex h-13 items-center justify-center px-10 rounded-xl text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 50%) 100%)",
                  boxShadow: "0 0 32px rgba(59,130,246,0.4), 0 0 64px rgba(59,130,246,0.15)",
                }}
              >
                Start Hosting
              </button>
              <button
                onClick={() => navigate("/vps-hosting")}
                className="inline-flex h-13 items-center justify-center px-10 rounded-xl text-base font-medium text-white/80 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                View VPS Plans
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
