import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Eye, EyeOff, RefreshCw, Plus, Trash2 } from "lucide-react";
import { Toast, ConfirmDialog, GlassInput, GlassTextarea, Card, SectionHeader, SaveButton, Modal, Badge } from "./shared";

interface Service {
  id: number; slug: string; name: string; icon: string;
  description: string | null; features: string[]; pricingLink: string | null;
  orderUrl: string | null; imageUrl: string | null; visible: number; sortOrder: number;
}

const EMPTY: Partial<Service> & { featuresText: string } = {
  slug: "", name: "", icon: "🖥️", description: "", pricingLink: "", orderUrl: "", imageUrl: "", visible: 1, sortOrder: 0, featuresText: "",
};

export default function ServicesManager({ token }: { token: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<null | "add" | number>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/services-config/admin", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json() as { services?: Service[] };
      setServices(d.services ?? []);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const openEdit = (s: Service) => {
    setForm({ ...s, featuresText: (s.features ?? []).join("\n") });
    setModal(s.id);
  };

  const openAdd = () => { setForm({ ...EMPTY }); setModal("add"); };

  const save = async () => {
    if (!form.name) return setToast({ msg: "Name is required.", type: "error" });
    setSaving(true);
    try {
      const features = (form.featuresText || "").split("\n").map(s => s.trim()).filter(Boolean);
      const payload = { ...form, features };
      delete (payload as Record<string, unknown>).featuresText;
      const isEdit = typeof modal === "number";
      const r = await fetch(isEdit ? `/api/services-config/${modal}` : "/api/services-config", {
        method: isEdit ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        setToast({ msg: isEdit ? "Service updated." : "Service created.", type: "success" });
        setModal(null); load();
      } else {
        const e = await r.json() as { error?: string };
        setToast({ msg: e.error ?? "Save failed.", type: "error" });
      }
    } finally { setSaving(false); }
  };

  const toggleVisible = async (s: Service) => {
    const visible = s.visible ? 0 : 1;
    await fetch(`/api/services-config/${s.id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ visible }) });
    setServices(ss => ss.map(x => x.id === s.id ? { ...x, visible } : x));
  };

  const deleteService = async (id: number) => {
    const r = await fetch(`/api/services-config/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { setToast({ msg: "Service deleted.", type: "success" }); setServices(ss => ss.filter(s => s.id !== id)); }
    else setToast({ msg: "Delete failed.", type: "error" });
    setConfirmId(null);
  };

  return (
    <div>
      <SectionHeader title="Services Manager" subtitle="Manage the hosting services shown on your website" />
      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}
      {confirmId !== null && <ConfirmDialog msg="Delete this service card?" onConfirm={() => deleteService(confirmId)} onCancel={() => setConfirmId(null)} />}

      {modal !== null && (
        <AnimatePresence>
          <Modal title={typeof modal === "number" ? "Edit Service" : "Add Service"} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <GlassInput label="Icon (emoji)" value={form.icon as string} onChange={v => set("icon", v)} placeholder="⛏️" />
                <div className="col-span-2">
                  <GlassInput label="Service Name" value={form.name as string} onChange={v => set("name", v)} placeholder="Minecraft Hosting" />
                </div>
              </div>
              {modal === "add" && (
                <GlassInput label="Slug (unique ID)" value={form.slug as string} onChange={v => set("slug", v)} placeholder="minecraft" />
              )}
              <GlassTextarea label="Description" value={form.description as string} onChange={v => set("description", v)} rows={2} placeholder="High-performance hosting with DDoS protection..." />
              <GlassTextarea label="Features (one per line)" value={form.featuresText as string} onChange={v => set("featuresText", v)} rows={4} placeholder={"DDoS Protection\nInstant Setup\n24/7 Support"} />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Pricing Page URL" value={form.pricingLink as string} onChange={v => set("pricingLink", v)} placeholder="/minecraft-hosting" />
                <GlassInput label="Order Button URL" value={form.orderUrl as string} onChange={v => set("orderUrl", v)} placeholder="https://discord.gg/..." />
              </div>
              <GlassInput label="Image URL (optional)" value={form.imageUrl as string} onChange={v => set("imageUrl", v)} placeholder="https://..." />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Sort Order" value={String(form.sortOrder ?? 0)} onChange={v => set("sortOrder", Number(v))} type="number" />
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">Visibility</label>
                  <button onClick={() => set("visible", form.visible ? 0 : 1)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: form.visible ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${form.visible ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, color: form.visible ? "#34d399" : "rgba(255,255,255,0.4)" }}>
                    {form.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    {form.visible ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <SaveButton loading={saving} onClick={save} label={typeof modal === "number" ? "Update Service" : "Create Service"} />
              </div>
            </div>
          </Modal>
        </AnimatePresence>
      )}

      <div className="flex justify-end gap-2 mb-6">
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white border border-white/8 transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }}>
          <Plus size={14} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/30 text-sm">Loading services...</div>
      ) : (
        <div className="grid gap-4">
          {services.map(s => (
            <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{s.name}</span>
                      <Badge color={s.visible ? "#22c55e" : "#6b7280"}>{s.visible ? "Visible" : "Hidden"}</Badge>
                    </div>
                    <p className="text-white/45 text-sm mb-2">{s.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(s.features ?? []).map((f, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full text-white/50" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => toggleVisible(s)} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors">
                      {s.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setConfirmId(s.id)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
