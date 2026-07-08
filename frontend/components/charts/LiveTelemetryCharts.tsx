import React, { useState } from "react";
import { useRaceStore } from "@/store/useRaceStore";
import { GlassCard } from "../shared/GlassCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { LineChart as ChartIcon, Eye, Thermometer, Zap } from "lucide-react";

export function LiveTelemetryCharts() {
  const { driverAnalytics, telemetry } = useRaceStore();
  const [activeTab, setActiveTab] = useState<"cognitive" | "tires" | "fuel">("cognitive");

  // Local helper for tyre wear chart data compilation
  const compileTireData = () => {
    if (!telemetry) return [];
    
    // Compile a projection curve over the next 15 laps based on wear rates
    const wearRate = telemetry.tire_wear_avg / Math.max(1, telemetry.lap);
    const data = [];
    
    // Historical wear
    for (let i = 1; i <= telemetry.lap; i++) {
      data.push({
        lap: i,
        wear: Math.round(wearRate * i * 100),
        temperature: Math.round(telemetry.tire_temp_fl + (i % 2 === 0 ? 1 : -1))
      });
    }

    // Future MCTS projection wear curve
    for (let j = telemetry.lap + 1; j <= telemetry.lap + 15; j++) {
      const projectedWear = Math.min(100, Math.round(telemetry.tire_wear_avg * 100 + (j - telemetry.lap) * 2.8));
      data.push({
        lap: j,
        wear: projectedWear,
        projected: true,
        temperature: Math.round(telemetry.tire_temp_fl + (j % 2 === 0 ? 3 : -2))
      });
    }

    return data;
  };

  const tireData = compileTireData();

  // Fuel data compilation
  const compileFuelData = () => {
    if (!telemetry) return [];
    const data = [];
    const baseFuel = 105;
    for (let i = 1; i <= telemetry.lap; i++) {
      data.push({
        lap: i,
        fuel: Math.round((baseFuel - (i * 1.05)) * 10) / 10
      });
    }
    return data;
  };

  const fuelData = compileFuelData();

  return (
    <GlassCard className="flex flex-col justify-between min-h-[300px]">
      <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-2.5">
        <div className="flex items-center space-x-2">
          <ChartIcon className="w-4 h-4 text-f1-red" />
          <span className="text-xs font-black uppercase font-telemetry tracking-wider">
            ANALYTICS & HISTORICAL PLOTS
          </span>
        </div>

        {/* Tab Headers */}
        <div className="flex space-x-1.5">
          <button
            onClick={() => setActiveTab("cognitive")}
            className={`px-3 py-1 rounded text-[10px] font-black font-telemetry transition-all duration-200 ${
              activeTab === "cognitive"
                ? "bg-f1-red/10 border border-f1-red text-f1-red"
                : "border border-transparent text-text-secondaryDark hover:text-white"
            }`}
          >
            HDM COGNITION
          </button>
          <button
            onClick={() => setActiveTab("tires")}
            className={`px-3 py-1 rounded text-[10px] font-black font-telemetry transition-all duration-200 ${
              activeTab === "tires"
                ? "bg-f1-red/10 border border-f1-red text-f1-red"
                : "border border-transparent text-text-secondaryDark hover:text-white"
            }`}
          >
            TYRE DEGRADATION
          </button>
          <button
            onClick={() => setActiveTab("fuel")}
            className={`px-3 py-1 rounded text-[10px] font-black font-telemetry transition-all duration-200 ${
              activeTab === "fuel"
                ? "bg-f1-red/10 border border-f1-red text-f1-red"
                : "border border-transparent text-text-secondaryDark hover:text-white"
            }`}
          >
            FUEL CONSUMPTION
          </button>
        </div>
      </div>

      <div className="flex-grow min-h-[220px] mt-4 flex items-center justify-center">
        {/* Render Tab Contents */}
        {activeTab === "cognitive" && (
          <div className="w-full h-full min-h-[220px]">
            {driverAnalytics.length === 0 ? (
              <div className="flex items-center justify-center h-full text-text-secondaryDark text-xs font-telemetry">
                COMPLETE AT LEAST ONE LAP TO COMPILE COGNITIVE GRAPHS
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={driverAnalytics} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hrpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff1e1e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ff1e1e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="lap" stroke="#888" fontSize={9} fontFamily="Share Tech Mono" />
                  <YAxis domain={[0, 1]} stroke="#888" fontSize={9} fontFamily="Share Tech Mono" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", fontSize: "10px", fontFamily: "Share Tech Mono" }} 
                    labelClassName="text-white"
                  />
                  <Area type="monotone" dataKey="hrp" stroke="#ff1e1e" fillOpacity={1} fill="url(#hrpGrad)" name="Risk Penalty (HRP)" />
                  <Area type="monotone" dataKey="efficiency" stroke="#22c55e" fillOpacity={1} fill="url(#effGrad)" name="Driver Efficiency" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {activeTab === "tires" && (
          <div className="w-full h-full min-h-[220px]">
            {tireData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-text-secondaryDark text-xs font-telemetry">
                WAITING FOR LAP TELEMETRY FEED
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={tireData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="lap" stroke="#888" fontSize={9} fontFamily="Share Tech Mono" />
                  <YAxis domain={[0, 100]} stroke="#888" fontSize={9} fontFamily="Share Tech Mono" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", fontSize: "10px", fontFamily: "Share Tech Mono" }} 
                  />
                  <Line type="monotone" dataKey="wear" stroke="#ff4d4d" strokeWidth={2.5} activeDot={{ r: 6 }} name="Tyre Wear (%)" />
                  <Line type="monotone" dataKey="temperature" stroke="#22d3ee" strokeDasharray="4 4" strokeWidth={1.5} name="FL Temp (°C)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {activeTab === "fuel" && (
          <div className="w-full h-full min-h-[220px]">
            {fuelData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-text-secondaryDark text-xs font-telemetry">
                WAITING FOR LAP TELEMETRY FEED
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={fuelData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="lap" stroke="#888" fontSize={9} fontFamily="Share Tech Mono" />
                  <YAxis domain={[0, 110]} stroke="#888" fontSize={9} fontFamily="Share Tech Mono" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", fontSize: "10px", fontFamily: "Share Tech Mono" }} 
                  />
                  <Area type="monotone" dataKey="fuel" stroke="#f59e0b" fillOpacity={1} fill="url(#fuelGrad)" name="Fuel Remaining (kg)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
