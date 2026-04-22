import { Eclipse, SunMedium } from "lucide-react";
import { motion } from "framer-motion";

export const ThemeToggle = ({ theme, onToggle }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    whileHover={{ y: -1 }}
    onClick={onToggle}
    className="ghost-button h-10 w-10 rounded-full p-0 text-neutral-300 light-mode:text-neutral-700"
    aria-label="Toggle theme"
  >
    {theme === "dark" ? <Eclipse size={16} /> : <SunMedium size={16} />}
  </motion.button>
);
