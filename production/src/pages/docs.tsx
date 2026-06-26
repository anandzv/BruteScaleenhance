import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, CreditCard, Rocket, HeadphonesIcon, ArrowRightLeft,
  Shield, Globe, HelpCircle, BookOpen, ChevronDown, Menu, X,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

// ─── Sidebar sections ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "getting-started",  label: "Getting Started",  icon: BookOpen },
  { id: "how-to-buy",       label: "How To Buy",        icon: ShoppingCart },
  { id: "billing",          label: "Billing",           icon: CreditCard },
  { id: "deployment",       label: "Deployment",        icon: Rocket },
  { id: "support",          label: "Support",           icon: HeadphonesIcon },
  { id: "migration",        label: "Migration",         icon: ArrowRightLeft },
  { id: "security",         label: "Security",          icon: Shield },
  { id: "network",          label: "Network",           icon: Globe },
  { id: "faq",              label: "FAQ",               icon: HelpCircle },
];

// ─── Scroll helper ─────────────────────────────────────────────────────────────
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Discord / Ticket buttons (reused in hero + CTA) ──────────────────────────
function DiscordButton({ size = "md" }: { size?: "md" | "lg" }) {
  const cls = size === "lg"
    ? "h-12 px-7 text-base font-bold"
    : "h-10 px-5 text-sm font-semibold";
  return (
    <motion.a
      href="https://discord.gg/A23a2GtWWb"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      className={`inline-flex items-center gap-2.5 ${cls} rounded-xl text-white transition-all duration-300`}
      style={{
        background: "linear-gradient(135deg, rgba(88,101,242,0.22) 0%, rgba(59,130,246,0.18) 100%)",
        border: "1px solid rgba(88,101,242,0.4)",
        boxShadow: "0 0 20px rgba(88,101,242,0.18)",
      }}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
      Join Discord
    </motion.a>
  );
}

function TicketButton({ size = "md" }: { size?: "md" | "lg" }) {
  const cls = size === "lg"
    ? "h-12 px-7 text-base font-bold"
    : "h-10 px-5 text-sm font-semibold";
  return (
    <motion.a
      href="https://discord.gg/A23a2GtWWb"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      className={`inline-flex items-center gap-2.5 ${cls} rounded-xl text-white transition-all duration-300 relative overflow-hidden`}
      style={{
        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
        boxShadow: "0 0 24px rgba(99,102,241,0.45), 0 0 48px rgba(99,102,241,0.15)",
      }}
    >
      <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
      <ShoppingCart className="w-4 h-4 relative" />
      <span className="relative">Open Purchase Ticket</span>
    </motion.a>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function DocSection({ id, title, children, badge }: { id: string; title: string; children: React.ReactNode; badge?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="mb-20 scroll-mt-28"
    >
      {badge && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {badge}
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-3" style={{ borderBottom: "1px solid rgba(59,130,246,0.12)" }}>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

// ─── Glass card ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(10,18,48,0.75) 0%, rgba(6,10,28,0.85) 100%)",
        border: "1px solid rgba(59,130,246,0.18)",
        boxShadow: "0 0 24px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Timeline step ────────────────────────────────────────────────────────────
function TimelineStep({ step, title, children, last = false }: { step: number; title: string; children?: React.ReactNode; last?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: step * 0.05 }}
      className="flex gap-5"
    >
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 0 16px rgba(99,102,241,0.5)",
          }}
        >
          {step}
        </div>
        {!last && <div className="w-px flex-1 mt-2" style={{ background: "linear-gradient(to bottom, rgba(99,102,241,0.4), transparent)", minHeight: 32 }} />}
      </div>
      <div className="pb-7">
        <div className="text-white font-semibold mb-1.5">{title}</div>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Accordion item ───────────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="rounded-xl overflow-hidden mb-3"
      style={{
        background: "linear-gradient(135deg, rgba(10,18,48,0.7) 0%, rgba(6,10,28,0.8) 100%)",
        border: open ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(59,130,246,0.12)",
        boxShadow: open ? "0 0 20px rgba(99,102,241,0.12)" : "none",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-medium text-sm md:text-base hover:text-white/90 transition-colors"
      >
        {q}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-white/40 shrink-0 ml-3" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-white/55 leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Deployment card ──────────────────────────────────────────────────────────
function DeployCard({ emoji, service, time }: { emoji: string; service: string; time: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      className="rounded-xl p-4 flex items-center justify-between gap-3"
      style={{
        background: "linear-gradient(135deg, rgba(10,18,48,0.8) 0%, rgba(6,10,28,0.9) 100%)",
        border: "1px solid rgba(99,102,241,0.2)",
        boxShadow: "0 0 20px rgba(99,102,241,0.07)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <span className="text-white font-medium text-sm">{service}</span>
      </div>
      <span
        className="text-xs font-bold px-3 py-1.5 rounded-lg"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))",
          border: "1px solid rgba(99,102,241,0.3)",
          color: "#a5b4fc",
        }}
      >
        {time}
      </span>
    </motion.div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────
function SearchBar({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <div className="relative mb-6">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search documentation..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 bg-transparent outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.4)"; }}
        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onSelect, query, setQuery }: {
  active: string; onSelect: (id: string) => void; query: string; setQuery: (v: string) => void;
}) {
  const filtered = SECTIONS.filter(s => s.label.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="h-full">
      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 px-1">Documentation</div>
      <SearchBar query={query} setQuery={setQuery} />
      <nav className="space-y-0.5">
        {filtered.map(s => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => { onSelect(s.id); scrollTo(s.id); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200"
              style={{
                background: isActive ? "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(124,58,237,0.14))" : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.28)" : "1px solid transparent",
                color: isActive ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                boxShadow: isActive ? "0 0 12px rgba(99,102,241,0.12)" : "none",
              }}
            >
              <Icon size={15} className="shrink-0" style={{ color: isActive ? "#818cf8" : "rgba(255,255,255,0.3)" }} />
              {s.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Docs() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Track active section on scroll
  useEffect(() => {
    const handler = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveSection(s.id);
          return;
        }
      }
      setActiveSection("getting-started");
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="page-docs">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <BookOpen size={13} />
              Documentation Center
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              BruteScale{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                Documentation
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Everything you need to know before purchasing a server. Learn how ordering, deployment, billing, support, migrations, and infrastructure work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <DiscordButton size="lg" />
              <TicketButton size="lg" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body: sidebar + content ── */}
      <div className="container mx-auto px-6 max-w-7xl pb-24">

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileSidebarOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 bg-white/5"
          >
            {mobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            {mobileSidebarOpen ? "Close Menu" : "Browse Sections"}
          </button>
          <AnimatePresence>
            {mobileSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3 rounded-2xl p-5"
                style={{ background: "rgba(6,10,28,0.95)", border: "1px solid rgba(59,130,246,0.15)", backdropFilter: "blur(20px)" }}
              >
                <Sidebar
                  active={activeSection}
                  onSelect={(id) => { setActiveSection(id); setMobileSidebarOpen(false); }}
                  query={searchQuery}
                  setQuery={setSearchQuery}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-10">
          {/* Sticky sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(8,14,36,0.85) 0%, rgba(5,9,24,0.9) 100%)", border: "1px solid rgba(59,130,246,0.1)", backdropFilter: "blur(20px)" }}>
              <Sidebar active={activeSection} onSelect={setActiveSection} query={searchQuery} setQuery={setSearchQuery} />
            </div>
          </aside>

          {/* Main content */}
          <main ref={mainRef} className="flex-1 min-w-0">

            {/* §1 Getting Started */}
            <DocSection id="getting-started" title="Getting Started" badge="Welcome">
              <GlassCard hover={false}>
                <p className="text-white/65 leading-relaxed mb-4">
                  Welcome to BruteScale. Our mission is to provide premium game hosting, VPS infrastructure, RDP hosting, dedicated servers, and web hosting with enterprise-grade hardware and premium support.
                </p>
                <p className="text-white/65 leading-relaxed">
                  Whether you're hosting a Minecraft network, Discord bot, production website, or business application, our team is here to help. This documentation covers everything you need from your first server order to ongoing management.
                </p>
              </GlassCard>
            </DocSection>

            {/* §2 How To Buy */}
            <DocSection id="how-to-buy" title="How To Buy A Server" badge="Purchase Process">
              <div className="space-y-0">
                <TimelineStep step={1} title="Click the Discord button on any page." />
                <TimelineStep step={2} title="Join the official BruteScale Discord Server." />
                <TimelineStep step={3} title="Create a Purchase Ticket." />
                <TimelineStep step={4} title="Talk directly with our hosting specialists." />
                <TimelineStep step={5} title="Tell us what service you need.">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Minecraft Hosting","VPS Hosting","RDP Hosting","Dedicated Servers","Discord Bot Hosting","Web Hosting"].map(s => (
                      <span key={s} className="text-xs px-3 py-1.5 rounded-lg font-medium text-blue-300" style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(59,130,246,0.22)" }}>{s}</span>
                    ))}
                  </div>
                </TimelineStep>
                <TimelineStep step={6} title="Our team recommends the best hardware according to your requirements and budget." />
                <TimelineStep step={7} title="If available, we can provide a temporary demo server so you can test performance, latency, and panel before purchasing." />
                <TimelineStep step={8} title="After confirmation, our billing team generates your invoice." />
                <TimelineStep step={9} title="Complete your payment." />
                <TimelineStep step={10} title="Receive instantly:" last>
                  <div className="mt-2 space-y-1.5">
                    {["Panel Login","Server IP","Login Credentials","Invoice","Setup Instructions"].map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm text-white/60">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs">✓</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </TimelineStep>
              </div>
            </DocSection>

            {/* §3 Billing */}
            <DocSection id="billing" title="Billing & Payments" badge="Payments">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { emoji: "📱", label: "UPI", desc: "Fast, instant bank transfers via UPI" },
                  { emoji: "🏦", label: "Bank Transfer", desc: "Direct bank transfer accepted" },
                  { emoji: "💬", label: "Other Methods", desc: "Additional options via support team" },
                ].map(m => (
                  <GlassCard key={m.label}>
                    <div className="text-2xl mb-2">{m.emoji}</div>
                    <div className="text-white font-semibold mb-1">{m.label}</div>
                    <div className="text-white/45 text-sm">{m.desc}</div>
                  </GlassCard>
                ))}
              </div>
              <GlassCard hover={false}>
                <ul className="space-y-2.5 text-sm text-white/60">
                  <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Every successful purchase receives a proper invoice.</li>
                  <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Renewal reminders are sent before your service expires.</li>
                  <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Contact our billing team on Discord for any payment queries.</li>
                </ul>
              </GlassCard>
            </DocSection>

            {/* §4 Deployment */}
            <DocSection id="deployment" title="Deployment Times" badge="Infrastructure">
              <div className="space-y-3">
                <DeployCard emoji="🎮" service="Minecraft Hosting" time="5–15 Minutes" />
                <DeployCard emoji="💻" service="VPS Hosting" time="10–30 Minutes" />
                <DeployCard emoji="🖥️" service="RDP Hosting" time="10–30 Minutes" />
                <DeployCard emoji="⚙️" service="Dedicated Servers" time="30–120 Minutes" />
                <DeployCard emoji="🌐" service="Web Hosting" time="5–10 Minutes" />
                <DeployCard emoji="🤖" service="Discord Bot Hosting" time="5–10 Minutes" />
              </div>
            </DocSection>

            {/* §5 Support */}
            <DocSection id="support" title="24/7 Customer Support" badge="Support">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { emoji: "🔧", label: "Technical Support", desc: "Server issues, crashes, performance problems" },
                  { emoji: "💳", label: "Billing Support", desc: "Invoices, renewals, payment queries" },
                  { emoji: "🛒", label: "Purchase Assistance", desc: "Help choosing the right plan & hardware" },
                  { emoji: "🔄", label: "Migration Help", desc: "Moving from another provider" },
                  { emoji: "⚡", label: "Performance Optimization", desc: "Tuning & configuration assistance" },
                  { emoji: "🔍", label: "Server Troubleshooting", desc: "Diagnostics and debugging help" },
                  { emoji: "🎫", label: "Discord Ticket Support", desc: "Raise tickets for any topic instantly" },
                  { emoji: "📚", label: "Knowledge Base", desc: "Guides, tutorials, and setup docs" },
                ].map(c => (
                  <GlassCard key={c.label}>
                    <div className="text-2xl mb-2">{c.emoji}</div>
                    <div className="text-white font-semibold text-sm mb-1">{c.label}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{c.desc}</div>
                  </GlassCard>
                ))}
              </div>
            </DocSection>

            {/* §6 Migration */}
            <DocSection id="migration" title="Free Migration Assistance" badge="Migrations">
              <GlassCard hover={false} className="mb-5">
                <p className="text-white/65 text-sm leading-relaxed">
                  BruteScale helps migrate your servers from other providers with minimal downtime. Our team handles the technical details so you can switch without disrupting your players or users.
                </p>
              </GlassCard>
              <div className="mb-3 text-xs font-bold text-white/30 uppercase tracking-widest">Supported Platforms</div>
              <div className="flex flex-wrap gap-2">
                {["Paper","Purpur","Spigot","Fabric","Forge","Velocity","BungeeCord","Pterodactyl","Node.js Applications"].map(p => (
                  <motion.span
                    key={p}
                    whileHover={{ scale: 1.05 }}
                    className="text-xs px-3.5 py-2 rounded-xl font-medium text-indigo-300 cursor-default"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}
                  >
                    {p}
                  </motion.span>
                ))}
              </div>
            </DocSection>

            {/* §7 Security */}
            <DocSection id="security" title="Enterprise Security" badge="Security">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { emoji: "🛡️", label: "Enterprise DDoS Protection", desc: "480Gbps mitigation capacity" },
                  { emoji: "💾", label: "Automatic Backups", desc: "Regular snapshots of your data" },
                  { emoji: "🔥", label: "Firewall Protection", desc: "Advanced rules & traffic filtering" },
                  { emoji: "🏢", label: "Secure Infrastructure", desc: "Tier 3+ certified datacenters" },
                  { emoji: "👁️", label: "24/7 Monitoring", desc: "Real-time alerts and threat detection" },
                  { emoji: "🔒", label: "Encrypted Connections", desc: "End-to-end encrypted control panels" },
                ].map(c => (
                  <GlassCard key={c.label}>
                    <div className="text-2xl mb-3">{c.emoji}</div>
                    <div className="text-white font-semibold text-sm mb-1.5">{c.label}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{c.desc}</div>
                  </GlassCard>
                ))}
              </div>
            </DocSection>

            {/* §8 Network */}
            <DocSection id="network" title="Global Network" badge="Infrastructure">
              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  { flag: "🇮🇳", country: "India", city: "Mumbai", color: "#3b82f6", features: ["Premium low latency routing", "99.99% uptime", "NVMe infrastructure"] },
                  { flag: "🇦🇪", country: "Dubai", city: "Dubai, UAE", color: "#8b5cf6", features: ["Premium routing", "99.99% uptime", "NVMe infrastructure"] },
                  { flag: "🇸🇬", country: "Singapore", city: "Singapore", color: "#22c55e", features: ["Enterprise routing", "99.99% uptime", "NVMe infrastructure"] },
                ].map(n => (
                  <motion.div
                    key={n.country}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(10,18,48,0.85) 0%, rgba(6,10,28,0.92) 100%)",
                      border: `1px solid ${n.color}30`,
                      boxShadow: `0 0 28px ${n.color}10`,
                    }}
                  >
                    <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${n.color}80, transparent)` }} />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{n.flag}</span>
                        <div>
                          <div className="text-white font-bold">{n.country}</div>
                          <div className="text-white/35 text-xs">{n.city}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                          <motion.div className="w-2 h-2 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ boxShadow: "0 0 6px #22c55e" }} />
                          <span className="text-emerald-400 text-xs font-semibold">Online</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {n.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm text-white/55">
                            <div className="w-1 h-1 rounded-full shrink-0" style={{ background: n.color }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </DocSection>

            {/* §9 FAQ */}
            <DocSection id="faq" title="Frequently Asked Questions" badge="FAQ">
              {[
                { q: "How long does deployment take?", a: "Minecraft and web hosting deploy in 5–15 minutes. VPS and RDP take 10–30 minutes. Dedicated servers are provisioned within 30–120 minutes depending on hardware availability." },
                { q: "Can I upgrade my plan later?", a: "Yes. Contact our support team on Discord and we'll help you upgrade your server resources at any time. Upgrades are typically applied within a few hours." },
                { q: "Can I install plugins?", a: "Absolutely. You get full access to your server panel (Pterodactyl) where you can install any compatible plugins for Paper, Spigot, Purpur, and other server types." },
                { q: "Can I install mods?", a: "Yes. Fabric and Forge server types are fully supported. You can install mods directly through your panel or via SFTP access." },
                { q: "Do I receive full admin access?", a: "Yes. You receive full admin and operator access to your game server, as well as panel access to manage files, backups, databases, and startup parameters." },
                { q: "Can I migrate from another host?", a: "Yes. We offer free migration assistance. Just open a ticket on Discord and our team will handle the migration with minimal downtime." },
                { q: "Do you provide ongoing support?", a: "Yes. Our support team is available 24/7 via Discord tickets. We help with technical issues, performance tuning, plugin configuration, and more." },
                { q: "How do renewals work?", a: "You'll receive a renewal reminder before your service expires. Pay the invoice through our billing team to continue uninterrupted service." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </DocSection>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative rounded-3xl overflow-hidden p-10 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(10,18,48,0.9) 0%, rgba(20,12,50,0.9) 100%)",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 0 60px rgba(99,102,241,0.1)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Deploy Your Server?</h2>
                <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed mb-8">
                  Need help choosing the right plan? Join our Discord server and speak directly with our hosting specialists. We'll answer your questions, recommend the best server for your needs, and guide you through the complete purchase process.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <DiscordButton size="lg" />
                  <TicketButton size="lg" />
                </div>
              </div>
            </motion.div>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
