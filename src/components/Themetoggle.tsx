import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  variant?: "floating" | "inline" | "navbar";
  className?: string;
}

export default function ThemeToggle({
  variant = "floating",
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const tooltipText = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";

  if (variant === "navbar" || variant === "inline") {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          type="button"
          onClick={toggleTheme}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={tooltipText}
          className="relative p-2 rounded-full border border-neutral-200/80 dark:border-neutral-700/80 bg-white/70 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-200 backdrop-blur-md shadow-xs hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-apple-blue/40"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun-icon"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              </motion.div>
            ) : (
              <motion.div
                key="moon-icon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Moon className="w-4 h-4 text-neutral-700 fill-neutral-700/10" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2.5 py-1 bg-neutral-900/90 dark:bg-neutral-100/90 text-white dark:text-neutral-900 text-[11px] font-medium rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm"
            >
              {tooltipText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Floating button variant
  return (
    <div
      id="cribr-floating-theme-toggle"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center ${className}`}
    >
      <div className="relative">
        {/* Floating Action Button */}
        <motion.button
          type="button"
          onClick={toggleTheme}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={tooltipText}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/85 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 border border-neutral-200/90 dark:border-neutral-700/90 shadow-lg shadow-neutral-950/10 dark:shadow-black/40 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-apple-blue/50 group transition-colors duration-300"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="dark-sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20 drop-shadow-sm transition-transform group-hover:rotate-45 duration-300" />
              </motion.div>
            ) : (
              <motion.div
                key="light-moon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <Moon className="w-5 h-5 text-neutral-800 fill-neutral-800/10 drop-shadow-xs transition-transform group-hover:-rotate-12 duration-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neutral-900/90 dark:bg-neutral-100/95 text-white dark:text-neutral-950 text-xs font-semibold rounded-xl shadow-xl border border-white/10 dark:border-neutral-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-md"
            >
              {tooltipText}
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-900/90 dark:bg-neutral-100/95 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
