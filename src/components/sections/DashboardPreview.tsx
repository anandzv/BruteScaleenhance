import { motion } from "framer-motion";
import { Activity, Cpu, HardDrive, Network, Terminal } from "lucide-react";

export function DashboardPreview() {
  return (
    <section className="py-24 overflow-hidden" data-testid="section-dashboard-preview">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" data-testid="dashboard-headline">Manage Everything from One Place</h2>
          <p className="text-lg text-muted-foreground">Our custom-built control panel gives you absolute control over your infrastructure with military precision.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-5xl mx-auto rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden perspective-[2000px]"
          data-testid="mock-dashboard"
        >
          {/* Header */}
          <div className="h-12 border-b border-border/50 flex items-center px-4 gap-4 bg-background/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center font-mono text-xs text-muted-foreground">
              node-01.brutescale.net — Root Access
            </div>
          </div>

          <div className="flex h-[400px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-border/50 p-4 space-y-2 hidden md:block bg-background/20">
              {['Overview', 'Console', 'Network', 'Backups', 'Settings'].map((item, i) => (
                <div key={i} className={`px-4 py-2 rounded-lg text-sm font-medium ${i === 0 ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:bg-card'}`}>
                  {item}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 grid grid-cols-2 gap-6 overflow-y-auto">
              {/* CPU Card */}
              <div className="col-span-2 md:col-span-1 border border-border/50 bg-background/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-primary/20"><Cpu size={40} /></div>
                <h4 className="text-muted-foreground text-sm font-medium mb-4">CPU Usage (8 Cores)</h4>
                <div className="text-4xl font-bold text-white mb-4">24<span className="text-xl text-muted-foreground">%</span></div>
                <div className="flex items-end gap-1 h-12">
                  {[40, 60, 45, 30, 80, 50, 40, 24].map((val, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative">
                      <div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{ height: `${val}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* RAM Card */}
              <div className="col-span-2 md:col-span-1 border border-border/50 bg-background/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-accent/20"><Activity size={40} /></div>
                <h4 className="text-muted-foreground text-sm font-medium mb-4">Memory Allocation</h4>
                <div className="text-4xl font-bold text-white mb-4">12.4<span className="text-xl text-muted-foreground">GB</span></div>
                <div className="w-full bg-card h-3 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[45%]" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-right">45% of 32GB utilized</div>
              </div>

              {/* Console Preview */}
              <div className="col-span-2 border border-border/50 bg-black rounded-xl p-4 font-mono text-xs text-green-400 overflow-hidden relative">
                <div className="absolute top-3 right-3 text-muted-foreground/50"><Terminal size={16}/></div>
                <div className="space-y-1 opacity-80">
                  <div>root@node-01:~# systemctl status minecraft-server</div>
                  <div>● minecraft-server.service - Minecraft Survival Node</div>
                  <div>     Loaded: loaded (/etc/systemd/system/minecraft-server.service; enabled)</div>
                  <div>     Active: active (running) since Fri 2023-10-27 12:45:00 UTC; 4 days ago</div>
                  <div>   Main PID: 12458 (java)</div>
                  <div className="animate-pulse">_</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
