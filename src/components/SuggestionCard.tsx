import React from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface SuggestionCardProps {
  icon: string;
  title: string;
  query: string;
  onClick: (query: string) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  icon,
  title,
  query,
  onClick,
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onClick={() => onClick(query)}
      className="w-full text-left bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 md:p-5 shadow-2xs hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center space-x-3.5 pr-2">
        <span className="text-2xl p-2.5 bg-[#F8F8F7] dark:bg-neutral-800 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <span className="text-sm md:text-base font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {title}
        </span>
      </div>
      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-neutral-400 dark:text-neutral-500 flex items-center justify-center flex-shrink-0 transition-colors">
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </div>
    </motion.button>
  );
};

export default SuggestionCard;
