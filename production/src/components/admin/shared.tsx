import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check, Save, RefreshCw } from "lucide-react";

export function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-2xl"
      style={{
        background: type === "success"
          ? "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.2))"
          : "linear-gradient(135deg,rgba(239,68,68,0.2),rgba(185,28,28,0.2))",
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

export function ConfirmDialog({ msg, onConfirm, onCancel, confirmLabel = "Delete", confirmColor = "#dc2626" }: {
  msg: string; onConfirm: () => void; onCancel: () => void; confirmLabel?: string; confirmColor?: string;
}) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-6 max-w-sm w-full mx-4"
        style={{ background: "linear-gradient(135deg,rgba(8,14,36,0.98),rgba(5,9,24,0.99))", border: "1px solid rgba(239,68,68,0.3)", backdropFilter: "blur(24px)" }}>
        <div className="text-white font-semibold mb-2">Confirm Action</div>
        <p className="text-white/55 text-sm mb-6">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-9 rounded-lg border border-white/10 bg-white/5 text-sm text-white/70 hover:text-white transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 h-9 rounded-lg text-sm font-semibold text-white transition-all" style={{ background: `linear-gradient(135deg,${confirmColor},${confirmColor}cc)` }}>{confirmLabel}</button>
        </div>
      </motion.div>
    </div>
  );
}

export function GlassInput({ label, value, onChange, type = "text", placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all disabled:opacity-50"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.45)"; }}
        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );
}

export function GlassSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
        style={{ background: "rgba(20,25,55,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function GlassTextarea({ label, value, onChange, rows = 3, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all resize-none"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.45)"; }}
        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-6 ${className}`}
      style={{ background: "linear-gradient(135deg,rgba(10,18,48,0.75),rgba(6,10,28,0.85))", border: "1px solid rgba(59,130,246,0.14)", backdropFilter: "blur(20px)" }}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm">{subtitle}</p>}
    </div>
  );
}

export function SaveButton({ loading, onClick, label = "Save Changes" }: { loading?: boolean; onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
      style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
      {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
      {loading ? "Saving..." : label}
    </button>
  );
}

export function Badge({ children, color = "#3b82f6" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
      {children}
    </span>
  );
}

export function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-[9990] flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(8,14,36,0.99),rgba(5,9,24,1))", border: "1px solid rgba(59,130,246,0.2)", backdropFilter: "blur(24px)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"><X size={16} /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}
