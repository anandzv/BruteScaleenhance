import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

const navLinks = [
  { label: "Services",  href: "#services" },
  { label: "Docs",      href: "/docs" },
  { label: "Minecraft Hosting", href: "/minecraft-hosting", highlight: true },
  { label: "VPS / RDP", href: "/vps-hosting" },
  { label: "Network",   href: "#network" },
  { label: "About",     href: "#about" },
];

// Scroll to a section on the home page.
// If already on /, scroll immediately. Otherwise navigate to / and let home.tsx handle it.
function useHashNav() {
  const [location, navigate] = useLocation();
  return (href: string) => {
    if (!href.startsWith("#")) { navigate(href); return; }
    const section = href.slice(1);
    if (location === "/") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("bs_scroll_to", section);
      navigate("/");
    }
  };
}

export function Navbar() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenu]   = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const { user, logout }                  = useAuth();
  const goTo                              = useHashNav();
  const userMenuRef                       = useRef<HTMLDivElement>(null);
  const [currentLocation, navigate]        = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (currentLocation === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenu(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#03040f]/85 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
      data-testid="navbar"
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="text-xl font-bold tracking-tight text-white shrink-0"
          style={{ textShadow: "0 0 20px rgba(59,130,246,0.9), 0 0 40px rgba(59,130,246,0.4)" }}
          data-testid="link-logo"
        >
          BruteScale
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => { goTo(link.href); setMobileMenu(false); }}
              className={`text-sm font-medium transition-all duration-200 relative group bg-transparent border-0 cursor-pointer ${
                link.highlight ? "text-blue-400 hover:text-blue-300" : "text-white/60 hover:text-white"
              }`}
              data-testid={`link-nav-${link.label.toLowerCase().replace(/[^a-z]/g, "-")}`}
            >
              {link.label}
              {link.highlight && (
                <span className="absolute -top-1.5 -right-4 text-[10px] font-bold text-emerald-400 leading-none">
                  HOT
                </span>
              )}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Auth — Desktop */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">

          {/* Discord Button */}
          <div className="relative group">
            <motion.a
              href="https://discord.gg/A23a2GtWWb"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="relative inline-flex h-9 items-center justify-center gap-2 px-4 rounded-lg text-sm font-medium text-white/85 overflow-hidden transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(88,101,242,0.18) 0%, rgba(59,130,246,0.14) 100%)",
                border: "1px solid rgba(88,101,242,0.35)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 12px rgba(88,101,242,0.12)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(88,101,242,0.35), 0 0 48px rgba(88,101,242,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(88,101,242,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(88,101,242,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(88,101,242,0.35)"; }}
              data-testid="btn-discord"
            >
              {/* shimmer overlay */}
              <span className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />

              {/* green live dot */}
              <span className="relative shrink-0">
                <DiscordIcon className="w-4 h-4 text-[#7289da] group-hover:scale-110 transition-transform duration-200" />
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#03040f]"
                  style={{ background: "#23d160", boxShadow: "0 0 6px #23d160" }}
                />
              </span>

              <span className="bg-clip-text text-transparent font-semibold" style={{ backgroundImage: "linear-gradient(135deg, #7289da 0%, #5865f2 50%, #3b82f6 100%)" }}>
                Discord
              </span>
            </motion.a>

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0"
              style={{ background: "rgba(8,14,36,0.95)", border: "1px solid rgba(88,101,242,0.3)", backdropFilter: "blur(12px)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
            >
              Join Our Community
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ background: "rgba(8,14,36,0.95)", borderLeft: "1px solid rgba(88,101,242,0.3)", borderTop: "1px solid rgba(88,101,242,0.3)" }} />
            </div>
          </div>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white/80 hover:text-white transition-all duration-200"
                style={{
                  background: user.isAdmin ? "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(124,58,237,0.14))" : "rgba(255,255,255,0.06)",
                  border: user.isAdmin ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: user.isAdmin ? "0 0 12px rgba(99,102,241,0.2)" : "none",
                }}
                data-testid="btn-user-menu"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: user.isAdmin ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 52%) 100%)" }}
                >
                  {user.isAdmin ? "👤" : user.username[0].toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.isAdmin ? "Admin" : user.username}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(8,14,36,0.98) 0%, rgba(5,9,24,0.99) 100%)",
                      border: "1px solid rgba(99,130,255,0.2)",
                      backdropFilter: "blur(24px)",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.4), 0 0 60px rgba(59,130,246,0.06)",
                    }}
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="text-xs text-white/40">{user.isAdmin ? "Administrator" : "Signed in as"}</div>
                      <div className="text-sm font-semibold text-white truncate">{user.username}</div>
                      <div className="text-xs text-white/30 truncate">{user.email}</div>
                    </div>
                    <div className="p-2">
                      {user.isAdmin && (
                        <>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/admin"); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors font-medium"
                          >
                            <span>⚙️</span> Dashboard
                          </button>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/admin"); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                          >
                            <span>🛡️</span> Visit Admin Panel
                          </button>
                          <div className="my-1.5 border-t border-white/5" />
                        </>
                      )}
                      {!user.isAdmin && (
                        <button
                          onClick={() => { setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User size={14} /> My Account
                        </button>
                      )}
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/8 transition-colors"
                        data-testid="btn-logout"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="relative inline-flex h-9 items-center justify-center px-5 text-sm font-medium text-white/80 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white"
                data-testid="btn-nav-login"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="relative inline-flex h-9 items-center justify-center px-5 text-sm font-semibold text-white rounded-lg overflow-hidden transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 50%) 100%)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.15)",
                }}
                data-testid="btn-nav-signup"
              >
                Sign Up
                <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white/80 hover:text-white transition-colors p-1"
          onClick={() => setMobileMenu(!mobileMenuOpen)}
          data-testid="btn-mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#03040f]/95 backdrop-blur-xl border-b border-white/5 flex flex-col p-6 space-y-4"
            data-testid="mobile-menu"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => { goTo(link.href); setMobileMenu(false); }}
                className={`text-base font-medium transition-colors text-left bg-transparent border-0 cursor-pointer ${
                  link.highlight ? "text-blue-400" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
            {/* Discord — mobile */}
            <a
              href="https://discord.gg/A23a2GtWWb"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenu(false)}
              className="inline-flex h-11 items-center justify-center gap-2.5 rounded-xl text-sm font-semibold w-full transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(88,101,242,0.18) 0%, rgba(59,130,246,0.14) 100%)",
                border: "1px solid rgba(88,101,242,0.35)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 16px rgba(88,101,242,0.18)",
              }}
            >
              <span className="relative shrink-0">
                <DiscordIcon className="w-4 h-4 text-[#7289da]" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: "#23d160", boxShadow: "0 0 5px #23d160" }} />
              </span>
              <span className="bg-clip-text text-transparent font-semibold" style={{ backgroundImage: "linear-gradient(135deg, #7289da 0%, #5865f2 50%, #3b82f6 100%)" }}>
                Discord Server
              </span>
            </a>

            <div className="flex gap-3">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileMenu(false); }}
                  className="flex-1 inline-flex h-11 items-center justify-center rounded-lg text-sm font-medium text-red-400 border border-red-500/20 bg-red-500/8 hover:bg-red-500/15 transition-colors gap-2"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" className="flex-1 inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors" onClick={() => setMobileMenu(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="flex-1 inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, hsl(215 90% 48%) 0%, hsl(265 80% 50%) 100%)", boxShadow: "0 0 20px rgba(59,130,246,0.4)" }} onClick={() => setMobileMenu(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
