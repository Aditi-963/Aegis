import random
from typing import Dict, Any

class WeatherEngine:
    def __init__(self):
        self.rain_intensity = 0.0  # 0.0 to 1.0
        self.track_water_depth = 0.0  # 0.0 to 6.0 mm
        self.grip_level = 1.0  # 1.0 (dry) to 0.4 (extreme wet)
        self.status = "dry"  # dry, cloudy, damp, wet, heavy_rain
        self.ambient_temp = 22.0  # °C
        self.track_temp = 35.0  # °C
        self.humidity = 40.0  # %
        
    def update(self, lap: int, target_rain: float = None) -> Dict[str, Any]:
        """
        Updates weather variables. If target_rain is provided, transitions
        towards it. Otherwise, evolves naturally.
        """
        # Natural evolution if target is not forced
        if target_rain is None:
            # Let's say weather evolves slowly
            change_roll = random.random()
            if change_roll < 0.05:  # 5% chance of weather shifts
                delta = random.uniform(-0.15, 0.15)
                self.rain_intensity = max(0.0, min(1.0, self.rain_intensity + delta))
        else:
            # Transition towards user-targeted rain intensity (0.05 step per update)
            if self.rain_intensity < target_rain:
                self.rain_intensity = min(target_rain, self.rain_intensity + 0.05)
            elif self.rain_intensity > target_rain:
                self.rain_intensity = max(target_rain, self.rain_intensity - 0.05)

        # Track water depth evolution
        if self.rain_intensity > 0.0:
            # Water accumulates depending on rain intensity
            accumulation = self.rain_intensity * 0.4  # accumulation rate mm/step
            self.track_water_depth = min(6.0, self.track_water_depth + accumulation)
        else:
            # Track dries out
            dry_rate = 0.1 + (self.track_temp / 100.0) * 0.15  # temperature dependent
            self.track_water_depth = max(0.0, self.track_water_depth - dry_rate)

        # Classify weather status
        if self.track_water_depth < 0.1:
            if self.rain_intensity > 0.0:
                self.status = "cloudy"  # starting to spit
            else:
                self.status = "dry"
        elif self.track_water_depth < 1.0:
            self.status = "damp"
        elif self.track_water_depth < 3.0:
            self.status = "wet"
        else:
            self.status = "heavy_rain"

        # Calculate grip levels based on track water depth
        # Dry track grip is 1.0
        # Grip drops as water accumulates
        base_grip = 1.0
        if self.track_water_depth > 0.0:
            # Grip loss curve
            base_grip -= min(0.6, self.track_water_depth * 0.18)
        self.grip_level = round(max(0.4, base_grip), 3)

        # Temperature effects
        if self.status in ["wet", "heavy_rain"]:
            self.track_temp = max(16.0, self.track_temp - 0.5)
            self.humidity = min(98.0, self.humidity + 2.0)
        else:
            # Recover back to ambient+
            self.track_temp = min(38.0, self.track_temp + 0.1)
            self.humidity = max(35.0, self.humidity - 0.5)

        return self.get_state()

    def get_state(self) -> Dict[str, Any]:
        return {
            "rain_intensity": round(self.rain_intensity, 2),
            "track_water_depth": round(self.track_water_depth, 2),
            "grip_level": round(self.grip_level, 2),
            "status": self.status,
            "ambient_temp": round(self.ambient_temp, 1),
            "track_temp": round(self.track_temp, 1),
            "humidity": round(self.humidity, 1)
        }
