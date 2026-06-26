import { Link } from "wouter";
import { SiX, SiDiscord, SiGithub } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background pt-16 pb-8 relative overflow-hidden" data-testid="footer">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] inline-block mb-4" data-testid="link-footer-logo">
              BruteScale
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Military-grade web hosting built for scale, engineered for precision. Power without limits for the next generation of online experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-social-x">
                <SiX size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-social-discord">
                <SiDiscord size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-social-github">
                <SiGithub size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Minecraft Hosting</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">VPS Hosting</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Dedicated Servers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Web Hosting</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Domain Names</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Datacenters</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">SLA</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BruteScale Networks. All rights reserved.</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
