import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How quickly can I deploy a server?",
    answer: "Our automated orchestration engine provisions Minecraft, VPS, and Discord Bot servers in under 60 seconds. Dedicated bare metal servers are typically provisioned within 12 hours depending on custom hardware requirements."
  },
  {
    question: "Do you offer DDoS protection on all plans?",
    answer: "Yes, every BruteScale plan includes 480Gbps+ automated inline DDoS mitigation at no extra cost. Our proprietary filters block L3/L4/L7 attacks instantly without dropping legitimate player connections."
  },
  {
    question: "Can I upgrade my plan at any time?",
    answer: "Absolutely. You can scale your resources up or down directly from your control panel without any downtime. Billing is pro-rated automatically."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and various cryptocurrencies including Bitcoin, Ethereum, and USDC."
  },
  {
    question: "Do you offer a money-back guarantee?",
    answer: "Yes, we offer a 7-day no-questions-asked refund policy for all Minecraft, VPS, and web hosting plans. Dedicated servers are excluded."
  },
  {
    question: "Where are your datacenters located?",
    answer: "We operate in Tier 3+ facilities across New York, Los Angeles, London, Frankfurt, Singapore, Sydney, and Tokyo."
  }
];

export function FAQ() {
  return (
    <section className="py-24" data-testid="section-faq">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white" data-testid="faq-headline">Frequently Asked Questions</h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4" data-testid="accordion-faq">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card/30 border border-border/50 rounded-lg px-6 hover:border-primary/50 transition-colors data-[state=open]:border-primary/50" data-testid={`faq-item-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-lg text-white hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
