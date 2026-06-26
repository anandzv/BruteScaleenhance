import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, Copy, Star } from "lucide-react";
import { Toast, ConfirmDialog, GlassInput, GlassTextarea, GlassSelect, Card, SectionHeader, SaveButton, Modal, Badge } from "./shared";

interface Plan {
  id: number; service: string; title: string; price: number; currency: string;
  billingPeriod: string; cpu: string | null; ram: string | null; storage: string | null;
  bandwidth: string | null; location: string | null; buttonText: string | null;
  buttonUrl: string | null; features: string[]; badge: string | null;
  popular: number; bgColor: string | null; status: string; sortOrder: number;
}

const SERVICES = [
  { value: "minecraft", label: "Minecraft Hosting" },
  { value: "vps",       label: "VPS Hosting" },
  { value: "rdp",       label: "RDP Hosting" },
  { value: "dedicated", label: "Dedicated Servers" },
  { value: "discord-bot", label: "Discord Bot Hosting" },
  { value: "web",       label: "Web Hosting" },
];

const CURRENCIES = ["INR", "USD", "EUR", "GBP"].map(c => ({ value: c, label: c }));
const PERIODS    = ["monthly","quarterly","yearly","lifetime"].map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }));
const STATUSES   = [{ value: "active", label: "Active" }, { value: "hidden", label: "Hidden" }, { value: "archived", label: "Archived" }];

const EMPTY: Partial<Plan> & { featuresText: string } = {
  service: "minecraft", title: "", price: 0, currency: "INR", billingPeriod: "monthly",
  cpu: "", ram: "", storage: "", bandwidth: "", location: "",
  buttonText: "Order Now", buttonUrl: "", badge: "", bgColor: "",
  popular: 0, status: "active", sortOrder: 0, featuresText: "",
};

export default function PlansManager({ token }: { token: string }) {
  const [serviceFilter, setServiceFilter] = useState("all");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<null | "add" | number>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/plans/admin", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json() as { plans?: Plan[] };
      setPlans(d.plans ?? []);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const filtered = serviceFilter === "all" ? plans : plans.filter(p => p.service === serviceFilter);

  const openAdd = () => {
    setForm({ ...EMPTY, service: serviceFilter === "all" ? "minecraft" : serviceFilter });
    setModal("add");
  };

  const openEdit = (p: Plan) => {
    setForm({ ...p, featuresText: (p.features ?? []).join("\n") });
    setModal(p.id);
  };

  const duplicate = async (p: Plan) => {
    const payload = { ...p, title: p.title + " (Copy)", id: undefined, features: p.features };
    const r = await fetch("/api/plans", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (r.ok) { setToast({ msg: "Plan duplicated.", type: "success" }); load(); }
    else setToast({ msg: "Duplicate failed.", type: "error" });
  };

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title) return setToast({ msg: "Title is required.", type: "error" });
    setSaving(true);
    try {
      const features = (form.featuresText || "").split("\n").map(s => s.trim()).filter(Boolean);
      const payload = { ...form, features, price: Number(form.price) || 0, sortOrder: Number(form.sortOrder) || 0, popular: form.popular ? 1 : 0 };
      delete (payload as Record<string, unknown>).featuresText;
      const isEdit = typeof modal === "number";
      const r = await fetch(isEdit ? `/api/plans/${modal}` : "/api/plans", {
        method: isEdit ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        setToast({ msg: isEdit ? "Plan updated." : "Plan created.", type: "success" });
        setModal(null); load();
      } else {
        const e = await r.json() as { error?: string };
        setToast({ msg: e.error ?? "Save failed.", type: "error" });
      }
    } finally { setSaving(false); }
  };

  const deletePlan = async (id: number) => {
    const r = await fetch(`/api/plans/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { setToast({ msg: "Plan deleted.", type: "success" }); setPlans(ps => ps.filter(p => p.id !== id)); }
    else setToast({ msg: "Delete failed.", type: "error" });
    setConfirmId(null);
  };

  const toggleStatus = async (p: Plan) => {
    const status = p.status === "active" ? "hidden" : "active";
    await fetch(`/api/plans/${p.id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setPlans(ps => ps.map(x => x.id === p.id ? { ...x, status } : x));
  };

  return (
    <div>
      <SectionHeader title="Plans Manager" subtitle="Create and manage hosting plans — they appear on your hosting pages" />
      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}
      {confirmId !== null && <ConfirmDialog msg="Permanently delete this plan?" onConfirm={() => deletePlan(confirmId)} onCancel={() => setConfirmId(null)} />}

      {modal !== null && (
        <AnimatePresence>
          <Modal title={typeof modal === "number" ? "Edit Plan" : "Create Plan"} onClose={() => setModal(null)}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <GlassSelect label="Service" value={form.service as string} onChange={v => set("service", v)} options={SERVICES} />
                <GlassInput label="Plan Title" value={form.title as string} onChange={v => set("title", v)} placeholder="Starter Plan" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <GlassInput label="Price" value={String(form.price ?? "")} onChange={v => set("price", v)} type="number" placeholder="299" />
                <GlassSelect label="Currency" value={form.currency as string} onChange={v => set("currency", v)} options={CURRENCIES} />
                <GlassSelect label="Billing" value={form.billingPeriod as string} onChange={v => set("billingPeriod", v)} options={PERIODS} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label="CPU" value={form.cpu as string} onChange={v => set("cpu", v)} placeholder="2 vCPU" />
                <GlassInput label="RAM" value={form.ram as string} onChange={v => set("ram", v)} placeholder="4GB" />
                <GlassInput label="Storage" value={form.storage as string} onChange={v => set("storage", v)} placeholder="50GB NVMe" />
                <GlassInput label="Bandwidth" value={form.bandwidth as string} onChange={v => set("bandwidth", v)} placeholder="Unlimited" />
              </div>
              <GlassInput label="Location" value={form.location as string} onChange={v => set("location", v)} placeholder="India, Singapore, Dubai" />
              <GlassTextarea label="Features (one per line)" value={form.featuresText as string} onChange={v => set("featuresText", v)} rows={4} placeholder={"DDoS Protection\nInstant Setup\n24/7 Support"} />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Button Text" value={form.buttonText as string} onChange={v => set("buttonText", v)} placeholder="Order Now" />
                <GlassInput label="Button URL" value={form.buttonUrl as string} onChange={v => set("buttonUrl", v)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Badge (e.g. HOT)" value={form.badge as string} onChange={v => set("badge", v)} placeholder="HOT" />
                <GlassSelect label="Status" value={form.status as string} onChange={v => set("status", v)} options={STATUSES} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Sort Order" value={String(form.sortOrder ?? 0)} onChange={v => set("sortOrder", v)} type="number" />
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">Popular</label>
                  <button onClick={() => set("popular", form.popular ? 0 : 1)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: form.popular ? "rgba(250,204,21,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${form.popular ? "rgba(250,204,21,0.3)" : "rgba(255,255,255,0.08)"}`, color: form.popular ? "#fbbf24" : "rgba(255,255,255,0.4)" }}>
                    <Star size={14} fill={form.popular ? "currentColor" : "none"} />
                    {form.popular ? "Popular" : "Not Popular"}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <SaveButton loading={saving} onClick={save} label={typeof modal === "number" ? "Update Plan" : "Create Plan"} />
              </div>
            </div>
          </Modal>
        </AnimatePresence>
      )}

      {/* Filter + Add */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setServiceFilter("all")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ background: serviceFilter === "all" ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${serviceFilter === "all" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, color: serviceFilter === "all" ? "#a5b4fc" : "rgba(255,255,255,0.4)" }}>
          All ({plans.length})
        </button>
        {SERVICES.map(s => (
          <button key={s.value} onClick={() => setServiceFilter(s.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: serviceFilter === s.value ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${serviceFilter === s.value ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, color: serviceFilter === s.value ? "#a5b4fc" : "rgba(255,255,255,0.4)" }}>
            {s.label} ({plans.filter(p => p.service === s.value).length})
          </button>
        ))}
        <button onClick={load} className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white border border-white/8 transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }}>
          <Plus size={14} /> Create Plan
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12 text-white/30 text-sm">Loading plans...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/25 text-sm">No plans found. Click Create Plan to add one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {["Plan","Service","Price","Status","Popular",""].map(h => (
                    <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-white/30 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-2">
                      <div className="text-white font-medium">{p.title}</div>
                      {p.badge && <Badge color="#f59e0b">{p.badge}</Badge>}
                    </td>
                    <td className="py-3 px-2 text-white/50 text-xs">{SERVICES.find(s => s.value === p.service)?.label}</td>
                    <td className="py-3 px-2 text-white/70">{p.currency} {p.price}/{p.billingPeriod}</td>
                    <td className="py-3 px-2">
                      <Badge color={p.status === "active" ? "#22c55e" : "#ef4444"}>{p.status}</Badge>
                    </td>
                    <td className="py-3 px-2">{p.popular ? <Star size={14} className="text-yellow-400" fill="currentColor" /> : <span className="text-white/20">—</span>}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => toggleStatus(p)} title="Toggle" className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors">
                          {p.status === "active" ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button onClick={() => duplicate(p)} title="Duplicate" className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                          <Copy size={13} />
                        </button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setConfirmId(p.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
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
