import { motion } from "framer-motion";

const locations = [
  { name: "New York", top: "35%", left: "28%" },
  { name: "Los Angeles", top: "40%", left: "15%" },
  { name: "London", top: "25%", left: "45%" },
  { name: "Frankfurt", top: "28%", left: "52%" },
  { name: "Singapore", top: "60%", left: "75%" },
  { name: "Sydney", top: "80%", left: "85%" },
  { name: "Tokyo", top: "40%", left: "82%" },
];

export function Network() {
  return (
    <section id="network" className="py-24 relative overflow-hidden bg-card/20" data-testid="section-network">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" data-testid="network-headline">Global Infrastructure, Local Performance</h2>
          <p className="text-lg text-muted-foreground">Deploy closer to your users. Our multi-regional footprint ensures ultra-low latency worldwide.</p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto aspect-[2/1] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idHJhbnNwYXJlbnQiLz48L3N2Zz4=')] rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden" data-testid="network-map">
          {/* Stylized CSS Grid Background instead of complex SVG map for simplicity and vibe */}
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          
          {locations.map((loc, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
              className="absolute group cursor-pointer"
              style={{ top: loc.top, left: loc.left }}
              data-testid={`network-dot-${loc.name.toLowerCase().replace(' ', '-')}`}
            >
              <div className="relative w-4 h-4 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                <div className="absolute inset-1 bg-white rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-card border border-border text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xl">
                {loc.name}
              </div>
            </motion.div>
          ))}
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between text-xs text-muted-foreground font-mono bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border/50">
            <div>NETWORK_STATUS: <span className="text-green-400">OPERATIONAL</span></div>
            <div className="hidden sm:block">UPLINK: 10Gbps</div>
            <div>SLA: 99.99%</div>
          </div>
        </div>
      </div>
    </section>
  );
}
