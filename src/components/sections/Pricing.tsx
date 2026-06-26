import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 4.99,
      annualPrice: 3.99,
      features: [
        "2GB RAM",
        "1 vCPU",
        "20GB NVMe SSD",
        "5 player slots",
        "DDoS Protection",
        "24/7 Support",
        "Free subdomain"
      ],
      popular: false
    },
    {
      name: "Pro",
      monthlyPrice: 12.99,
      annualPrice: 10.39,
      features: [
        "8GB RAM",
        "4 vCPU",
        "80GB NVMe SSD",
        "50 player slots",
        "DDoS Protection",
        "Priority Support",
        "Custom domain",
        "Automated backups"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      monthlyPrice: 29.99,
      annualPrice: 23.99,
      features: [
        "32GB RAM",
        "8 vCPU",
        "200GB NVMe SSD",
        "Unlimited players",
        "DDoS Protection",
        "Dedicated Support manager",
        "Custom domain",
        "Daily backups",
        "Plugin support",
        "Server monitoring"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 relative" data-testid="section-pricing">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" data-testid="pricing-headline">Plans Built for Every Scale</h2>
          <p className="text-lg text-muted-foreground mb-8">Start small or go massive. Cancel anytime. No hidden fees.</p>
          
          <div className="flex items-center justify-center gap-4" data-testid="pricing-toggle">
            <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span className={`text-sm font-medium flex items-center gap-2 ${annual ? 'text-white' : 'text-muted-foreground'}`}>
              Annual
              <span className="inline-block bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full border border-accent/30">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-3xl backdrop-blur-md p-8 flex flex-col ${
                plan.popular 
                  ? 'bg-card/60 border-2 border-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] transform md:-translate-y-4' 
                  : 'bg-card/30 border border-border/50'
              }`}
              data-testid={`pricing-card-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-white">
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground mb-1">/mo</span>
              </div>
              
              <button className={`w-full py-3 rounded-lg font-medium transition-all mb-8 ${
                plan.popular 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]' 
                  : 'bg-card/50 text-white border border-border/50 hover:bg-card hover:border-primary/50'
              }`} data-testid={`btn-select-plan-${plan.name.toLowerCase()}`}>
                Deploy Now
              </button>
              
              <div className="space-y-4 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check size={18} className="text-primary shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
