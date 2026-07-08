from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.connection import Base

class RaceSession(Base):
    __tablename__ = "race_sessions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    track_name = Column(String)
    total_laps = Column(Integer)
    status = Column(String, default="active")  # active, completed, paused
    created_at = Column(DateTime, default=datetime.utcnow)

    telemetry_logs = relationship("TelemetryLog", back_populates="session", cascade="all, delete-orphan")
    driver_states = relationship("DriverState", back_populates="session", cascade="all, delete-orphan")
    weather_states = relationship("WeatherState", back_populates="session", cascade="all, delete-orphan")
    strategy_history = relationship("StrategyHistory", back_populates="session", cascade="all, delete-orphan")
    pit_stops = relationship("PitStopEvent", back_populates="session", cascade="all, delete-orphan")
    events = relationship("RaceEventLog", back_populates="session", cascade="all, delete-orphan")
    audit_chain = relationship("AuditChain", back_populates="session", cascade="all, delete-orphan")

class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id", ondelete="CASCADE"))
    lap = Column(Integer)
    sector = Column(Integer)
    speed = Column(Float)
    rpm = Column(Float)
    gear = Column(Integer)
    throttle = Column(Float)
    brake = Column(Float)
    steering_angle = Column(Float)
    gforce_x = Column(Float)
    gforce_y = Column(Float)
    fuel_load = Column(Float)
    ers_charge = Column(Float)
    
    # Tires
    tire_wear_fl = Column(Float)
    tire_wear_fr = Column(Float)
    tire_wear_rl = Column(Float)
    tire_wear_rr = Column(Float)
    tire_temp_fl = Column(Float)
    tire_temp_fr = Column(Float)
    tire_temp_rl = Column(Float)
    tire_temp_rr = Column(Float)
    tire_compound = Column(String)
    
    # HRP
    hrp_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("RaceSession", back_populates="telemetry_logs")

class DriverState(Base):
    __tablename__ = "driver_states"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id", ondelete="CASCADE"))
    lap = Column(Integer)
    cognitive_efficiency = Column(Float)
    fatigue = Column(Float)
    stress = Column(Float)
    reaction_delay = Column(Float)
    focus_level = Column(Float)
    aggression_bias = Column(Float)
    risk_bias = Column(Float)
    confidence_state = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("RaceSession", back_populates="driver_states")

class WeatherState(Base):
    __tablename__ = "weather_states"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id", ondelete="CASCADE"))
    lap = Column(Integer)
    rain_intensity = Column(Float)
    track_water_depth = Column(Float)
    grip_level = Column(Float)
    status = Column(String)  # dry, cloudy, damp, wet, heavy_rain
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("RaceSession", back_populates="weather_states")

class StrategyHistory(Base):
    __tablename__ = "strategy_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id", ondelete="CASCADE"))
    lap = Column(Integer)
    recommended_compound = Column(String)
    expected_stops = Column(Integer)
    mcts_depth = Column(Integer)
    win_probability = Column(Float)
    confidence_score = Column(Float)
    pit_window_start = Column(Integer)
    pit_window_end = Column(Integer)
    strategy_string = Column(Text)  # JSON-encoded array of compounds & laps
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("RaceSession", back_populates="strategy_history")

class PitStopEvent(Base):
    __tablename__ = "pit_stop_events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id", ondelete="CASCADE"))
    lap = Column(Integer)
    compound_from = Column(String)
    compound_to = Column(String)
    duration = Column(Float)
    is_unsafe_release = Column(Boolean, default=False)
    is_crew_error = Column(Boolean, default=False)
    pit_lane_time = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("RaceSession", back_populates="pit_stops")

class RaceEventLog(Base):
    __tablename__ = "race_event_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id", ondelete="CASCADE"))
    lap = Column(Integer)
    event_type = Column(String)  # flag, tire_warning, driver_stress, weather_change, telemetry_anomaly
    description = Column(String)
    severity = Column(String)  # info, warning, critical
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("RaceSession", back_populates="events")

class AuditChain(Base):
    __tablename__ = "audit_chain"

    id = Column(Integer, primary_key=True, index=True)
    block_index = Column(Integer)
    session_id = Column(Integer, ForeignKey("race_sessions.id", ondelete="CASCADE"))
    telemetry_hash = Column(String)
    previous_hash = Column(String)
    verified = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("RaceSession", back_populates="audit_chain")
