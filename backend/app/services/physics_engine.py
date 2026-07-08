import random
from typing import Dict, Any

class PhysicsEngine:
    def __init__(self, start_fuel: float = 110.0, start_compound: str = "MEDIUM"):
        self.fuel_load = start_fuel  # kg
        self.tire_compound = start_compound.upper()  # SOFT, MEDIUM, HARD, WET
        
        # Tire wears 0.0 (fresh) to 1.0 (dead)
        self.tire_wear = {
            "FL": 0.0, "FR": 0.0, "RL": 0.0, "RR": 0.0
        }
        
        # Tire temps in °C
        self.tire_temp = {
            "FL": 85.0, "FR": 85.0, "RL": 88.0, "RR": 88.0
        }
        
        self.ers_charge = 100.0  # %
        self.speed = 0.0  # km/h
        self.rpm = 0.0  # rpm
        self.gear = 1  # 1 to 8
        self.throttle = 0.0  # 0 to 1
        self.brake = 0.0  # 0 to 1
        self.steering_angle = 0.0  # degrees
        self.gforce_x = 0.0  # lateral
        self.gforce_y = 0.0  # longitudinal
        self.drs_active = False

        # Sectors reference lap time (Silverstone reference)
        # S1: ~28.0s, S2: ~36.0s, S3: ~26.0s -> Total ~90s (1:30.000)
        self.sector_best = [28.200, 36.100, 25.700]

    def update_telemetry(self, sector: int, engine_mode: str, grip_level: float, hrp: float, track_water_depth: float) -> Dict[str, Any]:
        """
        Simulates one high-frequency telemetry update during a sector.
        """
        # Dynamic Throttle, Brake, Steering, Gear, RPM, G-Forces based on sector layout
        # Sector 1: Straights + Fast corners. Gear 5-8. RPM high. Throttle high. DRS active.
        # Sector 2: Technical/Chicanes. Gear 3-6. Rapid steering, high lateral G-Forces.
        # Sector 3: Slow corners + Pit entry. Gear 2-5. High braking pressure, RL/RR tire stress.
        
        # Mode impacts ERS and Fuel
        ers_deployed = False
        if engine_mode == "PUSH":
            self.fuel_load = max(0.0, self.fuel_load - 0.08)  # Burn fuel faster
            if self.ers_charge > 5.0:
                self.ers_charge -= 0.6  # Deploy ERS
                ers_deployed = True
        else:
            self.fuel_load = max(0.0, self.fuel_load - 0.045)  # Conserve fuel
            self.ers_charge = min(100.0, self.ers_charge + 0.4)  # Harvest ERS

        # Grip multiplier based on compound + track water depth
        compound_grip = self._get_compound_grip(track_water_depth)
        combined_grip = grip_level * compound_grip

        # Speed, RPM, Throttle, Brake simulation
        if sector == 1:
            self.throttle = round(random.uniform(0.85, 1.0) if combined_grip > 0.7 else random.uniform(0.6, 0.8), 2)
            self.brake = round(random.uniform(0.0, 0.15), 2)
            self.steering_angle = round(random.uniform(-10.0, 10.0), 1)
            self.gear = random.choice([6, 7, 8])
            self.drs_active = True if track_water_depth < 0.2 else False
            base_speed = 310.0
        elif sector == 2:
            self.throttle = round(random.uniform(0.4, 0.75), 2)
            self.brake = round(random.uniform(0.1, 0.6), 2)
            self.steering_angle = round(random.uniform(-45.0, 45.0), 1)
            self.gear = random.choice([3, 4, 5, 6])
            self.drs_active = False
            base_speed = 210.0
        else:
            self.throttle = round(random.uniform(0.3, 0.8), 2)
            self.brake = round(random.uniform(0.3, 0.95), 2)
            self.steering_angle = round(random.uniform(-30.0, 30.0), 1)
            self.gear = random.choice([2, 3, 4, 5])
            self.drs_active = False
            base_speed = 175.0

        # Adjust speed based on combined grip, weight (fuel), ERS deployment, and driver HRP
        fuel_weight_penalty = (self.fuel_load / 110.0) * 8.0  # up to 8 km/h slower when full of fuel
        ers_boost = 15.0 if ers_deployed else 0.0
        hrp_delay_penalty = hrp * 12.0  # Driver delay/mistake slows car down

        self.speed = round((base_speed * combined_grip) - fuel_weight_penalty + ers_boost - hrp_delay_penalty + random.uniform(-4, 4), 1)
        self.speed = max(40.0, self.speed)  # Ensure positive speed

        # RPM matching speed and gear
        self.rpm = round((self.speed / (self.gear * 40.0)) * 12000.0 + random.uniform(-100, 100))
        self.rpm = max(4000.0, min(14800.0, self.rpm))

        # G-Forces
        self.gforce_x = round((self.steering_angle / 45.0) * 4.2 * combined_grip + random.uniform(-0.2, 0.2), 2)
        self.gforce_y = round((self.throttle - self.brake) * 3.5 * combined_grip + random.uniform(-0.1, 0.1), 2)

        # Update Tire Temperatures & Wear
        self._update_tires(sector, engine_mode, combined_grip, hrp, track_water_depth)

        return self.get_telemetry_state()

    def _get_compound_grip(self, track_water_depth: float) -> float:
        """
        Determines the tire compound grip depending on the water on the track.
        """
        if self.tire_compound == "SOFT":
            # Soft has highest dry grip, but fails completely in wet
            if track_water_depth < 0.1: return 1.05
            if track_water_depth < 0.8: return 0.7
            return 0.3
        elif self.tire_compound == "MEDIUM":
            # Medium is the benchmark
            if track_water_depth < 0.1: return 1.0
            if track_water_depth < 0.8: return 0.65
            return 0.25
        elif self.tire_compound == "HARD":
            # Hard has lower base grip, but is durable
            if track_water_depth < 0.1: return 0.95
            if track_water_depth < 0.8: return 0.6
            return 0.2
        elif self.tire_compound == "WET":
            # Wet tires perform poorly on dry tracks but are optimal in wet
            if track_water_depth < 0.1: return 0.6  # Overheats and slips
            if track_water_depth < 1.5: return 0.85  # Damp/intermediate zone
            return 0.95  # Heavy wet
        return 1.0

    def _update_tires(self, sector: int, engine_mode: str, combined_grip: float, hrp: float, track_water_depth: float):
        """
        Calculates independent tire degradation and temperatures.
        """
        # Wear factors by compound
        wear_rates = {
            "SOFT": 0.0035,
            "MEDIUM": 0.002,
            "HARD": 0.0011,
            "WET": 0.0012 if track_water_depth > 0.5 else 0.008  # Wets disintegrate on dry tracks
        }
        
        base_rate = wear_rates.get(self.tire_compound, 0.002)
        if engine_mode == "PUSH":
            base_rate *= 1.7
        
        # Driver HRP factor: locking tires increases local wear and generates flat-spots (wear spikes)
        hrp_wear_multiplier = 1.0 + (hrp * 1.5)

        # Apply sector wear bias
        # Sector 2: high steering -> FL and FR wear slightly more
        # Sector 3: high traction -> RL and RR wear slightly more
        for tire in self.tire_wear:
            wear_inc = base_rate * hrp_wear_multiplier
            if sector == 2 and tire in ["FL", "FR"]:
                wear_inc *= 1.2
            elif sector == 3 and tire in ["RL", "RR"]:
                wear_inc *= 1.3
            self.tire_wear[tire] = min(1.0, round(self.tire_wear[tire] + wear_inc, 4))

        # Temperature simulation
        # Ideal Temps: SOFT/MED/HARD = 85°C - 105°C, WET = 55°C - 75°C
        target_temp = 90.0
        if self.tire_compound == "WET":
            target_temp = 65.0 if track_water_depth > 0.5 else 105.0  # Overheating on dry track
        else:
            if track_water_depth > 1.0:
                target_temp = 50.0  # Overcooled by surface water
            else:
                target_temp = 95.0

        if engine_mode == "PUSH":
            target_temp += 10.0
        
        # Add friction-based temperature increases per sector
        for tire in self.tire_temp:
            friction_heat = abs(self.gforce_x) * 2.5 + abs(self.gforce_y) * 1.8
            # Under HRP or locking, spikes temp
            if hrp > 0.5 and random.random() < 0.1:
                friction_heat += 15.0  # locking spike
                
            current = self.tire_temp[tire]
            # Heat moves towards target + friction
            self.tire_temp[tire] = round(current + ((target_temp + friction_heat) - current) * 0.12, 1)

    def change_tires(self, new_compound: str):
        """
        Executes a tire swap (box events).
        """
        self.tire_compound = new_compound.upper()
        for tire in self.tire_wear:
            self.tire_wear[tire] = 0.0
        for tire in self.tire_temp:
            # Tires come out of blankets at 80°C
            self.tire_temp[tire] = 80.0 if new_compound != "WET" else 60.0

    def get_telemetry_state(self) -> Dict[str, Any]:
        avg_wear = sum(self.tire_wear.values()) / 4.0
        return {
            "speed": self.speed,
            "rpm": self.rpm,
            "gear": self.gear,
            "throttle": self.throttle,
            "brake": self.brake,
            "steering_angle": self.steering_angle,
            "gforce_x": self.gforce_x,
            "gforce_y": self.gforce_y,
            "fuel_load": round(self.fuel_load, 2),
            "ers_charge": round(self.ers_charge, 1),
            "drs_active": self.drs_active,
            "tire_compound": self.tire_compound,
            # Independent corners
            "tire_wear_fl": round(self.tire_wear["FL"], 4),
            "tire_wear_fr": round(self.tire_wear["FR"], 4),
            "tire_wear_rl": round(self.tire_wear["RL"], 4),
            "tire_wear_rr": round(self.tire_wear["RR"], 4),
            "tire_wear_avg": round(avg_wear, 4),
            "tire_temp_fl": self.tire_temp["FL"],
            "tire_temp_fr": self.tire_temp["FR"],
            "tire_temp_rl": self.tire_temp["RL"],
            "tire_temp_rr": self.tire_temp["RR"],
        }
