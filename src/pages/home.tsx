import { useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { Features } from "@/components/sections/Features";
import { DDoSProtection } from "@/components/sections/DDoSProtection";
import { GlobalInfrastructure } from "@/components/sections/GlobalInfrastructure";
import { PingTest } from "@/components/sections/PingTest";
import { Network } from "@/components/sections/Network";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTABanner } from "@/components/sections/CTABanner";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  // Handle cross-page hash navigation: if another page stored a scroll target, use it
  useEffect(() => {
    const target = sessionStorage.getItem("bs_scroll_to");
    if (target) {
      sessionStorage.removeItem("bs_scroll_to");
      // Small delay to let the page render first
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="page-home">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Features />
      <DDoSProtection />
      <GlobalInfrastructure />
      <PingTest />
      <Network />
      <DashboardPreview />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
