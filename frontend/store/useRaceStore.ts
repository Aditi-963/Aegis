import { create } from "zustand";

export interface TelemetryState {
  lap: number;
  sector: number;
  sector_time?: number;
  elapsed_time?: number;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
  steering_angle: number;
  gforce_x: number;
  gforce_y: number;
  fuel_load: number;
  ers_charge: number;
  drs_active: boolean;
  
  // Tires
  tire_compound: string;
  tire_wear_fl: number;
  tire_wear_fr: number;
  tire_wear_rl: number;
  tire_wear_rr: number;
  tire_wear_avg: number;
  tire_temp_fl: number;
  tire_temp_fr: number;
  tire_temp_rl: number;
  tire_temp_rr: number;
  
  // Driver state
  fatigue: number;
  stress: number;
  focus_level: number;
  aggression_bias: number;
  risk_bias: number;
  confidence_state: number;
  reaction_delay: number;
  cognitive_efficiency: number;
  hrp_score: number;
  
  // Weather
  weather?: {
    rain_intensity: number;
    track_water_depth: number;
    grip_level: number;
    status: string;
    ambient_temp: number;
    track_temp: number;
    humidity: number;
  };

  pit_stop?: {
    active: boolean;
    duration: number;
    pit_lane_time: number;
    is_crew_error: boolean;
    error_reason: string;
    is_unsafe_release: boolean;
  } | null;
}

export interface MCTSStrategy {
  recommended_compound: string;
  expected_stops: number;
  confidence_score: number;
  win_probability: number;
  pit_window_start: number;
  pit_window_end: number;
  strategy_string: string;
  recommended_action: string;
  predicted_laps: Array<{
    lap: number;
    compound: string;
    mode: string;
  }>;
}

export interface RaceEvent {
  lap: number;
  event_type: string;
  description: string;
  severity: string;
  timestamp: string;
}

interface HRPRecord {
  lap: number;
  fatigue: number;
  stress: number;
  hrp: number;
  efficiency: number;
}

export type ViewportMode = "cinematic" | "professional" | "minimal" | "research";

interface RaceStore {
  telemetry: TelemetryState;
  sessionFlag: string;
  blockchainVerified: boolean;
  blockchainLastHash: string;
  activeEvents: RaceEvent[];
  mctsStrategy: MCTSStrategy;
  isRunning: boolean;
  targetRain: number;
  driverAnalytics: HRPRecord[];
  theme: "dark" | "light";
  socket: WebSocket | null;
  hasRealSocketData: boolean;
  
  // Decoupled Presentation Viewport Modes
  viewportMode: ViewportMode;
  cinematicStep: "landing" | "boot" | "active";
  
  setSocket: (socket: WebSocket | null) => void;
  updateFromWebSocket: (payload: any) => void;
  setTargetRain: (val: number) => void;
  setTheme: (theme: "dark" | "light") => void;
  addHRPRecord: (record: HRPRecord) => void;
  setDriverAnalytics: (records: HRPRecord[]) => void;
  setViewportMode: (mode: ViewportMode) => void;
  setCinematicStep: (step: "landing" | "boot" | "active") => void;
  
  // Controls sending to WebSocket
  sendAction: (action: string, data?: any) => void;
  
  // Local pacing loop (keeps UI alive before/between socket ticks)
  tickLocalTelemetry: () => void;
}

const baselineTelemetry: TelemetryState = {
  lap: 12,
  sector: 2,
  sector_time: 36.120,
  elapsed_time: 1084.250,
  speed: 284.6,
  rpm: 12150,
  gear: 6,
  throttle: 0.85,
  brake: 0.0,
  steering_angle: 12.4,
  gforce_x: 2.15,
  gforce_y: 1.85,
  fuel_load: 82.4,
  ers_charge: 88.5,
  drs_active: true,
  tire_compound: "MEDIUM",
  tire_wear_fl: 0.182,
  tire_wear_fr: 0.174,
  tire_wear_rl: 0.215,
  tire_wear_rr: 0.198,
  tire_wear_avg: 0.192,
  tire_temp_fl: 92.4,
  tire_temp_fr: 91.8,
  tire_temp_rl: 95.2,
  tire_temp_rr: 94.6,
  fatigue: 0.12,
  stress: 0.22,
  focus_level: 0.94,
  aggression_bias: 0.50,
  risk_bias: 0.15,
  confidence_state: 0.85,
  reaction_delay: 0.165,
  cognitive_efficiency: 0.91,
  hrp_score: 0.09,
  weather: {
    rain_intensity: 0.0,
    track_water_depth: 0.0,
    grip_level: 1.0,
    status: "dry",
    ambient_temp: 22.4,
    track_temp: 36.5,
    humidity: 42.0
  },
  pit_stop: null
};

const baselineStrategy: MCTSStrategy = {
  recommended_compound: "MEDIUM",
  expected_stops: 1,
  confidence_score: 0.92,
  win_probability: 0.74,
  pit_window_start: 22,
  pit_window_end: 26,
  strategy_string: "MEDIUM stint (Laps 1-24) → HARD stint (Laps 25-50)",
  recommended_action: "STAY OUT - PACE OK",
  predicted_laps: [
    { lap: 12, compound: "MEDIUM", mode: "CONSERVE" },
    { lap: 13, compound: "MEDIUM", mode: "CONSERVE" },
    { lap: 14, compound: "MEDIUM", mode: "CONSERVE" }
  ]
};

const baselineEvents: RaceEvent[] = [
  { lap: 1, event_type: "flag", description: "GREEN FLAG: Stint initialized. Track clear.", severity: "info", timestamp: "00:00:01" },
  { lap: 3, event_type: "telemetry_anomaly", description: "DRS Enabled by Race Control.", severity: "info", timestamp: "00:04:12" },
  { lap: 8, event_type: "driver_stress", description: "Biometric link synchronized. Stress bounds nominal.", severity: "info", timestamp: "00:11:45" }
];

export const useRaceStore = create<RaceStore>((set, get) => ({
  telemetry: baselineTelemetry,
  sessionFlag: "GREEN",
  blockchainVerified: true,
  blockchainLastHash: "4ff3bc21e0da...",
  activeEvents: baselineEvents,
  mctsStrategy: baselineStrategy,
  isRunning: false,
  targetRain: 0.0,
  driverAnalytics: [],
  theme: "dark",
  socket: null,
  hasRealSocketData: false,
  
  // Mode Selector defaults
  viewportMode: "cinematic",
  cinematicStep: "landing",

  setSocket: (socket) => set({ socket }),

  updateFromWebSocket: (payload) => {
    if (payload.type === "telemetry_update") {
      set({
        hasRealSocketData: true,
        telemetry: {
          lap: payload.lap,
          sector: payload.sector,
          sector_time: payload.sector_time,
          elapsed_time: payload.elapsed_time,
          speed: payload.speed,
          rpm: payload.rpm,
          gear: payload.gear,
          throttle: payload.throttle,
          brake: payload.brake,
          steering_angle: payload.steering_angle,
          gforce_x: payload.gforce_x,
          gforce_y: payload.gforce_y,
          fuel_load: payload.fuel_load,
          ers_charge: payload.ers_charge,
          drs_active: payload.drs_active,
          tire_compound: payload.tire_compound,
          tire_wear_fl: payload.tire_wear_fl,
          tire_wear_fr: payload.tire_wear_fr,
          tire_wear_rl: payload.tire_wear_rl,
          tire_wear_rr: payload.tire_wear_rr,
          tire_wear_avg: payload.tire_wear_avg,
          tire_temp_fl: payload.tire_temp_fl,
          tire_temp_fr: payload.tire_temp_fr,
          tire_temp_rl: payload.tire_temp_rl,
          tire_temp_rr: payload.tire_temp_rr,
          fatigue: payload.fatigue,
          stress: payload.stress,
          focus_level: payload.focus_level,
          aggression_bias: payload.aggression_bias,
          risk_bias: payload.risk_bias,
          confidence_state: payload.confidence_state,
          reaction_delay: payload.reaction_delay,
          cognitive_efficiency: payload.cognitive_efficiency,
          hrp_score: payload.hrp_score,
          weather: payload.weather,
          pit_stop: payload.pit_stop
        },
        sessionFlag: payload.session_flag,
        blockchainVerified: payload.blockchain_verified,
        blockchainLastHash: payload.blockchain_last_hash,
        activeEvents: payload.active_events || [],
        mctsStrategy: payload.mcts_strategy
      });

      if (payload.lap_completed) {
        const record = {
          lap: payload.lap,
          fatigue: payload.fatigue,
          stress: payload.stress,
          hrp: payload.hrp_score,
          efficiency: payload.cognitive_efficiency
        };
        get().addHRPRecord(record);
      }
    } else if (payload.type === "sim_state_toggled") {
      set({ isRunning: payload.is_running });
    } else if (payload.type === "sim_state_reset") {
      set({
        telemetry: baselineTelemetry,
        sessionFlag: "GREEN",
        activeEvents: baselineEvents,
        mctsStrategy: baselineStrategy,
        isRunning: false,
        driverAnalytics: [],
        hasRealSocketData: false
      });
    }
  },

  setTargetRain: (val) => set({ targetRain: val }),

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (theme === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    }
  },

  addHRPRecord: (record) => {
    set((state) => {
      if (state.driverAnalytics.some((r) => r.lap === record.lap)) return state;
      return {
        driverAnalytics: [...state.driverAnalytics, record].slice(-30)
      };
    });
  },

  setDriverAnalytics: (records) => set({ driverAnalytics: records }),

  setViewportMode: (mode) => set({ viewportMode: mode }),
  
  setCinematicStep: (step) => set({ cinematicStep: step }),

  sendAction: (action, data = {}) => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action, ...data }));
    }
  },

  tickLocalTelemetry: () => {
    if (get().hasRealSocketData) return;

    set((state) => {
      const t = state.telemetry;
      const targetSpeed = t.speed + (Math.random() > 0.5 ? 1 : -1) * (1.0 + Math.random() * 2);
      const cappedSpeed = Math.max(260.0, Math.min(315.0, targetSpeed));
      
      const targetRpm = Math.round(11200 + (cappedSpeed / 300) * 2800 + (Math.random() > 0.5 ? 30 : -30));
      const cappedRpm = Math.max(9000, Math.min(14500, targetRpm));

      const steer = Math.round((Math.sin(Date.now() / 400) * 15.0 + (Math.random() > 0.5 ? 0.5 : -0.5)) * 10) / 10;

      const gX = Math.round((steer / 15.0) * 2.8 * 100) / 100;
      const gY = Math.round((t.throttle - t.brake) * 2.5 * 100) / 100;

      const tFL = Math.round((t.tire_temp_fl + Math.abs(gX) * 0.15 + (Math.random() > 0.5 ? 0.05 : -0.05)) * 10) / 10;

      return {
        telemetry: {
          ...t,
          speed: Math.round(cappedSpeed * 10) / 10,
          rpm: cappedRpm,
          steering_angle: steer,
          gforce_x: gX,
          gforce_y: gY,
          tire_temp_fl: tFL,
          tire_temp_fr: Math.round((t.tire_temp_fr + Math.abs(gX) * 0.12 + (Math.random() > 0.5 ? 0.05 : -0.05)) * 10) / 10,
          tire_temp_rl: Math.round((t.tire_temp_rl + Math.abs(gY) * 0.15 + (Math.random() > 0.5 ? 0.05 : -0.05)) * 10) / 10,
          tire_temp_rr: Math.round((t.tire_temp_rr + Math.abs(gY) * 0.13 + (Math.random() > 0.5 ? 0.05 : -0.05)) * 10) / 10,
          ers_charge: Math.max(5.0, Math.min(100.0, t.ers_charge + (Math.random() > 0.5 ? 0.05 : -0.08))),
          reaction_delay: Math.round((0.15 + t.fatigue * 0.1 + t.stress * 0.08 + Math.random() * 0.005) * 1000) / 1000
        }
      };
    });
  }
}));
