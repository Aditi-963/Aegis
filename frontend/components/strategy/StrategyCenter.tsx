import React from "react";
import { useRaceStore } from "@/store/useRaceStore";
import { GlassCard } from "../shared/GlassCard";
import { Brain, Flame, ShieldAlert, Cpu, Award, Navigation } from "lucide-react";

export function StrategyCenter() {
  const { telemetry, mctsStrategy, sendAction } = useRaceStore();



  const handleAction = (actionType: string, payload?: any) => {
    sendAction(actionType, payload);
  };

  // Determine HRP warning levels
  const hrpVal = telemetry.hrp_score * 100;
  const getHRPColor = () => {
    if (hrpVal > 45) return "text-red-500";
    if (hrpVal > 25) return "text-amber-500";
    return "text-green-400";
  };

  const getHRPBg = () => {
    if (hrpVal > 45) return "bg-red-500/20";
    if (hrpVal > 25) return "bg-amber-500/20";
    return "bg-green-500/10";
  };

  return (
    <div className="space-y-4">
      {/* 1. MCTS Recommended Action Banner */}
      <GlassCard glowColor={mctsStrategy.recommended_action.includes("BOX") ? "red" : "none"}>
        <div className="flex items-center space-x-2 border-b border-border-light dark:border-border-dark pb-2 mb-3">
          <Brain className="w-4.5 h-4.5 text-f1-red animate-pulse" />
          <span className="text-xs font-black uppercase font-telemetry tracking-wider">
            MCTS STRATEGY RECOMMENDATION
          </span>
        </div>

        <div className="text-center py-2">
          <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider block">Recommended Strategy</span>
          <span className="text-xl font-black font-telemetry tracking-tight text-white block mt-0.5 uppercase">
            {mctsStrategy.recommended_action}
          </span>
          <span className="text-xs font-medium text-text-secondaryDark block mt-1">
            {mctsStrategy.strategy_string}
          </span>
        </div>

        {/* Undercut/Overcut alerts */}
        {telemetry.tire_wear_avg > 0.45 && (
          <div className="mt-3 bg-red-950/40 border border-f1-red/30 p-2 rounded-lg flex items-start space-x-2 text-[10px] font-telemetry">
            <ShieldAlert className="w-4 h-4 text-f1-red shrink-0 mt-0.5 animate-bounce" />
            <div>
              <span className="text-f1-red font-black uppercase">Undercut Alert: </span>
              <span className="text-text-secondaryDark">Car 16 has boxed for Softs. Sector 1 loss expected if staying out. Advise BOX NOW to defend stint gap.</span>
            </div>
          </div>
        )}
      </GlassCard>

      {/* 2. Interactive Strategy Control Override Cockpit */}
      <GlassCard>
        <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider block mb-3">
          STRATEGY INTERVENTION PANEL
        </span>

        {/* Engine Modes */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => handleAction("set_engine_mode", { mode: "PUSH" })}
            className={`py-2 px-3 rounded-lg border text-xs font-black font-telemetry flex items-center justify-center space-x-1.5 transition-all duration-200 ${
              telemetry.engine_mode === "PUSH"
                ? "bg-f1-red border-f1-red text-white shadow-[0_0_10px_rgba(255,30,30,0.4)]"
                : "border-border-light dark:border-border-dark text-text-secondaryDark hover:text-white hover:bg-white/5"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>PUSH MODE</span>
          </button>

          <button
            onClick={() => handleAction("set_engine_mode", { mode: "CONSERVE" })}
            className={`py-2 px-3 rounded-lg border text-xs font-black font-telemetry flex items-center justify-center space-x-1.5 transition-all duration-200 ${
              telemetry.engine_mode === "CONSERVE"
                ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                : "border-border-light dark:border-border-dark text-text-secondaryDark hover:text-white hover:bg-white/5"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>CONSERVE</span>
          </button>
        </div>

        {/* BOX overrides */}
        <span className="text-[9px] text-text-secondaryDark uppercase font-telemetry tracking-wider block mb-2">
          BOX NOW Override (Select Compound)
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => handleAction("box", { compound: "SOFT" })}
            className="py-1.5 rounded bg-neutral-900 border border-[#ff1e1e]/40 hover:bg-[#ff1e1e]/20 text-[#ff1e1e] text-[10px] font-black font-telemetry transition-all"
          >
            S-SOFT
          </button>
          <button
            onClick={() => handleAction("box", { compound: "MEDIUM" })}
            className="py-1.5 rounded bg-neutral-900 border border-yellow-500/40 hover:bg-yellow-500/20 text-yellow-500 text-[10px] font-black font-telemetry transition-all"
          >
            M-MED
          </button>
          <button
            onClick={() => handleAction("box", { compound: "HARD" })}
            className="py-1.5 rounded bg-neutral-900 border border-white/20 hover:bg-white/10 text-white text-[10px] font-black font-telemetry transition-all"
          >
            H-HARD
          </button>
          <button
            onClick={() => handleAction("box", { compound: "WET" })}
            className="py-1.5 rounded bg-neutral-900 border border-blue-500/40 hover:bg-blue-500/20 text-blue-400 text-[10px] font-black font-telemetry transition-all"
          >
            W-WET
          </button>
        </div>
      </GlassCard>

      {/* 3. Driver HRP Risk Score Panel */}
      <GlassCard className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider">
            HUMAN RISK PENALTY (HRP)
          </span>
          <Cpu className="w-4 h-4 text-text-secondaryDark" />
        </div>

        <div className={`p-3 rounded-lg flex items-center justify-between ${getHRPBg()} border border-border-light dark:border-border-dark`}>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-text-secondaryDark font-medium block">
              Cognitive Safety Margins
            </span>
            <span className={`text-2xl font-black font-telemetry tracking-tight ${getHRPColor()}`}>
              {hrpVal}% Risk
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-text-secondaryDark font-medium block">
              Braking Delay
            </span>
            <span className="text-sm font-bold text-white dark:text-white font-telemetry">
              +{Math.round(telemetry.reaction_delay * 1000)}ms
            </span>
          </div>
        </div>

        <div className="space-y-2 text-[10px] text-text-secondaryDark font-telemetry">
          <div className="flex justify-between">
            <span>Cognitive Efficiency</span>
            <span className="text-white font-bold">{Math.round(telemetry.cognitive_efficiency * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Focus Coefficient</span>
            <span className="text-white font-bold">{Math.round(telemetry.focus_level * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Fatigue Degradation</span>
            <span className="text-white font-bold">{Math.round(telemetry.fatigue * 100)}%</span>
          </div>
        </div>
      </GlassCard>

      {/* 4. MCTS Rollout Statistics */}
      <GlassCard className="grid grid-cols-2 gap-4">
        <div className="text-center border-r border-border-light dark:border-border-dark pr-2">
          <span className="text-[9px] text-text-secondaryDark uppercase font-telemetry block">MCTS Confidence</span>
          <span className="text-xl font-black text-white font-telemetry tracking-tight block mt-1">
            {Math.round(mctsStrategy.confidence_score * 100)}%
          </span>
          <div className="w-12 h-1 bg-f1-red mx-auto mt-2 rounded-full" style={{ width: `${mctsStrategy.confidence_score * 100}%` }} />
        </div>

        <div className="text-center">
          <span className="text-[9px] text-text-secondaryDark uppercase font-telemetry block">Win Probability</span>
          <span className="text-xl font-black text-emerald-400 font-telemetry tracking-tight block mt-1 flex items-center justify-center">
            <Award className="w-4.5 h-4.5 text-emerald-400 mr-1" />
            {Math.round(mctsStrategy.win_probability * 100)}%
          </span>
          <div className="w-12 h-1 bg-emerald-400 mx-auto mt-2 rounded-full" style={{ width: `${mctsStrategy.win_probability * 100}%` }} />
        </div>
      </GlassCard>
    </div>
  );
}
