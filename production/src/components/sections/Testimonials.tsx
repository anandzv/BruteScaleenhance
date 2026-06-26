import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex M.",
    role: "Minecraft Network Owner",
    text: "BruteScale completely transformed our server performance. Zero downtime in 6 months, and our player count has doubled because the TPS never drops.",
    avatar: "AM"
  },
  {
    name: "Sarah K.",
    role: "Discord Bot Developer",
    text: "The bot hosting is incredibly reliable. Our verification bots have been running non-stop for over a year without a single blip. Highly recommended.",
    avatar: "SK"
  },
  {
    name: "James R.",
    role: "Game Studio Owner",
    text: "The dedicated servers handle our peak loads effortlessly. Incredible value for the price, and the custom orchestration tools save us hours.",
    avatar: "JR"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 border-y border-border/50 bg-card/10" data-testid="section-testimonials">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white" data-testid="testimonials-headline">Trusted by Thousands of Server Owners</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-card/40 backdrop-blur-md border border-border/50 p-8 rounded-2xl relative group hover:border-primary/30 transition-colors"
              data-testid={`testimonial-card-${i}`}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={18} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-lg text-white/90 italic mb-8 leading-relaxed">"{test.text}"</p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white">{test.name}</h4>
                  <div className="text-sm text-muted-foreground">{test.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
