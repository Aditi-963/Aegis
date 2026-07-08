import React from "react";
import { useRaceStore } from "@/store/useRaceStore";
import { Sun, Moon, Play, Pause, RotateCcw, CloudRain, Radio, ShieldAlert } from "lucide-react";

export function TopNavBar() {
  const { 
    telemetry, 
    sessionFlag, 
    isRunning, 
    targetRain, 
    setTargetRain, 
    theme, 
    setTheme, 
    sendAction,
    viewportMode,
    setViewportMode
  } = useRaceStore();

  const handleToggleSim = () => {
    sendAction("toggle_simulation");
  };

  const handleResetSim = () => {
    sendAction("reset_simulation");
  };

  const handleWeatherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTargetRain(val);
    sendAction("force_weather", { value: val });
  };

  // session flag coloring
  const getFlagClasses = () => {
    switch (sessionFlag) {
      case "YELLOW":
        return "bg-amber-500 text-black animate-pulse-fast";
      case "VSC":
        return "bg-orange-500 text-black animate-pulse-fast font-black border-2 border-white";
      case "SAFETY_CAR":
        return "bg-red-600 text-white animate-pulse-fast font-black border-2 border-amber-400";
      case "RED":
        return "bg-red-800 text-white font-bold animate-pulse";
      default:
        return "bg-emerald-500 text-black";
    }
  };

  return (
    <header className="w-full glass-panel dark:bg-[#050505b3] border-b border-border-light dark:border-border-dark py-3 px-6 flex items-center justify-between sticky top-0 z-50">
      
      {/* 1. AEGIS Logo & Session Name */}
      <div className="flex items-center space-x-4">
        {/* Sleek F1 Cyber shield logo SVG */}
        <div className="flex items-center space-x-2">
          <svg className="w-9 h-9 text-f1-red filter drop-shadow-[0_0_8px_rgba(255,30,30,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L85 25V55C85 75 70 88 50 93C30 88 15 75 15 55V25L50 10Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="4" />
            <path d="M30 45H70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M35 58H65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M42 71H58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M50 20V35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase neon-text-red">
              AEGIS<span className="text-white dark:text-white text-xs font-semibold ml-1.5 border border-f1-red px-1 rounded">STRATEGIST</span>
            </h1>
            <p className="text-[10px] text-text-secondaryDark tracking-wider uppercase font-telemetry">
              Cyber-Physical Operations Center
            </p>
          </div>
        </div>
      </div>

      {/* 2. Flag Status & Session Information */}
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-text-secondaryDark uppercase font-telemetry tracking-widest">Global Status</span>
          <div className={`mt-1 px-3 py-1 rounded text-xs font-black tracking-widest uppercase flex items-center space-x-1.5 ${getFlagClasses()}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{sessionFlag} FLAG</span>
          </div>
        </div>

        <div className="h-8 w-px bg-border-light dark:bg-border-dark" />

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[10px] text-text-secondaryDark block font-telemetry uppercase tracking-wider">Circuit</span>
            <span className="text-xs font-bold text-white dark:text-white">Silverstone (5.891 km)</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-secondaryDark block font-telemetry uppercase tracking-wider">Session Time</span>
            <span className="text-xs font-bold font-telemetry text-f1-red">
              {telemetry?.elapsed_time ? `${Math.floor(telemetry.elapsed_time / 60)}:${String(Math.floor(telemetry.elapsed_time % 60)).padStart(2, "0")}.${Math.floor((telemetry.elapsed_time % 1) * 1000)}` : "00:00.000"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-secondaryDark block font-telemetry uppercase tracking-wider">Lap</span>
            <span className="text-xs font-bold text-white dark:text-white">
              {telemetry?.lap ? `${telemetry.lap} / 50` : "STINT START"}
            </span>
          </div>
        </div>
      </div>

      {/* 2.5 Presentation Viewport Mode Selector */}
      <div className="flex items-center space-x-2 bg-black/50 border border-border-light dark:border-border-dark px-3 py-1.5 rounded-lg select-none">
        <span className="text-[9px] text-text-secondaryDark uppercase font-telemetry leading-none">
          Cockpit Mode
        </span>
        <select
          value={viewportMode}
          onChange={(e) => setViewportMode(e.target.value as any)}
          className="bg-transparent border-0 text-xs font-black font-telemetry tracking-wider text-f1-red focus:outline-none focus:ring-0 cursor-pointer uppercase"
        >
          <option value="cinematic" className="bg-[#111] text-white">Cinematic</option>
          <option value="professional" className="bg-[#111] text-white">Professional</option>
          <option value="minimal" className="bg-[#111] text-white">Minimal</option>
          <option value="research" className="bg-[#111] text-white">Research</option>
        </select>
      </div>

      {/* 3. Controls (Weather override, sim state, light/dark) */}
      <div className="flex items-center space-x-5">
        {/* Weather Injector */}
        <div className="flex items-center space-x-2 bg-black/40 border border-border-light dark:border-border-dark p-2 rounded-lg">
          <div className="flex flex-col">
            <span className="text-[9px] text-text-secondaryDark uppercase font-telemetry leading-none flex items-center">
              <CloudRain className="w-2.5 h-2.5 text-blue-400 mr-1" />
              Force Rain Radar
            </span>
            <span className="text-[10px] font-bold text-blue-400 font-telemetry leading-tight mt-0.5">
              {Math.round(targetRain * 100)}% Intensity
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={targetRain}
            onChange={handleWeatherChange}
            className="w-20 accent-blue-500 bg-border-dark h-1 rounded-lg cursor-pointer"
          />
        </div>

        <div className="h-8 w-px bg-border-light dark:bg-border-dark" />

        {/* Play/Pause/Restart buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleSim}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              isRunning 
                ? "bg-f1-red/10 border-f1-red text-f1-red hover:bg-f1-red/20 shadow-[0_0_8px_rgba(255,30,30,0.2)]" 
                : "bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500/20"
            }`}
            title={isRunning ? "Pause Simulation" : "Start Simulation"}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-500" />}
          </button>
          <button
            onClick={handleResetSim}
            className="p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-white/5 text-text-secondaryDark hover:text-white transition-all duration-200"
            title="Reset Race Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="h-8 w-px bg-border-light dark:bg-border-dark" />

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg border border-border-light dark:border-border-dark text-text-secondaryDark hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-600" />}
        </button>
      </div>

    </header>
  );
}
