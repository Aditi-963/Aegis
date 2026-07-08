from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class TelemetryLogBase(BaseModel):
    lap: int
    sector: int
    speed: float
    rpm: float
    gear: int
    throttle: float
    brake: float
    steering_angle: float
    gforce_x: float
    gforce_y: float
    fuel_load: float
    ers_charge: float
    tire_wear_fl: float
    tire_wear_fr: float
    tire_wear_rl: float
    tire_wear_rr: float
    tire_temp_fl: float
    tire_temp_fr: float
    tire_temp_rl: float
    tire_temp_rr: float
    tire_compound: str
    hrp_score: float

class TelemetryLogCreate(TelemetryLogBase):
    session_id: int

class TelemetryLogSchema(TelemetryLogBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class DriverStateBase(BaseModel):
    lap: int
    cognitive_efficiency: float
    fatigue: float
    stress: float
    reaction_delay: float
    focus_level: float
    aggression_bias: float
    risk_bias: float
    confidence_state: float

class DriverStateCreate(DriverStateBase):
    session_id: int

class DriverStateSchema(DriverStateBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class WeatherStateBase(BaseModel):
    lap: int
    rain_intensity: float
    track_water_depth: float
    grip_level: float
    status: str

class WeatherStateCreate(WeatherStateBase):
    session_id: int

class WeatherStateSchema(WeatherStateBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class StrategyHistoryBase(BaseModel):
    lap: int
    recommended_compound: str
    expected_stops: int
    mcts_depth: int
    win_probability: float
    confidence_score: float
    pit_window_start: int
    pit_window_end: int
    strategy_string: str

class StrategyHistoryCreate(StrategyHistoryBase):
    session_id: int

class StrategyHistorySchema(StrategyHistoryBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class PitStopEventBase(BaseModel):
    lap: int
    compound_from: str
    compound_to: str
    duration: float
    is_unsafe_release: bool
    is_crew_error: bool
    pit_lane_time: float

class PitStopEventCreate(PitStopEventBase):
    session_id: int

class PitStopEventSchema(PitStopEventBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class RaceEventLogBase(BaseModel):
    lap: int
    event_type: str
    description: str
    severity: str

class RaceEventLogCreate(RaceEventLogBase):
    session_id: int

class RaceEventLogSchema(RaceEventLogBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AuditChainBase(BaseModel):
    block_index: int
    telemetry_hash: str
    previous_hash: str
    verified: bool

class AuditChainCreate(AuditChainBase):
    session_id: int

class AuditChainSchema(AuditChainBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class RaceSessionBase(BaseModel):
    name: str
    track_name: str
    total_laps: int

class RaceSessionCreate(RaceSessionBase):
    pass

class RaceSessionSchema(RaceSessionBase):
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class StrategyRequest(BaseModel):
    lap: int
    driver_fatigue: float
    driver_stress: float
    tire_wear: float
    tire_compound: str
    rain_intensity: float
    track_grip: float
    fuel_load: float
