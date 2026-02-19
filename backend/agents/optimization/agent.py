import asyncio
import logging
import json
from uuid import uuid4

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from shared.event_bus import event_bus
from shared.gemini_service import gemini_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OptimizationAgent:
    def __init__(self):
        self.running = False

    async def start(self):
        await event_bus.connect()
        gemini_service.initialize()
        self.running = True
        logger.info("Optimization Agent started")
        
        await self.subscribe_to_simulations()

    async def stop(self):
        self.running = False
        await event_bus.disconnect()
        logger.info("Optimization Agent stopped")

    async def subscribe_to_simulations(self):
        async for event_id, event_data in event_bus.subscribe(
            "simulations", 
            "optimization-agent-group", 
            "optimization-agent-1"
        ):
            try:
                await self.process_simulation_event(event_data)
            except Exception as e:
                logger.error(f"Error processing simulation: {e}")

    async def process_simulation_event(self, event_data: dict):
        data = json.loads(event_data.get("data", "{}"))
        simulation_id = data.get("simulation_id")
        scenarios = data.get("scenarios", [])
        
        logger.info(f"Optimizing scenarios for simulation: {simulation_id}")
        
        await asyncio.sleep(2)
        
        recommended_idx = data.get("recommended_scenario_index", 0)
        recommended_scenario = scenarios[recommended_idx] if scenarios else None
        
        if recommended_scenario and recommended_scenario.get("strategy_type") in ["backup_suppliers", "hybrid"]:
            negotiation_terms = await self.generate_negotiation_terms(recommended_scenario)
        else:
            negotiation_terms = None
        
        event = {
            "action_id": str(uuid4()),
            "simulation_id": simulation_id,
            "disruption_id": data.get("disruption_id"),
            "recommended_scenario": recommended_scenario,
            "estimated_savings": recommended_scenario.get("cost_estimate", 0) * 0.3 if recommended_scenario else 0,
            "negotiation_terms": negotiation_terms
        }
        
        await event_bus.publish("action.recommended", event)
        logger.info(f"Published action recommendation for {simulation_id}")

    async def generate_negotiation_terms(self, scenario: dict) -> dict:
        if gemini_service._initialized:
            return await gemini_service.generate_negotiation_proposal(
                supplier_name="Backup Supplier A",
                supplier_history={
                    "on_time_delivery_rate": 0.92,
                    "quality_score": 4.5,
                    "avg_lead_time_days": 14
                },
                context={
                    "scenario": scenario.get("title"),
                    "urgency": "high"
                }
            )
        
        return {
            "opening_proposal": {
                "price_adjustment_pct": -3.0,
                "delivery_timeline_days": 10,
                "volume_commitment": 2000
            },
            "rationale": "Urgent requirement with volume commitment opportunity",
            "fallback_position": {
                "price_adjustment_pct": 0,
                "delivery_timeline_days": 14,
                "volume_commitment": 1500
            },
            "best_alternative": "Secondary backup supplier with 15% cost increase"
        }


async def main():
    agent = OptimizationAgent()
    try:
        await agent.start()
    except KeyboardInterrupt:
        await agent.stop()


if __name__ == "__main__":
    asyncio.run(main())
