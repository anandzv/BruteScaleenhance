import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { name: "RAM", starter: "2GB", pro: "8GB", enterprise: "32GB" },
  { name: "vCPU Cores", starter: "1 Core", pro: "4 Cores", enterprise: "8 Cores" },
  { name: "Storage (NVMe SSD)", starter: "20GB", pro: "80GB", enterprise: "200GB" },
  { name: "DDoS Protection", starter: true, pro: true, enterprise: true },
  { name: "Automated Backups", starter: false, pro: "Weekly", enterprise: "Daily" },
  { name: "Custom Domain", starter: false, pro: true, enterprise: true },
  { name: "Priority Support", starter: false, pro: true, enterprise: "Dedicated Manager" },
  { name: "Server Monitoring", starter: false, pro: false, enterprise: true },
];

export function ComparisonTable() {
  return (
    <section className="py-24 hidden md:block" data-testid="section-comparison">
      <div className="container mx-auto px-6 max-w-5xl">
        <h3 className="text-2xl font-bold text-center text-white mb-12" data-testid="comparison-headline">Compare Plans</h3>
        
        <div className="bg-card/30 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden">
          <table className="w-full text-left border-collapse" data-testid="table-comparison">
            <thead>
              <tr className="bg-card/50 border-b border-border/50">
                <th className="p-6 font-semibold text-muted-foreground w-1/4">Features</th>
                <th className="p-6 font-bold text-white text-center w-1/4">Starter</th>
                <th className="p-6 font-bold text-primary text-center w-1/4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5"></div>
                  <span className="relative z-10 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">Pro</span>
                </th>
                <th className="p-6 font-bold text-white text-center w-1/4">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="border-b border-border/20 last:border-0 hover:bg-card/40 transition-colors"
                >
                  <td className="p-6 font-medium text-white/90">{feature.name}</td>
                  <td className="p-6 text-center text-muted-foreground">
                    {typeof feature.starter === 'boolean' 
                      ? (feature.starter ? <Check className="mx-auto text-green-400" size={20}/> : <X className="mx-auto text-muted-foreground/30" size={20}/>)
                      : feature.starter}
                  </td>
                  <td className="p-6 text-center text-white font-medium bg-primary/5">
                    {typeof feature.pro === 'boolean' 
                      ? (feature.pro ? <Check className="mx-auto text-primary drop-shadow-[0_0_3px_rgba(59,130,246,0.8)]" size={20}/> : <X className="mx-auto text-muted-foreground/30" size={20}/>)
                      : feature.pro}
                  </td>
                  <td className="p-6 text-center text-muted-foreground">
                    {typeof feature.enterprise === 'boolean' 
                      ? (feature.enterprise ? <Check className="mx-auto text-green-400" size={20}/> : <X className="mx-auto text-muted-foreground/30" size={20}/>)
                      : feature.enterprise}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
