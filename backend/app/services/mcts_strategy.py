import random
import math
from typing import Dict, Any, List

class StrategyNode:
    def __init__(self, lap: int, tire_compound: str, fuel_load: float, fatigue: float, stress: float, rain_intensity: float, track_grip: float, parent=None, action: str = None):
        self.lap = lap
        self.tire_compound = tire_compound
        self.fuel_load = fuel_load
        self.fatigue = fatigue
        self.stress = stress
        self.rain_intensity = rain_intensity
        self.track_grip = track_grip
        
        self.parent = parent
        self.action = action  # 'PUSH', 'CONSERVE', 'BOX_SOFT', 'BOX_MEDIUM', 'BOX_HARD', 'BOX_WET'
        
        self.children = []
        self.visits = 0
        self.total_time_cost = 0.0  # We want to MINIMIZE this cost (race duration)
        self.risk_penalty = 0.0  # Sum of mistakes/crashes

    def is_fully_expanded(self) -> bool:
        # Action space: PUSH, CONSERVE, and BOX options (can only box if we stay out, say)
        # To avoid combinatorial explosion in MCTS search, we only allow BOX if tire wear is high or weather changes
        allowed = ["PUSH", "CONSERVE"]
        if self.lap < 50:  # Allow pit stops
            allowed.extend(["BOX_SOFT", "BOX_MEDIUM", "BOX_HARD", "BOX_WET"])
        return len(self.children) == len(allowed)

    def get_best_child(self, exploration_constant: float = 2.0):
        # Since we want to MINIMIZE total cost, UCT is modified:
        # Value = - (total_time_cost/visits) + C * sqrt(ln(parent_visits)/visits)
        # We add HRP risk penalty to the cost.
        best_val = -float('inf')
        best_child = None
        
        for child in self.children:
            if child.visits == 0:
                return child
            
            # Average lap time + average risk penalty
            avg_cost = (child.total_time_cost + child.risk_penalty) / child.visits
            exploitation = -avg_cost
            
            exploration = exploration_constant * math.sqrt(math.log(self.visits) / child.visits)
            uct_val = exploitation + exploration
            
            if uct_val > best_val:
                best_val = uct_val
                best_child = child
                
        return best_child

class MCTSStrategyEngine:
    def __init__(self, total_race_laps: int = 50):
        self.total_race_laps = total_race_laps
        self.reference_base_lap = 90.0  # 1:30.000 (Silverstone base)
        self.pit_lane_loss = 22.0

    def optimize_strategy(self, current_lap: int, current_compound: str, fuel_load: float, fatigue: float, stress: float, rain_intensity: float, track_grip: float, rollouts: int = 150) -> Dict[str, Any]:
        """
        Runs MCTS rollouts from the current state to find the optimal strategy.
        """
        # If already on the last lap, just stay out
        if current_lap >= self.total_race_laps:
            return {
                "recommended_compound": current_compound,
                "expected_stops": 0,
                "confidence_score": 1.0,
                "win_probability": 0.5,
                "pit_window_start": 0,
                "pit_window_end": 0,
                "strategy_string": f"Lap {current_lap}: STAY OUT",
                "recommended_action": "STAY OUT",
                "predicted_laps": []
            }

        root = StrategyNode(
            lap=current_lap,
            tire_compound=current_compound,
            fuel_load=fuel_load,
            fatigue=fatigue,
            stress=stress,
            rain_intensity=rain_intensity,
            track_grip=track_grip
        )

        for _ in range(rollouts):
            node = root
            # 1. Selection
            while node.children and node.is_fully_expanded():
                node = node.get_best_child()
                if node is None:
                    break
            
            # If selection returned None or we reached the end, bypass
            if node is None:
                continue

            # 2. Expansion
            if not node.is_fully_expanded() and node.lap < self.total_race_laps:
                action = self._select_unexplored_action(node)
                if action:
                    node = self._expand_node(node, action)

            # 3. Simulation (Rollout)
            cost, risk = self._run_rollout(node)

            # 4. Backpropagation
            curr = node
            while curr is not None:
                curr.visits += 1
                curr.total_time_cost += cost
                curr.risk_penalty += risk
                curr = curr.parent

        # Select best immediate action based on highest visits (most robust path)
        if not root.children:
            # Fallback
            return self._generate_fallback(current_compound, current_lap)

        best_child = max(root.children, key=lambda c: c.visits)
        best_action = best_child.action

        # Generate predicted strategy timeline
        predicted_path = []
        curr = best_child
        pit_stops = 0
        recommended_compound = current_compound
        pit_laps = []

        # Follow best simulated route
        temp_lap = current_lap
        temp_comp = current_compound
        
        while temp_lap < self.total_race_laps:
            # Predict compound changes
            if "BOX" in best_action:
                temp_comp = best_action.split("_")[1]
                pit_stops += 1
                pit_laps.append(temp_lap)
                best_action = "STAY OUT"  # Reset for next steps
            
            predicted_path.append({
                "lap": temp_lap,
                "compound": temp_comp,
                "mode": "PUSH" if "PUSH" in best_action else "CONSERVE"
            })
            temp_lap += 1

        # Heuristic confidence and win probability
        hrp = 1.0 - (root.focus_level_calc() * (1.0 - root.fatigue * 0.3))
        confidence = max(0.1, min(0.98, 0.95 - (hrp * 0.5) - (rain_intensity * 0.2)))
        win_prob = max(0.05, min(0.95, 0.65 - (pit_stops * 0.12) - (hrp * 0.4) + (0.1 if current_compound == "SOFT" else 0.0)))

        # Format strategy string
        strategy_timeline = []
        current_stint_start = current_lap
        curr_c = current_compound
        for lap_data in predicted_path:
            if lap_data["compound"] != curr_c:
                strategy_timeline.append(f"{curr_c} (Laps {current_stint_start}-{lap_data['lap']-1})")
                current_stint_start = lap_data["lap"]
                curr_c = lap_data["compound"]
        strategy_timeline.append(f"{curr_c} (Laps {current_stint_start}-{self.total_race_laps})")
        strategy_str = " → ".join(strategy_timeline)

        # Set pit window
        pit_window_start = 0
        pit_window_end = 0
        if pit_laps:
            pit_window_start = max(current_lap, pit_laps[0] - 2)
            pit_window_end = min(self.total_race_laps, pit_laps[0] + 2)

        return {
            "recommended_compound": best_child.tire_compound,
            "expected_stops": pit_stops,
            "confidence_score": round(confidence, 2),
            "win_probability": round(win_prob, 2),
            "pit_window_start": pit_window_start,
            "pit_window_end": pit_window_end,
            "strategy_string": strategy_str,
            "recommended_action": best_child.action,
            "predicted_laps": predicted_path[:10]  # Return next 10 laps for visual chart forecasts
        }

    def _select_unexplored_action(self, node: StrategyNode) -> str:
        explored = [child.action for child in node.children]
        allowed = ["PUSH", "CONSERVE"]
        if node.lap < self.total_race_laps - 1:
            allowed.extend(["BOX_SOFT", "BOX_MEDIUM", "BOX_HARD", "BOX_WET"])
        
        unexplored = [a for a in allowed if a not in explored]
        return random.choice(unexplored) if unexplored else None

    def _expand_node(self, node: StrategyNode, action: str) -> StrategyNode:
        next_lap = node.lap + 1
        
        # Physics / State transition heuristics for tree search
        new_compound = node.tire_compound
        pit_cost = 0.0
        
        if "BOX" in action:
            new_compound = action.split("_")[1]
            pit_cost = self.pit_lane_loss + 2.4  # Pit lane driving + stop duration

        # Fuel burn
        fuel_burn = 1.4 if action == "PUSH" else 0.85
        new_fuel = max(0.0, node.fuel_load - fuel_burn)

        # Fatigue increase
        fatigue_inc = 0.007 if action == "PUSH" else 0.004
        new_fatigue = min(1.0, node.fatigue + fatigue_inc)
        
        # Stress spike
        new_stress = node.stress
        if action == "BOX_WET" and node.rain_intensity < 0.3:
            new_stress += 0.25 # Boxing early stresses driver

        child = StrategyNode(
            lap=next_lap,
            tire_compound=new_compound,
            fuel_load=new_fuel,
            fatigue=new_fatigue,
            stress=new_stress,
            rain_intensity=node.rain_intensity,
            track_grip=node.track_grip,
            parent=node,
            action=action
        )
        # Apply initial time penalty for pit stops inside the node cost
        child.total_time_cost += pit_cost
        
        node.children.append(child)
        return child

    def _run_rollout(self, node: StrategyNode) -> tuple:
        """
        Simulates the race from the node's lap to the end of the race to calculate cost.
        """
        curr_lap = node.lap
        curr_compound = node.tire_compound
        curr_fuel = node.fuel_load
        curr_fatigue = node.fatigue
        curr_stress = node.stress
        curr_rain = node.rain_intensity
        curr_grip = node.track_grip
        
        total_time = 0.0
        total_risk = 0.0
        
        # Simple fast-forward simulation
        while curr_lap < self.total_race_laps:
            # Determine tyre grip multiplier
            comp_grip = 1.0
            if curr_compound == "SOFT": comp_grip = 1.05 if curr_rain < 0.2 else 0.4
            elif curr_compound == "MEDIUM": comp_grip = 1.0 if curr_rain < 0.2 else 0.35
            elif curr_compound == "HARD": comp_grip = 0.95 if curr_rain < 0.2 else 0.3
            elif curr_compound == "WET": comp_grip = 0.65 if curr_rain < 0.2 else 0.92

            combined_grip = curr_grip * comp_grip

            # Driver cognitive efficiency
            focus = 1.0 - (curr_fatigue * 0.4)
            cog_eff = max(0.1, focus * (1.0 - curr_stress * 0.25))
            hrp = 1.0 - cog_eff

            # Compute lap time
            base_time = self.reference_base_lap
            # Fuel penalty (+0.08s per kg of fuel)
            fuel_penalty = curr_fuel * 0.08
            # Grip penalty
            grip_penalty = (1.0 - combined_grip) * 15.0
            # Driver delay
            driver_penalty = hrp * 4.0
            
            lap_time = base_time + fuel_penalty + grip_penalty + driver_penalty + random.uniform(-0.5, 0.5)
            total_time += lap_time

            # Accumulate risk penalty
            mistake_risk = (hrp ** 2.5) * 50.0  # exponential time penalty weight
            total_risk += mistake_risk

            # Advance state variables
            curr_lap += 1
            curr_fuel = max(0.0, curr_fuel - 1.1)  # average consumption per lap
            curr_fatigue = min(1.0, curr_fatigue + 0.005)
            
        return total_time, total_risk

    def _generate_fallback(self, current_compound: str, current_lap: int) -> Dict[str, Any]:
        return {
            "recommended_compound": current_compound,
            "expected_stops": 0,
            "confidence_score": 0.5,
            "win_probability": 0.3,
            "pit_window_start": min(self.total_race_laps, current_lap + 2),
            "pit_window_end": min(self.total_race_laps, current_lap + 6),
            "strategy_string": f"{current_compound} → Laps {current_lap}-{self.total_race_laps}",
            "recommended_action": "CONSERVE",
            "predicted_laps": []
        }

    # Helper function in StrategyNode to estimate focus
    def focus_level_calc(self) -> float:
        return max(0.2, 1.0 - (self.fatigue * 0.4) - (self.stress * 0.15))
