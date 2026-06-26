import { useRef } from "react";
import { motion } from "framer-motion";

export function CTABanner() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position:absolute;border-radius:50%;pointer-events:none;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,0.25);
      transform:scale(0);animation:cta-ripple 0.55s linear forwards;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <section className="py-24 relative overflow-hidden" data-testid="section-cta">
      <style>{`@keyframes cta-ripple{to{transform:scale(1);opacity:0}}`}</style>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gradient-to-r from-primary to-accent opacity-20 blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PHBhdGggZD0iTTAuNSAwdiA0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-card/40 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="cta-headline">
            Ready to Scale Without Limits?
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Join thousands of networks relying on our engineered precision.
          </p>

          {/* Premium CTA button */}
          <motion.a
            ref={btnRef}
            href="https://portal.brutescale.xyz/"
            onClick={handleClick}
            data-testid="btn-final-cta"
            animate={{
              boxShadow: [
                "0 0 30px rgba(255,255,255,0.25), 0 0 60px rgba(59,130,246,0.15)",
                "0 0 44px rgba(255,255,255,0.38), 0 0 80px rgba(59,130,246,0.28)",
                "0 0 30px rgba(255,255,255,0.25), 0 0 60px rgba(59,130,246,0.15)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              y: -3,
              boxShadow: "0 0 52px rgba(255,255,255,0.5), 0 0 100px rgba(59,130,246,0.4)",
              transition: { duration: 0.3 },
            }}
            whileFocus={{
              y: -3,
              boxShadow: "0 0 52px rgba(255,255,255,0.5), 0 0 100px rgba(59,130,246,0.4)",
              transition: { duration: 0.3 },
            }}
            className="relative inline-flex h-14 items-center justify-center overflow-hidden rounded-lg bg-white px-10 text-lg font-bold text-background cursor-pointer transition-all duration-300 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Get Started Free
          </motion.a>

          <p className="mt-5 text-sm text-muted-foreground">
            Launch your BruteScale Client Portal to deploy, manage, and monitor your hosting services.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
