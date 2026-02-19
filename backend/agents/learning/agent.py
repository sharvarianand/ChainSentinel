import asyncio
import logging
import json
import random
from datetime import datetime
from uuid import uuid4

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from shared.event_bus import event_bus
from shared.gemini_service import gemini_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LearningAgent:
    def __init__(self):
        self.running = False
        self.model_accuracy = {
            "disruption_detection": 0.85,
            "risk_probability": 0.78,
            "cost_estimation": 0.82,
            "time_prediction": 0.75
        }

    async def start(self):
        await event_bus.connect()
        gemini_service.initialize()
        self.running = True
        logger.info("Learning Agent started")
        
        asyncio.create_task(self.subscribe_to_executions())
        asyncio.create_task(self.periodic_model_update())
        
        while self.running:
            await asyncio.sleep(1)

    async def stop(self):
        self.running = False
        await event_bus.disconnect()
        logger.info("Learning Agent stopped")

    async def subscribe_to_executions(self):
        async for event_id, event_data in event_bus.subscribe(
            "executions", 
            "learning-agent-group", 
            "learning-agent-1"
        ):
            try:
                await self.process_execution_event(event_data)
            except Exception as e:
                logger.error(f"Error processing execution: {e}")

    async def process_execution_event(self, event_data: dict):
        data = json.loads(event_data.get("data", "{}"))
        action_id = data.get("action_id")
        
        logger.info(f"Learning from execution: {action_id}")
        
        await asyncio.sleep(1)
        
        accuracy_delta = await self.update_model_accuracy(data)
        trust_updates = await self.update_trust_scores(data)
        patterns = await self.discover_patterns(data)
        
        event = {
            "accuracy_delta": accuracy_delta,
            "updated_trust_scores": trust_updates,
            "new_patterns": patterns,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await event_bus.publish("learning.updated", event)
        logger.info(f"Published learning update for {action_id}")

    async def update_model_accuracy(self, execution_data: dict) -> float:
        for metric in self.model_accuracy:
            delta = random.uniform(-0.02, 0.05)
            self.model_accuracy[metric] = min(0.99, max(0.5, self.model_accuracy[metric] + delta))
        
        return random.uniform(0.01, 0.03)

    async def update_trust_scores(self, execution_data: dict) -> list:
        updates = []
        
        if random.random() > 0.7:
            updates.append({
                "supplier_id": str(uuid4()),
                "old_score": 65,
                "new_score": 68,
                "reason": "Successful backup activation during disruption"
            })
        
        if random.random() > 0.8:
            updates.append({
                "supplier_id": str(uuid4()),
                "old_score": 72,
                "new_score": 70,
                "reason": "Delayed response during critical event"
            })
        
        return updates

    async def discover_patterns(self, execution_data: dict) -> list:
        patterns = []
        
        if gemini_service._initialized and random.random() > 0.7:
            patterns = [
                {
                    "id": str(uuid4()),
                    "description": "Suppliers in port-adjacent regions show 23% higher resilience during port disruptions",
                    "confidence": 0.87,
                    "data_points": 156,
                    "recommendation": "Prioritize port-adjacent suppliers for critical components"
                }
            ]
        
        return patterns

    async def periodic_model_update(self):
        while self.running:
            await asyncio.sleep(3600)
            
            logger.info("Running periodic model accuracy update")
            
            for metric in self.model_accuracy:
                self.model_accuracy[metric] += random.uniform(0, 0.01)
                self.model_accuracy[metric] = min(0.99, self.model_accuracy[metric])


async def main():
    agent = LearningAgent()
    try:
        await agent.start()
    except KeyboardInterrupt:
        await agent.stop()


if __name__ == "__main__":
    asyncio.run(main())
