import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const interactiveSelector =
  "a, button, [role='button'], input, textarea, select, label, [data-cursor='interactive']";

export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const smoothX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.35 });
  const smoothY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.35 });

  useEffect(() => {
    const media = window.matchMedia("(pointer:fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncCapability = () => setEnabled(media.matches && !reduced.matches);
    syncCapability();

    media.addEventListener("change", syncCapability);
    reduced.addEventListener("change", syncCapability);

    const updatePointer = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      setInteractive(Boolean(event.target.closest(interactiveSelector)));
    };

    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);
    const handleLeave = () => {
      setInteractive(false);
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("blur", handleUp);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      media.removeEventListener("change", syncCapability);
      reduced.removeEventListener("change", syncCapability);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("blur", handleUp);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [x, y]);

  const outerSize = useMemo(() => {
    if (pressed) return 26;
    if (interactive) return 40;
    return 30;
  }, [interactive, pressed]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full border border-white/20 bg-white/10 mix-blend-screen md:block"
        style={{
          x: smoothX,
          y: smoothY,
          width: outerSize,
          height: outerSize,
          marginLeft: -outerSize / 2,
          marginTop: -outerSize / 2,
          boxShadow: interactive ? "0 0 40px rgba(92,124,255,0.28)" : "0 0 26px rgba(255,255,255,0.08)"
        }}
        animate={{
          opacity: 1,
          scale: pressed ? 0.92 : 1
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden rounded-full bg-accent-400 md:block"
        style={{
          x: smoothX,
          y: smoothY,
          width: interactive ? 8 : 10,
          height: interactive ? 8 : 10,
          marginLeft: interactive ? -4 : -5,
          marginTop: interactive ? -4 : -5,
          boxShadow: "0 0 20px rgba(92,124,255,0.65)"
        }}
        animate={{
          scale: pressed ? 0.7 : 1,
          opacity: 1
        }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
      />
    </>
  );
};
