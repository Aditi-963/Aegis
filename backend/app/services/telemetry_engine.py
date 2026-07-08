import random
from typing import Dict, Any, List
from app.services.physics_engine import PhysicsEngine
from app.services.hdm_engine import HDMEngine
from app.services.weather_engine import WeatherEngine
from app.services.pit_engine import PitEngine

class TelemetryEngine:
    def __init__(self, start_fuel: float = 100.0, start_compound: str = "MEDIUM"):
        self.physics = PhysicsEngine(start_fuel, start_compound)
        self.hdm = HDMEngine()
        self.weather = WeatherEngine()
        self.pit = PitEngine()

        self.current_lap = 1
        self.current_sector = 1
        self.engine_mode = "CONSERVE"  # CONSERVE or PUSH
        
        self.lap_sector_times = []  # times for S1, S2, S3 in current lap
        self.completed_laps: List[Dict[str, Any]] = []
        self.out_lap_warmup_sectors = 0
        self.pit_stop_active = False
        self.pit_stop_data = None

        # Cumulative elapsed race time in seconds
        self.elapsed_time = 0.0

    def set_engine_mode(self, mode: str):
        if mode in ["PUSH", "CONSERVE"]:
            self.engine_mode = mode

    def force_weather(self, target_rain: float):
        self.weather.update(self.current_lap, target_rain)

    def trigger_box(self, new_compound: str) -> Dict[str, Any]:
        """
        Signals that the driver is entering the pit lane on this lap.
        """
        self.pit_stop_active = True
        # Execute stop
        stop_results = self.pit.execute_stop(
            self.hdm.fatigue, self.hdm.stress, self.hdm.risk_bias
        )
        self.pit_stop_data = stop_results
        
        # Change tyres in physics
        self.physics.change_tires(new_compound)
        
        # Warmup delay applied
        self.out_lap_warmup_sectors = stop_results["warmup_penalty_sectors"]
        
        return stop_results

    def step_sector(self, target_weather_rain: float = None) -> Dict[str, Any]:
        """
        Simulates completion of one sector, updates all engines, and returns consolidated state.
        """
        # 1. Update weather
        weather_state = self.weather.update(self.current_lap, target_weather_rain)

        # 2. Get averages of wear for HDM
        physics_state = self.physics.get_telemetry_state()
        avg_wear = physics_state["tire_wear_avg"]

        # 3. Update Human Driver Model
        hdm_state = self.hdm.update(
            self.current_lap,
            self.engine_mode,
            avg_wear,
            weather_state["grip_level"],
            weather_state["rain_intensity"]
        )

        # 4. Update Physics Telemetry
        physics_telemetry = self.physics.update_telemetry(
            self.current_sector,
            self.engine_mode,
            weather_state["grip_level"],
            hdm_state["hrp_score"],
            weather_state["track_water_depth"]
        )

        # 5. Calculate Sector Duration in seconds
        # Reference sectors: S1=28.2s, S2=36.1s, S3=25.7s
        base_sec_time = self.physics.sector_best[self.current_sector - 1]
        
        # Tyre degradation penalty: up to +3.5s per sector on completely bald tyres
        tire_degrade_penalty = (avg_wear ** 1.8) * 3.5
        
        # Fuel weight penalty: empty fuel is baseline, full fuel is +0.8s per sector
        fuel_penalty = (physics_telemetry["fuel_load"] / 100.0) * 0.8
        
        # Grip/Weather penalty: up to +8s per sector under poor grip
        grip_penalty = (1.0 - (weather_state["grip_level"] * self.physics._get_compound_grip(weather_state["track_water_depth"]))) * 8.0
        
        # ERS boost: reduces sector time by up to -0.6s
        ers_boost = -0.6 if (self.engine_mode == "PUSH" and physics_telemetry["ers_charge"] > 5) else 0.0
        
        # Driver cognitive inefficiency penalty: reaction delay and inconsistency adds up to +2.5s
        driver_cognitive_penalty = (1.0 - hdm_state["cognitive_efficiency"]) * 2.0 + (hdm_state["reaction_delay"] - 0.15) * 3.0
        
        # Out-lap tire warmup penalty
        warmup_penalty = 0.0
        if self.out_lap_warmup_sectors > 0:
            warmup_penalty = 1.8
            self.out_lap_warmup_sectors -= 1

        # Sum sector time
        sector_time = base_sec_time + tire_degrade_penalty + fuel_penalty + grip_penalty + ers_boost + driver_cognitive_penalty + warmup_penalty
        
        # Incorporate random driver mistakes
        if hdm_state["mistake_occurred"]:
            sector_time += random.uniform(1.2, 3.5)

        # Pit stop penalty (applied in Sector 3)
        pit_stationary_time = 0.0
        pit_lane_time = 0.0
        if self.current_sector == 3 and self.pit_stop_active:
            pit_stationary_time = self.pit_stop_data["duration"]
            pit_lane_time = self.pit_stop_data["pit_lane_time"]
            sector_time += pit_lane_time
            self.pit_stop_active = False

        sector_time = round(sector_time, 3)
        self.lap_sector_times.append(sector_time)
        self.elapsed_time += sector_time

        # Consolidated state
        consolidated = {
            "lap": self.current_lap,
            "sector": self.current_sector,
            "sector_time": sector_time,
            "elapsed_time": round(self.elapsed_time, 3),
            "engine_mode": self.engine_mode,
            **physics_telemetry,
            **hdm_state,
            "weather": weather_state,
            "pit_stop": {
                "active": self.current_sector == 3 and self.pit_stop_data is not None and pit_stationary_time > 0,
                "duration": pit_stationary_time,
                "pit_lane_time": pit_lane_time,
                "is_crew_error": self.pit_stop_data["is_crew_error"] if self.pit_stop_data else False,
                "error_reason": self.pit_stop_data["error_reason"] if self.pit_stop_data else "",
                "is_unsafe_release": self.pit_stop_data["is_unsafe_release"] if self.pit_stop_data else False
            } if self.current_sector == 3 else None
        }

        # Clear pit stop data if completed
        if self.current_sector == 3 and not self.pit_stop_active:
            self.pit_stop_data = None

        # Handle sector increment
        if self.current_sector == 3:
            # End of Lap!
            lap_time = round(sum(self.lap_sector_times), 3)
            consolidated["lap_completed"] = True
            consolidated["lap_time"] = lap_time
            consolidated["sector_times"] = self.lap_sector_times.copy()
            
            # Save completed lap log
            self.completed_laps.append({
                "lap": self.current_lap,
                "lap_time": lap_time,
                "sector_times": self.lap_sector_times.copy(),
                "tire_compound": physics_telemetry["tire_compound"],
                "cognitive_efficiency": hdm_state["cognitive_efficiency"],
                "stress": hdm_state["stress"],
                "fatigue": hdm_state["fatigue"]
            })
            
            # Reset for next lap
            self.current_lap += 1
            self.current_sector = 1
            self.lap_sector_times = []
        else:
            consolidated["lap_completed"] = False
            self.current_sector += 1

        return consolidated
