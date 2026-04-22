export const pageTransition = {
  initial: { opacity: 0, y: 20, filter: "blur(14px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(10px)" },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};
