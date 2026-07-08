import random
from typing import Dict, Any

class HDMEngine:
    def __init__(self, aggression_bias: float = 0.5):
        self.fatigue = 0.05  # 0.0 to 1.0
        self.stress = 0.15  # 0.0 to 1.0
        self.focus_level = 0.95  # 0.0 to 1.0
        self.aggression_bias = aggression_bias  # 0.0 to 1.0 (set by user/driver style)
        self.risk_bias = 0.2  # 0.0 to 1.0 (increases under stress or catching up)
        self.confidence_state = 0.8  # 0.0 to 1.0
        self.reaction_delay = 0.15  # seconds
        self.cognitive_efficiency = 1.0  # 0.0 to 1.0
        self.hrp_score = 0.0  # Human Risk Penalty
        self.mistake_occurred = False
        self.mistake_description = ""

    def update(self, lap: int, engine_mode: str, tire_wear: float, grip_level: float, rain_intensity: float) -> Dict[str, Any]:
        """
        Updates the driver's cognitive state based on racing telemetry, weather, and tires.
        """
        self.mistake_occurred = False
        self.mistake_description = ""

        # 1. Fatigue accumulation
        # Push mode causes more fatigue. Heavy wear or rain increases fatigue rate.
        fatigue_rate = 0.006
        if engine_mode == "PUSH":
            fatigue_rate *= 1.8
        if rain_intensity > 0.3:
            fatigue_rate *= 1.5
        if tire_wear > 0.5:
            fatigue_rate *= 1.3
        
        self.fatigue = min(1.0, self.fatigue + fatigue_rate)

        # 2. Stress calculation
        # Affected by low grip, extreme rain, high tire wear, and aggression bias
        target_stress = 0.1
        target_stress += (1.0 - grip_level) * 0.4
        target_stress += rain_intensity * 0.3
        target_stress += (tire_wear ** 2) * 0.25
        target_stress += self.aggression_bias * 0.15
        
        # Smooth stress transition
        self.stress = round(self.stress + (target_stress - self.stress) * 0.15, 3)

        # 3. Focus Level
        # Focus drops as fatigue increases, but is temporarily spiked by stress (adrenaline)
        # up to a point, after which extreme stress crushes focus (panic/overwhelm).
        base_focus = 1.0 - (self.fatigue * 0.4)
        if self.stress < 0.6:
            # Adrenaline spike boost
            focus_multiplier = 1.0 + (self.stress * 0.1)
        else:
            # Panic drop
            focus_multiplier = 1.0 - ((self.stress - 0.6) * 0.6)
            
        self.focus_level = max(0.2, min(1.0, base_focus * focus_multiplier))

        # 4. Confidence State
        # Boosted by grip and high focus; crushed by worn tires and high stress
        self.confidence_state = max(0.1, min(1.0, grip_level * 0.6 + self.focus_level * 0.4 - self.stress * 0.2))

        # 5. Risk Bias
        # Increases when driver is pushing, has low confidence, or high aggression
        target_risk = self.aggression_bias * 0.5 + (1.0 - self.confidence_state) * 0.3
        if engine_mode == "PUSH":
            target_risk += 0.2
        self.risk_bias = max(0.0, min(1.0, target_risk))

        # 6. Cognitive Efficiency
        # Overall capacity is focus degraded by fatigue and stress
        self.cognitive_efficiency = max(0.1, round(
            self.focus_level * (1.0 - self.fatigue * 0.35) * (1.0 - self.stress * 0.25), 3
        ))

        # 7. Human Risk Penalty (HRP)
        self.hrp_score = round(1.0 - self.cognitive_efficiency, 3)

        # 8. Reaction Delay (seconds)
        # Base is 0.15s (150ms). Fatigue and stress add to reaction time.
        self.reaction_delay = round(0.15 + (self.fatigue * 0.12) + (self.stress * 0.08), 3)

        # 9. Mistake roll
        # Mistake probability increases exponentially with HRP and Risk Bias
        mistake_probability = (self.hrp_score ** 2.5) * 0.2 + (self.risk_bias * 0.05)
        if random.random() < mistake_probability:
            self.mistake_occurred = True
            # Roll for mistake type
            mistake_roll = random.random()
            if mistake_roll < 0.4:
                self.mistake_description = "Lockup S1: Over-braking at hairpin due to cognitive delay."
                self.confidence_state = max(0.1, self.confidence_state - 0.15)
                self.stress = min(1.0, self.stress + 0.2)
            elif mistake_roll < 0.7:
                self.mistake_description = "Apex Miss S2: Drifted wide onto exit kerb, losing sector delta."
                self.confidence_state = max(0.1, self.confidence_state - 0.1)
                self.stress = min(1.0, self.stress + 0.15)
            else:
                self.mistake_description = "Traction Loss S3: Excessive throttle spin on worn rears."
                self.confidence_state = max(0.1, self.confidence_state - 0.2)
                self.stress = min(1.0, self.stress + 0.25)

        return self.get_state()

    def get_state(self) -> Dict[str, Any]:
        return {
            "fatigue": round(self.fatigue, 2),
            "stress": round(self.stress, 2),
            "focus_level": round(self.focus_level, 2),
            "aggression_bias": round(self.aggression_bias, 2),
            "risk_bias": round(self.risk_bias, 2),
            "confidence_state": round(self.confidence_state, 2),
            "reaction_delay": round(self.reaction_delay, 3),
            "cognitive_efficiency": round(self.cognitive_efficiency, 2),
            "hrp_score": round(self.hrp_score, 2),
            "mistake_occurred": self.mistake_occurred,
            "mistake_description": self.mistake_description
        }
