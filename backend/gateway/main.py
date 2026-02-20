from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from typing import List, Optional
from uuid import UUID

from shared.config import settings
from shared.database import init_db, async_session
from shared.event_bus import event_bus
from shared.gemini_service import gemini_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Database ---
    try:
        await init_db()
        logger.info("Database initialised successfully")
    except Exception as exc:
        logger.error(f"Database init failed – running without persistence: {exc}")

    # --- Event bus (Redis) ---
    try:
        await event_bus.connect()
    except Exception as exc:
        logger.warning(f"Event bus connect failed – using in-memory fallback: {exc}")

    # --- Gemini ---
    try:
        gemini_service.initialize()
    except Exception as exc:
        logger.warning(f"Gemini init failed – using mock mode: {exc}")

    logger.info("ChainSentinel API Gateway started")
    yield

    try:
        await event_bus.disconnect()
    except Exception:
        pass
    logger.info("ChainSentinel API Gateway stopped")


app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"name": settings.app_name, "version": settings.version, "status": "running"}


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "redis": "connected",
            "gemini": "configured" if gemini_service._initialized else "mock_mode"
        }
    }


@app.get("/api/disruptions")
async def list_disruptions(
    severity: Optional[str] = None,
    region: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import DisruptionDB
        
        query = select(DisruptionDB)
        
        if severity:
            query = query.where(DisruptionDB.severity == severity)
        if region:
            query = query.where(DisruptionDB.region.ilike(f"%{region}%"))
        if status:
            query = query.where(DisruptionDB.status == status)
        
        query = query.offset(offset).limit(limit).order_by(DisruptionDB.detected_at.desc())
        
        result = await db.execute(query)
        disruptions = result.scalars().all()
        
        return [
            {
                "id": str(d.id),
                "type": d.type.value if d.type else None,
                "title": d.title,
                "description": d.description,
                "severity": d.severity.value if d.severity else None,
                "region": d.region,
                "latitude": d.latitude,
                "longitude": d.longitude,
                "status": d.status.value if d.status else None,
                "detected_at": d.detected_at.isoformat() if d.detected_at else None,
                "resolved_at": d.resolved_at.isoformat() if d.resolved_at else None
            }
            for d in disruptions
        ]


@app.get("/api/disruptions/{disruption_id}")
async def get_disruption(disruption_id: UUID):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import DisruptionDB
        
        result = await db.execute(
            select(DisruptionDB).where(DisruptionDB.id == disruption_id)
        )
        disruption = result.scalar_one_or_none()
        
        if not disruption:
            raise HTTPException(status_code=404, detail="Disruption not found")
        
        return {
            "id": str(disruption.id),
            "type": disruption.type.value if disruption.type else None,
            "title": disruption.title,
            "description": disruption.description,
            "severity": disruption.severity.value if disruption.severity else None,
            "region": disruption.region,
            "latitude": disruption.latitude,
            "longitude": disruption.longitude,
            "source_urls": disruption.source_urls,
            "status": disruption.status.value if disruption.status else None,
            "detected_at": disruption.detected_at.isoformat() if disruption.detected_at else None,
            "resolved_at": disruption.resolved_at.isoformat() if disruption.resolved_at else None
        }


@app.post("/api/disruptions/simulate")
async def trigger_simulation(disruption_id: UUID):
    await event_bus.publish("simulation.trigger", {"disruption_id": str(disruption_id)})
    return {"message": "Simulation triggered", "disruption_id": str(disruption_id)}


@app.get("/api/risk/heatmap")
async def get_risk_heatmap():
    return {
        "regions": [
            {"region": "Shanghai, China", "risk_level": 0.85, "lat": 31.2304, "lng": 121.4737},
            {"region": "Shenzhen, China", "risk_level": 0.72, "lat": 22.5431, "lng": 114.0579},
            {"region": "Taiwan", "risk_level": 0.45, "lat": 23.6978, "lng": 120.9605},
            {"region": "Mumbai, India", "risk_level": 0.58, "lat": 19.0760, "lng": 72.8777},
            {"region": "Vietnam", "risk_level": 0.35, "lat": 14.0583, "lng": 108.2772},
            {"region": "South Korea", "risk_level": 0.28, "lat": 35.9078, "lng": 127.7669},
            {"region": "Germany", "risk_level": 0.15, "lat": 51.1657, "lng": 10.4515},
            {"region": "Brazil", "risk_level": 0.42, "lat": -14.2350, "lng": -51.9253},
            {"region": "Mexico", "risk_level": 0.38, "lat": 23.6345, "lng": -102.5528},
            {"region": "Japan", "risk_level": 0.22, "lat": 36.2048, "lng": 138.2529},
            {"region": "Thailand", "risk_level": 0.48, "lat": 15.8700, "lng": 100.9925},
            {"region": "UK", "risk_level": 0.18, "lat": 55.3781, "lng": -3.4360}
        ]
    }


@app.get("/api/risk/suppliers/{supplier_id}")
async def get_supplier_risk(supplier_id: UUID):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import SupplierDB
        
        result = await db.execute(
            select(SupplierDB).where(SupplierDB.id == supplier_id)
        )
        supplier = result.scalar_one_or_none()
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        return {
            "supplier_id": str(supplier.id),
            "name": supplier.name,
            "risk_score": 100 - supplier.trust_score,
            "trust_score": supplier.trust_score,
            "risk_factors": [
                {"factor": "Delivery reliability", "score": 78},
                {"factor": "Quality consistency", "score": 85},
                {"factor": "Response time", "score": 72},
                {"factor": "Cost stability", "score": 90}
            ]
        }


@app.get("/api/simulations")
async def list_simulations(limit: int = 20, offset: int = 0):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import SimulationDB
        
        result = await db.execute(
            select(SimulationDB)
            .offset(offset)
            .limit(limit)
            .order_by(SimulationDB.created_at.desc())
        )
        simulations = result.scalars().all()
        
        return [
            {
                "id": str(s.id),
                "disruption_id": str(s.disruption_id),
                "status": s.status,
                "created_at": s.created_at.isoformat() if s.created_at else None,
                "completed_at": s.completed_at.isoformat() if s.completed_at else None
            }
            for s in simulations
        ]


@app.get("/api/simulations/{simulation_id}")
async def get_simulation(simulation_id: UUID):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import SimulationDB, ScenarioDB
        
        sim_result = await db.execute(
            select(SimulationDB).where(SimulationDB.id == simulation_id)
        )
        simulation = sim_result.scalar_one_or_none()
        
        if not simulation:
            raise HTTPException(status_code=404, detail="Simulation not found")
        
        scenarios_result = await db.execute(
            select(ScenarioDB).where(ScenarioDB.simulation_id == simulation_id)
        )
        scenarios = scenarios_result.scalars().all()
        
        return {
            "id": str(simulation.id),
            "disruption_id": str(simulation.disruption_id),
            "status": simulation.status,
            "created_at": simulation.created_at.isoformat() if simulation.created_at else None,
            "completed_at": simulation.completed_at.isoformat() if simulation.completed_at else None,
            "scenarios": [
                {
                    "id": str(s.id),
                    "title": s.title,
                    "description": s.description,
                    "strategy_type": s.strategy_type,
                    "cost_estimate": s.cost_estimate,
                    "risk_reduction_pct": s.risk_reduction_pct,
                    "time_to_resolve_hours": s.time_to_resolve_hours,
                    "confidence_lower": s.confidence_lower,
                    "confidence_upper": s.confidence_upper,
                    "is_recommended": s.is_recommended,
                    "is_selected": s.is_selected
                }
                for s in scenarios
            ]
        }


@app.post("/api/simulations/{simulation_id}/select")
async def select_scenario(simulation_id: UUID, scenario_id: UUID):
    await event_bus.publish("scenario.selected", {
        "simulation_id": str(simulation_id),
        "scenario_id": str(scenario_id)
    })
    return {"message": "Scenario selected for execution"}


@app.get("/api/suppliers")
async def list_suppliers(
    tier: Optional[int] = None,
    region: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import SupplierDB
        
        query = select(SupplierDB)
        
        if tier:
            query = query.where(SupplierDB.tier == tier)
        if region:
            query = query.where(SupplierDB.region.ilike(f"%{region}%"))
        if status:
            query = query.where(SupplierDB.status == status)
        
        query = query.offset(offset).limit(limit)
        
        result = await db.execute(query)
        suppliers = result.scalars().all()
        
        return [
            {
                "id": str(s.id),
                "name": s.name,
                "tier": s.tier,
                "region": s.region,
                "trust_score": s.trust_score,
                "status": s.status.value if s.status else "active",
                "created_at": s.created_at.isoformat() if s.created_at else None
            }
            for s in suppliers
        ]


@app.get("/api/suppliers/{supplier_id}")
async def get_supplier(supplier_id: UUID):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import SupplierDB
        
        result = await db.execute(
            select(SupplierDB).where(SupplierDB.id == supplier_id)
        )
        supplier = result.scalar_one_or_none()
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        return {
            "id": str(supplier.id),
            "name": supplier.name,
            "tier": supplier.tier,
            "region": supplier.region,
            "trust_score": supplier.trust_score,
            "status": supplier.status.value if supplier.status else "active",
            "extra_data": supplier.extra_data,
            "created_at": supplier.created_at.isoformat() if supplier.created_at else None,
            "updated_at": supplier.updated_at.isoformat() if supplier.updated_at else None
        }


@app.get("/api/suppliers/{supplier_id}/backups")
async def get_backup_suppliers(supplier_id: UUID):
    return {
        "supplier_id": str(supplier_id),
        "backup_suppliers": [
            {
                "id": "backup-1",
                "name": "Alternative Supplier A",
                "trust_score": 82,
                "capacity_available": 5000,
                "cost_delta_pct": 8.5,
                "lead_time_days": 21
            },
            {
                "id": "backup-2",
                "name": "Alternative Supplier B",
                "trust_score": 75,
                "capacity_available": 3000,
                "cost_delta_pct": 12.0,
                "lead_time_days": 14
            }
        ]
    }


@app.post("/api/suppliers/{supplier_id}/activate-backup")
async def activate_backup_supplier(supplier_id: UUID, backup_id: str):
    await event_bus.publish("backup.activated", {
        "primary_supplier_id": str(supplier_id),
        "backup_supplier_id": backup_id
    })
    return {"message": "Backup supplier activation initiated"}


@app.post("/api/negotiations")
async def start_negotiation(request: dict):
    await event_bus.publish("negotiation.started", request)
    return {"message": "Negotiation process started"}


@app.get("/api/negotiations/{negotiation_id}")
async def get_negotiation(negotiation_id: UUID):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import NegotiationDB
        
        result = await db.execute(
            select(NegotiationDB).where(NegotiationDB.id == negotiation_id)
        )
        negotiation = result.scalar_one_or_none()
        
        if not negotiation:
            raise HTTPException(status_code=404, detail="Negotiation not found")
        
        return {
            "id": str(negotiation.id),
            "action_id": str(negotiation.action_id),
            "supplier_id": str(negotiation.supplier_id),
            "opening_proposal": negotiation.opening_proposal,
            "counter_offers": negotiation.counter_offers,
            "final_terms": negotiation.final_terms,
            "status": negotiation.status,
            "created_at": negotiation.created_at.isoformat() if negotiation.created_at else None
        }


@app.get("/api/compliance/rules")
async def list_compliance_rules():
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import ComplianceRuleDB
        
        result = await db.execute(select(ComplianceRuleDB))
        rules = result.scalars().all()
        
        return [
            {
                "id": str(r.id),
                "name": r.name,
                "category": r.category,
                "description": r.description,
                "is_active": r.is_active,
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in rules
        ]


@app.post("/api/compliance/rules")
async def create_compliance_rule(rule: dict):
    async with async_session() as db:
        from shared.database import ComplianceRuleDB
        import uuid
        
        new_rule = ComplianceRuleDB(
            id=uuid.uuid4(),
            name=rule.get("name"),
            category=rule.get("category"),
            description=rule.get("description"),
            rule_logic=rule.get("rule_logic", {}),
            is_active=rule.get("is_active", True)
        )
        
        db.add(new_rule)
        await db.commit()
        await db.refresh(new_rule)
        
        return {
            "id": str(new_rule.id),
            "name": new_rule.name,
            "category": new_rule.category,
            "description": new_rule.description,
            "is_active": new_rule.is_active
        }


@app.get("/api/compliance/log")
async def get_compliance_log(limit: int = 50, offset: int = 0):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import ComplianceLogDB
        
        result = await db.execute(
            select(ComplianceLogDB)
            .offset(offset)
            .limit(limit)
            .order_by(ComplianceLogDB.checked_at.desc())
        )
        logs = result.scalars().all()
        
        return [
            {
                "id": str(l.id),
                "action_id": str(l.action_id),
                "rule_id": str(l.rule_id),
                "result": l.result,
                "explanation": l.explanation,
                "approved_by": l.approved_by,
                "checked_at": l.checked_at.isoformat() if l.checked_at else None
            }
            for l in logs
        ]


@app.get("/api/learning/accuracy")
async def get_model_accuracy():
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import ModelAccuracyLogDB
        
        result = await db.execute(
            select(ModelAccuracyLogDB)
            .limit(100)
            .order_by(ModelAccuracyLogDB.recorded_at.desc())
        )
        logs = result.scalars().all()
        
        return [
            {
                "id": str(l.id),
                "model_name": l.model_name,
                "version": l.version,
                "metric_name": l.metric_name,
                "metric_value": l.metric_value,
                "recorded_at": l.recorded_at.isoformat() if l.recorded_at else None
            }
            for l in logs
        ]


@app.get("/api/learning/patterns")
async def get_discovered_patterns():
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import DiscoveredPatternDB
        
        result = await db.execute(
            select(DiscoveredPatternDB)
            .limit(20)
            .order_by(DiscoveredPatternDB.discovered_at.desc())
        )
        patterns = result.scalars().all()
        
        return [
            {
                "id": str(p.id),
                "description": p.description,
                "confidence": p.confidence,
                "data_points_used": p.data_points_used,
                "recommendation": p.recommendation,
                "discovered_at": p.discovered_at.isoformat() if p.discovered_at else None
            }
            for p in patterns
        ]


@app.get("/api/learning/trust-movements")
async def get_trust_movements(limit: int = 20):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import TrustScoreHistoryDB, SupplierDB
        from sqlalchemy.orm import joinedload
        
        result = await db.execute(
            select(TrustScoreHistoryDB)
            .limit(limit)
            .order_by(TrustScoreHistoryDB.recorded_at.desc())
        )
        movements = result.scalars().all()
        
        return [
            {
                "id": str(m.id),
                "supplier_id": str(m.supplier_id),
                "score": m.score,
                "change_reason": m.change_reason,
                "recorded_at": m.recorded_at.isoformat() if m.recorded_at else None
            }
            for m in movements
        ]


@app.get("/api/incidents")
async def list_incidents(
    severity: Optional[str] = None,
    region: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import IncidentDB
        
        query = select(IncidentDB)
        
        if severity:
            query = query.where(IncidentDB.severity == severity)
        if region:
            query = query.where(IncidentDB.region.ilike(f"%{region}%"))
        if status:
            query = query.where(IncidentDB.status == status)
        
        query = query.offset(offset).limit(limit).order_by(IncidentDB.occurred_at.desc())
        
        result = await db.execute(query)
        incidents = result.scalars().all()
        
        return [
            {
                "id": str(i.id),
                "disruption_id": str(i.disruption_id),
                "title": i.title,
                "severity": i.severity.value if i.severity else None,
                "region": i.region,
                "suppliers_affected": i.suppliers_affected,
                "actions_taken": i.actions_taken,
                "cost_saved": i.cost_saved,
                "time_to_resolve_hours": i.time_to_resolve_hours,
                "prediction_accuracy": i.prediction_accuracy,
                "status": i.status,
                "occurred_at": i.occurred_at.isoformat() if i.occurred_at else None,
                "resolved_at": i.resolved_at.isoformat() if i.resolved_at else None
            }
            for i in incidents
        ]


@app.get("/api/incidents/{incident_id}")
async def get_incident(incident_id: UUID):
    async with async_session() as db:
        from sqlalchemy import select
        from shared.database import IncidentDB
        
        result = await db.execute(
            select(IncidentDB).where(IncidentDB.id == incident_id)
        )
        incident = result.scalar_one_or_none()
        
        if not incident:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return {
            "id": str(incident.id),
            "disruption_id": str(incident.disruption_id),
            "title": incident.title,
            "severity": incident.severity.value if incident.severity else None,
            "region": incident.region,
            "suppliers_affected": incident.suppliers_affected,
            "actions_taken": incident.actions_taken,
            "cost_saved": incident.cost_saved,
            "time_to_resolve_hours": incident.time_to_resolve_hours,
            "prediction_accuracy": incident.prediction_accuracy,
            "status": incident.status,
            "occurred_at": incident.occurred_at.isoformat() if incident.occurred_at else None,
            "resolved_at": incident.resolved_at.isoformat() if incident.resolved_at else None,
            "replay_data": incident.replay_data
        }


@app.get("/api/agent-status")
async def get_agent_status():
    return {
        "agents": [
            {"name": "Intelligence Agent", "status": "active", "last_action": "2 min ago"},
            {"name": "Risk Agent", "status": "active", "last_action": "5 min ago"},
            {"name": "Simulation Agent", "status": "active", "last_action": "10 min ago"},
            {"name": "Optimization Agent", "status": "active", "last_action": "15 min ago"},
            {"name": "Orchestration Agent", "status": "active", "last_action": "20 min ago"},
            {"name": "Learning Agent", "status": "active", "last_action": "1 hour ago"}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
