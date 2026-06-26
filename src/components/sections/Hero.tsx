import { motion, useMotionValue, useSpring } from "framer-motion";
import { useLocation } from "wouter";
import { ThreeLogo } from "@/components/ThreeLogo";
import { ThreeBackground } from "@/components/ThreeBackground";
import { Zap, Shield, Clock } from "lucide-react";

function MagneticButton({ children, primary, onClick, ...props }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  
  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };
  
  const handleMouseLeave = () => { 
    x.set(0); 
    y.set(0); 
  };
  
  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={primary ? "btn-primary-glow" : "btn-ghost-glow"}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Hero() {
  const [location, setLocation] = useLocation();

  const handleStartHosting = () => {
    if (location === "/") {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("bs_scroll_to", "services");
      setLocation("/");
    }
  };

  const statCards = [
    { icon: Zap, value: "99.9%", label: "Uptime SLA", delayClass: "" },
    { icon: Shield, value: "480Gbps", label: "DDoS Protected", delayClass: "animate-float-card-delay" },
    { icon: Clock, value: "24/7", label: "Expert Support", delayClass: "animate-float-card-delay2" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" data-testid="section-hero">
      <ThreeBackground />
      {/* Very subtle bottom fade only — no bright overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(3,4,15,0.5) 100%)" }} />
      
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: text content */}
        <div className="text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4" data-testid="badge-hero-new">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
              New Enterprise Hardware Deployed
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6"
          >
            <span className="block">Power Without</span>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-text">
              Limits
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl"
          >
            Military-grade hosting for Minecraft networks, powerful VPS instances, and enterprise applications. Built for scale, engineered for precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <MagneticButton primary onClick={handleStartHosting} data-testid="btn-hero-primary">
              Start Hosting
            </MagneticButton>
            <MagneticButton primary={false} onClick={() => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }) }} data-testid="btn-hero-secondary">
              View Plans
            </MagneticButton>
          </motion.div>

          <div className="flex flex-wrap gap-4 pt-8">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 + (i * 0.1) }}
                className={`flex items-center space-x-3 text-sm bg-card/30 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 animate-float-card ${stat.delayClass}`}
                data-testid={`stat-card-${i}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-tight">{stat.value}</div>
                  <div className="text-muted-foreground text-xs">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: ThreeLogo */}
        <div className="hidden lg:flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ThreeLogo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
