import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Cpu, ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onEnterSim: () => void;
  onScrollToExplain: () => void;
}

export function HeroSection({ onEnterSim, onScrollToExplain }: HeroSectionProps) {
  const [telemetryValues, setTelemetryValues] = useState({
    speed: 312,
    rpm: 12400,
    temp: 98,
    ers: 94,
    hrp: 18
  });

  // Telemetry stream animations
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryValues({
        speed: Math.round(300 + Math.random() * 25),
        rpm: Math.round(12100 + Math.random() * 800),
        temp: Math.round(92 + Math.random() * 12),
        ers: Math.round(80 + Math.random() * 20),
        hrp: Math.round(10 + Math.random() * 25)
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#050505] text-white overflow-hidden py-8 px-6">
      
      {/* 1. Immersive Ambient Backdrops */}
      {/* Red Cybernetic radial glowing hotspots */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-f1-red/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-f1-red/5 rounded-full filter blur-[150px] pointer-events-none animate-pulse" />

      {/* Cyberpunk grid overlay lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,30,30,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,30,30,0.015)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Rain particles trail overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1518818419601-72c8673f5852?q=80&w=2070')] bg-cover bg-center" />

      {/* 2. Top Header Brand Bar */}
      <div className="w-full max-w-[1400px] flex items-center justify-between z-20">
        <div className="flex items-center space-x-2.5">
          <svg className="w-8 h-8 text-f1-red filter drop-shadow-[0_0_8px_rgba(255,30,30,0.7)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L85 25V55C85 75 70 88 50 93C30 88 15 75 15 55V25L50 10Z" fill="currentColor" fillOpacity="0.2" stroke="#ff1e1e" strokeWidth="4" />
            <path d="M30 45H70" stroke="#ff1e1e" strokeWidth="6" strokeLinecap="round" />
            <path d="M35 58H65" stroke="#ff1e1e" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <div>
            <span className="text-lg font-black tracking-tighter uppercase neon-text-red">
              AEGIS<span className="text-white text-xs font-semibold ml-1.5 border border-f1-red px-1 rounded">PLATFORM</span>
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-[11px] font-telemetry tracking-widest text-text-secondaryDark uppercase">
          <span className="hover:text-white transition-colors cursor-pointer" onClick={onScrollToExplain}>Technology</span>
          <span className="hover:text-white transition-colors cursor-pointer">HDM Cognition</span>
          <span className="hover:text-white transition-colors cursor-pointer">MCTS Optimizer</span>
          <span className="hover:text-white transition-colors cursor-pointer">Weather Physics</span>
        </div>
      </div>

      {/* 3. Central Cinematic Pitch Column */}
      <div className="w-full max-w-[1200px] grid grid-cols-12 gap-8 flex-grow items-center z-10 my-8">
        
        {/* Left Hand: Cinematic Copywriting */}
        <div className="col-span-12 lg:col-span-7 space-y-6 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block bg-f1-red/10 border border-f1-red/30 px-3 py-1 rounded text-[10px] font-black tracking-widest text-f1-red uppercase font-telemetry"
          >
            Classified Race Intelligence // System Version 1.0.4
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white"
          >
            WHERE HUMAN LIMITS<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-f1-red via-f1-accent to-white filter drop-shadow-[0_0_15px_rgba(255,30,30,0.3)]">
              MEET MACHINE STRATEGY
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm md:text-base text-text-secondaryDark leading-relaxed max-w-xl font-sans"
          >
            Real-time Formula-1 strategy simulation combining advanced vehicle physics, dynamic weather cells, and the proprietary **Human Driver Model** (HDM) to optimize track performance.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={onEnterSim}
              className="px-8 py-3 rounded-lg bg-f1-red hover:bg-f1-accent text-white font-black text-xs uppercase font-telemetry tracking-widest shadow-[0_0_20px_rgba(255,30,30,0.5)] flex items-center space-x-2 transition-all duration-300 transform hover:scale-[1.03]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ENTER SIMULATION</span>
            </button>
            <button
              onClick={onScrollToExplain}
              className="px-8 py-3 rounded-lg border border-border-dark hover:border-white text-white font-black text-xs uppercase font-telemetry tracking-widest bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
            >
              <Cpu className="w-4 h-4" />
              <span>SYSTEM SPECS</span>
            </button>
          </motion.div>
        </div>

        {/* Right Hand: Holographic Interactive Car & HUD */}
        <div className="col-span-12 lg:col-span-5 relative flex items-center justify-center min-h-[300px]">
          
          {/* Glowing HUD Ring Visualizer */}
          <div className="absolute w-80 h-80 rounded-full border border-dashed border-f1-red/20 animate-[spin_40s_linear_infinite] flex items-center justify-center">
            <div className="w-72 h-72 rounded-full border border-double border-f1-red/10 flex items-center justify-center">
              <div className="w-60 h-60 rounded-full border border-f1-red/5" />
            </div>
          </div>

          {/* Animated Speed Lines */}
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-f1-red to-transparent opacity-30 animate-pulse top-1/4" />
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-f1-red to-transparent opacity-20 animate-pulse bottom-1/4" />

          {/* Glowing SVG F1 Car Overlay */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="z-10 w-full max-w-[380px] drop-shadow-[0_0_25px_rgba(255,30,30,0.55)]"
          >
            <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-f1-red">
              {/* Animated racing speed trails */}
              <path d="M 50,110 L 150,110 M 80,130 L 180,130" stroke="#ff1e1e" strokeWidth="2" strokeDasharray="10 5" opacity="0.6" className="animate-pulse" />
              {/* Silhouette of F1 car */}
              <path d="M120 120 C140 100, 200 90, 230 90 C250 90, 270 100, 280 120 C290 120, 310 115, 320 125 C330 135, 340 135, 350 135 H360 C370 135, 375 140, 370 145 C360 155, 320 155, 290 155 C260 155, 200 155, 170 155 C140 155, 130 145, 120 145 H110 C100 145, 95 140, 95 135 H105 C115 135, 118 120, 120 120 Z" fill="none" stroke="currentColor" strokeWidth="4" />
              {/* Under-glow neon floor */}
              <path d="M 90,165 L 380,165" stroke="currentColor" strokeWidth="3" opacity="0.4" />
              <path d="M 120,165 L 350,165" stroke="#ff1e1e" strokeWidth="6" opacity="0.7" className="animate-pulse" />
              {/* Front and rear wings */}
              <rect x="75" y="125" width="20" height="25" fill="none" stroke="currentColor" strokeWidth="3" />
              <rect x="365" y="115" width="22" height="35" fill="none" stroke="currentColor" strokeWidth="3" />
              {/* Wheels */}
              <circle cx="145" cy="150" r="22" fill="#0c0c0c" stroke="currentColor" strokeWidth="4" />
              <circle cx="315" cy="150" r="22" fill="#0c0c0c" stroke="currentColor" strokeWidth="4" />
              {/* Inner core biometric lines */}
              <path d="M 230,95 Q 210,130 200,140" stroke="#22c55e" strokeWidth="2.5" opacity="0.8" className="animate-pulse" />
            </svg>
          </motion.div>

          {/* Floating Telemetry HUD Matrix Panel */}
          <div className="absolute top-2 right-2 bg-black/80 border border-f1-red/30 p-2.5 rounded text-[10px] font-telemetry tracking-wider text-text-secondaryDark space-y-1 z-20 neon-glow-red select-none">
            <span className="text-f1-red font-black block border-b border-f1-red/20 pb-0.5 mb-1.5">// LIVE MATRIX</span>
            <div>SPEED: <strong className="text-white">{telemetryValues.speed} KM/H</strong></div>
            <div>RPM: <strong className="text-white">{telemetryValues.rpm}</strong></div>
            <div>TYRE TEMP: <strong className="text-white">{telemetryValues.temp}°C</strong></div>
            <div>ERS BATTERY: <strong className="text-emerald-400">{telemetryValues.ers}%</strong></div>
            <div className="text-f1-accent">HRP RISK: <strong>{telemetryValues.hrp}%</strong></div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Scroller HUD */}
      <div className="w-full max-w-[1400px] flex items-center justify-between z-20">
        <div className="text-[10px] text-text-secondaryDark font-telemetry tracking-widest uppercase">
          [ SCROLL DOWN TO INITIALIZE DATA ]
        </div>
        <button 
          onClick={onScrollToExplain}
          className="p-2 rounded-full border border-border-dark hover:border-white hover:bg-white/5 text-text-secondaryDark hover:text-white transition-all duration-300 animate-bounce"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
}
