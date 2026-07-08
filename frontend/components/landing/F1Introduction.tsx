import React from "react";
import { GlassCard } from "../shared/GlassCard";
import { Compass, Database, Cpu, Activity } from "lucide-react";

export function F1Introduction() {
  const steps = [
    {
      year: "1950s",
      title: "Mechanical Era",
      desc: "Purely mechanical cars driven by intuition and mechanical gut-feeling. Zero telemetry. High driver mortality.",
      icon: <Compass className="w-5 h-5 text-neutral-500" />,
      tag: "MECHANICAL FEEL",
      border: "border-neutral-800"
    },
    {
      year: "1980s",
      title: "Telemetry Revolution",
      desc: "Sensor telemetry introduced. Teams collect live RPM, speed, and gear logs. Data analysis remains historical.",
      icon: <Database className="w-5 h-5 text-blue-400" />,
      tag: "DATA LOGGING",
      border: "border-blue-500/20"
    },
    {
      year: "2000s",
      title: "Strategy AI",
      desc: "Monte Carlo strategy simulations running on server farms off-site. Predicts tyre degradation and pit windows.",
      icon: <Cpu className="w-5 h-5 text-yellow-500" />,
      tag: "PREDICTIVE MATH",
      border: "border-yellow-500/20"
    },
    {
      year: "2025+",
      title: "AEGIS Human-Aware Strategy",
      desc: "Futuristic cyber-physical platform simulating vehicles, weather, and the driver's biological constraints (fatigue, stress, delay).",
      icon: <Activity className="w-5 h-5 text-f1-red" />,
      tag: "HUMAN INTEGRATED AI",
      border: "border-f1-red/40 neon-glow-red"
    }
  ];

  return (
    <section className="py-24 px-6 w-full max-w-[1400px] mx-auto border-t border-border-dark">
      
      {/* Narrative Section Header */}
      <div className="max-w-3xl mb-16 space-y-4">
        <span className="text-[10px] text-f1-red font-black font-telemetry tracking-widest uppercase block">
          // HISTORICAL INTELLIGENCE MATRIX
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
          THE EVOLUTION OF RACE INTELLIGENCE
        </h2>
        <p className="text-sm md:text-base text-text-secondaryDark font-sans leading-relaxed">
          Motorsport strategy has shifted from purely mechanical intuition to complex predictive computational algorithms. However, traditional models ignore the most variable component in the loop: **The Human Driver.**
        </p>
      </div>

      {/* Narrative Timeline Horizontal Rows / Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <GlassCard 
            key={idx} 
            className={`
              flex flex-col justify-between p-6 transition-all duration-300 transform hover:scale-[1.03] hover:bg-white/5 border
              ${step.border}
            `}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black font-telemetry text-white/20 select-none">
                  {step.year}
                </span>
                <div className="p-2 rounded bg-black/40 border border-border-dark">
                  {step.icon}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-black font-telemetry text-f1-red tracking-wider uppercase block mb-1">
                  {step.tag}
                </span>
                <h3 className="text-lg font-bold uppercase text-white leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-text-secondaryDark mt-2.5 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            </div>

            <div className="border-t border-border-dark pt-3 mt-6 flex items-center justify-between text-[10px] font-telemetry text-text-secondaryDark uppercase">
              <span>Status</span>
              <span className={step.year === "2025+" ? "text-f1-red font-black animate-pulse" : "text-neutral-500"}>
                {step.year === "2025+" ? "ACTIVE AEGIS CORE" : "DEPRECATED"}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

    </section>
  );
}
