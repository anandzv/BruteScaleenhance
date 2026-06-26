import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import logoUrl from "@assets/a947162ae872406a3f330e8d25116299_70_1782312802875.webp";

export function ThreeLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const tiltY = useTransform(springX, [-1, 1], [-18, 18]);
  const tiltX = useTransform(springY, [-1, 1], [12, -12]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const CUBE_SIZE = 160;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{ width: 380, height: 380, perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-testid="three-logo"
    >
      {/* Ambient glow behind cube — dark, not bright */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 280,
          height: 280,
          background: "radial-gradient(circle, rgba(30,70,200,0.18) 0%, rgba(80,0,160,0.10) 50%, transparent 75%)",
        }}
      />

      {/* The CSS 3D Cube */}
      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <motion.div
          animate={{ rotateY: 360, rotateX: [0, 8, 0, -8, 0] }}
          transition={{
            rotateY: { duration: 22, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            width: CUBE_SIZE,
            height: CUBE_SIZE,
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* Front face */}
          <CubeFace
            transform={`translateZ(${CUBE_SIZE / 2}px)`}
            size={CUBE_SIZE}
            isHovered={isHovered}
            edgeColor="rgba(60,120,255,0.8)"
          />
          {/* Back face */}
          <CubeFace
            transform={`rotateY(180deg) translateZ(${CUBE_SIZE / 2}px)`}
            size={CUBE_SIZE}
            isHovered={isHovered}
            edgeColor="rgba(60,120,255,0.5)"
          />
          {/* Left face */}
          <CubeFace
            transform={`rotateY(-90deg) translateZ(${CUBE_SIZE / 2}px)`}
            size={CUBE_SIZE}
            isHovered={isHovered}
            edgeColor="rgba(80,0,200,0.6)"
            darken
          />
          {/* Right face */}
          <CubeFace
            transform={`rotateY(90deg) translateZ(${CUBE_SIZE / 2}px)`}
            size={CUBE_SIZE}
            isHovered={isHovered}
            edgeColor="rgba(80,0,200,0.6)"
            darken
          />
          {/* Top face */}
          <CubeFace
            transform={`rotateX(90deg) translateZ(${CUBE_SIZE / 2}px)`}
            size={CUBE_SIZE}
            isHovered={isHovered}
            edgeColor="rgba(100,180,255,0.5)"
            top
          />
          {/* Bottom face */}
          <CubeFace
            transform={`rotateX(-90deg) translateZ(${CUBE_SIZE / 2}px)`}
            size={CUBE_SIZE}
            isHovered={isHovered}
            edgeColor="rgba(20,20,60,0.8)"
            bottom
          />
        </motion.div>
      </motion.div>

      {/* Ground reflection glow */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          bottom: "20%",
          width: 200,
          height: 30,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(40,80,200,0.4) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Scan line overlay on cube */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{ width: CUBE_SIZE + 4, height: CUBE_SIZE + 4 }}
      >
        <motion.div
          className="absolute w-full"
          style={{ height: 2, background: "rgba(100,180,255,0.15)", left: 0 }}
          animate={{ top: ["-5%", "105%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

interface CubeFaceProps {
  transform: string;
  size: number;
  isHovered: boolean;
  edgeColor: string;
  darken?: boolean;
  top?: boolean;
  bottom?: boolean;
}

function CubeFace({ transform, size, isHovered, edgeColor, darken, top: isTop, bottom: isBottom }: CubeFaceProps) {
  const baseBg = isBottom
    ? "linear-gradient(135deg, #010108 0%, #02020e 100%)"
    : isTop
    ? "linear-gradient(135deg, #05091a 0%, #08102e 100%)"
    : darken
    ? "linear-gradient(135deg, #020510 0%, #050d20 100%)"
    : "linear-gradient(135deg, #040a1f 0%, #070e28 50%, #040a1f 100%)";

  const glowShadow = isHovered
    ? `0 0 20px ${edgeColor}, inset 0 0 30px rgba(20,60,160,0.15)`
    : `0 0 8px ${edgeColor}, inset 0 0 15px rgba(10,30,100,0.1)`;

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        transform,
        background: baseBg,
        border: `1px solid ${edgeColor}`,
        boxShadow: glowShadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "box-shadow 0.3s",
        backfaceVisibility: "hidden",
        overflow: "hidden",
      }}
    >
      {/* Metallic surface texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isTop || isBottom
            ? "none"
            : "repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(60,120,255,0.03) 12px, rgba(60,120,255,0.03) 13px)",
          pointerEvents: "none",
        }}
      />

      {/* Corner bolts */}
      {!isTop && !isBottom && (
        <>
          {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: edgeColor,
                boxShadow: `0 0 4px ${edgeColor}`,
              }}
            />
          ))}
        </>
      )}

      {/* Logo on face */}
      {!isTop && !isBottom && (
        <div style={{ position: "relative", width: size * 0.62, height: size * 0.62 }}>
          {/* Logo glow backdrop */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(40,80,200,0.25) 0%, transparent 70%)",
            }}
          />
          <img
            src={logoUrl}
            alt="BruteScale"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: darken
                ? "brightness(0.55) saturate(0.8)"
                : "brightness(0.9) saturate(1.1) drop-shadow(0 0 8px rgba(80,130,255,0.6))",
              display: "block",
            }}
            draggable={false}
          />
        </div>
      )}

      {/* Top face: server vent lines */}
      {isTop && (
        <div style={{ width: "80%", height: "80%", display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 3,
                borderRadius: 2,
                background: `rgba(60,120,255,${0.15 + i * 0.04})`,
                boxShadow: "0 0 4px rgba(60,120,255,0.3)",
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom face: dark base plate */}
      {isBottom && (
        <div
          style={{
            width: "70%",
            height: "70%",
            border: "1px solid rgba(40,80,160,0.3)",
            borderRadius: 2,
            background: "rgba(10,20,50,0.5)",
          }}
        />
      )}
    </div>
  );
}
