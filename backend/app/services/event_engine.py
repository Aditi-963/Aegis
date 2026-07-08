import random
from typing import Dict, Any, List

class EventEngine:
    def __init__(self):
        self.session_flag = "GREEN"  # GREEN, YELLOW, VSC, SAFETY_CAR, RED
        self.flag_timer = 0  # sectors remaining for current flag
        self.rain_forecast_ticks = 0
        self.rain_forecast_message = ""

    def update_session_flags(self, lap: int, sector: int, driver_mistake: bool, fatigue: float) -> Dict[str, Any]:
        """
        Manages the global race flags (Safety Car, Yellow Flag) dynamically.
        """
        # Decrement flag timers
        if self.flag_timer > 0:
            self.flag_timer -= 1
            if self.flag_timer == 0:
                self.session_flag = "GREEN"
                return {
                    "event_type": "flag",
                    "description": "TRACK CLEAR: Double yellow flags cleared. DRS enabled.",
                    "severity": "info",
                    "flag": "GREEN"
                }
            return None

        # Random incident generation or triggered by driver mistakes
        # High fatigue/HRP increases chances of global yellow flags (other cars spinning, etc.)
        incident_roll = random.random()
        
        # If our driver made a mistake that was severe
        if driver_mistake and incident_roll < 0.2:
            self.session_flag = "YELLOW"
            self.flag_timer = random.randint(2, 4)  # sector durations
            return {
                "event_type": "flag",
                "description": f"YELLOW FLAG: Sector {sector} incident. Driver off track, recovered.",
                "severity": "warning",
                "flag": "YELLOW"
            }

        # Session-wide Safety Cars / VSCs (simulating other grid cars)
        if incident_roll < 0.015:  # 1.5% chance of VSC per sector
            self.session_flag = "VSC"
            self.flag_timer = random.randint(4, 8)
            return {
                "event_type": "flag",
                "description": "VIRTUAL SAFETY CAR: Debris on exit of Becketts (Turn 13). Speed limited.",
                "severity": "critical",
                "flag": "VSC"
            }
        elif incident_roll < 0.025:  # 1% chance of Safety Car
            self.session_flag = "SAFETY_CAR"
            self.flag_timer = random.randint(6, 12)
            return {
                "event_type": "flag",
                "description": "SAFETY CAR DEPLOYED: Heavy crash S2. Field grouping. Pit lane open.",
                "severity": "critical",
                "flag": "SAFETY_CAR"
            }

        return None

    def trigger_rain_forecast(self, current_rain: float, target_rain: float) -> Dict[str, Any]:
        """
        Simulates radar reports of incoming rain.
        """
        if target_rain is not None and target_rain > current_rain and self.rain_forecast_ticks == 0:
            self.rain_forecast_ticks = 15  # Alert active for some ticks
            self.rain_forecast_message = f"RADAR WARNING: Rain cell incoming. Est. arrival in 4 laps. Intensity expected at {round(target_rain*100)}%."
            return {
                "event_type": "weather_change",
                "description": self.rain_forecast_message,
                "severity": "warning"
            }
        
        if self.rain_forecast_ticks > 0:
            self.rain_forecast_ticks -= 1
            
        return None
