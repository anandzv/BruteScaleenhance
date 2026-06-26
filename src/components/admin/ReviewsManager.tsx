import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, Youtube, Instagram, MessageSquare, Star } from "lucide-react";
import { Toast, ConfirmDialog, GlassInput, GlassTextarea, GlassSelect, Card, SectionHeader, SaveButton, Modal } from "./shared";

interface Review {
  id: number; type: string; visible: number; sortOrder: number;
  thumbnailUrl: string | null; title: string | null; creator: string | null;
  uploadDate: string | null; videoUrl: string | null; caption: string | null;
  reelUrl: string | null; screenshotUrl: string | null; reviewer: string | null;
  message: string | null; rating: number | null; createdAt: string;
}

const TABS = [
  { id: "youtube",   label: "YouTube",   icon: Youtube,       color: "#ff0000" },
  { id: "instagram", label: "Instagram", icon: Instagram,     color: "#e1306c" },
  { id: "discord",   label: "Discord",   icon: MessageSquare, color: "#5865f2" },
];

function extractYTId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
}

function ytThumb(id: string) {
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
}

const EMPTY_FORM = {
  videoUrl: "", title: "", creator: "", uploadDate: "",
  thumbnailUrl: "", caption: "", reelUrl: "", screenshotUrl: "",
  reviewer: "", message: "", rating: "5", sortOrder: "0", visible: true,
};

export default function ReviewsManager({ token }: { token: string }) {
  const [tab, setTab] = useState("youtube");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<null | "add" | number>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/reviews/admin", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json() as { reviews?: Review[] };
      setReviews(d.reviews ?? []);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const tabReviews = reviews.filter(r => r.type === tab);

  const openAdd = () => { setForm({ ...EMPTY_FORM }); setModal("add"); };
  const openEdit = (r: Review) => {
    setForm({
      videoUrl: r.videoUrl ?? "", title: r.title ?? "", creator: r.creator ?? "",
      uploadDate: r.uploadDate ?? "", thumbnailUrl: r.thumbnailUrl ?? "",
      caption: r.caption ?? "", reelUrl: r.reelUrl ?? "",
      screenshotUrl: r.screenshotUrl ?? "", reviewer: r.reviewer ?? "",
      message: r.message ?? "", rating: String(r.rating ?? 5),
      sortOrder: String(r.sortOrder), visible: r.visible === 1,
    });
    setModal(r.id);
  };

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleVideoUrl = (url: string) => {
    set("videoUrl", url);
    const id = extractYTId(url);
    if (id && !form.thumbnailUrl) set("thumbnailUrl", ytThumb(id));
  };

  const buildPayload = () => {
    const base = {
      type: tab, visible: form.visible ? 1 : 0,
      sortOrder: Number(form.sortOrder) || 0,
      thumbnailUrl: form.thumbnailUrl || null,
      title: form.title || null, creator: form.creator || null,
      uploadDate: form.uploadDate || null, videoUrl: form.videoUrl || null,
      caption: form.caption || null, reelUrl: form.reelUrl || null,
      screenshotUrl: form.screenshotUrl || null,
      reviewer: form.reviewer || null, message: form.message || null,
      rating: Number(form.rating) || 5,
    };
    return base;
  };

  const save = async () => {
    setSaving(true);
    try {
      const isEdit = typeof modal === "number";
      const url = isEdit ? `/api/reviews/${modal}` : "/api/reviews";
      const method = isEdit ? "PATCH" : "POST";
      const r = await fetch(url, {
        method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (r.ok) {
        setToast({ msg: isEdit ? "Review updated." : "Review added.", type: "success" });
        setModal(null);
        load();
      } else {
        const e = await r.json() as { error?: string };
        setToast({ msg: e.error ?? "Failed to save.", type: "error" });
      }
    } finally { setSaving(false); }
  };

  const toggleVisible = async (rev: Review) => {
    await fetch(`/api/reviews/${rev.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ visible: rev.visible === 1 ? 0 : 1 }),
    });
    setReviews(rs => rs.map(r => r.id === rev.id ? { ...r, visible: r.visible === 1 ? 0 : 1 } : r));
  };

  const deleteReview = async (id: number) => {
    const r = await fetch(`/api/reviews/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { setToast({ msg: "Review deleted.", type: "success" }); setReviews(rs => rs.filter(r => r.id !== id)); }
    else setToast({ msg: "Delete failed.", type: "error" });
    setConfirmId(null);
  };

  const activeTab = TABS.find(t => t.id === tab)!;

  return (
    <div>
      <SectionHeader title="Reviews Manager" subtitle="Manage YouTube, Instagram, and Discord reviews" />
      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}
      {confirmId !== null && <ConfirmDialog msg="Permanently delete this review?" onConfirm={() => deleteReview(confirmId)} onCancel={() => setConfirmId(null)} />}

      {modal !== null && (
        <AnimatePresence>
          <Modal title={typeof modal === "number" ? "Edit Review" : `Add ${activeTab.label} Review`} onClose={() => setModal(null)}>
            <div className="space-y-4">
              {tab === "youtube" && (
                <>
                  <GlassInput label="YouTube Video URL" value={form.videoUrl} onChange={handleVideoUrl} placeholder="https://youtube.com/watch?v=..." />
                  {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="thumb" className="w-full h-32 object-cover rounded-xl opacity-80" />}
                  <GlassInput label="Thumbnail URL (auto-filled)" value={form.thumbnailUrl} onChange={v => set("thumbnailUrl", v)} placeholder="https://img.youtube.com/..." />
                  <GlassInput label="Video Title" value={form.title} onChange={v => set("title", v)} placeholder="Amazing Minecraft Hosting Review" />
                  <GlassInput label="Creator Name" value={form.creator} onChange={v => set("creator", v)} placeholder="TechReviewer" />
                  <GlassInput label="Upload Date" value={form.uploadDate} onChange={v => set("uploadDate", v)} placeholder="Jan 15, 2025" />
                  <GlassTextarea label="Description" value={form.caption} onChange={v => set("caption", v)} rows={2} placeholder="Short description..." />
                </>
              )}
              {tab === "instagram" && (
                <>
                  <GlassInput label="Reel / Post URL" value={form.reelUrl} onChange={v => set("reelUrl", v)} placeholder="https://www.instagram.com/reel/..." />
                  <GlassInput label="Thumbnail URL" value={form.thumbnailUrl} onChange={v => set("thumbnailUrl", v)} placeholder="https://..." />
                  {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="thumb" className="w-full h-32 object-cover rounded-xl opacity-80" />}
                  <GlassInput label="Creator / @username" value={form.creator} onChange={v => set("creator", v)} placeholder="@username" />
                  <GlassTextarea label="Caption" value={form.caption} onChange={v => set("caption", v)} rows={3} placeholder="Post caption..." />
                </>
              )}
              {tab === "discord" && (
                <>
                  <GlassInput label="Screenshot URL" value={form.screenshotUrl} onChange={v => set("screenshotUrl", v)} placeholder="https://... (upload in Media first)" />
                  {form.screenshotUrl && <img src={form.screenshotUrl} alt="screenshot" className="w-full h-32 object-cover rounded-xl opacity-80" />}
                  <GlassInput label="Reviewer Username" value={form.reviewer} onChange={v => set("reviewer", v)} placeholder="Username#0000" />
                  <GlassTextarea label="Review Message" value={form.message} onChange={v => set("message", v)} rows={3} placeholder="Great hosting service..." />
                  <GlassSelect label="Rating" value={form.rating} onChange={v => set("rating", v)}
                    options={[5,4,3,2,1].map(n => ({ value: String(n), label: "★".repeat(n) + " " + n + " / 5" }))} />
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Sort Order" value={form.sortOrder} onChange={v => set("sortOrder", v)} type="number" placeholder="0" />
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">Visibility</label>
                  <button onClick={() => set("visible", !form.visible)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: form.visible ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${form.visible ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, color: form.visible ? "#34d399" : "rgba(255,255,255,0.4)" }}>
                    {form.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    {form.visible ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <SaveButton loading={saving} onClick={save} label={typeof modal === "number" ? "Update Review" : "Add Review"} />
              </div>
            </div>
          </Modal>
        </AnimatePresence>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? `${t.color}18` : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? t.color + "40" : "rgba(255,255,255,0.08)"}`,
                color: active ? t.color : "rgba(255,255,255,0.45)",
              }}>
              <Icon size={14} />
              {t.label}
              <span className="ml-1 text-xs opacity-60">{reviews.filter(r => r.type === t.id).length}</span>
            </button>
          );
        })}
        <button onClick={load} className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white border border-white/8 hover:border-white/20 transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 0 16px rgba(99,102,241,0.3)" }}>
          <Plus size={14} /> Add
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12 text-white/30 text-sm">Loading reviews...</div>
        ) : tabReviews.length === 0 ? (
          <div className="text-center py-12 text-white/25 text-sm">No {activeTab.label} reviews yet. Click Add to create one.</div>
        ) : (
          <div className="space-y-3">
            {tabReviews.map(rev => (
              <motion.div key={rev.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-white/3"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                {(rev.thumbnailUrl || rev.screenshotUrl) && (
                  <img src={rev.thumbnailUrl ?? rev.screenshotUrl ?? ""} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0 opacity-80" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{rev.title ?? rev.reviewer ?? rev.creator ?? "Untitled"}</div>
                  <div className="text-white/35 text-xs truncate mt-0.5">
                    {rev.creator ?? rev.reviewer ?? ""}
                    {rev.rating && tab === "discord" && (
                      <span className="ml-2 text-yellow-400">{"★".repeat(rev.rating)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: rev.visible ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)", color: rev.visible ? "#34d399" : "rgba(255,255,255,0.3)", border: `1px solid ${rev.visible ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"}` }}>
                    {rev.visible ? "Live" : "Hidden"}
                  </span>
                  <button onClick={() => toggleVisible(rev)} title="Toggle visibility" className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors">
                    {rev.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button onClick={() => openEdit(rev)} className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setConfirmId(rev.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
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
