import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const startTime = performance.now();
      
      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuart)
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeProgress * end));
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };
      
      requestAnimationFrame(updateCount);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export function Stats() {
  const stats = [
    { value: 50000, suffix: "+", label: "Customers" },
    { value: 99.9, suffix: "%", label: "Uptime", isFloat: true },
    { value: 15, suffix: "+", label: "Datacenters" },
    { value: 10, suffix: "Gbps+", label: "Network" }
  ];

  return (
    <section className="py-12 border-y border-border bg-card/30 backdrop-blur-md relative z-20" data-testid="section-stats">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
              data-testid={`stat-item-${i}`}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                {stat.isFloat ? (
                  <span>99.9%</span>
                ) : (
                  <AnimatedCounter end={stat.value as number} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
