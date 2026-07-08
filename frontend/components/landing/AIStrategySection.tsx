import React, { useEffect, useState } from "react";
import { GlassCard } from "../shared/GlassCard";
import { Brain, Cpu, Database, Compass } from "lucide-react";
import { motion } from "framer-motion";

export function AIStrategySection() {
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  // Cycle search nodes to simulate active MCTS rollouts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSearchIndex((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const searchStates = [
    { name: "Root [Lap 12]", visits: 480, time: "91.2s", risk: "18%" },
    { name: "STAY OUT - PUSH stint", visits: 240, time: "90.5s", risk: "28%" },
    { name: "STAY OUT - CONSERVE stint", visits: 180, time: "92.0s", risk: "11%" },
    { name: "BOX NOW - SOFT tyres stint", visits: 60, time: "114.4s", risk: "4%" }
  ];

  return (
    <section className="py-24 px-6 w-full max-w-[1400px] mx-auto border-t border-border-dark bg-[#050505]/40">
      
      <div className="grid grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Animated MCTS Strategy Tree Visualizer */}
        <div className="col-span-12 lg:col-span-6 relative flex items-center justify-center min-h-[350px]">
          {/* Cyberpunk grid overlay lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* SVG Strategy Tree */}
          <svg className="w-full max-w-[450px] h-[320px] text-f1-red" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glowGreen">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Tree Branch Links */}
            <path d="M 200,50 L 80,150" stroke={activeSearchIndex === 1 ? "#ff1e1e" : "#222"} strokeWidth={activeSearchIndex === 1 ? 3.5 : 2} className="transition-all" />
            <path d="M 200,50 L 200,150" stroke={activeSearchIndex === 2 ? "#ff1e1e" : "#222"} strokeWidth={activeSearchIndex === 2 ? 3.5 : 2} className="transition-all" />
            <path d="M 200,50 L 320,150" stroke={activeSearchIndex === 3 ? "#ff1e1e" : "#222"} strokeWidth={activeSearchIndex === 3 ? 3.5 : 2} className="transition-all" />

            <path d="M 80,150 L 50,240" stroke="#222" strokeWidth="1.5" />
            <path d="M 80,150 L 110,240" stroke="#222" strokeWidth="1.5" />

            {/* Nodes */}
            {/* Root Node */}
            <circle cx="200" cy="50" r="16" fill="#111" stroke={activeSearchIndex === 0 ? "#ff1e1e" : "#333"} strokeWidth="3.5" className="transition-all" />
            <text x="200" y="54" fill="#ffffff" fontSize="9" fontFamily="Share Tech Mono" textAnchor="middle">ROOT</text>

            {/* Child Node 1: PUSH */}
            <g>
              <circle cx="80" cy="150" r="14" fill="#111" stroke={activeSearchIndex === 1 ? "#ff1e1e" : "#333"} strokeWidth="2.5" className="transition-all" />
              <text x="80" y="153" fill={activeSearchIndex === 1 ? "#ff1e1e" : "#888"} fontSize="8" fontFamily="Share Tech Mono" textAnchor="middle">PUSH</text>
              <text x="80" y="180" fill="#aaaaaa" fontSize="7" fontFamily="Share Tech Mono" textAnchor="middle">Win: 64%</text>
            </g>

            {/* Child Node 2: CONSERVE */}
            <g>
              <circle cx="200" cy="150" r="14" fill="#111" stroke={activeSearchIndex === 2 ? "#ff1e1e" : "#333"} strokeWidth="2.5" className="transition-all" />
              <text x="200" y="153" fill={activeSearchIndex === 2 ? "#ff1e1e" : "#888"} fontSize="8" fontFamily="Share Tech Mono" textAnchor="middle">CONS</text>
              <text x="200" y="180" fill="#aaaaaa" fontSize="7" fontFamily="Share Tech Mono" textAnchor="middle">Win: 52%</text>
            </g>

            {/* Child Node 3: BOX */}
            <g>
              <circle cx="320" cy="150" r="14" fill="#111" stroke={activeSearchIndex === 3 ? "#ff1e1e" : "#333"} strokeWidth="2.5" className="transition-all" />
              <text x="320" y="153" fill={activeSearchIndex === 3 ? "#ff1e1e" : "#888"} fontSize="8" fontFamily="Share Tech Mono" textAnchor="middle">BOX</text>
              <text x="320" y="180" fill="#aaaaaa" fontSize="7" fontFamily="Share Tech Mono" textAnchor="middle">Win: 41%</text>
            </g>

            {/* Sub-Children */}
            <circle cx="50" cy="240" r="6" fill="#222" stroke="#444" strokeWidth="1.5" />
            <circle cx="110" cy="240" r="6" fill="#222" stroke="#444" strokeWidth="1.5" />

            {/* Active search scanner laser */}
            <line x1="10" y1={80 + activeSearchIndex * 45} x2="390" y2={80 + activeSearchIndex * 45} stroke="#ff1e1e" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          </svg>

          {/* Current Rollout HUD Stats */}
          <div className="absolute bottom-2 left-6 bg-black/80 border border-f1-red/30 p-2.5 rounded text-[10px] font-telemetry tracking-wider text-text-secondaryDark space-y-0.5 z-10 neon-glow-red">
            <span className="text-f1-red font-black block border-b border-f1-red/20 pb-0.5 mb-1.5">// RECURSIVE NODE MATRIX</span>
            <div>NODE ID: <strong className="text-white">{searchStates[activeSearchIndex].name}</strong></div>
            <div>ROLLOUT VISITS: <strong className="text-white">{searchStates[activeSearchIndex].visits}</strong></div>
            <div>EST. LAP COST: <strong className="text-white">{searchStates[activeSearchIndex].time}</strong></div>
            <div>HRP RISK PENALTY: <strong className="text-f1-red">{searchStates[activeSearchIndex].risk}</strong></div>
          </div>
        </div>

        {/* Right Side: Copy & Specs */}
        <div className="col-span-12 lg:col-span-6 space-y-6 text-left">
          <span className="text-[10px] text-f1-red font-black font-telemetry tracking-widest uppercase block">
            // MONTE CARLO RACE PREDICTION
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            MONTE CARLO / MCTS STRATEGY ENGINE
          </h2>
          <p className="text-sm md:text-base text-text-secondaryDark leading-relaxed font-sans">
            F1 racing is highly dynamic. AEGIS employs a real-time **Monte Carlo Tree Search (MCTS)** decision engine. At each sector, it spawns hundreds of pathing rollouts, evaluating engine push limits, tyre compounds, fuel loads, weather radar precipitation cells, and driver stress to converge on mathematically optimal pit windows.
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs font-telemetry">
            <div className="p-3 bg-black/40 border border-border-dark rounded-lg flex items-center space-x-2">
              <Brain className="w-5 h-5 text-f1-red shrink-0" />
              <div>
                <span className="text-white font-bold block">120+ Node Depth</span>
                <span className="text-text-secondaryDark text-[10px] uppercase">Explores complex stints</span>
              </div>
            </div>

            <div className="p-3 bg-black/40 border border-border-dark rounded-lg flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-bold block">Undercut Defence</span>
                <span className="text-text-secondaryDark text-[10px] uppercase">Reacts to rival boxes</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
