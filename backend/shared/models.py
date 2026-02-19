from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum


class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class DisruptionType(str, Enum):
    PORT_STRIKE = "port_strike"
    WEATHER = "weather"
    GEOPOLITICAL = "geopolitical"
    SUPPLIER_DEFAULT = "supplier_default"
    LOGISTICS_FAILURE = "logistics_failure"
    REGULATORY = "regulatory"
    NATURAL_DISASTER = "natural_disaster"


class DisruptionStatus(str, Enum):
    DETECTED = "detected"
    ASSESSED = "assessed"
    SIMULATING = "simulating"
    RESOLVED = "resolved"


class SupplierStatus(str, Enum):
    ACTIVE = "active"
    AT_RISK = "at_risk"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


class ActionStatus(str, Enum):
    PENDING = "pending"
    COMPLIANCE_CHECK = "compliance_check"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"


class SupplierBase(BaseModel):
    name: str
    tier: int = Field(..., ge=1, le=5)
    region: str
    trust_score: float = Field(default=50.0, ge=0, le=100)
    status: SupplierStatus = SupplierStatus.ACTIVE
    extra_data: Optional[dict] = None


class Supplier(SupplierBase):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class DisruptionBase(BaseModel):
    type: DisruptionType
    title: str
    description: Optional[str] = None
    severity: SeverityLevel
    region: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    source_urls: List[str] = []


class Disruption(DisruptionBase):
    id: UUID = Field(default_factory=uuid4)
    status: DisruptionStatus = DisruptionStatus.DETECTED
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ScenarioBase(BaseModel):
    title: str
    description: Optional[str] = None
    strategy_type: str
    cost_estimate: float
    risk_reduction_pct: float = Field(..., ge=0, le=100)
    time_to_resolve_hours: int
    confidence_lower: float
    confidence_upper: float


class Scenario(ScenarioBase):
    id: UUID = Field(default_factory=uuid4)
    simulation_id: UUID
    is_recommended: bool = False
    is_selected: bool = False

    class Config:
        from_attributes = True


class ActionBase(BaseModel):
    action_type: str
    description: str
    disruption_id: UUID
    scenario_id: Optional[UUID] = None


class Action(ActionBase):
    id: UUID = Field(default_factory=uuid4)
    status: ActionStatus = ActionStatus.PENDING
    compliance_result: Optional[str] = None
    compliance_details: Optional[dict] = None
    executed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[dict] = None

    class Config:
        from_attributes = True


class ComplianceRuleBase(BaseModel):
    name: str
    category: str
    description: str
    rule_logic: dict
    is_active: bool = True


class ComplianceRule(ComplianceRuleBase):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class NegotiationBase(BaseModel):
    action_id: UUID
    supplier_id: UUID
    opening_proposal: dict
    counter_offers: List[dict] = []
    final_terms: Optional[dict] = None


class Negotiation(NegotiationBase):
    id: UUID = Field(default_factory=uuid4)
    status: str = "drafting"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class DisruptionDetectedEvent(BaseModel):
    event_type: str = "disruption.detected"
    disruption_id: UUID
    disruption_type: DisruptionType
    title: str
    severity: SeverityLevel
    region: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    source_urls: List[str] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class RiskAssessedEvent(BaseModel):
    event_type: str = "risk.assessed"
    disruption_id: UUID
    affected_suppliers: List[dict]
    probability_of_delay: float
    estimated_financial_impact: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SimulationCompleteEvent(BaseModel):
    event_type: str = "simulation.complete"
    simulation_id: UUID
    disruption_id: UUID
    scenarios: List[dict]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ActionRecommendedEvent(BaseModel):
    event_type: str = "action.recommended"
    action_id: UUID
    disruption_id: UUID
    recommended_scenario: dict
    estimated_savings: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ActionExecutedEvent(BaseModel):
    event_type: str = "action.executed"
    action_id: UUID
    disruption_id: UUID
    confirmation_details: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class LearningUpdatedEvent(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    event_type: str = "learning.updated"
    accuracy_delta: float
    updated_trust_scores: List[dict]
    new_patterns: List[dict]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
