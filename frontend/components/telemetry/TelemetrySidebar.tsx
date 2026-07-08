import React from "react";
import { useRaceStore } from "@/store/useRaceStore";
import { TelemetryCard } from "./TelemetryCard";
import { Gauge, Battery, Fuel, Compass, Disc } from "lucide-react";
import { GlassCard } from "../shared/GlassCard";

export function TelemetrySidebar() {
  const telemetry = useRaceStore((state) => state.telemetry);



  // Determine tire temperature safety colors
  const getTempColorClass = (temp: number, compound: string) => {
    const limits = compound === "WET" ? { min: 50, max: 80 } : { min: 72, max: 110 };
    if (temp > limits.max) return "text-red-500 font-bold";
    if (temp < limits.min) return "text-cyan-400 font-semibold";
    return "text-green-400";
  };

  const getTempBgClass = (temp: number, compound: string) => {
    const limits = compound === "WET" ? { min: 50, max: 80 } : { min: 72, max: 110 };
    if (temp > limits.max) return "bg-red-500/20 border-red-500/40";
    if (temp < limits.min) return "bg-cyan-500/20 border-cyan-500/40";
    return "bg-green-500/10 border-green-500/20";
  };

  // Determine wear warnings
  const isTireCritical = telemetry.tire_wear_avg > 0.65;

  return (
    <div className="space-y-4">
      {/* 1. Primary Speedometer / Gear Panel */}
      <GlassCard className="relative overflow-hidden flex flex-col items-center py-6">
        <div className="absolute top-2 left-3">
          <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider">VEHICLE VELOCITY</span>
        </div>

        {/* Speed and Gear circular telemetry arc */}
        <div className="relative w-44 h-44 mt-3 flex items-center justify-center">
          {/* Outer arc background */}
          <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
          {/* Colored throttle/speed arc */}
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-f1-red border-l-f1-red transition-all duration-300"
            style={{ transform: `rotate(${(telemetry.speed / 350) * 270}deg)` }}
          />

          <div className="text-center z-10">
            <span className="text-5xl font-black font-telemetry leading-none block tracking-tighter text-white">
              {Math.round(telemetry.speed)}
            </span>
            <span className="text-[10px] uppercase font-telemetry text-text-secondaryDark tracking-wider block">KM/H</span>
            
            {/* Gear Display */}
            <div className="mt-2 bg-f1-red/10 border border-f1-red/30 px-3 py-0.5 rounded-full inline-block">
              <span className="text-xs uppercase font-telemetry text-text-secondaryDark tracking-wider">GEAR</span>
              <span className="text-sm font-black text-f1-red ml-1 font-telemetry">{telemetry.gear}</span>
            </div>
          </div>
        </div>

        {/* DRS indicator */}
        {telemetry.drs_active && (
          <div className="absolute bottom-3 bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded tracking-widest animate-pulse font-telemetry">
            DRS ENABLED
          </div>
        )}
      </GlassCard>

      {/* 2. Throttle & Brake Pedals bar */}
      <GlassCard className="space-y-2.5">
        <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider block">PEDAL INPUTS</span>
        
        {/* Throttle */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-telemetry">
            <span className="text-emerald-400 font-bold uppercase">Throttle</span>
            <span className="text-emerald-400">{Math.round(telemetry.throttle * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-200"
              style={{ width: `${telemetry.throttle * 100}%` }}
            />
          </div>
        </div>

        {/* Brake */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-telemetry">
            <span className="text-f1-red font-bold uppercase">Brake Pressure</span>
            <span className="text-f1-red">{Math.round(telemetry.brake * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-f1-red h-full rounded-full transition-all duration-200"
              style={{ width: `${telemetry.brake * 100}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* 3. ERS and Fuel Grid */}
      <div className="grid grid-cols-2 gap-4">
        <TelemetryCard
          title="ERS Energy"
          value={`${Math.round(telemetry.ers_charge)}`}
          unit="%"
          icon={<Battery className="w-4 h-4 text-emerald-400" />}
          progress={telemetry.ers_charge}
          progressColor="bg-emerald-400"
          subValue={telemetry.ers_charge > 75 ? "DEPLOY LIMIT OK" : telemetry.ers_charge < 20 ? "CHARGE CRITICAL" : "HARVESTING ACTIVE"}
        />

        <TelemetryCard
          title="Fuel Load"
          value={`${telemetry.fuel_load}`}
          unit="kg"
          icon={<Fuel className="w-4 h-4 text-amber-500" />}
          progress={(telemetry.fuel_load / 110) * 100}
          progressColor="bg-amber-500"
          subValue={`Est. Laps: ${Math.round(telemetry.fuel_load / 1.1)}`}
          warning={telemetry.fuel_load < 8}
        />
      </div>

      {/* 4. G-Force Grid */}
      <GlassCard className="flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-2">
          <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider">G-FORCE SPECTROMETER</span>
          <Compass className="w-3.5 h-3.5 text-text-secondaryDark" />
        </div>

        {/* 2D Coordinate Grid Visualizer */}
        <div className="relative w-36 h-36 border border-border-light dark:border-border-dark rounded-lg flex items-center justify-center bg-black/20">
          {/* Axis lines */}
          <div className="absolute w-full h-px bg-border-light dark:bg-border-dark" />
          <div className="absolute w-px h-full bg-border-light dark:bg-border-dark" />
          
          {/* Outer G limits rings */}
          <div className="absolute w-24 h-24 border border-dashed border-border-light dark:border-border-dark rounded-full" />
          <div className="absolute w-12 h-12 border border-dashed border-border-light dark:border-border-dark rounded-full" />
          
          {/* Glowing G indicator dot */}
          <div 
            className="absolute w-3.5 h-3.5 bg-f1-red border-2 border-white rounded-full transition-all duration-300 filter drop-shadow-[0_0_6px_rgba(255,30,30,0.8)]"
            style={{ 
              transform: `translate(${Math.max(-50, Math.min(50, (telemetry.gforce_x / 5) * 50))}px, ${Math.max(-50, Math.min(50, (-telemetry.gforce_y / 5) * 50))}px)` 
            }}
          />

          <span className="absolute bottom-1 right-2 text-[9px] font-telemetry text-text-secondaryDark uppercase">5.0 G MAX</span>
        </div>

        <div className="w-full flex justify-around text-xs mt-2 font-telemetry uppercase text-text-secondaryDark">
          <span>Lat: <strong className="text-white">{telemetry.gforce_x}G</strong></span>
          <span>Lon: <strong className="text-white">{telemetry.gforce_y}G</strong></span>
        </div>
      </GlassCard>

      {/* 5. Tyre Telemetry Matrix */}
      <GlassCard glowColor={isTireCritical ? "red" : "none"}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider">TYRE THERMALS & WEAR</span>
          <span className="text-[10px] font-black uppercase text-f1-red bg-f1-red/10 border border-f1-red/20 px-2 py-0.5 rounded font-telemetry">
            {telemetry.tire_compound}
          </span>
        </div>

        {/* 4 corner tire layout */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* Front Left */}
          <div className={`p-2.5 rounded border flex flex-col justify-between ${getTempBgClass(telemetry.tire_temp_fl, telemetry.tire_compound)}`}>
            <div className="flex justify-between text-[9px] font-telemetry text-text-secondaryDark leading-none">
              <span>FL</span>
              <span className={getTempColorClass(telemetry.tire_temp_fl, telemetry.tire_compound)}>
                {Math.round(telemetry.tire_temp_fl)}°C
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-sm font-black font-telemetry">
                {Math.round(telemetry.tire_wear_fl * 100)}%
              </span>
              <span className="text-[8px] text-text-secondaryDark uppercase tracking-wider font-semibold">Wear</span>
            </div>
            <div className="w-full bg-neutral-800 h-1 mt-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-f1-red h-full rounded-full"
                style={{ width: `${telemetry.tire_wear_fl * 100}%` }}
              />
            </div>
          </div>

          {/* Front Right */}
          <div className={`p-2.5 rounded border flex flex-col justify-between ${getTempBgClass(telemetry.tire_temp_fr, telemetry.tire_compound)}`}>
            <div className="flex justify-between text-[9px] font-telemetry text-text-secondaryDark leading-none">
              <span>FR</span>
              <span className={getTempColorClass(telemetry.tire_temp_fr, telemetry.tire_compound)}>
                {Math.round(telemetry.tire_temp_fr)}°C
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-sm font-black font-telemetry">
                {Math.round(telemetry.tire_wear_fr * 100)}%
              </span>
              <span className="text-[8px] text-text-secondaryDark uppercase tracking-wider font-semibold">Wear</span>
            </div>
            <div className="w-full bg-neutral-800 h-1 mt-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-f1-red h-full rounded-full"
                style={{ width: `${telemetry.tire_wear_fr * 100}%` }}
              />
            </div>
          </div>

          {/* Rear Left */}
          <div className={`p-2.5 rounded border flex flex-col justify-between ${getTempBgClass(telemetry.tire_temp_rl, telemetry.tire_compound)}`}>
            <div className="flex justify-between text-[9px] font-telemetry text-text-secondaryDark leading-none">
              <span>RL</span>
              <span className={getTempColorClass(telemetry.tire_temp_rl, telemetry.tire_compound)}>
                {Math.round(telemetry.tire_temp_rl)}°C
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-sm font-black font-telemetry">
                {Math.round(telemetry.tire_wear_rl * 100)}%
              </span>
              <span className="text-[8px] text-text-secondaryDark uppercase tracking-wider font-semibold">Wear</span>
            </div>
            <div className="w-full bg-neutral-800 h-1 mt-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-f1-red h-full rounded-full"
                style={{ width: `${telemetry.tire_wear_rl * 100}%` }}
              />
            </div>
          </div>

          {/* Rear Right */}
          <div className={`p-2.5 rounded border flex flex-col justify-between ${getTempBgClass(telemetry.tire_temp_rr, telemetry.tire_compound)}`}>
            <div className="flex justify-between text-[9px] font-telemetry text-text-secondaryDark leading-none">
              <span>RR</span>
              <span className={getTempColorClass(telemetry.tire_temp_rr, telemetry.tire_compound)}>
                {Math.round(telemetry.tire_temp_rr)}°C
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-sm font-black font-telemetry">
                {Math.round(telemetry.tire_wear_rr * 100)}%
              </span>
              <span className="text-[8px] text-text-secondaryDark uppercase tracking-wider font-semibold">Wear</span>
            </div>
            <div className="w-full bg-neutral-800 h-1 mt-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-f1-red h-full rounded-full"
                style={{ width: `${telemetry.tire_wear_rr * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global blockchain audit verification flag */}
        <div className="mt-4 flex items-center justify-between border-t border-border-light dark:border-border-dark pt-3 text-[10px] font-telemetry text-text-secondaryDark uppercase">
          <span className="flex items-center">
            <Disc className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Audit Ledger Integrity
          </span>
          <span className="text-emerald-400 font-black">SECURE</span>
        </div>
      </GlassCard>
    </div>
  );
}
