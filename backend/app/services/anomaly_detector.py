from typing import Dict, Any, List

class AnomalyDetector:
    def __init__(self):
        # Operational thresholds
        self.max_dry_tire_temp = 112.0  # °C
        self.min_dry_tire_temp = 72.0
        self.max_wet_tire_temp = 82.0
        self.max_driver_stress = 0.82
        self.min_driver_focus = 0.55
        self.max_driver_fatigue = 0.75

    def scan_telemetry(self, telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Scans a telemetry state frame for warnings or safety hazards.
        """
        alerts = []
        
        # 1. Tire temperature alerts
        compound = telemetry.get("tire_compound", "MEDIUM")
        temp_FL = telemetry.get("tire_temp_fl", 90.0)
        temp_FR = telemetry.get("tire_temp_fr", 90.0)
        temp_RL = telemetry.get("tire_temp_rl", 90.0)
        temp_RR = telemetry.get("tire_temp_rr", 90.0)

        tires = {"FL": temp_FL, "FR": temp_FR, "RL": temp_RL, "RR": temp_RR}
        
        if compound == "WET":
            for name, temp in tires.items():
                if temp > self.max_wet_tire_temp:
                    alerts.append({
                        "event_type": "tire_warning",
                        "description": f"Tire {name} extreme overheating ({temp}°C). Wet compounds disintegrating.",
                        "severity": "critical"
                    })
        else:
            for name, temp in tires.items():
                if temp > self.max_dry_tire_temp:
                    alerts.append({
                        "event_type": "tire_warning",
                        "description": f"Tire {name} overheating ({temp}°C). Lockup risk elevated.",
                        "severity": "warning"
                    })
                elif temp < self.min_dry_tire_temp:
                    alerts.append({
                        "event_type": "tire_warning",
                        "description": f"Tire {name} under optimal window ({temp}°C). Low cornering grip.",
                        "severity": "info"
                    })

        # 2. Tire wear warnings
        wear_avg = telemetry.get("tire_wear_avg", 0.0)
        if wear_avg > 0.65:
            severity = "critical" if wear_avg > 0.8 else "warning"
            alerts.append({
                "event_type": "tire_warning",
                "description": f"Average tire wear reached {round(wear_avg * 100, 1)}%. Pit stop mandatory.",
                "severity": severity
            })

        # 3. Driver cognitive status warnings
        stress = telemetry.get("stress", 0.0)
        focus = telemetry.get("focus_level", 1.0)
        fatigue = telemetry.get("fatigue", 0.0)

        if stress > self.max_driver_stress:
            alerts.append({
                "event_type": "driver_stress",
                "description": f"Driver stress level critical ({round(stress*100)}%). Aggression bias high.",
                "severity": "warning"
            })
            
        if focus < self.min_driver_focus:
            alerts.append({
                "event_type": "driver_stress",
                "description": f"Driver focus critically degraded ({round(focus*100)}%). Extreme locking warning.",
                "severity": "critical"
            })

        if fatigue > self.max_driver_fatigue:
            alerts.append({
                "event_type": "driver_stress",
                "description": f"Driver fatigue exceeded safe limits ({round(fatigue*100)}%). Braking delays imminent.",
                "severity": "warning"
            })

        # 4. Mechanical or extreme driving anomalies
        gforce_x = telemetry.get("gforce_x", 0.0)
        gforce_y = telemetry.get("gforce_y", 0.0)
        brake = telemetry.get("brake", 0.0)
        
        # High brake pressure during lateral G cornering could signify locking
        if brake > 0.85 and abs(gforce_x) > 3.0:
            alerts.append({
                "event_type": "telemetry_anomaly",
                "description": "Braking G-force instability detected. Front tires locking under corner load.",
                "severity": "warning"
            })

        # Fuel warning
        fuel = telemetry.get("fuel_load", 100.0)
        if fuel < 5.0 and fuel > 0.1:
            alerts.append({
                "event_type": "telemetry_anomaly",
                "description": f"Low fuel alert ({round(fuel, 2)} kg remaining). Risk of engine cut-out.",
                "severity": "critical"
            })

        return alerts
