import { motion } from "framer-motion";
import { Shield, Globe2, Zap, HardDrive } from "lucide-react";

const features = [
  {
    title: "480Gbps+ DDoS Protection",
    description: "Military-grade inline mitigation filters out malicious traffic before it reaches your server. Zero impact on legitimate players or latency.",
    icon: Shield,
    align: "left"
  },
  {
    title: "Global Edge Network",
    description: "15+ datacenters worldwide connected via private 10Gbps backbones. We route traffic across the shortest path, guaranteeing sub-150ms latency globally.",
    icon: Globe2,
    align: "right"
  },
  {
    title: "Instant 60-Second Deploys",
    description: "Our custom orchestration engine provisions bare metal and virtual instances instantly. Skip the setup and start building immediately.",
    icon: Zap,
    align: "left"
  },
  {
    title: "Enterprise NVMe Storage",
    description: "All nodes run purely on Gen4 NVMe SSDs in RAID-10 arrays. Up to 10x faster read/write speeds compared to standard SSDs.",
    icon: HardDrive,
    align: "right"
  }
];

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden" data-testid="section-features">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" data-testid="features-headline">Why Thousands Choose BruteScale</h2>
          <p className="text-lg text-muted-foreground">We don't cut corners. Every component of our infrastructure is engineered for maximum performance and reliability.</p>
        </div>

        <div className="space-y-24">
          {features.map((feature, i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-12 items-center ${feature.align === 'right' ? 'md:flex-row-reverse' : ''}`} data-testid={`feature-row-${i}`}>
              <motion.div 
                initial={{ opacity: 0, x: feature.align === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex-1 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 w-full"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-card/30 border border-border/50 backdrop-blur">
                  {/* Decorative Abstract Visual per feature */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-3/4 h-3/4 rounded-full blur-[80px] opacity-20 ${i % 2 === 0 ? 'bg-primary' : 'bg-accent'}`} />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay" />
                    <feature.icon size={120} className="text-white/10" />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
