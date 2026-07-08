import React, { useEffect, useState } from "react";
import { Cpu, Radio } from "lucide-react";

interface BootSequenceProps {
  onBootComplete: () => void;
}

export function BootSequence({ onBootComplete }: BootSequenceProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "INITIALIZING AEGIS CORE...",
    "ESTABLISHING SYSTEM SECURITY ENCRYPTIONS...",
    "SYNCING TELEMETRY CHANNELS... [OK]",
    "DECRYPTING SHA-256 DATA AUDIT LEDGER... [OK]",
    "CALIBRATING DRIVER COGNITIVE MODEL... [OK]",
    "LOADING STRATEGY ENGINE... [OK]",
    "CONNECTING WEATHER INTELLIGENCE... [OK]",
    "ACTIVATING REAL-TIME SIMULATION... [OK]",
    "RACE CONTROL ONLINE"
  ];

  const onBootCompleteRef = React.useRef(onBootComplete);
  
  useEffect(() => {
    onBootCompleteRef.current = onBootComplete;
  }, [onBootComplete]);

  useEffect(() => {
    let tick = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Unified 90ms simulation tick loop (fully completes in ~3.2s)
    const interval = setInterval(() => {
      tick += 1;
      const currentProgress = Math.min(100, tick * 3);
      setProgress(currentProgress);

      // Map logs to show precisely as progress hits percentage milestones
      const milestones = [0, 12, 24, 38, 50, 62, 75, 88, 98];
      const activeLogs: string[] = [];
      
      bootLogs.forEach((log, idx) => {
        if (currentProgress >= milestones[idx]) {
          activeLogs.push(log);
        }
      });
      
      setLogs(activeLogs);

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Pause briefly at 100% before activating the dashboard
        timeoutId = setTimeout(() => {
          onBootCompleteRef.current();
        }, 400);
      }
    }, 90);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505] flex flex-col items-center justify-center text-white z-[999] overflow-hidden px-6 scanlines">
      
      {/* Cybernetic background highlights */}
      <div className="absolute w-[600px] h-[600px] bg-f1-red/10 rounded-full filter blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,30,30,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,30,30,0.015)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Futuristic Holographic Track Map Scanning */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-8 select-none">
        {/* Hologram rings spinning */}
        <div className="absolute inset-0 rounded-full border border-dashed border-f1-red/35 animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-double border-f1-red/15 animate-[spin_4s_reverse_infinite]" />
        
        {/* Hologram car vector scanline sweep */}
        <svg className="w-32 h-32 text-f1-red/45 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10C75 10 90 25 90 50C90 75 75 90 50 90C25 90 10 75 10 50C10 25 25 10 50 10Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#ff1e1e" strokeWidth="1.5" className="animate-bounce" />
        </svg>

        <div className="absolute z-10 text-center">
          <Cpu className="w-8 h-8 text-f1-red animate-pulse mx-auto filter drop-shadow-[0_0_8px_rgba(255,30,30,0.7)]" />
        </div>
      </div>

      {/* Cyberpunk system diagnostics terminal */}
      <div className="w-full max-w-[650px] bg-black/90 border border-f1-red/30 p-6 rounded-lg font-telemetry tracking-wider text-xs text-neutral-400 space-y-1.5 shadow-[0_0_25px_rgba(255,30,30,0.2)] min-h-[230px] relative">
        <div className="flex items-center justify-between border-b border-f1-red/20 pb-2 mb-3.5">
          <span className="text-f1-red font-black tracking-widest block uppercase">// SYSTEM INITIALIZATION INITIALIZER</span>
          <span className="text-emerald-400 font-bold flex items-center animate-pulse">
            <Radio className="w-3.5 h-3.5 mr-1" />
            ONLINE
          </span>
        </div>

        <div className="space-y-1 text-[11px] leading-tight text-left">
          {logs.map((log, idx) => {
            const isLast = idx === bootLogs.length - 1;
            return (
              <div 
                key={idx} 
                className={isLast ? "text-emerald-400 font-black animate-pulse flex items-center space-x-1.5" : "text-neutral-400"}
              >
                <span>&gt; {log}</span>
                {isLast && <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block" />}
              </div>
            );
          })}
          {logs.length < bootLogs.length && (
            <div className="text-f1-red animate-pulse flex items-center">
              <span>&gt; PROCESSING SECTOR DECRYPTION INITIALIZER...</span>
              <span className="w-1.5 h-3.5 bg-f1-red animate-pulse inline-block ml-1" />
            </div>
          )}
        </div>
      </div>

      {/* Boot percentage indicator */}
      <div className="w-full max-w-[650px] mt-6 space-y-1.5">
        <div className="flex justify-between text-[10px] font-telemetry text-neutral-400 tracking-wider uppercase">
          <span>CLASSIFIED TELEMETRY SYNCRONIZATION</span>
          <span className="text-f1-red font-bold font-telemetry">{progress}%</span>
        </div>
        <div className="w-full bg-neutral-950 h-2.5 border border-f1-red/20 rounded overflow-hidden p-0.5 relative">
          {/* Glowing bar sweep */}
          <div 
            className="h-full bg-gradient-to-r from-f1-red to-f1-accent rounded transition-all duration-100 filter drop-shadow-[0_0_6px_rgba(255,30,30,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>
  );
}
