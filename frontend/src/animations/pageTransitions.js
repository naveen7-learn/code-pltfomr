export const pageTransition = {
  initial: { opacity: 0, y: 24, scale: 0.992, filter: "blur(14px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, scale: 0.996, filter: "blur(10px)" },
  transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.03
    }
  }
};

export const riseIn = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
};

export const listItemIn = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
};
