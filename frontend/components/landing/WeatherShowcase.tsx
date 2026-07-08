import React, { useState } from "react";
import { GlassCard } from "../shared/GlassCard";
import { CloudRain, Sun, Cloud, AlertTriangle } from "lucide-react";

export function WeatherShowcase() {
  const [activeWeather, setActiveWeather] = useState<"dry" | "damp" | "wet" | "heavy">("dry");

  const weatherStates = {
    dry: {
      title: "Dry Stint",
      rain: 0,
      grip: 1.0,
      wear: "Standard",
      stress: "Optimal (12%)",
      tyre: "SOFT / MEDIUM Slicks",
      desc: "Maximum aerodynamic grip. Tyre temperatures hover at 95°C. DRS active.",
      icon: <Sun className="w-6 h-6 text-amber-400" />,
      color: "border-amber-400/20 bg-amber-400/5",
      gripColor: "text-emerald-400"
    },
    damp: {
      title: "Damp Patches",
      rain: 25,
      grip: 0.82,
      wear: "1.3x Elevated",
      stress: "Elevated (34%)",
      tyre: "MEDIUM / INTERMEDIATES",
      desc: "Damp spots forming in Sector 2 chicanes. Core slicks struggle with micro-slips.",
      icon: <Cloud className="w-6 h-6 text-blue-300" />,
      color: "border-blue-400/20 bg-blue-400/5",
      gripColor: "text-yellow-400"
    },
    wet: {
      title: "Rain Active",
      rain: 60,
      grip: 0.64,
      wear: "1.8x Slips",
      stress: "High Stress (58%)",
      tyre: "INTERMEDIATE / WETS",
      desc: "Standing water forming. Slicks lose thermal grip completely. Box now required.",
      icon: <CloudRain className="w-6 h-6 text-blue-500" />,
      color: "border-blue-600/30 bg-blue-600/5",
      gripColor: "text-orange-500"
    },
    heavy: {
      title: "Monsoon Storm",
      rain: 100,
      grip: 0.42,
      wear: "Extreme flat-spotting",
      stress: "Critical (82%)",
      tyre: "HEAVY WETS mandatory",
      desc: "Severe hydroplaning risk. Track water depth >4.0 mm. Safety car highly probable.",
      icon: <AlertTriangle className="w-6 h-6 text-f1-red animate-pulse" />,
      color: "border-f1-red/40 bg-f1-red/5",
      gripColor: "text-f1-red"
    }
  };

  const curr = weatherStates[activeWeather];

  return (
    <section className="py-24 px-6 w-full max-w-[1400px] mx-auto border-t border-border-dark">
      
      <div className="grid grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Storytelling */}
        <div className="col-span-12 lg:col-span-5 space-y-6 text-left">
          <span className="text-[10px] text-f1-red font-black font-telemetry tracking-widest uppercase block">
            // ENVIRONMENTAL DATA OVERRIDES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            DYNAMIC WEATHER PHYSICS ENGINE
          </h2>
          <p className="text-sm md:text-base text-text-secondaryDark leading-relaxed font-sans">
            Weather changes race strategy in seconds. The AEGIS **Weather Engine** continuously simulates precipitation cells. A shift in track water depth alters braking distances and drops tire friction, forcing the strategy engine to decide between slick stay-outs or wet pit box transitions.
          </p>

          {/* Interactive weather buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {(["dry", "damp", "wet", "heavy"] as const).map((wKey) => (
              <button
                key={wKey}
                onClick={() => setActiveWeather(wKey)}
                className={`py-2.5 rounded border text-[9px] font-black font-telemetry tracking-wider uppercase transition-all duration-300 ${
                  activeWeather === wKey
                    ? "bg-f1-red border-f1-red text-white shadow-[0_0_12px_rgba(255,30,30,0.3)]"
                    : "border-border-dark text-text-secondaryDark hover:text-white hover:bg-white/5"
                }`}
              >
                {wKey === "heavy" ? "MONSOON" : wKey}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Biometric Dashboard Hud */}
        <div className="col-span-12 lg:col-span-7">
          <GlassCard className={`p-6 border transition-all duration-500 ${curr.color}`}>
            <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-black/40 border border-border-dark rounded-lg">
                  {curr.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase leading-none">
                    {curr.title}
                  </h3>
                  <span className="text-[9px] text-text-secondaryDark font-telemetry uppercase tracking-wider block mt-1">
                    Radar Status: {curr.rain}% precipitation
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black font-telemetry text-f1-red bg-f1-red/10 border border-f1-red/20 px-2 py-0.5 rounded">
                SIMULATION LEVEL {curr.rain > 50 ? "CRITICAL" : "OK"}
              </span>
            </div>

            {/* Environmental HUD meters */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-telemetry">
              <div className="p-3 bg-black/40 border border-border-dark rounded-lg">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Track Friction Grip</span>
                <span className={`text-xl font-black ${curr.gripColor} block mt-0.5`}>
                  {curr.grip} x multiplier
                </span>
              </div>
              <div className="p-3 bg-black/40 border border-border-dark rounded-lg">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Recommended Compound</span>
                <span className="text-white font-bold block mt-0.5">
                  {curr.tyre}
                </span>
              </div>
              <div className="p-3 bg-black/40 border border-border-dark rounded-lg">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Tyre Wear Penalty</span>
                <span className="text-white font-bold block mt-0.5">
                  {curr.wear}
                </span>
              </div>
              <div className="p-3 bg-black/40 border border-border-dark rounded-lg">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Driver Biometric Stress</span>
                <span className="text-white font-bold block mt-0.5">
                  {curr.stress}
                </span>
              </div>
            </div>

            <p className="text-xs text-text-secondaryDark leading-relaxed font-sans border-t border-border-light dark:border-border-dark pt-3">
              {curr.desc}
            </p>
          </GlassCard>
        </div>

      </div>

    </section>
  );
}
