import asyncio
import logging
import random
from uuid import uuid4
import json

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from shared.event_bus import event_bus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SimulationAgent:
    def __init__(self):
        self.running = False

    async def start(self):
        await event_bus.connect()
        self.running = True
        logger.info("Simulation Agent started")
        
        await self.subscribe_to_risks()

    async def stop(self):
        self.running = False
        await event_bus.disconnect()
        logger.info("Simulation Agent stopped")

    async def subscribe_to_risks(self):
        async for event_id, event_data in event_bus.subscribe(
            "risks", 
            "simulation-agent-group", 
            "simulation-agent-1"
        ):
            try:
                await self.process_risk_event(event_data)
            except Exception as e:
                logger.error(f"Error processing risk: {e}")

    async def process_risk_event(self, event_data: dict):
        data = json.loads(event_data.get("data", "{}"))
        disruption_id = data.get("disruption_id")
        logger.info(f"Running simulations for disruption: {disruption_id}")
        
        await asyncio.sleep(3)
        
        scenarios = await self.generate_scenarios(data)
        
        event = {
            "simulation_id": str(uuid4()),
            "disruption_id": disruption_id,
            "scenarios": scenarios,
            "recommended_scenario_index": await self.select_best_scenario(scenarios)
        }
        
        await event_bus.publish("simulation.complete", event)
        logger.info(f"Published simulation results for {disruption_id}")

    async def generate_scenarios(self, risk_data: dict) -> list:
        affected_count = len(risk_data.get("affected_suppliers", []))
        financial_impact = risk_data.get("estimated_financial_impact", {})
        base_cost = financial_impact.get("p50", 2500000)
        
        scenarios = [
            {
                "id": str(uuid4()),
                "title": "Do Nothing",
                "description": "Wait for disruption to resolve naturally",
                "strategy_type": "wait",
                "cost_estimate": base_cost,
                "risk_reduction_pct": 0,
                "time_to_resolve_hours": random.randint(500, 800),
                "confidence_lower": 85,
                "confidence_upper": 95,
                "is_recommended": False
            },
            {
                "id": str(uuid4()),
                "title": "Reroute Shipments",
                "description": "Redirect shipments through alternative ports",
                "strategy_type": "reroute",
                "cost_estimate": base_cost * 0.6,
                "risk_reduction_pct": 55,
                "time_to_resolve_hours": random.randint(120, 200),
                "confidence_lower": 70,
                "confidence_upper": 85,
                "is_recommended": False
            },
            {
                "id": str(uuid4()),
                "title": "Activate Backup Suppliers",
                "description": "Engage pre-qualified backup suppliers for affected components",
                "strategy_type": "backup_suppliers",
                "cost_estimate": base_cost * 0.45,
                "risk_reduction_pct": 72,
                "time_to_resolve_hours": random.randint(72, 120),
                "confidence_lower": 75,
                "confidence_upper": 90,
                "is_recommended": True
            },
            {
                "id": str(uuid4()),
                "title": "Hybrid Approach",
                "description": "Combination of rerouting and backup supplier activation",
                "strategy_type": "hybrid",
                "cost_estimate": base_cost * 0.55,
                "risk_reduction_pct": 85,
                "time_to_resolve_hours": random.randint(96, 150),
                "confidence_lower": 80,
                "confidence_upper": 92,
                "is_recommended": False
            }
        ]
        
        return scenarios

    async def select_best_scenario(self, scenarios: list) -> int:
        best_idx = 0
        best_score = 0
        
        for idx, scenario in enumerate(scenarios):
            score = (
                scenario["risk_reduction_pct"] * 0.4 +
                (100 - scenario["cost_estimate"] / 50000) * 0.3 +
                (100 - scenario["time_to_resolve_hours"] / 10) * 0.2 +
                scenario["confidence_lower"] * 0.1
            )
            if score > best_score:
                best_score = score
                best_idx = idx
        
        return best_idx


async def main():
    agent = SimulationAgent()
    try:
        await agent.start()
    except KeyboardInterrupt:
        await agent.stop()


if __name__ == "__main__":
    asyncio.run(main())
