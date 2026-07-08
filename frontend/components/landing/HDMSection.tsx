import React, { useState, useEffect } from "react";
import { GlassCard } from "../shared/GlassCard";
import { Activity, ShieldAlert, Brain, Zap } from "lucide-react";

export function HDMSection() {
  const [fatigue, setFatigue] = useState(0.2); // 0 to 1
  const [stress, setStress] = useState(0.3); // 0 to 1

  // Derived biometric variables
  const focus = Math.max(0.2, Math.round((1.0 - fatigue * 0.4) * (1.0 + (stress < 0.6 ? stress * 0.1 : -((stress - 0.6) * 0.6))) * 100) / 100);
  const cognitiveEfficiency = Math.max(0.1, Math.round(focus * (1.0 - fatigue * 0.35) * (1.0 - stress * 0.25) * 100));
  const hrp = 100 - cognitiveEfficiency;
  const reactionDelay = Math.round((0.15 + fatigue * 0.12 + stress * 0.08) * 1000);

  // Generate dynamic heartbeat line coordinates
  const [heartbeatPath, setHeartbeatPath] = useState("");
  useEffect(() => {
    // Generate heart rate waves matching stress
    const points = [];
    const bpm = 120 + stress * 60;
    const spacing = 12;
    
    for (let i = 0; i <= 30; i++) {
      const x = i * spacing;
      let y = 40;
      if (i % 6 === 0) {
        y = 15; // Spike up
      } else if (i % 6 === 1) {
        y = 65; // Spike down
      }
      points.push(`${x},${y}`);
    }
    setHeartbeatPath(`M ${points.join(" L ")}`);
  }, [stress]);

  return (
    <section className="py-24 px-6 w-full max-w-[1400px] mx-auto border-t border-border-dark">
      
      <div className="grid grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Interactive Driver Brain Laboratory */}
        <div className="col-span-12 lg:col-span-6 space-y-6 text-left">
          <span className="text-[10px] text-f1-red font-black font-telemetry tracking-widest uppercase block">
            // NEURO-BIOMETRIC MODELING LAB
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            THE HUMAN DRIVER LIMITATION (HDM)
          </h2>
          <p className="text-sm md:text-base text-text-secondaryDark leading-relaxed font-sans">
            Under severe G-force loads, high tyre wear, and wet weather transitions, F1 drivers suffer cognitive decay. The proprietary AEGIS HDM mathematically integrates mental fatigue and operational stress, generating the **Human Risk Penalty (HRP)** to modulate real-time decision safety.
          </p>

          {/* Sliders Laboratory */}
          <GlassCard className="p-5 space-y-4 border border-border-dark">
            <span className="text-[10px] text-text-secondaryDark font-telemetry tracking-wider uppercase block">
              Adjust Driver Biomarker Overrides
            </span>

            {/* Fatigue Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-telemetry uppercase text-text-secondaryDark">
                <span>Driver Fatigue</span>
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

            {/* Stress Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-telemetry uppercase text-text-secondaryDark">
                <span>Operational Stress</span>
                <span className="text-white font-bold">{Math.round(stress * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.0" 
                step="0.05"
                value={stress}
                onChange={(e) => setStress(parseFloat(e.target.value))}
                className="w-full accent-f1-red bg-neutral-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Biometric Neural Command Center Grid */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
          
          {/* Reaction Delay Card */}
          <GlassCard className="flex flex-col justify-between p-5 text-center border border-border-dark hover:border-f1-red/30 transition-all duration-300">
            <div className="flex items-center justify-between text-[10px] text-text-secondaryDark font-telemetry uppercase">
              <span>Reaction Delay</span>
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <div className="my-4">
              <span className="text-4xl font-black font-telemetry tracking-tight text-white leading-none">
                {reactionDelay}
              </span>
              <span className="text-xs font-telemetry text-text-secondaryDark block uppercase mt-1">Milliseconds</span>
            </div>
            <span className="text-[9px] text-text-secondaryDark uppercase font-telemetry">
              {reactionDelay > 220 ? "CRITICAL COGNITIVE LAG" : "OPTIMAL SYNC SPEED"}
            </span>
          </GlassCard>

          {/* Biometric ECG Heart-Rate Monitor */}
          <GlassCard className="flex flex-col justify-between p-5 border border-border-dark hover:border-f1-red/30 transition-all duration-300">
            <div className="flex items-center justify-between text-[10px] text-text-secondaryDark font-telemetry uppercase">
              <span>ECG Stress Waveform</span>
              <Activity className="w-3.5 h-3.5 text-f1-red animate-pulse" />
            </div>
            <div className="my-3 flex items-center justify-center bg-black/40 border border-border-dark rounded p-2 h-16 relative overflow-hidden">
              <svg className="w-full h-full text-f1-red" viewBox="0 0 350 80">
                <path d={heartbeatPath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex justify-between text-[9px] font-telemetry text-text-secondaryDark uppercase">
              <span>EST. PULSE:</span>
              <span className="text-f1-red font-bold">{Math.round(120 + stress * 60)} BPM</span>
            </div>
          </GlassCard>

          {/* Cognitive Efficiency Ring */}
          <GlassCard className="col-span-2 p-5 flex items-center justify-between border border-border-dark hover:border-f1-red/30 transition-all duration-300">
            <div className="space-y-2 max-w-[60%]">
              <div className="flex items-center space-x-1.5">
                <Brain className="w-4 h-4 text-f1-red" />
                <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry">BIOMETRIC COEFFICIENT</span>
              </div>
              <h3 className="text-base font-bold text-white uppercase leading-tight">
                HRP RISK FACTOR: <span className="text-f1-red font-black">{hrp}%</span>
              </h3>
              <p className="text-[10px] text-text-secondaryDark font-sans leading-relaxed">
                As fatigue and stress accumulate, focus efficiency degrades by **{100 - cognitiveEfficiency}%**, increasing lock-up risks and tyre sliding.
              </p>
            </div>

            {/* Circular Ring Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#ff1e1e" 
                  strokeWidth="8" 
                  strokeDasharray={`${cognitiveEfficiency * 2.51} 251`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-black font-telemetry text-white">
                  {cognitiveEfficiency}%
                </span>
                <span className="text-[8px] text-text-secondaryDark uppercase tracking-wider block font-medium">CAPACITY</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </section>
  );
}
