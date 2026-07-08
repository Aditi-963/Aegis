import React, { useState } from "react";
import { GlassCard } from "../shared/GlassCard";
import { Play, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

interface InteractivePreviewProps {
  onEnterSim: () => void;
}

export function InteractivePreview({ onEnterSim }: InteractivePreviewProps) {
  const [compound, setCompound] = useState<"SOFT" | "MEDIUM" | "HARD" | "WET">("MEDIUM");
  const [rain, setRain] = useState(0.0); // 0 to 1
  const [aggression, setAggression] = useState(0.5); // 0 to 1
  const [fatigue, setFatigue] = useState(0.1); // 0 to 1
  const [mode, setMode] = useState<"PUSH" | "CONSERVE">("CONSERVE");

  // Dynamic Strategy Laboratory Physics Simulation
  const simulateMetrics = () => {
    // 1. Base wear rates
    const wearRates = { SOFT: 4.2, MEDIUM: 2.4, HARD: 1.4, WET: 1.2 };
    let baseWear = wearRates[compound];
    if (compound === "WET" && rain < 0.2) baseWear = 8.0; // Wets shred on dry track
    if (mode === "PUSH") baseWear *= 1.6;
    baseWear *= (1.0 + aggression * 0.5);
    const wearRate = Math.round(baseWear * 10) / 10;

    // 2. Grip multipliers
    let compGrip = 1.0;
    if (compound === "SOFT") compGrip = rain < 0.1 ? 1.05 : rain < 0.5 ? 0.6 : 0.25;
    else if (compound === "MEDIUM") compGrip = rain < 0.1 ? 1.0 : rain < 0.5 ? 0.55 : 0.2;
    else if (compound === "HARD") compGrip = rain < 0.1 ? 0.95 : rain < 0.5 ? 0.5 : 0.15;
    else if (compound === "WET") compGrip = rain < 0.1 ? 0.6 : rain < 0.5 ? 0.84 : 0.96;

    // 3. Driver cognitive delay & HRP
    const focus = 1.0 - fatigue * 0.4;
    const stress = 0.15 + (1.0 - compGrip) * 0.45 + aggression * 0.15;
    const cognitiveEfficiency = focus * (1.0 - fatigue * 0.3) * (1.0 - stress * 0.22);
    const hrp = Math.round((1.0 - cognitiveEfficiency) * 100);

    // 4. Lap Time Simulation (Reference Silverstone base is 90.0s)
    let lapTime = 90.0;
    
    // Mode deltas
    lapTime += mode === "PUSH" ? -0.8 : 0.5;
    // Wear delta
    lapTime += baseWear * 0.25;
    // Grip/Precipitation penalty
    lapTime += (1.0 - compGrip) * 12.0;
    // Driver lag
    lapTime += (hrp / 100) * 3.5;
    
    const formattedLapTime = Math.round(lapTime * 1000) / 1000;
    const minutes = Math.floor(formattedLapTime / 60);
    const seconds = Math.floor(formattedLapTime % 60);
    const ms = Math.floor((formattedLapTime % 1) * 1000);
    
    const lapString = `${minutes}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;

    // Mistake risk %
    const risk = Math.min(98, Math.round((hrp / 100) ** 2.2 * 100 + aggression * 10));

    return {
      wearRate,
      hrp,
      risk,
      lapString
    };
  };

  const metrics = simulateMetrics();

  return (
    <section className="py-24 px-6 w-full max-w-[1400px] mx-auto border-t border-border-dark bg-[#050505]/20">
      
      {/* Header */}
      <div className="max-w-3xl mb-16 space-y-4">
        <span className="text-[10px] text-f1-red font-black font-telemetry tracking-widest uppercase block">
          // CYBER-PHYSICAL SYSTEM LABORATORY
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
          INTERACTIVE AI STRATEGY PREVIEW
        </h2>
        <p className="text-sm md:text-base text-text-secondaryDark font-sans leading-relaxed">
          Before entering the tactical F1 command cockpit, test your strategic configurations in the AEGIS sandboxed prediction lab. Tweak compound stints, weather radars, and driver biological fatigue coefficients to inspect estimated lap times and HRP safety margins instantly.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Parameters Slider Panel */}
        <div className="col-span-12 lg:col-span-6">
          <GlassCard className="p-6 border border-border-dark flex flex-col justify-between h-full space-y-6">
            <span className="text-[10px] text-text-secondaryDark font-telemetry uppercase tracking-wider block">
              Sandbox Parameters Control
            </span>

            {/* Compound Select */}
            <div className="space-y-2">
              <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry block">STINT TYRE COMPOUND</span>
              <div className="grid grid-cols-4 gap-2">
                {(["SOFT", "MEDIUM", "HARD", "WET"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCompound(c)}
                    className={`py-2 rounded text-[10px] font-black font-telemetry transition-all ${
                      compound === c
                        ? "bg-f1-red border border-f1-red text-white"
                        : "bg-black/40 border border-border-dark text-text-secondaryDark hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Engine Modes */}
            <div className="space-y-2">
              <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry block">ENGINE FUEL MODE</span>
              <div className="grid grid-cols-2 gap-2">
                {(["PUSH", "CONSERVE"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`py-2 rounded text-[10px] font-black font-telemetry transition-all ${
                      mode === m
                        ? "bg-f1-red border border-f1-red text-white"
                        : "bg-black/40 border border-border-dark text-text-secondaryDark hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Precipitation Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-telemetry uppercase text-text-secondaryDark">
                <span>Weather Radar (Rain Intensity)</span>
                <span className="text-blue-400 font-bold">{Math.round(rain * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.0" 
                step="0.05"
                value={rain}
                onChange={(e) => setRain(parseFloat(e.target.value))}
                className="w-full accent-blue-500 bg-neutral-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Aggression Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-telemetry uppercase text-text-secondaryDark">
                <span>Driver Track Aggression</span>
                <span className="text-f1-accent font-bold">{Math.round(aggression * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.0" 
                step="0.05"
                value={aggression}
                onChange={(e) => setAggression(parseFloat(e.target.value))}
                className="w-full accent-f1-red bg-neutral-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Fatigue Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-telemetry uppercase text-text-secondaryDark">
                <span>Driver Biometric Fatigue</span>
                <span className="text-white font-bold">{Math.round(fatigue * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.0" 
                step="0.05"
                value={fatigue}
                onChange={(e) => setFatigue(parseFloat(e.target.value))}
                className="w-full accent-f1-red bg-neutral-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

          </GlassCard>
        </div>

        {/* Right Side: Dynamic Outputs HUD */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between">
          <GlassCard className="p-6 border border-border-dark flex-grow flex flex-col justify-between space-y-6">
            
            <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-3">
              <span className="text-[10px] text-text-secondaryDark font-telemetry uppercase tracking-wider">
                Real-Time Sandbox Forecast
              </span>
              <Sparkles className="w-4 h-4 text-f1-red animate-pulse" />
            </div>

            {/* Estimated Lap Time HUD display */}
            <div className="text-center py-4 bg-black/40 border border-border-dark rounded-xl p-4">
              <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider block">Estimated Lap Time (Silverstone)</span>
              <span className="text-4xl sm:text-5xl font-black font-telemetry tracking-tighter text-white block mt-1 select-all">
                {metrics.lapString}
              </span>
            </div>

            {/* Secondary variables grids */}
            <div className="grid grid-cols-3 gap-3 text-xs font-telemetry">
              <div className="p-2.5 bg-black/30 border border-border-dark rounded text-center">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Wear Rate</span>
                <span className="text-base font-black text-white block mt-0.5">{metrics.wearRate}% <span className="text-[10px] font-medium text-text-secondaryDark block">/ lap</span></span>
              </div>
              
              <div className="p-2.5 bg-black/30 border border-border-dark rounded text-center">
                <span className="text-[9px] uppercase text-text-secondaryDark block">HRP Score</span>
                <span className={`text-base font-black block mt-0.5 ${metrics.hrp > 40 ? "text-f1-red" : "text-white"}`}>{metrics.hrp}%</span>
              </div>

              <div className="p-2.5 bg-black/30 border border-border-dark rounded text-center">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Mistake Risk</span>
                <span className={`text-base font-black block mt-0.5 ${metrics.risk > 45 ? "text-f1-red" : "text-emerald-400"}`}>{metrics.risk}%</span>
              </div>
            </div>

            {/* Safety status footer */}
            <div className="flex items-center space-x-2 text-[10px] uppercase font-telemetry border-t border-border-light dark:border-border-dark pt-3 text-text-secondaryDark justify-between">
              <div className="flex items-center space-x-1.5">
                {metrics.risk > 40 ? (
                  <AlertTriangle className="w-4 h-4 text-f1-red shrink-0 animate-bounce" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>Safety Rating: <strong className={metrics.risk > 40 ? "text-f1-red" : "text-emerald-400"}>{metrics.risk > 40 ? "CRITICAL LOCK-UP HAZARD" : "STABLE LAB PACE"}</strong></span>
              </div>
              <span className="text-f1-red font-black">STINT CONFIG SECURED</span>
            </div>

          </GlassCard>

          {/* Epic CTA Enter Simulation Boot Trigger */}
          <button
            onClick={onEnterSim}
            className="w-full mt-4 py-4 rounded-xl bg-f1-red hover:bg-f1-accent text-white font-black text-sm uppercase font-telemetry tracking-widest shadow-[0_0_25px_rgba(255,30,30,0.5)] flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>BOOT AEGIS LIVE RIVALRY SIMULATOR</span>
          </button>
        </div>

      </div>

    </section>
  );
}
