import React, { useEffect, useState } from "react";
import { useRaceStore } from "@/store/useRaceStore";
import { GlassCard } from "../shared/GlassCard";
import { Map, Flag, RefreshCw } from "lucide-react";

export function LiveTrackMap() {
  const telemetry = useRaceStore((state) => state.telemetry);
  const sessionFlag = useRaceStore((state) => state.sessionFlag);
  
  const [carProgress, setCarProgress] = useState(0); // 0 to 100 representing lap percent

  // Track coordinates for Silverstone path SVG (Symmetric and scaled)
  const trackPath = "M 250,80 C 370,60 480,100 480,180 C 480,260 420,290 390,320 C 360,350 370,410 410,430 C 450,450 470,390 490,480 C 500,530 450,560 380,540 C 310,520 220,530 180,500 C 140,470 120,440 100,370 C 80,300 110,240 140,210 C 170,180 150,130 180,100 C 200,80 210,90 250,80 Z";

  useEffect(() => {
    if (!telemetry) return;

    // Estimate progress along the track map based on sector and high frequency variables
    const baseSectors = [0, 31, 71, 100];
    const sec = telemetry.sector;
    const throttle = telemetry.throttle;
    const speed = telemetry.speed;

    // Micro-interpolation inside the sector using speed and time
    let microProgress = 0;
    if (speed > 50) {
      // Create a smooth sweep
      const elapsedInSector = (telemetry.elapsed_time || 0) % 30;
      microProgress = (elapsedInSector * (speed / 300)) % 10;
    }

    const currentBase = baseSectors[sec - 1];
    const nextBase = baseSectors[sec] || 100;
    const sectorRange = nextBase - currentBase;

    // Set progress smooth
    const estimated = currentBase + (microProgress / 10) * sectorRange;
    setCarProgress(Math.min(99.5, Math.max(0.5, estimated)));
  }, [telemetry]);

  // Silverstone corner labels
  const corners = [
    { name: "Copse", x: 380, y: 70 },
    { name: "Maggots", x: 490, y: 150 },
    { name: "Becketts", x: 440, y: 260 },
    { name: "Stowe", x: 470, y: 440 },
    { name: "Vale", x: 370, y: 565 },
    { name: "Club", x: 190, y: 535 },
    { name: "Luffield", x: 120, y: 310 },
    { name: "Woodcote", x: 165, y: 195 }
  ];

  return (
    <GlassCard className="flex flex-col justify-between min-h-[480px]">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-3">
        <div className="flex items-center space-x-2">
          <Map className="w-4 h-4 text-f1-red" />
          <span className="text-xs font-black uppercase font-telemetry tracking-wider">
            LIVE TRACK GPS MONITOR
          </span>
        </div>
        <div className="flex items-center space-x-4 text-[10px] font-telemetry text-text-secondaryDark">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full mr-1.5" />
            Sector 1
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full mr-1.5" />
            Sector 2
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 bg-f1-red rounded-full mr-1.5" />
            Sector 3
          </span>
        </div>
      </div>

      {/* Main Track SVG Plotter */}
      <div className="relative flex-grow flex items-center justify-center py-6 min-h-[380px]">
        {/* Neon Grid overlay for Cyberpunk feeling */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <svg className="w-full h-full max-w-[550px] max-h-[400px]" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="sectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" /> {/* S1 Cyan */}
              <stop offset="50%" stopColor="#facc15" /> {/* S2 Yellow */}
              <stop offset="100%" stopColor="#ff1e1e" /> {/* S3 Red */}
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Underlay track glow */}
          <path
            d={trackPath}
            stroke="url(#sectorGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
          />

          {/* Main Track Line */}
          <path
            id="track-circuit"
            d={trackPath}
            stroke="url(#sectorGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Speed traps and lines */}
          {/* Start Finish Line */}
          <line x1="250" y1="65" x2="250" y2="95" stroke="#ffffff" strokeWidth="3" />
          <text x="240" y="55" fill="#ffffff" fontSize="10" fontFamily="Share Tech Mono" textAnchor="middle">START/FINISH</text>

          {/* Pit lane entry point */}
          <path d="M 125,290 C 130,340 150,380 180,410" stroke="#aaaaaa" strokeWidth="2" strokeDasharray="4 4" />
          <text x="165" y="420" fill="#aaaaaa" fontSize="9" fontFamily="Share Tech Mono">PIT LANE</text>

          {/* Corner Labels */}
          {corners.map((corner, idx) => (
            <g key={idx}>
              <circle cx={corner.x} cy={corner.y} r="2.5" fill="#555555" />
              <text 
                x={corner.x} 
                y={corner.y - 8} 
                fill="#888888" 
                fontSize="9" 
                fontFamily="Share Tech Mono"
                textAnchor="middle"
                className="opacity-70 dark:opacity-50"
              >
                {corner.name}
              </text>
            </g>
          ))}

          {/* Renders the moving car */}
          <CarDot pathId="track-circuit" progress={carProgress} sessionFlag={sessionFlag} />
        </svg>
      </div>

      {/* Speed Trap Overlay HUD */}
      <div className="border-t border-border-light dark:border-border-dark pt-3 flex items-center justify-between text-xs font-telemetry uppercase text-text-secondaryDark">
        <div className="flex items-center space-x-1.5">
          <Flag className="w-3.5 h-3.5 text-white" />
          <span>Active Turn: <strong className="text-white">Becketts (S2)</strong></span>
        </div>
        <div>
          <span>Sector Best: <strong className="text-cyan-400">28.200s</strong> | <strong className="text-yellow-400">36.100s</strong> | <strong className="text-f1-red">25.700s</strong></span>
        </div>
      </div>
    </GlassCard>
  );
}

interface CarDotProps {
  pathId: string;
  progress: number;
  sessionFlag: string;
}

// Sub-component to compute precise coordinate positioning on SVG path
function CarDot({ pathId, progress, sessionFlag }: CarDotProps) {
  const [coords, setCoords] = useState({ x: 250, y: 80 });

  useEffect(() => {
    const path = document.getElementById(pathId) as SVGPathElement | null;
    if (!path) return;

    try {
      const pathLength = path.getTotalLength();
      const point = path.getPointAtLength((progress / 100) * pathLength);
      setCoords({ x: point.x, y: point.y });
    } catch (e) {
      // Fallback
    }
  }, [progress, pathId]);

  // Car marker color based on flags
  const getMarkerColor = () => {
    if (sessionFlag === "GREEN") return "#ff1e1e";
    if (sessionFlag === "YELLOW") return "#f59e0b";
    return "#3b82f6"; // VSC/SC
  };

  return (
    <g>
      {/* Outer pulse ring */}
      <circle 
        cx={coords.x} 
        cy={coords.y} 
        r="12" 
        fill={getMarkerColor()} 
        opacity="0.3"
        className="animate-ping"
      />
      {/* Glowing physical marker */}
      <circle 
        cx={coords.x} 
        cy={coords.y} 
        r="6.5" 
        fill={getMarkerColor()} 
        stroke="#ffffff" 
        strokeWidth="1.5"
        filter="url(#glow)"
      />
      <text x={coords.x + 10} y={coords.y - 10} fill="#ffffff" fontSize="10" fontFamily="Share Tech Mono" fontWeight="bold" filter="drop-shadow(0 0 2px black)">
        CAR 01
      </text>
    </g>
  );
}
