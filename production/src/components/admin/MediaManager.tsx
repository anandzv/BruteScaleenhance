import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Upload, Trash2, RefreshCw, Copy, Image, Film, FileText, Check } from "lucide-react";
import { Toast, ConfirmDialog, Card, SectionHeader } from "./shared";

interface Media {
  id: number; filename: string; originalName: string | null;
  mimeType: string | null; size: number | null; url: string | null;
  mediaType: string; createdAt: string;
}

function fileIcon(type: string) {
  if (type === "video") return <Film size={20} className="text-purple-400" />;
  if (type === "image") return <Image size={20} className="text-blue-400" />;
  return <FileText size={20} className="text-white/40" />;
}

function formatBytes(b: number | null) {
  if (!b) return "—";
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / 1024 / 1024).toFixed(1) + " MB";
}

export default function MediaManager({ token }: { token: string }) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/media", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json() as { media?: Media[] };
      setMedia(d.media ?? []);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/media/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (r.ok) {
        setToast({ msg: `${file.name} uploaded.`, type: "success" });
        load();
      } else {
        const e = await r.json() as { error?: string };
        setToast({ msg: e.error ?? "Upload failed.", type: "error" });
      }
    } finally { setUploading(false); }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  };

  const deleteMedia = async (id: number) => {
    const r = await fetch(`/api/media/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { setToast({ msg: "File deleted.", type: "success" }); setMedia(m => m.filter(x => x.id !== id)); }
    else setToast({ msg: "Delete failed.", type: "error" });
    setConfirmId(null);
  };

  const copyUrl = (item: Media) => {
    const url = item.url ?? "";
    navigator.clipboard.writeText(url).then(() => {
      setCopied(item.id);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  return (
    <div>
      <SectionHeader title="Media Manager" subtitle="Upload images, screenshots, and videos for use across the site" />
      {toast && <AnimatePresence><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></AnimatePresence>}
      {confirmId !== null && <ConfirmDialog msg="Permanently delete this file?" onConfirm={() => deleteMedia(confirmId)} onCancel={() => setConfirmId(null)} />}

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-2xl p-10 text-center mb-6 transition-all"
        style={{
          background: dragOver ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
          border: `2px dashed ${dragOver ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.1)"}`,
        }}
      >
        <input ref={inputRef} type="file" multiple accept="image/*,video/*,.pdf,.svg,.ico,.gif,.webp"
          className="hidden" onChange={e => handleFiles(e.target.files)} />
        <Upload size={32} className="mx-auto mb-3" style={{ color: dragOver ? "#818cf8" : "rgba(255,255,255,0.2)" }} />
        {uploading ? (
          <p className="text-white/50 text-sm">Uploading...</p>
        ) : (
          <>
            <p className="text-white/50 text-sm font-medium">Drag & drop files here, or click to browse</p>
            <p className="text-white/25 text-xs mt-1">Images, Videos, SVG, GIF, WebP — max 25MB</p>
          </>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/40 text-sm">{media.length} files</span>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white border border-white/8 transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12 text-white/30 text-sm">Loading media...</div>
        ) : media.length === 0 ? (
          <div className="text-center py-12 text-white/25 text-sm">No files yet. Upload your first file above.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl overflow-hidden group relative"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                {/* Preview */}
                <div className="aspect-square flex items-center justify-center overflow-hidden bg-white/3">
                  {item.mediaType === "image" && item.url ? (
                    <img src={item.url} alt={item.originalName ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {fileIcon(item.mediaType)}
                      <span className="text-white/30 text-xs">{item.mediaType}</span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-2.5">
                  <p className="text-white/70 text-xs font-medium truncate">{item.originalName ?? item.filename}</p>
                  <p className="text-white/30 text-xs">{formatBytes(item.size)}</p>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => copyUrl(item)} title="Copy URL"
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs transition-all hover:bg-white/8 text-white/40 hover:text-white">
                      {copied === item.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copied === item.id ? "Copied!" : "Copy URL"}
                    </button>
                    <button onClick={() => setConfirmId(item.id)} className="py-1 px-2 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
