import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Youtube, Instagram, MessageSquare, ExternalLink, Calendar, User, Play, Star } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

type ReviewType = "youtube" | "instagram" | "discord";

interface Review {
  id: number;
  type: ReviewType;
  visible: number;
  sortOrder: number;
  thumbnailUrl: string | null;
  title: string | null;
  creator: string | null;
  uploadDate: string | null;
  videoUrl: string | null;
  caption: string | null;
  reelUrl: string | null;
  screenshotUrl: string | null;
  reviewer: string | null;
  message: string | null;
  createdAt: string;
}

const CATEGORIES = [
  {
    key: "youtube" as ReviewType,
    label: "YouTube Reviews",
    icon: Youtube,
    color: "text-red-400",
    border: "border-red-500/40",
    activeBg: "bg-red-500/15",
    activeBorder: "border-red-500/60",
    dot: "bg-red-400",
  },
  {
    key: "instagram" as ReviewType,
    label: "Instagram Reviews",
    icon: Instagram,
    color: "text-pink-400",
    border: "border-pink-500/40",
    activeBg: "bg-pink-500/15",
    activeBorder: "border-pink-500/60",
    dot: "bg-pink-400",
  },
  {
    key: "discord" as ReviewType,
    label: "Discord Reviews",
    icon: MessageSquare,
    color: "text-indigo-400",
    border: "border-indigo-500/40",
    activeBg: "bg-indigo-500/15",
    activeBorder: "border-indigo-500/60",
    dot: "bg-indigo-400",
  },
];

function EmptyState({ type }: { type: ReviewType }) {
  const cat = CATEGORIES.find((c) => c.key === type)!;
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <cat.icon size={26} className={cat.color} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No reviews yet</h3>
      <p className="text-sm text-white/40 max-w-xs">
        {type === "youtube" && "YouTube video reviews will appear here once added by the admin."}
        {type === "instagram" && "Instagram reel reviews will appear here once added by the admin."}
        {type === "discord" && "Discord screenshot reviews will appear here once added by the admin."}
      </p>
    </div>
  );
}

function YoutubeCard({ review }: { review: Review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden hover:border-red-500/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-black/40 overflow-hidden">
        {review.thumbnailUrl ? (
          <img
            src={review.thumbnailUrl}
            alt={review.title || "YouTube review"}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube size={36} className="text-white/20" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-red-500/90 flex items-center justify-center shadow-lg">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5 text-[10px] text-white/80 font-medium">
          <Youtube size={10} className="text-red-400" /> YouTube
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-3 leading-snug">
          {review.title || "Untitled Review"}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <User size={11} />
            <span className="truncate max-w-[120px]">{review.creator || "Unknown"}</span>
          </div>
          {review.uploadDate && (
            <div className="flex items-center gap-1 text-xs text-white/40">
              <Calendar size={11} />
              <span>{review.uploadDate}</span>
            </div>
          )}
        </div>
        {review.videoUrl ? (
          <a
            href={review.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-9 rounded-lg text-xs font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.25), rgba(220,38,38,0.15))",
              border: "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <Play size={13} className="text-red-400" />
            Watch Video
            <ExternalLink size={11} className="text-white/40 ml-auto" />
          </a>
        ) : (
          <div className="h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-xs text-white/30">
            No link provided
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InstagramCard({ review }: { review: Review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden hover:border-pink-500/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(236,72,153,0.08)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-black/40 overflow-hidden">
        {review.thumbnailUrl ? (
          <img
            src={review.thumbnailUrl}
            alt={review.creator || "Instagram review"}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Instagram size={36} className="text-white/20" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5 text-[10px] text-white/80 font-medium">
          <Instagram size={10} className="text-pink-400" /> Instagram
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70 mb-3">
          <User size={12} />
          {review.creator || "Unknown"}
        </div>
        {review.caption && (
          <p className="text-xs text-white/50 leading-relaxed line-clamp-3 mb-4">
            {review.caption}
          </p>
        )}
        {review.reelUrl ? (
          <a
            href={review.reelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-9 rounded-lg text-xs font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(219,39,119,0.15))",
              border: "1px solid rgba(236,72,153,0.35)",
            }}
          >
            <Instagram size={13} className="text-pink-400" />
            Open Reel
            <ExternalLink size={11} className="text-white/40 ml-auto" />
          </a>
        ) : (
          <div className="h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-xs text-white/30">
            No link provided
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DiscordCard({ review }: { review: Review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden hover:border-indigo-500/30 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]"
    >
      {/* Screenshot */}
      {review.screenshotUrl && (
        <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
          <img
            src={review.screenshotUrl}
            alt="Discord review screenshot"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5 text-[10px] text-white/80 font-medium">
            <MessageSquare size={10} className="text-indigo-400" /> Discord
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-5">
        {!review.screenshotUrl && (
          <div className="flex items-center gap-1 text-xs text-indigo-400 mb-3">
            <MessageSquare size={12} /> Discord
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
            {(review.reviewer || "U")[0].toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-semibold text-white/80">{review.reviewer || "Anonymous"}</div>
            {review.uploadDate && (
              <div className="text-[10px] text-white/30 flex items-center gap-1">
                <Calendar size={9} />{review.uploadDate}
              </div>
            )}
          </div>
        </div>
        {review.message && (
          <div className="rounded-xl bg-white/5 border border-white/8 p-3">
            <p className="text-xs text-white/60 leading-relaxed line-clamp-4 italic">
              "{review.message}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ReviewsPage() {
  const [activeCategory, setActiveCategory] = useState<ReviewType>("youtube");

  const { data, isLoading } = useQuery<{ reviews: Review[] }>({
    queryKey: ["reviews", activeCategory],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?type=${activeCategory}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const reviews = data?.reviews ?? [];

  const activeCat = CATEGORIES.find((c) => c.key === activeCategory)!;

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="page-reviews">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full bg-violet-600/8 blur-[100px]" />
          <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full bg-blue-600/8 blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400 mb-5">
              <Star size={13} className="text-violet-400" />
              Community Reviews
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            What Our Community Says
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto"
          >
            Real reviews from real users across YouTube, Instagram, and Discord.
          </motion.p>
        </div>
      </section>

      {/* ─── Main Content ─────────────────────────────────────────────────────── */}
      <section className="py-8 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Sidebar (desktop) / Tab bar (mobile) ─────────────────────── */}
            <aside className="lg:w-64 flex-shrink-0">
              {/* Mobile: horizontal tabs */}
              <div className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      activeCategory === cat.key
                        ? `${cat.activeBg} ${cat.activeBorder} ${cat.color}`
                        : "border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <cat.icon size={15} />
                    {cat.label.replace(" Reviews", "")}
                  </button>
                ))}
              </div>

              {/* Desktop: vertical sidebar */}
              <div className="hidden lg:block sticky top-24 rounded-2xl border border-white/8 bg-white/[0.03] p-3 backdrop-blur-xl">
                <div className="text-xs font-mono text-white/30 tracking-widest uppercase px-3 py-2 mb-1">
                  Categories
                </div>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border transition-all duration-200 mb-1.5 last:mb-0 ${
                      activeCategory === cat.key
                        ? `${cat.activeBg} ${cat.activeBorder} ${cat.color}`
                        : `border-transparent text-white/50 hover:text-white hover:bg-white/5`
                    }`}
                  >
                    <cat.icon size={16} />
                    <span>{cat.label}</span>
                    {activeCategory === cat.key && (
                      <span className={`ml-auto w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                    )}
                  </button>
                ))}

                {/* Decorative divider */}
                <div className="mt-4 pt-4 border-t border-white/5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-white/30 font-mono">Live Reviews</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Reviews Grid ─────────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Category header */}
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 mb-6"
              >
                <activeCat.icon size={20} className={activeCat.color} />
                <h2 className="text-lg font-bold text-white">{activeCat.label}</h2>
                <span className="ml-auto text-xs text-white/30 font-mono">
                  {isLoading ? "..." : `${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
                </span>
              </motion.div>

              {/* Loading skeleton */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden animate-pulse">
                      <div className="aspect-video bg-white/5" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-white/8 rounded w-3/4" />
                        <div className="h-3 bg-white/8 rounded w-1/2" />
                        <div className="h-8 bg-white/5 rounded-lg mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cards grid */}
              {!isLoading && reviews.length === 0 && (
                <EmptyState type={activeCategory} />
              )}

              {!isLoading && reviews.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {reviews.map((review, i) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                      >
                        {activeCategory === "youtube" && <YoutubeCard review={review} />}
                        {activeCategory === "instagram" && <InstagramCard review={review} />}
                        {activeCategory === "discord" && <DiscordCard review={review} />}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
