import random
from typing import Dict, Any

class PitEngine:
    def __init__(self):
        # Normal distribution params for F1 pit crew
        self.base_pit_stop_mu = 2.4  # seconds
        self.base_pit_stop_sigma = 0.3
        self.pit_lane_delta = 20.0  # seconds spent driving down pit lane (Silverstone spec)

    def execute_stop(self, driver_fatigue: float, driver_stress: float, risk_bias: float) -> Dict[str, Any]:
        """
        Simulates a physical pit stop, tire swap and releases the car.
        """
        # Risk factors increase team mistakes
        crew_mistake_prob = 0.04 + (driver_stress * 0.05) + (risk_bias * 0.03)
        
        is_crew_error = False
        duration_penalty = 0.0
        error_reason = ""
        
        # Crew mistake check (cross-threaded wheel nut, front jack delay, etc.)
        if random.random() < crew_mistake_prob:
            is_crew_error = True
            error_roll = random.random()
            if error_roll < 0.40:
                duration_penalty = random.uniform(3.0, 5.0)
                error_reason = "Wheel nut cross-thread on Front-Right. Gun jammed."
            elif error_roll < 0.75:
                duration_penalty = random.uniform(1.8, 3.5)
                error_reason = "Front Jack release failure. Delayed lowering."
            else:
                duration_penalty = random.uniform(8.0, 15.0)
                error_reason = "Rear-Left tyre fitment issue. Cross-thread override required."

        # Dynamic pit stop duration using normal distribution
        base_swap_time = max(1.8, random.normalvariate(self.base_pit_stop_mu, self.base_pit_stop_sigma))
        total_stationary_time = round(base_swap_time + duration_penalty, 3)

        # Unsafe release risk
        # Risk bias increases chances of unsafe release
        unsafe_release_prob = 0.01 + (risk_bias * 0.08)
        is_unsafe_release = False
        if random.random() < unsafe_release_prob:
            is_unsafe_release = True

        total_pit_time = round(self.pit_lane_delta + total_stationary_time, 3)

        return {
            "duration": total_stationary_time,
            "is_crew_error": is_crew_error,
            "error_reason": error_reason,
            "is_unsafe_release": is_unsafe_release,
            "pit_lane_time": total_pit_time,
            "warmup_penalty_sectors": 1  # Next 1 sector is slower due to cold tires
        }

    def analyze_traffic_window(self, car_lap_times: list, gap_to_leader: float) -> Dict[str, Any]:
        """
        Analyzes if boxing now puts the driver in traffic or clean air.
        """
        # Simplistic traffic model: We check where a ~22 second pit stop puts us
        # compared to simulated field gaps.
        # Say field has cars every 4-8 seconds.
        projected_gap = gap_to_leader + 22.5
        
        # Determine if we land in a clean window or behind traffic
        # We can simulate the surrounding gaps
        nearby_cars = []
        in_traffic = False
        traffic_reason = ""
        
        # Simple heuristic
        if int(projected_gap) % 8 in [0, 1, 2, 7]:
            in_traffic = True
            traffic_reason = "Dirty air window behind Car 14 (Aston Martin)."
        else:
            in_traffic = False
            traffic_reason = "Clean track window. Est. 3.2s gap ahead and 4.1s behind."

        return {
            "projected_position_delta": -22.5,
            "in_traffic": in_traffic,
            "traffic_reason": traffic_reason,
            "window_status": "CRITICAL" if in_traffic else "OPTIMAL"
        }
