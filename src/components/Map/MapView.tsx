import React, { useState } from "react";
import { FullProject } from "../../types/search";
import { MapPin, Building2, ShieldCheck, ArrowRight, X, Sparkles, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MapViewProps {
  projects: FullProject[];
  onSelectProject: (project: FullProject) => void;
}

export const MapView: React.FC<MapViewProps> = ({ projects, onSelectProject }) => {
  const [selectedPin, setSelectedPin] = useState<FullProject | null>(projects[0] || null);

  return (
    <div className="relative w-full h-[600px] sm:h-[680px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 text-white flex items-center gap-2 text-xs shadow-lg">
        <Navigation className="w-4 h-4 text-blue-400 animate-pulse" />
        <span className="font-semibold">Bangalore Tech Corridor Map</span>
        <span className="text-slate-400">({projects.length} Verified Projects)</span>
      </div>

      {/* Styled Interactive SVG Map Canvas */}
      <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
        {/* Decorative Grid Lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Major Roads / Corridors styling */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
          {/* Outer Ring Road Line */}
          <path
            d="M 100,100 C 300,200 500,150 900,400"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="6,6"
          />
          {/* Whitefield Metro Corridor */}
          <path
            d="M 200,500 C 400,350 700,300 850,200"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
          />
          {/* Sarjapur Corridor */}
          <path
            d="M 150,250 C 350,400 650,450 800,550"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
          />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1 shadow-lg">
          <div className="font-medium text-slate-200 mb-1">Corridor Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-emerald-500 rounded-full" /> Whitefield Metro Line
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-amber-500 rounded-full" /> Sarjapur Main Rd
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-blue-500 rounded-full" /> Outer Ring Road
          </div>
        </div>

        {/* Project Pin Markers */}
        {projects.map((proj) => {
          const isSelected = selectedPin?.id === proj.id;
          const coords = proj.mapCoords || { x: 50, y: 50 };

          return (
            <div
              key={proj.id}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                onClick={() => setSelectedPin(proj)}
                className={`group relative flex items-center transition-all duration-300 focus:outline-none ${
                  isSelected ? "scale-125 z-30" : "hover:scale-110"
                }`}
              >
                {/* Pin Badge */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-xl border transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-400 ring-4 ring-blue-500/30"
                      : proj.status === "safe" || proj.status === "ready"
                      ? "bg-slate-900 text-slate-100 border-emerald-500/80 hover:bg-slate-800"
                      : "bg-slate-900 text-amber-300 border-amber-500/80"
                  }`}
                >
                  <MapPin
                    className={`w-3.5 h-3.5 ${
                      isSelected ? "text-white" : "text-blue-400"
                    }`}
                  />
                  <span>{proj.name.split(" ")[0]}</span>
                  <span className="text-[10px] opacity-80 font-mono">
                    {proj.priceRange.split(" - ")[0]}
                  </span>
                </div>
              </button>
            </div>
          );
        })}

        {/* Selected Project Preview Card Overlay */}
        <AnimatePresence>
          {selectedPin && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="absolute bottom-6 right-6 z-30 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-4 rounded-2xl shadow-2xl text-white"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/50 mb-1">
                    <ShieldCheck className="w-3 h-3" />
                    {selectedPin.statusText}
                  </span>
                  <h4 className="text-base font-bold text-white line-clamp-1">
                    {selectedPin.name}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    {selectedPin.builder} • {selectedPin.localityName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Price Range</div>
                  <div className="font-semibold text-blue-400">
                    {selectedPin.priceRange}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Unit Density</div>
                  <div className="font-semibold text-slate-200">
                    {selectedPin.densityText}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectProject(selectedPin)}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>View Full AI Intelligence Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
