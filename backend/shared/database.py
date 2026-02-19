import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum, JSON
from sqlalchemy import JSON as SQLiteJSON
import uuid
from datetime import datetime
import json

from shared.config import settings
from shared.models import SeverityLevel, DisruptionType, DisruptionStatus, SupplierStatus, ActionStatus

Base = declarative_base()

engine = create_async_engine(
    settings.database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=True
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db():
    async with async_session() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


class SupplierDB(Base):
    __tablename__ = "suppliers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    tier = Column(Integer, nullable=False)
    region = Column(String(100), nullable=False)
    trust_score = Column(Float, default=50.0)
    status = Column(SQLEnum(SupplierStatus), default=SupplierStatus.ACTIVE)
    extra_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SupplyRelationshipDB(Base):
    __tablename__ = "supply_relationships"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    from_supplier_id = Column(String(36), ForeignKey("suppliers.id"))
    to_supplier_id = Column(String(36), ForeignKey("suppliers.id"))
    dependency_strength = Column(Float, default=0.5)
    is_backup = Column(Boolean, default=False)
    extra_data = Column(JSON, nullable=True)


class DisruptionDB(Base):
    __tablename__ = "disruptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(SQLEnum(DisruptionType), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(SQLEnum(SeverityLevel), nullable=False)
    region = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    source_urls = Column(JSON, default=[])
    status = Column(SQLEnum(DisruptionStatus), default=DisruptionStatus.DETECTED)
    detected_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)


class DisruptionSupplierDB(Base):
    __tablename__ = "disruption_suppliers"

    disruption_id = Column(String(36), ForeignKey("disruptions.id"), primary_key=True)
    supplier_id = Column(String(36), ForeignKey("suppliers.id"), primary_key=True)
    impact_probability = Column(Float, nullable=True)
    estimated_delay_days = Column(Integer, nullable=True)
    estimated_cost_impact = Column(Float, nullable=True)


class SimulationDB(Base):
    __tablename__ = "simulations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    disruption_id = Column(String(36), ForeignKey("disruptions.id"))
    status = Column(String(50), default="running")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class ScenarioDB(Base):
    __tablename__ = "scenarios"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    simulation_id = Column(String(36), ForeignKey("simulations.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    strategy_type = Column(String(100), nullable=False)
    cost_estimate = Column(Float, nullable=False)
    risk_reduction_pct = Column(Float, nullable=False)
    time_to_resolve_hours = Column(Integer, nullable=False)
    confidence_lower = Column(Float, nullable=False)
    confidence_upper = Column(Float, nullable=False)
    is_recommended = Column(Boolean, default=False)
    is_selected = Column(Boolean, default=False)


class ActionDB(Base):
    __tablename__ = "actions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    disruption_id = Column(String(36), ForeignKey("disruptions.id"))
    scenario_id = Column(String(36), ForeignKey("scenarios.id"), nullable=True)
    action_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SQLEnum(ActionStatus), default=ActionStatus.PENDING)
    compliance_result = Column(String(50), nullable=True)
    compliance_details = Column(JSON, nullable=True)
    executed_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)


class NegotiationDB(Base):
    __tablename__ = "negotiations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    action_id = Column(String(36), ForeignKey("actions.id"))
    supplier_id = Column(String(36), ForeignKey("suppliers.id"))
    opening_proposal = Column(JSON, nullable=False)
    counter_offers = Column(JSON, default=[])
    final_terms = Column(JSON, nullable=True)
    status = Column(String(50), default="drafting")
    created_at = Column(DateTime, default=datetime.utcnow)


class ComplianceRuleDB(Base):
    __tablename__ = "compliance_rules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    rule_logic = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ComplianceLogDB(Base):
    __tablename__ = "compliance_log"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    action_id = Column(String(36), ForeignKey("actions.id"))
    rule_id = Column(String(36), ForeignKey("compliance_rules.id"))
    result = Column(String(20), nullable=False)
    explanation = Column(Text, nullable=True)
    approved_by = Column(String(255), nullable=True)
    checked_at = Column(DateTime, default=datetime.utcnow)


class ModelAccuracyLogDB(Base):
    __tablename__ = "model_accuracy_log"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_name = Column(String(100), nullable=False)
    version = Column(String(50), nullable=False)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)


class TrustScoreHistoryDB(Base):
    __tablename__ = "trust_score_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    supplier_id = Column(String(36), ForeignKey("suppliers.id"))
    score = Column(Float, nullable=False)
    change_reason = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)


class DiscoveredPatternDB(Base):
    __tablename__ = "discovered_patterns"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    description = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False)
    data_points_used = Column(Integer, nullable=False)
    recommendation = Column(Text, nullable=True)
    discovered_at = Column(DateTime, default=datetime.utcnow)


class IncidentDB(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    disruption_id = Column(String(36), ForeignKey("disruptions.id"))
    title = Column(String(500), nullable=False)
    severity = Column(SQLEnum(SeverityLevel), nullable=False)
    region = Column(String(100), nullable=False)
    suppliers_affected = Column(Integer, default=0)
    actions_taken = Column(Integer, default=0)
    cost_saved = Column(Float, nullable=True)
    time_to_resolve_hours = Column(Integer, nullable=True)
    prediction_accuracy = Column(Float, nullable=True)
    status = Column(String(50), nullable=False)
    occurred_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    replay_data = Column(JSON, nullable=True)
