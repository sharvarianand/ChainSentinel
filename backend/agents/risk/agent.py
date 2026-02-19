import asyncio
import logging
import random
from uuid import UUID
import json

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from shared.event_bus import event_bus
from shared.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RiskAgent:
    def __init__(self):
        self.running = False

    async def start(self):
        await event_bus.connect()
        self.running = True
        logger.info("Risk Agent started")
        
        await self.subscribe_to_disruptions()

    async def stop(self):
        self.running = False
        await event_bus.disconnect()
        logger.info("Risk Agent stopped")

    async def subscribe_to_disruptions(self):
        async for event_id, event_data in event_bus.subscribe(
            "disruptions", 
            "risk-agent-group", 
            "risk-agent-1"
        ):
            try:
                await self.process_disruption_event(event_data)
            except Exception as e:
                logger.error(f"Error processing disruption: {e}")

    async def process_disruption_event(self, event_data: dict):
        data = json.loads(event_data.get("data", "{}"))
        logger.info(f"Processing disruption for risk assessment: {data.get('disruption_id')}")
        
        await asyncio.sleep(2)
        
        affected_suppliers = await self.calculate_affected_suppliers(data)
        risk_assessment = await self.assess_risk(data, affected_suppliers)
        
        event = {
            "disruption_id": data.get("disruption_id"),
            "affected_suppliers": affected_suppliers,
            "probability_of_delay": risk_assessment["probability_of_delay"],
            "estimated_financial_impact": risk_assessment["financial_impact"],
            "cascade_analysis": risk_assessment["cascade_analysis"]
        }
        
        await event_bus.publish("risk.assessed", event)
        logger.info(f"Published risk assessment for {data.get('disruption_id')}")

    async def calculate_affected_suppliers(self, disruption: dict) -> list:
        region = disruption.get("region", "")
        
        mock_suppliers = [
            {"id": str(UUID(int=1)), "name": "Shanghai Port Logistics", "impact_prob": 0.95, "delay_days": 21},
            {"id": str(UUID(int=2)), "name": "ShenZhen Electronics Co.", "impact_prob": 0.78, "delay_days": 14},
            {"id": str(UUID(int=3)), "name": "Vietnam Assembly Corp.", "impact_prob": 0.62, "delay_days": 10},
            {"id": str(UUID(int=4)), "name": "TechParts Taiwan", "impact_prob": 0.45, "delay_days": 7},
            {"id": str(UUID(int=5)), "name": "Korea Semi Inc.", "impact_prob": 0.35, "delay_days": 5},
        ]
        
        if "Shanghai" in region or "China" in region:
            return mock_suppliers
        elif "Taiwan" in region:
            return [mock_suppliers[3], {"id": str(UUID(int=6)), "name": "Japan Quality Corp.", "impact_prob": 0.25, "delay_days": 3}]
        elif "India" in region:
            return [{"id": str(UUID(int=7)), "name": "Mumbai Textiles Ltd.", "impact_prob": 0.88, "delay_days": 14}]
        elif "Vietnam" in region:
            return [mock_suppliers[2]]
        else:
            return [random.choice(mock_suppliers)]

    async def assess_risk(self, disruption: dict, affected_suppliers: list) -> dict:
        severity = disruption.get("severity", "medium")
        
        severity_multipliers = {
            "critical": 0.9,
            "high": 0.7,
            "medium": 0.5,
            "low": 0.3
        }
        
        base_prob = severity_multipliers.get(severity, 0.5)
        
        financial_impact = {
            "p10": random.randint(500_000, 1_000_000),
            "p50": random.randint(2_000_000, 3_000_000),
            "p90": random.randint(4_000_000, 6_000_000)
        }
        
        cascade_analysis = {
            "tier_1_affected": len([s for s in affected_suppliers if s["impact_prob"] > 0.7]),
            "tier_2_affected": len([s for s in affected_suppliers if 0.4 <= s["impact_prob"] <= 0.7]),
            "tier_3_affected": len([s for s in affected_suppliers if s["impact_prob"] < 0.4]),
            "propagation_speed_days": random.randint(7, 21)
        }
        
        return {
            "probability_of_delay": base_prob + random.uniform(-0.1, 0.1),
            "financial_impact": financial_impact,
            "cascade_analysis": cascade_analysis
        }


async def main():
    agent = RiskAgent()
    try:
        await agent.start()
    except KeyboardInterrupt:
        await agent.stop()


if __name__ == "__main__":
    asyncio.run(main())
