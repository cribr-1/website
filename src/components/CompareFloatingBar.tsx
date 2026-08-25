import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, X, Trash2 } from 'lucide-react';

interface CompareFloatingBarProps {
  compareList: string[];
  projectsData: any[]; // To show names
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export default function CompareFloatingBar({
  compareList,
  projectsData,
  onRemove,
  onClear,
  onCompare
}: CompareFloatingBarProps) {
  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-900/10 p-4 flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full">
          <div className="flex items-center gap-2 text-blue-900 font-medium whitespace-nowrap">
            <Scale className="w-5 h-5 text-blue-600" />
            Compare ({compareList.length}/4)
          </div>
          
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {compareList.map(id => {
              const proj = projectsData.find(p => p.id === id);
              return (
                <div key={id} className="flex items-center gap-1 bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-md border border-blue-100">
                  <span className="truncate max-w-[100px] sm:max-w-[120px] font-medium">
                    {proj?.name || proj?.projectName || id}
                  </span>
                  <button onClick={() => onRemove(id)} className="p-0.5 hover:bg-blue-200 rounded-full transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <button 
            onClick={onClear}
            className="text-gray-500 hover:text-red-500 transition-colors p-2"
            title="Clear all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onCompare}
            disabled={compareList.length < 2}
            className={`flex-1 sm:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              compareList.length >= 2 
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Scale className="w-4 h-4" />
            {compareList.length < 2 ? "Select 1 more" : "Compare Now"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
