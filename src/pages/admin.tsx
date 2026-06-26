import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Settings, Globe, Home, FileText, Palette,
  Search, Users, Activity, LogOut, ChevronRight, Save, Trash2,
  RefreshCw, Shield, MessageSquare, X, Check, Star, Package,
  Server, Image as ImageIcon, Menu, Zap, BookOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ReviewsManager  from "@/components/admin/ReviewsManager";
import PlansManager    from "@/components/admin/PlansManager";
import ServicesManager from "@/components/admin/ServicesManager";
import DocsManager     from "@/components/admin/DocsManager";
import MediaManager    from "@/components/admin/MediaManager";
import { Toast, ConfirmDialog, GlassInput, GlassTextarea, Card, SectionHeader, SaveButton } from "@/components/admin/shared";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AdminStats {
  totalUsers: number; totalLogs: number; totalReviews: number;
  totalPlans: number; totalDocs: number; totalServices: number;
  totalLocations: number; websiteStatus: string; discordStatus: string;
}
interface UserRow  { id: number; username: string; email: string; createdAt: string; }
interface LogRow   { id: number; action: string; details: string | null; adminEmail: string; createdAt: string; }

// ─── Sidebar nav ───────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard",    icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "reviews",  label: "Reviews",       icon: Star },
      { id: "plans",    label: "Plans",         icon: Package },
      { id: "services", label: "Services",      icon: Server },
      { id: "docs",     label: "Docs",          icon: BookOpen },
      { id: "media",    label: "Media",         icon: ImageIcon },
    ],
  },
  {
    label: "Editors",
    items: [
      { id: "homepage", label: "Homepage",      icon: Home },
      { id: "ddos",     label: "DDoS Editor",   icon: Shield },
      { id: "network",  label: "Network",       icon: Globe },
    ],
  },
  {
    label: "System",
    items: [
      { id: "users",    label: "Users",         icon: Users },
      { id: "settings", label: "Settings",      icon: Settings },
      { id: "logs",     label: "Activity Logs", icon: Activity },
    ],
  },
];

const ALL_NAV = NAV_GROUPS.flatMap(g => g.items);

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
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white border border-white/10 transition-colors">
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
                  {["User","Email","Joined",""].map(h => (
                    <th key={h} className={`text-left py-3 px-2 text-xs font-semibold text-white/30 uppercase tracking-wide${h === "Joined" ? " hidden sm:table-cell" : ""}`}>{h}</th>
                  ))}
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
    setClearing(false); setConfirm(false);
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

// ─── Dashboard Section ────────────────────────────────────────────────────────
function DashboardSection({ stats, onNavigate }: { stats: AdminStats | null; onNavigate: (s: string) => void }) {
  const cards = [
    { emoji: "👥", label: "Total Users",    value: stats?.totalUsers ?? "—",   color: "#3b82f6", section: "users" },
    { emoji: "⭐", label: "Reviews",        value: stats?.totalReviews ?? "—",  color: "#f59e0b", section: "reviews" },
    { emoji: "📦", label: "Plans",          value: stats?.totalPlans ?? "—",    color: "#8b5cf6", section: "plans" },
    { emoji: "🌐", label: "Services",       value: stats?.totalServices ?? 6,   color: "#22c55e", section: "services" },
    { emoji: "📚", label: "Docs",           value: stats?.totalDocs ?? "—",     color: "#06b6d4", section: "docs" },
    { emoji: "📋", label: "Activity Logs",  value: stats?.totalLogs ?? "—",     color: "#6366f1", section: "logs" },
  ];
  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Overview of your BruteScale admin panel" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            onClick={() => onNavigate(c.section)} className="text-left">
            <Card className="hover:border-indigo-500/30 transition-colors cursor-pointer">
              <div className="text-2xl mb-3">{c.emoji}</div>
              <div className="text-2xl font-bold mb-1" style={{ color: c.color }}>{c.value}</div>
              <div className="text-white/40 text-xs font-medium uppercase tracking-wide">{c.label}</div>
            </Card>
          </motion.button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} className="text-emerald-400" />
            <span className="text-white font-semibold">System Status</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "API Server",      status: "Operational", color: "#22c55e" },
              { label: "Database",        status: "Operational", color: "#22c55e" },
              { label: "Authentication",  status: "Operational", color: "#22c55e" },
              { label: "Media Uploads",   status: "Operational", color: "#22c55e" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/60 text-sm">{s.label}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}30` }}>{s.status}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Zap size={18} className="text-yellow-400" />
            <span className="text-white font-semibold">Quick Actions</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Add Review",      section: "reviews",  color: "#f59e0b" },
              { label: "Create Plan",     section: "plans",    color: "#8b5cf6" },
              { label: "Upload Media",    section: "media",    color: "#3b82f6" },
              { label: "New Doc",         section: "docs",     color: "#06b6d4" },
            ].map(a => (
              <button key={a.section} onClick={() => onNavigate(a.section)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-left transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-white/70">{a.label}</span>
                <ChevronRight size={14} style={{ color: a.color }} />
              </button>
            ))}
          </div>
        </Card>
      </div>
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

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!user.isAdmin) { navigate("/"); }
  }, [user, navigate]);

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

  const navTo = (s: string) => { setSection(s); setMobileSidebarOpen(false); };

  if (!user?.isAdmin) return null;

  // ── Field configs ──────────────────────────────────────────────────────────
  const homepageFields = [
    { key: "hero_title",       label: "Hero Title",            placeholder: "Power Without Limits" },
    { key: "hero_subtitle",    label: "Hero Subtitle",         textarea: true, rows: 2, placeholder: "Military-grade hosting..." },
    { key: "announcement_badge", label: "Announcement Badge", placeholder: "New Enterprise Hardware Deployed" },
    { key: "start_hosting_btn", label: "Start Hosting Button", placeholder: "Start Hosting" },
    { key: "view_plans_btn",   label: "View Plans Button",     placeholder: "View Plans" },
    { key: "stat_uptime",      label: "Uptime SLA",            placeholder: "99.9%" },
    { key: "stat_ddos",        label: "DDoS Protection Value", placeholder: "480Gbps" },
    { key: "stat_support",     label: "Support Hours",         placeholder: "24/7" },
  ];

  const ddosFields = [
    { key: "ddos_hero_title",    label: "DDoS Hero Title",    placeholder: "Unbreakable DDoS Shield" },
    { key: "ddos_hero_subtitle", label: "DDoS Hero Subtitle", textarea: true, rows: 2, placeholder: "480Gbps+ of inline mitigation..." },
    { key: "ddos_capacity",      label: "Capacity Value",     placeholder: "480Gbps+" },
    { key: "ddos_mitigation",    label: "Mitigation Time",    placeholder: "<10s" },
    { key: "ddos_uptime",        label: "Uptime Value",       placeholder: "99.99%" },
    { key: "ddos_latency",       label: "Added Latency",      placeholder: "0ms" },
    { key: "ddos_cta_title",     label: "CTA Title",          placeholder: "Ready for Unbreakable Hosting?" },
    { key: "ddos_cta_subtitle",  label: "CTA Subtitle",       textarea: true, rows: 2, placeholder: "Join thousands of..." },
  ];

  const networkFields = [
    { key: "dc_india_status",      label: "India Status",     placeholder: "Online" },
    { key: "dc_india_uptime",      label: "India Uptime",     placeholder: "99.99%" },
    { key: "dc_india_latency",     label: "India Latency",    placeholder: "<12ms" },
    { key: "dc_singapore_status",  label: "Singapore Status", placeholder: "Online" },
    { key: "dc_singapore_uptime",  label: "Singapore Uptime", placeholder: "99.99%" },
    { key: "dc_singapore_latency", label: "Singapore Latency",placeholder: "<8ms" },
    { key: "dc_dubai_status",      label: "Dubai Status",     placeholder: "Online" },
    { key: "dc_dubai_uptime",      label: "Dubai Uptime",     placeholder: "99.99%" },
    { key: "dc_dubai_latency",     label: "Dubai Latency",    placeholder: "<18ms" },
  ];

  const settingsFields = [
    { key: "site_name",         label: "Website Name",         placeholder: "BruteScale" },
    { key: "site_tagline",      label: "Tagline",              placeholder: "Premium Hosting" },
    { key: "contact_email",     label: "Contact Email",        placeholder: "support@brutescale.com" },
    { key: "discord_invite",    label: "Discord Invite Link",  placeholder: "https://discord.gg/..." },
    { key: "discord_button_text", label: "Discord Button Text",placeholder: "Join Discord" },
    { key: "app_footer_text",   label: "Footer Text",          placeholder: "BruteScale — Premium Hosting" },
    { key: "app_copyright",     label: "Copyright Text",       placeholder: "© 2025 BruteScale" },
    { key: "app_logo_text",     label: "Logo Text",            placeholder: "BruteScale" },
    { key: "seo_title",         label: "SEO Title",            placeholder: "BruteScale — Premium Hosting" },
    { key: "seo_description",   label: "Meta Description",     textarea: true, rows: 2, placeholder: "Military-grade hosting..." },
    { key: "seo_keywords",      label: "Keywords",             placeholder: "minecraft hosting, vps, rdp" },
    { key: "seo_og_image",      label: "OG Image URL",         placeholder: "https://..." },
    { key: "maintenance_mode",  label: "Maintenance Mode (on/off)", placeholder: "off" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  const renderContent = () => {
    if (!token) return null;
    switch (section) {
      case "dashboard": return <DashboardSection stats={stats} onNavigate={navTo} />;
      case "reviews":   return <ReviewsManager token={token} />;
      case "plans":     return <PlansManager token={token} />;
      case "services":  return <ServicesManager token={token} />;
      case "docs":      return <DocsManager token={token} />;
      case "media":     return <MediaManager token={token} />;
      case "homepage":
        return <SettingsSection title="Homepage Editor" subtitle="Edit hero title, subtitles, stats, and buttons"
          fields={homepageFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(homepageFields.map(f => f.key), "Homepage Settings Updated")} saving={saving} />;
      case "ddos":
        return <SettingsSection title="DDoS Page Editor" subtitle="Edit the DDoS protection page hero, stats, and CTA"
          fields={ddosFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(ddosFields.map(f => f.key), "DDoS Page Settings Updated")} saving={saving} />;
      case "network":
        return <SettingsSection title="Network Locations" subtitle="Manage datacenter status and latency"
          fields={networkFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(networkFields.map(f => f.key), "Network Settings Updated")} saving={saving} />;
      case "users":    return <UsersSection token={token} />;
      case "settings":
        return <SettingsSection title="Site Settings" subtitle="Website name, SEO, Discord, footer, and contact settings"
          fields={settingsFields} values={settings} onChange={setSetting}
          onSave={() => saveSettings(settingsFields.map(f => f.key), "Site Settings Updated")} saving={saving} />;
      case "logs":     return <LogsSection token={token} />;
      default:         return null;
    }
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? "p-4" : "p-5 h-full flex flex-col"} overflow-y-auto`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
          <Shield size={14} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">BruteScale</div>
          <div className="text-white/30 text-xs">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <button key={item.id} onClick={() => navTo(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all duration-200"
                    style={{
                      background: active ? "linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.15))" : "transparent",
                      border: active ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                      color: active ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                      boxShadow: active ? "0 0 14px rgba(99,102,241,0.12)" : "none",
                    }}>
                    <Icon size={14} className="shrink-0" style={{ color: active ? "#818cf8" : "rgba(255,255,255,0.28)" }} />
                    {item.label}
                    {active && <ChevronRight size={12} className="ml-auto text-indigo-400/60" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-6 pt-5 border-t border-white/8 space-y-1">
        <button onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
          <Home size={14} /> Back to Site
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-colors">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden" data-testid="page-admin">
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 20% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)" }} />

      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 relative z-10"
        style={{ background: "linear-gradient(180deg,rgba(6,10,28,0.95),rgba(4,7,20,0.98))", borderRight: "1px solid rgba(59,130,246,0.1)" }}>
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-56 z-50 lg:hidden overflow-y-auto"
              style={{ background: "linear-gradient(180deg,rgba(6,10,28,0.99),rgba(4,7,20,1))", borderRight: "1px solid rgba(59,130,246,0.15)" }}>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 relative z-10 shrink-0"
          style={{ background: "rgba(4,7,20,0.8)", borderBottom: "1px solid rgba(59,130,246,0.08)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
              <Menu size={18} />
            </button>
            <div>
              <div className="text-white font-semibold text-sm">{ALL_NAV.find(n => n.id === section)?.label ?? "Admin Panel"}</div>
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

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
