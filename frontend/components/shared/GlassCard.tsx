import React from "react";
import { useRaceStore } from "@/store/useRaceStore";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "red" | "green" | "none";
}

export function GlassCard({ children, className = "", glowColor = "none" }: GlassCardProps) {
  const theme = useRaceStore((state) => state.theme);

  const glowStyles = {
    red: "neon-glow-red border-[#ff1e1ea3] dark:border-[#ff1e1ea3]",
    green: "neon-glow-green border-green-500/50 dark:border-green-500/50",
    none: "border-border-light dark:border-border-dark"
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`
        rounded-xl
        p-4
        transition-all
        duration-300
        ${isDark ? "glass-panel text-white" : "glass-panel-light text-black"}
        ${glowStyles[glowColor]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
