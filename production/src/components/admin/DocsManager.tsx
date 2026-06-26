import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, BookOpen } from "lucide-react";
import { Toast, ConfirmDialog, GlassInput, GlassTextarea, GlassSelect, Card, SectionHeader, SaveButton, Modal, Badge } from "./shared";

interface Doc {
  id: number; category: string; title: string; slug: string | null;
  content: string; published: number; sortOrder: number;
  createdAt: string; updatedAt: string;
}

const CATEGORIES = [
  { value: "general",    label: "General" },
  { value: "getting-started", label: "Getting Started" },
  { value: "billing",    label: "Billing" },
  { value: "minecraft",  label: "Minecraft" },
  { value: "vps",        label: "VPS" },
  { value: "rdp",        label: "RDP" },
  { value: "faq",        label: "FAQ" },
  { value: "other",      label: "Other" },
];

const EMPTY = { category: "general", title: "", slug: "", content: "", published: 0, sortOrder: 0 };

export default function DocsManager({ token }: { token: string }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<null | "add" | number>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/docs/admin", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json() as { docs?: Doc[] };
      setDocs(d.docs ?? []);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm({ ...EMPTY }); setModal("add"); };
  const openEdit = (d: Doc) => { setForm({ category: d.category, title: d.title, slug: d.slug ?? "", content: d.content, published: d.published, sortOrder: d.sortOrder }); setModal(d.id); };

  const save = async () => {
    if (!form.title) return setToast({ msg: "Title is required.", type: "error" });
    if (!form.content) return setToast({ msg: "Content is required.", type: "error" });
    setSaving(true);
    try {
      const isEdit = typeof modal === "number";
      const r = await fetch(isEdit ? `/api/docs/${modal}` : "/api/docs", {
        method: isEdit ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published: form.published ? 1 : 0, sortOrder: Number(form.sortOrder) || 0 }),
      });
      if (r.ok) {
        setToast({ msg: isEdit ? "Doc updated." : "Doc created.", type: "success" });
        setModal(null); load();
      } else {
        const e = await r.json() as { error?: string };
        setToast({ msg: e.error ?? "Save failed.", type: "error" });
      }
    } finally { setSaving(false); }
  };

  const togglePublished = async (doc: Doc) => {
    const published = doc.published ? 0 : 1;
    await fetch(`/api/docs/${doc.id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ published }) });
    setDocs(ds => ds.map(d => d.id === doc.id ? { ...d, published } : d));
  };

  const deleteDoc = async (id: number) => {
    const r = await fetch(`/api/docs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { setToast({ msg: "Doc deleted.", type: "success" }); setDocs(ds => ds.filter(d => d.id !== id)); }
    else setToast({ msg: "Delete failed.", type: "error" });
    setConfirmId(null);
  };

  const filtered = docs
    .filter(d => catFilter === "all" || d.category === catFilter)
    .filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionHeader title="Docs Manager" subtitle="Create and publish documentation articles" />
      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}
      {confirmId !== null && <ConfirmDialog msg="Permanently delete this document?" onConfirm={() => deleteDoc(confirmId)} onCancel={() => setConfirmId(null)} />}

      {modal !== null && (
        <AnimatePresence>
          <Modal title={typeof modal === "number" ? "Edit Document" : "New Document"} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <GlassSelect label="Category" value={form.category} onChange={v => set("category", v)} options={CATEGORIES} />
                <GlassInput label="Sort Order" value={String(form.sortOrder)} onChange={v => set("sortOrder", v)} type="number" placeholder="0" />
              </div>
              <GlassInput label="Title" value={form.title} onChange={v => set("title", v)} placeholder="How to connect to your server" />
              <GlassInput label="Slug (optional)" value={form.slug} onChange={v => set("slug", v)} placeholder="auto-generated-from-title" />
              <GlassTextarea label="Content (Markdown supported)" value={form.content} onChange={v => set("content", v)} rows={10} placeholder={"# Getting Started\n\nWelcome to BruteScale documentation...\n\n## Step 1\n\nConnect to your server using..."} />
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => set("published", form.published ? 0 : 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: form.published ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${form.published ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, color: form.published ? "#34d399" : "rgba(255,255,255,0.4)" }}>
                  {form.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  {form.published ? "Published" : "Draft"}
                </button>
                <SaveButton loading={saving} onClick={save} label={typeof modal === "number" ? "Update Doc" : "Publish Doc"} />
              </div>
            </div>
          </Modal>
        </AnimatePresence>
      )}

      {/* Toolbar */}
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search docs..."
          className="px-3 py-2 rounded-lg text-sm text-white placeholder-white/25 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", minWidth: 160 }} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm text-white outline-none"
          style={{ background: "rgba(20,25,55,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white border border-white/8 transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
        <button onClick={openAdd} className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }}>
          <Plus size={14} /> New Doc
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12 text-white/30 text-sm">Loading docs...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={32} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/25 text-sm">{search ? "No docs match your search." : "No docs yet. Click New Doc to get started."}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(doc => (
              <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-sm font-medium truncate">{doc.title}</span>
                    <Badge color={doc.published ? "#22c55e" : "#6b7280"}>{doc.published ? "Published" : "Draft"}</Badge>
                    <Badge color="#6366f1">{CATEGORIES.find(c => c.value === doc.category)?.label}</Badge>
                  </div>
                  <p className="text-white/30 text-xs truncate">{doc.content.slice(0, 80)}...</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => togglePublished(doc)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors">
                    {doc.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button onClick={() => openEdit(doc)} className="p-1.5 rounded-lg text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setConfirmId(doc.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
