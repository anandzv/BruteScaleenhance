import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Settings, Globe, Home, FileText, Palette,
  Search, Users, Activity, LogOut, ChevronRight, Save, Trash2,
  RefreshCw, Shield, Wifi, MessageSquare, X, Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AdminStats {
  totalUsers: number; totalLogs: number; totalServices: number;
  totalLocations: number; websiteStatus: string; discordStatus: string;
}
interface UserRow {
  id: number; username: string; email: string; createdAt: string;
}
interface LogRow {
  id: number; action: string; details: string | null; adminEmail: string; createdAt: string;
}

// ─── Sidebar sections ──────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",   label: "Dashboard",       icon: LayoutDashboard },
  { id: "discord",     label: "Discord Settings", icon: MessageSquare },
  { id: "homepage",    label: "Homepage",         icon: Home },
  { id: "network",     label: "Network",          icon: Globe },
  { id: "docs",        label: "Docs Manager",     icon: FileText },
  { id: "appearance",  label: "Appearance",       icon: Palette },
  { id: "seo",         label: "SEO",              icon: Search },
  { id: "users",       label: "Users",            icon: Users },
  { id: "logs",        label: "Activity Logs",    icon: Activity },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-2xl"
      style={{
        background: type === "success" ? "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.2))" : "linear-gradient(135deg,rgba(239,68,68,0.2),rgba(185,28,28,0.2))",
        border: `1px solid ${type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
        backdropFilter: "blur(20px)",
      }}
    >
      {type === "success" ? <Check size={15} className="text-emerald-400 shrink-0" /> : <X size={15} className="text-red-400 shrink-0" />}
      {msg}
      <button onClick={onClose} className="ml-2 text-white/40 hover:text-white/80"><X size={12} /></button>
    </motion.div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl p-6 max-w-sm w-full mx-4"
        style={{ background: "linear-gradient(135deg,rgba(8,14,36,0.98),rgba(5,9,24,0.99))", border: "1px solid rgba(239,68,68,0.3)", backdropFilter: "blur(24px)" }}>
        <div className="text-white font-semibold mb-2">Confirm Action</div>
        <p className="text-white/55 text-sm mb-6">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-9 rounded-lg border border-white/10 bg-white/5 text-sm text-white/70 hover:text-white transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 h-9 rounded-lg text-sm font-semibold text-white transition-all" style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Glass input ──────────────────────────────────────────────────────────────
function GlassInput({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.45)"; }}
        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );
}

function GlassTextarea({ label, value, onChange, rows = 3, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all resize-none"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.45)"; }}
        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-6 ${className}`}
      style={{ background: "linear-gradient(135deg,rgba(10,18,48,0.75),rgba(6,10,28,0.85))", border: "1px solid rgba(59,130,246,0.14)", backdropFilter: "blur(20px)" }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm">{subtitle}</p>}
    </div>
  );
}

function SaveButton({ loading, onClick, label = "Save Changes" }: { loading?: boolean; onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
      style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
      {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
      {loading ? "Saving..." : label}
    </button>
  );
}

// ─── Dashboard Section ────────────────────────────────────────────────────────
function DashboardSection({ stats }: { stats: AdminStats | null }) {
  const cards = [
    { emoji: "👥", label: "Total Users", value: stats?.totalUsers ?? "—", color: "#3b82f6" },
    { emoji: "🌐", label: "Active Locations", value: stats?.totalLocations ?? 3, color: "#22c55e" },
    { emoji: "🛠️", label: "Hosting Services", value: stats?.totalServices ?? 6, color: "#8b5cf6" },
    { emoji: "💬", label: "Discord Status", value: stats?.discordStatus ?? "—", color: "#5865f2" },
    { emoji: "🌍", label: "Website Status", value: stats?.websiteStatus ?? "—", color: "#22c55e" },
    { emoji: "📋", label: "Activity Logs", value: stats?.totalLogs ?? "—", color: "#f59e0b" },
  ];
  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Overview of your BruteScale admin panel" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card>
              <div className="text-2xl mb-3">{c.emoji}</div>
              <div className="text-2xl font-bold text-white mb-1" style={{ color: c.color }}>{c.value}</div>
              <div className="text-white/40 text-xs font-medium uppercase tracking-wide">{c.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} className="text-emerald-400" />
          <span className="text-white font-semibold">System Status</span>
        </div>
        <div className="space-y-3">
          {[
            { label: "API Server", status: "Operational", color: "#22c55e" },
            { label: "Database", status: "Operational", color: "#22c55e" },
            { label: "Authentication", status: "Operational", color: "#22c55e" },
            { label: "Admin Panel", status: "Operational", color: "#22c55e" },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-white/60 text-sm">{s.label}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}30` }}>{s.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Settings Form Section ────────────────────────────────────────────────────
function SettingsSection({
  title, subtitle, fields, values, onChange, onSave, saving,
}: {
  title: string; subtitle?: string;
  fields: { key: string; label: string; type?: string; placeholder?: string; textarea?: boolean; rows?: number }[];
  values: Record<string, string>; onChange: (k: string, v: string) => void;
  onSave: () => void; saving: boolean;
}) {
  return (
    <div>
      <SectionHeader title={title} subtitle={subtitle} />
      <Card>
        <div className="space-y-5 mb-6">
          {fields.map(f => f.textarea
            ? <GlassTextarea key={f.key} label={f.label} value={values[f.key] ?? ""} onChange={v => onChange(f.key, v)} rows={f.rows} placeholder={f.placeholder} />
            : <GlassInput key={f.key} label={f.label} value={values[f.key] ?? ""} onChange={v => onChange(f.key, v)} type={f.type} placeholder={f.placeholder} />
          )}
        </div>
        <SaveButton loading={saving} onClick={onSave} />
      </Card>
    </div>
  );
}

// ─── Users Section ────────────────────────────────────────────────────────────
function UsersSection({ token }: { token: string }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json() as { users?: UserRow[] };
      setUsers(d.users ?? []);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const deleteUser = async (id: number) => {
    const r = await fetch(`/api/admin/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { setToast({ msg: "User deleted.", type: "success" }); setUsers(u => u.filter(x => x.id !== id)); }
    else setToast({ msg: "Failed to delete.", type: "error" });
    setConfirm(null);
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="User Management" subtitle="View and manage registered users" />
      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}
      {confirm !== null && <ConfirmDialog msg="This will permanently delete the user account." onConfirm={() => deleteUser(confirm)} onCancel={() => setConfirm(null)} />}
      <Card>
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder-white/25 outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
        {loading ? (
          <div className="text-center py-12 text-white/30 text-sm">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-white/30 uppercase tracking-wide">User</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-white/30 uppercase tracking-wide">Email</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-white/30 uppercase tracking-wide hidden sm:table-cell">Joined</th>
                  <th className="py-3 px-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-10 text-white/25 text-sm">No users found.</td></tr>
                )}
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
                          {u.username[0].toUpperCase()}
                        </div>
                        <span className="text-white font-medium truncate max-w-[100px]">{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-white/50 truncate max-w-[160px]">{u.email}</td>
                    <td className="py-3 px-2 text-white/30 text-xs hidden sm:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => setConfirm(u.id)} className="text-red-400/60 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Logs Section ─────────────────────────────────────────────────────────────
function LogsSection({ token }: { token: string }) {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/logs", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json() as { logs?: LogRow[] };
      setLogs(d.logs ?? []);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const clearLogs = async () => {
    setClearing(true);
    const r = await fetch("/api/admin/logs", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { setLogs([]); setToast({ msg: "Logs cleared.", type: "success" }); }
    else setToast({ msg: "Failed to clear logs.", type: "error" });
    setClearing(false);
    setConfirm(false);
  };

  const actionColor = (a: string) => {
    if (a.includes("Deleted") || a.includes("Delete")) return "#ef4444";
    if (a.includes("Login")) return "#22c55e";
    return "#3b82f6";
  };

  return (
    <div>
      <SectionHeader title="Activity Logs" subtitle="Recent administrator actions" />
      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}
      {confirm && <ConfirmDialog msg="This will permanently delete all activity logs." onConfirm={clearLogs} onCancel={() => setConfirm(false)} />}
      <Card>
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <span className="text-white/40 text-sm">{logs.length} entries</span>
          <div className="flex gap-2">
            <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white border border-white/10 transition-colors">
              <RefreshCw size={12} /> Refresh
            </button>
            <button onClick={() => setConfirm(true)} disabled={clearing || logs.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400/70 hover:text-red-400 border border-red-500/15 hover:border-red-500/30 transition-colors disabled:opacity-40">
              <Trash2 size={12} /> Clear All
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-white/30 text-sm">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-white/25 text-sm">No activity logs yet.</div>
        ) : (
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {logs.map(l => (
              <div key={l.id} className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-white/3 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: actionColor(l.action), boxShadow: `0 0 6px ${actionColor(l.action)}80` }} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{l.action}</div>
                  {l.details && <div className="text-white/35 text-xs mt-0.5 truncate">{l.details}</div>}
                  <div className="text-white/25 text-xs mt-0.5">{l.adminEmail} · {new Date(l.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [, navigate] = useLocation();
  const { user, token, logout } = useAuth();
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── Guard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!user.isAdmin) { navigate("/"); }
  }, [user, navigate]);

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !user?.isAdmin) return;
    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then((d: AdminStats) => setStats(d)).catch(() => {});
    fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then((d: { settings?: Record<string, string> }) => { if (d.settings) setSettings(d.settings); }).catch(() => {});
  }, [token, user]);

  const setSetting = (k: string, v: string) => setSettings(s => ({ ...s, [k]: v }));

  const writeLog = useCallback(async (action: string, details?: string) => {
    if (!token || !user) return;
    await fetch("/api/admin/logs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action, details, adminEmail: user.email }),
    }).catch(() => {});
  }, [token, user]);

  const saveSettings = useCallback(async (keys: string[], logAction: string) => {
    if (!token) return;
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      keys.forEach(k => { payload[k] = settings[k] ?? ""; });
      const r = await fetch("/api/admin/settings/bulk", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });
      if (r.ok) {
        setToast({ msg: "Settings saved.", type: "success" });
        await writeLog(logAction, `Updated: ${keys.join(", ")}`);
      } else { setToast({ msg: "Failed to save.", type: "error" }); }
    } catch { setToast({ msg: "Network error.", type: "error" }); }
    finally { setSaving(false); }
  }, [token, settings, writeLog]);

  const handleLogout = () => { writeLog("Admin Logout"); logout(); navigate("/"); };

  if (!user?.isAdmin) return null;

  // ── Section config ─────────────────────────────────────────────────────────
  const discordFields = [
    { key: "discord_invite", label: "Discord Invite Link", placeholder: "https://discord.gg/..." },
    { key: "discord_button_text", label: "Discord Button Text", placeholder: "Join Discord" },
    { key: "discord_ticket_link", label: "Purchase Ticket Link", placeholder: "https://discord.gg/..." },
    { key: "discord_server_name", label: "Support Server Name", placeholder: "BruteScale" },
  ];
  const homepageFields = [
    { key: "hero_title", label: "Hero Title", placeholder: "Power Without Limits" },
    { key: "hero_subtitle", label: "Hero Subtitle", textarea: true, rows: 2, placeholder: "Military-grade hosting..." },
    { key: "announcement_badge", label: "Announcement Badge Text", placeholder: "New Enterprise Hardware Deployed" },
    { key: "start_hosting_btn", label: "Start Hosting Button Text", placeholder: "Start Hosting" },
    { key: "view_plans_btn", label: "View Plans Button Text", placeholder: "View Plans" },
    { key: "stat_uptime", label: "Uptime SLA Value", placeholder: "99.9%" },
    { key: "stat_ddos", label: "DDoS Protection Value", placeholder: "480Gbps" },
    { key: "stat_support", label: "Support Hours", placeholder: "24/7" },
  ];
  const networkFields = [
    { key: "dc_india_status", label: "India Status", placeholder: "Online" },
    { key: "dc_india_uptime", label: "India Uptime", placeholder: "99.99%" },
    { key: "dc_india_latency", label: "India Latency", placeholder: "<12ms" },
    { key: "dc_singapore_status", label: "Singapore Status", placeholder: "Online" },
    { key: "dc_singapore_uptime", label: "Singapore Uptime", placeholder: "99.99%" },
    { key: "dc_singapore_latency", label: "Singapore Latency", placeholder: "<8ms" },
    { key: "dc_dubai_status", label: "Dubai Status", placeholder: "Online" },
    { key: "dc_dubai_uptime", label: "Dubai Uptime", placeholder: "99.99%" },
    { key: "dc_dubai_latency", label: "Dubai Latency", placeholder: "<18ms" },
  ];
  const docsFields = [
    { key: "docs_hero_title", label: "Docs Hero Title", placeholder: "BruteScale Documentation" },
    { key: "docs_hero_subtitle", label: "Docs Hero Subtitle", textarea: true, rows: 2, placeholder: "Everything you need to know..." },
    { key: "docs_getting_started", label: "Getting Started Content", textarea: true, rows: 4, placeholder: "Welcome to BruteScale..." },
    { key: "docs_billing_content", label: "Billing Content", textarea: true, rows: 3, placeholder: "We accept UPI, Bank Transfer..." },
    { key: "docs_faq_1_q", label: "FAQ 1 Question", placeholder: "How long does deployment take?" },
    { key: "docs_faq_1_a", label: "FAQ 1 Answer", textarea: true, rows: 2, placeholder: "..." },
  ];
  const appearanceFields = [
    { key: "app_primary_color", label: "Primary Color (hex)", placeholder: "#3b82f6" },
    { key: "app_secondary_color", label: "Secondary Color (hex)", placeholder: "#8b5cf6" },
    { key: "app_footer_text", label: "Footer Text", placeholder: "BruteScale — Premium Hosting" },
    { key: "app_copyright", label: "Copyright Text", placeholder: "© 2025 BruteScale" },
    { key: "app_logo_text", label: "Logo Text", placeholder: "BruteScale" },
    { key: "app_glow_strength", label: "Glow Strength (0–1)", placeholder: "0.5" },
  ];
  const seoFields = [
    { key: "seo_title", label: "Website Title", placeholder: "BruteScale — Premium Hosting" },
    { key: "seo_description", label: "Meta Description", textarea: true, rows: 2, placeholder: "Military-grade hosting..." },
    { key: "seo_keywords", label: "Keywords", placeholder: "minecraft hosting, vps, rdp, dedicated servers" },
    { key: "seo_og_image", label: "Open Graph Image URL", placeholder: "https://..." },
    { key: "seo_twitter_card", label: "Twitter Card Type", placeholder: "summary_large_image" },
    { key: "seo_google_verify", label: "Google Verification Code", placeholder: "google-site-verification=..." },
  ];

  // ── Render section content ─────────────────────────────────────────────────
  const renderContent = () => {
    switch (section) {
      case "dashboard": return <DashboardSection stats={stats} />;
      case "discord":
        return <SettingsSection title="Discord Settings" subtitle="Manage Discord links and button text across the website"
          fields={discordFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(discordFields.map(f => f.key), "Discord Settings Updated")} saving={saving} />;
      case "homepage":
        return <SettingsSection title="Homepage Content" subtitle="Edit hero section, stats, and call-to-action text"
          fields={homepageFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(homepageFields.map(f => f.key), "Homepage Settings Updated")} saving={saving} />;
      case "network":
        return <SettingsSection title="Network Locations" subtitle="Manage datacenter status and latency display"
          fields={networkFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(networkFields.map(f => f.key), "Network Settings Updated")} saving={saving} />;
      case "docs":
        return <SettingsSection title="Documentation Manager" subtitle="Edit docs page headings, content, and FAQs"
          fields={docsFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(docsFields.map(f => f.key), "Docs Settings Updated")} saving={saving} />;
      case "appearance":
        return <SettingsSection title="Appearance Settings" subtitle="Customize colors, logo, and footer"
          fields={appearanceFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(appearanceFields.map(f => f.key), "Appearance Settings Updated")} saving={saving} />;
      case "seo":
        return <SettingsSection title="SEO Settings" subtitle="Manage meta tags, open graph, and search engine settings"
          fields={seoFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(seoFields.map(f => f.key), "SEO Settings Updated")} saving={saving} />;
      case "users": return token ? <UsersSection token={token} /> : null;
      case "logs": return token ? <LogsSection token={token} /> : null;
      default: return null;
    }
  };

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "p-4" : "p-6 h-full flex flex-col"}>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
          <Shield size={14} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">BruteScale</div>
          <div className="text-white/30 text-xs">Admin Panel</div>
        </div>
      </div>

      <nav className="space-y-0.5 flex-1">
        {NAV.map(item => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <button key={item.id} onClick={() => { setSection(item.id); setMobileSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200"
              style={{
                background: active ? "linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.15))" : "transparent",
                border: active ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                color: active ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                boxShadow: active ? "0 0 14px rgba(99,102,241,0.12)" : "none",
              }}>
              <Icon size={15} className="shrink-0" style={{ color: active ? "#818cf8" : "rgba(255,255,255,0.28)" }} />
              {item.label}
              {active && <ChevronRight size={12} className="ml-auto text-indigo-400/60" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-white/8 space-y-1">
        <button onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
          <Home size={14} /> Back to Site
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-colors">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden" data-testid="page-admin">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 20% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)" }} />

      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 relative z-10"
        style={{ background: "linear-gradient(180deg,rgba(6,10,28,0.95),rgba(4,7,20,0.98))", borderRight: "1px solid rgba(59,130,246,0.1)" }}>
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden overflow-y-auto"
              style={{ background: "linear-gradient(180deg,rgba(6,10,28,0.99),rgba(4,7,20,1))", borderRight: "1px solid rgba(59,130,246,0.15)" }}>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 relative z-10 shrink-0"
          style={{ background: "rgba(4,7,20,0.8)", borderBottom: "1px solid rgba(59,130,246,0.08)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
              <Settings size={18} />
            </button>
            <div>
              <div className="text-white font-semibold text-sm">{NAV.find(n => n.id === section)?.label ?? "Admin Panel"}</div>
              <div className="text-white/25 text-xs hidden sm:block">BruteScale Admin · {user.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-full"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
              <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <span className="hidden sm:inline">All Systems Operational</span>
              <span className="sm:hidden">Online</span>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
