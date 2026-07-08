import React from "react";
import { GlassCard } from "../shared/GlassCard";

interface TelemetryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  progress?: number; // 0 to 100
  progressColor?: string;
  subValue?: string | number;
  warning?: boolean;
}

export function TelemetryCard({ 
  title, 
  value, 
  unit = "", 
  icon, 
  progress, 
  progressColor = "bg-f1-red", 
  subValue,
  warning = false 
}: TelemetryCardProps) {
  return (
    <GlassCard className="flex flex-col justify-between" glowColor={warning ? "red" : "none"}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-secondaryDark tracking-wider uppercase font-telemetry leading-none">
          {title}
        </span>
        {icon && <div className="text-text-secondaryDark">{icon}</div>}
      </div>

      <div className="mt-2.5 flex items-baseline space-x-1">
        <span className="text-2xl font-black font-telemetry tracking-tight leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-text-secondaryDark font-semibold uppercase leading-none">
            {unit}
          </span>
        )}
      </div>

      {subValue !== undefined && (
        <span className="text-[10px] text-text-secondaryDark font-medium mt-1 leading-none">
          {subValue}
        </span>
      )}

      {progress !== undefined && (
        <div className="w-full bg-neutral-800 h-1.5 mt-3 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </GlassCard>
  );
}
