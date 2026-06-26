import { useEffect, useRef } from "react";

interface VoxelParticle {
  x: number; y: number; z: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  color: string;
  twinkleOffset: number;
}

interface EnergyStreak {
  x: number; y: number;
  angle: number;
  length: number;
  speed: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface GlowOrb {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  color: string;
  opacity: number;
  pulseOffset: number;
}

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let voxels: VoxelParticle[] = [];
    let streaks: EnergyStreak[] = [];
    let orbs: GlowOrb[] = [];
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Floating voxel particles (small squares)
      voxels = Array.from({ length: 80 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.15 + 0.05),
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? "#3b82f6" : (Math.random() > 0.5 ? "#8b5cf6" : "#06b6d4"),
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      // Nether portal energy streaks
      streaks = Array.from({ length: 18 }, () => spawnStreak(w, h));

      // Ambient glow orbs
      orbs = [
        // Primary blue orb center-left (behind logo area)
        { x: w * 0.72, y: h * 0.42, vx: 0, vy: 0, radius: 260, color: "30,80,200", opacity: 0.055, pulseOffset: 0 },
        // Purple orb
        { x: w * 0.25, y: h * 0.55, vx: 0, vy: 0, radius: 220, color: "100,20,180", opacity: 0.045, pulseOffset: 1.5 },
        // Teal accent
        { x: w * 0.5, y: h * 0.85, vx: 0, vy: 0, radius: 300, color: "0,100,160", opacity: 0.03, pulseOffset: 3 },
        // Small nether-purple near center
        { x: w * 0.6, y: h * 0.3, vx: 0, vy: 0, radius: 140, color: "150,0,200", opacity: 0.04, pulseOffset: 0.8 },
      ];
    };

    const spawnStreak = (w: number, h: number): EnergyStreak => {
      const maxLife = 80 + Math.random() * 120;
      return {
        x: w * 0.5 + (Math.random() - 0.5) * w * 0.5,
        y: h * 0.5 + (Math.random() - 0.5) * h * 0.5,
        angle: Math.random() * Math.PI * 2,
        length: 30 + Math.random() * 80,
        speed: 0.5 + Math.random() * 1.2,
        opacity: 0.3 + Math.random() * 0.4,
        color: Math.random() > 0.5 ? "120,0,220" : "60,40,255",
        life: Math.floor(Math.random() * maxLife),
        maxLife,
      };
    };

    const drawTerrainSilhouette = (w: number, h: number) => {
      // Blocky Minecraft-style terrain silhouette at bottom
      const baseY = h * 0.88;
      const blockSize = 18;

      ctx.save();
      ctx.globalAlpha = 0.12;

      // Far terrain layer (darker, smaller)
      ctx.fillStyle = "#0a0a1a";
      ctx.beginPath();
      ctx.moveTo(0, h);
      let x = 0;
      let y = baseY + 30;
      while (x < w) {
        const step = blockSize * (1 + Math.floor(Math.random() * 2));
        const nextY = baseY + 20 + Math.floor(Math.random() * 4) * blockSize;
        ctx.lineTo(x, y);
        ctx.lineTo(x, nextY);
        x += step;
        y = nextY;
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Near terrain (slightly brighter)
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#0d0d22";
      ctx.beginPath();
      ctx.moveTo(0, h);
      x = 0;
      y = baseY + 60;
      // Use seeded pattern for consistency
      const heights = [0, 1, 2, 0, -1, 1, 3, 2, 0, 1, -1, 2, 1, 0, 3, 1, 2, 0, -1, 1, 2, 3, 1, 0, 2, 1, -1, 0, 2, 1, 3, 2, 0, 1, -1, 2];
      let hi = 0;
      while (x < w) {
        const blockW = blockSize * 2;
        const nextY = baseY + 55 + (heights[hi % heights.length] * blockSize);
        ctx.lineTo(x, y);
        ctx.lineTo(x, nextY);
        x += blockW;
        y = nextY;
        hi++;
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawNetherPortal = (w: number, h: number) => {
      // Subtle nether portal ripple effect near the right side (behind logo)
      const cx = w * 0.7;
      const cy = h * 0.42;

      ctx.save();

      // Portal glow rings
      for (let i = 3; i >= 0; i--) {
        const radius = 80 + i * 40 + Math.sin(t * 1.5 + i) * 10;
        const grad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
        grad.addColorStop(0, `rgba(80,0,180,${0.0 + i * 0.01})`);
        grad.addColorStop(0.6, `rgba(120,0,220,${0.04 - i * 0.008})`);
        grad.addColorStop(1, "rgba(80,0,180,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Nether portal energy swirls
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 6; i++) {
        const angle = (t * 0.3 + i * (Math.PI / 3));
        const r = 60 + Math.sin(t * 0.8 + i) * 20;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r * 0.5;
        const sg = ctx.createRadialGradient(px, py, 0, px, py, 25);
        sg.addColorStop(0, "rgba(160,0,255,0.5)");
        sg.addColorStop(1, "rgba(80,0,180,0)");
        ctx.beginPath();
        ctx.arc(px, py, 25, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
      }

      ctx.restore();
    };

    const drawVolumetricFog = (w: number, h: number) => {
      // Dark volumetric fog at bottom (no bright glow)
      const fogGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
      fogGrad.addColorStop(0, "rgba(3,4,15,0)");
      fogGrad.addColorStop(0.6, "rgba(3,4,15,0.35)");
      fogGrad.addColorStop(1, "rgba(3,4,15,0.75)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, w, h);

      // Top vignette
      const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.25);
      topGrad.addColorStop(0, "rgba(3,4,15,0.5)");
      topGrad.addColorStop(1, "rgba(3,4,15,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, h * 0.25);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX / window.innerWidth;
      targetRef.current.y = e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      if (document.hidden) { animId = requestAnimationFrame(draw); return; }

      t += 0.012;
      const w = canvas.width;
      const h = canvas.height;

      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.04;
      const mx = (mouseRef.current.x - 0.5) * 25;
      const my = (mouseRef.current.y - 0.5) * 15;

      // Deep dark base
      ctx.fillStyle = "#03040f";
      ctx.fillRect(0, 0, w, h);

      // Ambient glow orbs (parallax layer 1 - slowest)
      orbs.forEach(orb => {
        const pulse = 0.85 + 0.15 * Math.sin(t * 0.6 + orb.pulseOffset);
        const px = orb.x - mx * 0.08;
        const py = orb.y - my * 0.05;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, orb.radius * pulse);
        grad.addColorStop(0, `rgba(${orb.color},${orb.opacity})`);
        grad.addColorStop(0.4, `rgba(${orb.color},${orb.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(${orb.color},0)`);
        ctx.beginPath();
        ctx.arc(px, py, orb.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Terrain silhouette (static, low parallax)
      ctx.save();
      ctx.translate(-mx * 0.04, -my * 0.02);
      drawTerrainSilhouette(w, h);
      ctx.restore();

      // Nether portal energy (medium parallax)
      ctx.save();
      ctx.translate(-mx * 0.1, -my * 0.06);
      drawNetherPortal(w, h);
      ctx.restore();

      // Energy streaks (nether portal style)
      ctx.save();
      ctx.translate(-mx * 0.12, -my * 0.08);
      streaks.forEach((s, i) => {
        s.life++;
        if (s.life > s.maxLife) {
          streaks[i] = spawnStreak(w, h);
          return;
        }
        const progress = s.life / s.maxLife;
        const fade = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        ctx.save();
        ctx.globalAlpha = s.opacity * fade * 0.6;
        ctx.strokeStyle = `rgba(${s.color},1)`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${s.color},0.8)`;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.stroke();
        ctx.restore();
      });
      ctx.restore();

      // Voxel particles (floating squares - parallax layer 2)
      ctx.save();
      ctx.translate(-mx * 0.18, -my * 0.12);
      voxels.forEach(v => {
        v.x += v.vx;
        v.y += v.vy;
        if (v.y < -10) { v.y = h + 10; v.x = Math.random() * w; }
        if (v.x < -10) v.x = w + 10;
        if (v.x > w + 10) v.x = -10;

        const twinkle = 0.6 + 0.4 * Math.sin(t * 1.5 + v.twinkleOffset);
        const sz = v.size * (0.5 + v.z * 0.5);

        ctx.save();
        ctx.globalAlpha = v.opacity * twinkle;
        ctx.shadowBlur = 6;
        ctx.shadowColor = v.color;
        ctx.fillStyle = v.color;
        // Draw square voxel
        ctx.fillRect(v.x - sz / 2, v.y - sz / 2, sz, sz);
        ctx.restore();
      });
      ctx.restore();

      // Subtle End-dimension particles (tiny points)
      ctx.save();
      ctx.translate(-mx * 0.22, -my * 0.16);
      const endParticleCount = 120;
      // Use a seeded pattern based on t to avoid reinitializing
      for (let i = 0; i < endParticleCount; i++) {
        const seed = (i * 7919) % 1000;
        const px = (seed / 10) % w;
        const py = ((seed * 13) % 100) / 100 * h;
        const driftX = Math.sin(t * 0.4 + i * 0.3) * 15;
        const driftY = Math.cos(t * 0.3 + i * 0.4) * 8;
        const fade = 0.4 + 0.6 * Math.sin(t * 0.8 + i * 0.5);

        ctx.beginPath();
        ctx.arc(px + driftX, py + driftY, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#60a5fa" : "#818cf8";
        ctx.globalAlpha = fade * 0.35;
        ctx.fill();
      }
      ctx.restore();

      // Volumetric fog overlay (no bright gradients)
      drawVolumetricFog(w, h);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", display: "block" }}
    />
  );
}
