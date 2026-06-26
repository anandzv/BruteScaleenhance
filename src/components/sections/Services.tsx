import { motion } from "framer-motion";
import { Gamepad2, Server, Layers, Cpu, Bot, Globe } from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    title: "Minecraft Hosting",
    description: "High-performance nodes powered by the latest NVMe SSDs and 5GHz+ processors. Zero lag, perfect TPS.",
    icon: Gamepad2,
    color: "text-primary"
  },
  {
    title: "VPS Hosting",
    description: "Root access, instant provisioning, and dedicated resources. Build anything, completely unmanaged or managed.",
    icon: Server,
    color: "text-accent"
  },
  {
    title: "RDP Hosting",
    description: "Premium Windows Remote Desktop servers powered by Intel Xeon, AMD EPYC, and AMD Ryzen processors. Perfect for trading, automation, remote work, development, rendering, and 24/7 applications.",
    icon: Layers,
    color: "text-blue-400"
  },
  {
    title: "Dedicated Servers",
    description: "Enterprise-grade bare metal in tier 3+ datacenters. Custom configurations available upon request.",
    icon: Cpu,
    color: "text-purple-400"
  },
  {
    title: "Discord Bot Hosting",
    description: "Keep your bots online 24/7 with Node.js, Python, and Java support. Simple control panel.",
    icon: Bot,
    color: "text-indigo-400"
  },
  {
    title: "Web Hosting",
    description: "Lightning fast cPanel hosting with free SSL, automated backups, and one-click app installers.",
    icon: Globe,
    color: "text-cyan-400"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function Services() {
  return (
    <section id="services" className="py-24 relative" data-testid="section-services">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" data-testid="services-headline">Everything You Need to Scale</h2>
          <p className="text-lg text-muted-foreground">From single game servers to complex global networks, we provide the infrastructure that powers your vision.</p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, i) => (
            <motion.div key={i} variants={itemVariants} className="group relative" data-testid={`service-card-${i}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-card/40 backdrop-blur-sm border border-border/50 p-8 rounded-2xl transition-all duration-300 group-hover:border-primary/50 group-hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl bg-background/50 border border-white/5 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-shadow ${service.color}`}>
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">{service.description}</p>
                <Link
                  href={
                    service.title === "Minecraft Hosting" ? "/minecraft-hosting"
                    : service.title === "VPS Hosting" ? "/vps-hosting"
                    : service.title === "RDP Hosting" ? "/rdp-hosting"
                    : "/pricing"
                  }
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-white transition-colors"
                  data-testid={`link-service-learn-more-${i}`}
                >
                  Learn More <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
