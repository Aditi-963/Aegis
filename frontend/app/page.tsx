"use client";

import React, { useRef, useCallback } from "react";
import { useRaceWebSocket } from "../hooks/useRaceWebSocket";
import { useRaceStore } from "../store/useRaceStore";

// High-density F1 Cockpit Dashboard components
import { TopNavBar } from "../components/dashboard/TopNavBar";
import { TelemetrySidebar } from "../components/telemetry/TelemetrySidebar";
import { LiveTrackMap } from "../components/track/LiveTrackMap";
import { StrategyCenter } from "../components/strategy/StrategyCenter";
import { LiveTelemetryCharts } from "../components/charts/LiveTelemetryCharts";
import { RaceEngineerAssistant } from "../components/ai/RaceEngineerAssistant";
import { GlassCard } from "../components/shared/GlassCard";

// Cinematic storytelling landing components
import { HeroSection } from "../components/landing/HeroSection";
import { F1Introduction } from "../components/landing/F1Introduction";
import { HDMSection } from "../components/landing/HDMSection";
import { AIStrategySection } from "../components/landing/AIStrategySection";
import { WeatherShowcase } from "../components/landing/WeatherShowcase";
import { InteractivePreview } from "../components/landing/InteractivePreview";
import { BootSequence } from "../components/landing/BootSequence";

import { ShieldCheck, ServerCrash, Layers, Activity, Brain, Cpu, Database, Eye } from "lucide-react";

export default function DashboardPage() {
  const { 
    activeEvents, 
    blockchainVerified, 
    blockchainLastHash, 
    telemetry,
    viewportMode,
    setViewportMode,
    cinematicStep,
    setCinematicStep
  } = useRaceStore();

  const explanationRef = useRef<HTMLDivElement>(null);

  // Activate WebSocket live streaming and local pacing loop
  useRaceWebSocket();

  const scrollToExplanation = () => {
    explanationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartBoot = useCallback(() => {
    setCinematicStep("boot");
  }, [setCinematicStep]);

  const handleBootComplete = useCallback(() => {
    setCinematicStep("active");
  }, [setCinematicStep]);

  // ==========================================
  // VIEWPORT ROUTING ENGINE (PRESENTATION LAYER)
  // ==========================================

  // A. CINEMATIC ROUTING STEPS
  if (viewportMode === "cinematic") {
    if (cinematicStep === "landing") {
      return (
        <div className="bg-[#050505] text-white font-sans overflow-x-hidden min-h-screen">
          <HeroSection 
            onEnterSim={handleStartBoot} 
            onScrollToExplain={scrollToExplanation} 
          />
          <div ref={explanationRef} id="explanation-matrix" className="space-y-12 pb-24">
            <F1Introduction />
            <HDMSection />
            <AIStrategySection />
            <WeatherShowcase />
            <InteractivePreview onEnterSim={handleStartBoot} />
          </div>
        </div>
      );
    }
    if (cinematicStep === "boot") {
      return <BootSequence onBootComplete={handleBootComplete} />;
    }
  }

  // B. PROFESSIONAL ANALYTICS MODE (High-density telemetry cockpit)
  const renderProfessionalMode = () => (
    <main className="min-h-screen bg-background-dark text-white font-sans scanlines pb-6">
      <TopNavBar />
      <div className="max-w-[1600px] mx-auto px-4 mt-6 grid grid-cols-12 gap-6">
        
        {/* Left Column: Live Vehicle Telemetry */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="flex items-center space-x-1.5 px-1">
            <Activity className="w-4 h-4 text-f1-red animate-pulse" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">
              TELEMETRY FEED
            </span>
          </div>
          <TelemetrySidebar />
        </div>

        {/* Center Column: GPS Track & Live Charts */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="flex items-center space-x-1.5 px-1">
            <Layers className="w-4 h-4 text-f1-red" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">
              TRACK MAP VISUALIZER
            </span>
          </div>
          <LiveTrackMap />
          <LiveTelemetryCharts />
        </div>

        {/* Right Column: AI Strategy Recommendations & Engineer Radio */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="flex items-center space-x-1.5 px-1">
            <Layers className="w-4 h-4 text-f1-red" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">
              DECISION ENGINE COCKPIT
            </span>
          </div>
          <StrategyCenter />
          <RaceEngineerAssistant />
        </div>
      </div>

      {/* Lower Section: Blockchain Security Integrity & Event Stream */}
      <div className="max-w-[1600px] mx-auto px-4 mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <GlassCard className="flex flex-col justify-between min-h-[140px]" glowColor={blockchainVerified ? "green" : "red"}>
            <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-2 mb-2.5">
              <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider">
                CRYPTOGRAPHIC INTEGRITY
              </span>
              {blockchainVerified ? (
                <ShieldCheck className="w-4 h-4 text-green-400" />
              ) : (
                <ServerCrash className="w-4 h-4 text-f1-red animate-pulse" />
              )}
            </div>
            <div className="space-y-1 text-[10px] font-telemetry text-text-secondaryDark uppercase">
              <div className="flex justify-between">
                <span>LEDGER STATUS</span>
                <span className="text-green-400 font-bold">VERIFIED</span>
              </div>
              <div className="flex justify-between">
                <span>CURRENT SHA-256</span>
                <span className="text-white select-all font-semibold">{blockchainLastHash}</span>
              </div>
              <div className="flex justify-between">
                <span>AUDIT BLOCKS SECURED</span>
                <span className="text-white font-bold">{telemetry ? telemetry.lap * 3 + telemetry.sector : 0}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <GlassCard className="min-h-[140px]">
            <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider block border-b border-border-light dark:border-border-dark pb-2 mb-2">
              REAL-TIME EVENT AND RACE CONTROL STREAM
            </span>
            <div className="overflow-y-auto space-y-1.5 max-h-[85px] scrollbar-thin text-xs font-telemetry">
              {activeEvents.map((evt, idx) => (
                <div key={idx} className="flex justify-between items-start space-x-2 py-0.5 border-b border-border-dark/30 last:border-b-0">
                  <span className="text-[10px] text-f1-red font-black shrink-0">[LAP {evt.lap}]</span>
                  <span className="text-text-secondaryDark shrink-0">{evt.timestamp}</span>
                  <span className={`text-[10px] uppercase font-black px-1.5 rounded shrink-0 ${evt.severity === "critical" ? "bg-f1-red/20 text-f1-red" : "bg-cyan-400/10 text-cyan-400"}`}>{evt.event_type}</span>
                  <span className="flex-grow text-white leading-none">{evt.description}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );

  // C. MINIMAL DASHBOARD MODE (Compact critical metrics)
  const renderMinimalMode = () => (
    <main className="min-h-screen bg-background-dark text-white font-sans scanlines pb-6">
      <TopNavBar />
      <div className="max-w-[1600px] mx-auto px-4 mt-6 grid grid-cols-12 gap-6">
        
        {/* Compact gauges */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="flex items-center space-x-1.5 px-1">
            <Activity className="w-4 h-4 text-f1-red animate-pulse" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">CRITICAL INSTRUMENTS</span>
          </div>
          <TelemetrySidebar />
        </div>

        {/* Center Track Map */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-1.5 px-1">
            <Layers className="w-4 h-4 text-f1-red" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">GPS MONITOR</span>
          </div>
          <LiveTrackMap />
          
          {/* Simple event stream overlay in minimal layout */}
          <GlassCard className="min-h-[140px]">
            <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider block border-b border-border-light dark:border-border-dark pb-2 mb-2">EVENT STREAM</span>
            <div className="overflow-y-auto space-y-1.5 max-h-[85px] scrollbar-thin text-xs font-telemetry">
              {activeEvents.slice(-6).map((evt, idx) => (
                <div key={idx} className="flex justify-between items-start space-x-2 py-0.5 border-b border-border-dark/30 last:border-b-0">
                  <span className="text-[10px] text-f1-red font-black shrink-0">[LAP {evt.lap}]</span>
                  <span className="flex-grow text-white leading-none">{evt.description}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* MCTS stints */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="flex items-center space-x-1.5 px-1">
            <Layers className="w-4 h-4 text-f1-red" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">AI RECOMMENDATIONS</span>
          </div>
          <StrategyCenter />
        </div>

      </div>
    </main>
  );

  // D. RESEARCH & COMPUTATIONAL MODE (Deep scientific metrics)
  const renderResearchMode = () => (
    <main className="min-h-screen bg-background-dark text-white font-sans scanlines pb-6">
      <TopNavBar />
      <div className="max-w-[1600px] mx-auto px-4 mt-6 grid grid-cols-12 gap-6">
        
        {/* Left Column: Driver Biometrics Grid & raw SHA ledger */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="flex items-center space-x-1.5 px-1">
            <Brain className="w-4 h-4 text-f1-red" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">NEUROBIOMETRIC MATRIX</span>
          </div>
          
          <GlassCard className="space-y-4">
            <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry block">Cognitive Driver States</span>
            <div className="grid grid-cols-2 gap-4 text-xs font-telemetry">
              <div className="p-3 bg-black/40 border border-border-dark rounded-lg">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Focus Capacity</span>
                <span className="text-base font-black text-white block mt-0.5">{Math.round(telemetry.focus_level * 100)}%</span>
              </div>
              <div className="p-3 bg-black/40 border border-border-dark rounded-lg">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Fatigue Level</span>
                <span className="text-base font-black text-white block mt-0.5">{Math.round(telemetry.fatigue * 100)}%</span>
              </div>
              <div className="p-3 bg-black/40 border border-border-dark rounded-lg">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Braking Reaction Delay</span>
                <span className="text-base font-black text-white block mt-0.5">{Math.round(telemetry.reaction_delay * 1000)}ms</span>
              </div>
              <div className="p-3 bg-black/40 border border-border-dark rounded-lg">
                <span className="text-[9px] uppercase text-text-secondaryDark block">Risk Penalty Score (HRP)</span>
                <span className="text-base font-black text-f1-red block mt-0.5">{Math.round(telemetry.hrp_score * 100)}%</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between min-h-[220px]" glowColor={blockchainVerified ? "green" : "red"}>
            <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-2 mb-2.5">
              <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-wider flex items-center">
                <Database className="w-4 h-4 mr-1 text-emerald-400" />
                SHA-256 TELEMETRY LEDGER
              </span>
            </div>
            
            <div className="space-y-1.5 text-[9px] font-telemetry text-text-secondaryDark uppercase select-all leading-tight">
              <div>BLOCK INDEX: <strong className="text-white">#{telemetry ? telemetry.lap * 3 + telemetry.sector : 0}</strong></div>
              <div>PREVIOUS BLOCK HASH: <strong className="text-white">4ff3bc21e0da8c92aef3...</strong></div>
              <div>CURRENT SECTOR HASH: <strong className="text-emerald-400 font-bold select-all">{blockchainLastHash}</strong></div>
              <div>LEDGER VERIFICATION: <strong className="text-emerald-400">PASSED</strong></div>
            </div>
          </GlassCard>
        </div>

        {/* Center Column: Live Analytics Area/Line Charts */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="flex items-center space-x-1.5 px-1">
            <Layers className="w-4 h-4 text-f1-red" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">MATHEMATICAL GRAPH MODELS</span>
          </div>
          <LiveTelemetryCharts />
        </div>

        {/* Right Column: AI stints and win stats */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="flex items-center space-x-1.5 px-1">
            <Cpu className="w-4 h-4 text-f1-red" />
            <span className="text-xs font-black uppercase font-telemetry tracking-wider">MCTS OPTIMIZATIONS</span>
          </div>
          <StrategyCenter />
        </div>

      </div>
    </main>
  );

  // Pivot render matching selected Viewport Mode
  switch (viewportMode) {
    case "professional":
    case "cinematic": // If cinematicStep is "active", it drops down here
      return renderProfessionalMode();
    case "minimal":
      return renderMinimalMode();
    case "research":
      return renderResearchMode();
    default:
      return renderProfessionalMode();
  }
}
