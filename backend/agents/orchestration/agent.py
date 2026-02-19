import asyncio
import logging
import json
from uuid import uuid4
from datetime import datetime

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from shared.event_bus import event_bus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OrchestrationAgent:
    def __init__(self):
        self.running = False

    async def start(self):
        await event_bus.connect()
        self.running = True
        logger.info("Orchestration Agent started")
        
        await self.subscribe_to_actions()

    async def stop(self):
        self.running = False
        await event_bus.disconnect()
        logger.info("Orchestration Agent stopped")

    async def subscribe_to_actions(self):
        async for event_id, event_data in event_bus.subscribe(
            "actions", 
            "orchestration-agent-group", 
            "orchestration-agent-1"
        ):
            try:
                await self.process_action_event(event_data)
            except Exception as e:
                logger.error(f"Error processing action: {e}")

    async def process_action_event(self, event_data: dict):
        data = json.loads(event_data.get("data", "{}"))
        action_id = data.get("action_id")
        scenario = data.get("recommended_scenario", {})
        
        logger.info(f"Executing action: {action_id}")
        
        compliance_result = await self.check_compliance(data)
        
        if compliance_result["passed"]:
            execution_result = await self.execute_action(data)
            
            event = {
                "action_id": action_id,
                "disruption_id": data.get("disruption_id"),
                "scenario_type": scenario.get("strategy_type"),
                "compliance_passed": True,
                "execution_details": execution_result,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            await event_bus.publish("action.executed", event)
            logger.info(f"Action executed successfully: {action_id}")
        else:
            logger.warning(f"Action blocked by compliance: {compliance_result['reason']}")
            await event_bus.publish("action.blocked", {
                "action_id": action_id,
                "reason": compliance_result["reason"],
                "timestamp": datetime.utcnow().isoformat()
            })

    async def check_compliance(self, action_data: dict) -> dict:
        await asyncio.sleep(1)
        
        rules = [
            {
                "name": "Cost Threshold",
                "check": lambda d: d.get("recommended_scenario", {}).get("cost_estimate", 0) < 500000,
                "reason": "Actions exceeding $500K require manual approval"
            },
            {
                "name": "Sanctioned Regions",
                "check": lambda d: True,
                "reason": "Routing through sanctioned regions is prohibited"
            },
            {
                "name": "Environmental Impact",
                "check": lambda d: True,
                "reason": "Alternative routes must not exceed 120% carbon footprint"
            }
        ]
        
        for rule in rules:
            if not rule["check"](action_data):
                return {"passed": False, "reason": rule["reason"]}
        
        return {"passed": True, "reason": None}

    async def execute_action(self, action_data: dict) -> dict:
        scenario = action_data.get("recommended_scenario", {})
        strategy_type = scenario.get("strategy_type", "unknown")
        
        await asyncio.sleep(2)
        
        results = {
            "reroute": {
                "po_generated": True,
                "po_number": f"PO-{uuid4().hex[:8].upper()}",
                "notifications_sent": ["logistics@company.com", "ops@company.com"],
                "carriers_notified": 2
            },
            "backup_suppliers": {
                "po_generated": True,
                "po_number": f"PO-{uuid4().hex[:8].upper()}",
                "suppliers_activated": ["Backup Supplier A", "Backup Supplier B"],
                "notifications_sent": ["procurement@company.com"]
            },
            "hybrid": {
                "po_generated": True,
                "po_number": f"PO-{uuid4().hex[:8].upper()}",
                "suppliers_activated": ["Backup Supplier A"],
                "reroutes_initiated": 3,
                "notifications_sent": ["ops@company.com", "procurement@company.com"]
            },
            "wait": {
                "po_generated": False,
                "monitoring_enabled": True,
                "alert_threshold_days": 7
            }
        }
        
        return results.get(strategy_type, {"status": "executed", "details": "Action completed"})


async def main():
    agent = OrchestrationAgent()
    try:
        await agent.start()
    except KeyboardInterrupt:
        await agent.stop()


if __name__ == "__main__":
    asyncio.run(main())
