import asyncio
import logging
import random
from datetime import datetime
from uuid import uuid4

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from shared.event_bus import event_bus
from shared.gemini_service import gemini_service
from shared.config import settings
from shared.models import DisruptionType, SeverityLevel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MOCK_NEWS_FEEDS = [
    {
        "title": "Major port strike disrupts operations at Shanghai port",
        "content": "Workers at Shanghai's main container terminal have initiated a labor action, causing significant delays in cargo handling. Operations are expected to be impacted for the next 72 hours minimum.",
        "source": "Reuters",
        "region": "Shanghai, China",
        "latitude": 31.2304,
        "longitude": 121.4737
    },
    {
        "title": "Typhoon warning issued for Taiwan Strait",
        "content": "Severe weather conditions expected to impact shipping lanes through Taiwan Strait. Vessels advised to seek alternative routes or delay departure.",
        "source": "Weather Service",
        "region": "Taiwan",
        "latitude": 23.6978,
        "longitude": 120.9605
    },
    {
        "title": "New trade regulations affecting semiconductor exports",
        "content": "Government announces new export controls on semiconductor components. Immediate impact on technology supply chains expected.",
        "source": "Government Bulletin",
        "region": "South Korea",
        "latitude": 35.9078,
        "longitude": 127.7669
    },
    {
        "title": "Flooding disrupts logistics in Mumbai",
        "content": "Heavy monsoon rains cause widespread flooding in Mumbai region, affecting road and rail logistics operations.",
        "source": "Local News",
        "region": "Mumbai, India",
        "latitude": 19.0760,
        "longitude": 72.8777
    },
    {
        "title": "Supplier bankruptcy filing - TechParts Vietnam",
        "content": "Major electronics component supplier TechParts Vietnam has filed for bankruptcy protection. Customers advised to seek alternative sources.",
        "source": "Business Wire",
        "region": "Vietnam",
        "latitude": 14.0583,
        "longitude": 108.2772
    }
]


class IntelligenceAgent:
    def __init__(self):
        self.running = False
        self.poll_interval = 60

    async def start(self):
        await event_bus.connect()
        gemini_service.initialize()
        self.running = True
        logger.info("Intelligence Agent started")

        await self.run_loop()

    async def stop(self):
        self.running = False
        await event_bus.disconnect()
        logger.info("Intelligence Agent stopped")

    async def run_loop(self):
        while self.running:
            try:
                await self.poll_sources()
                await asyncio.sleep(self.poll_interval)
            except Exception as e:
                logger.error(f"Error in agent loop: {e}")
                await asyncio.sleep(5)

    async def poll_sources(self):
        if random.random() < 0.3:
            news_item = random.choice(MOCK_NEWS_FEEDS)
            await self.process_news_item(news_item)

    async def process_news_item(self, news_item: dict):
        logger.info(f"Processing news: {news_item['title']}")
        
        classification = await gemini_service.classify_disruption(
            f"{news_item['title']}\n{news_item['content']}"
        )
        
        if classification.get("is_disruption", False):
            event_data = {
                "disruption_id": str(uuid4()),
                "disruption_type": classification.get("disruption_type", "logistics_failure"),
                "title": news_item["title"],
                "severity": classification.get("severity", "medium"),
                "region": news_item["region"],
                "latitude": news_item.get("latitude"),
                "longitude": news_item.get("longitude"),
                "source_urls": [news_item.get("source", "unknown")],
                "description": news_item.get("content"),
                "confidence": classification.get("confidence", 0.5)
            }
            
            await event_bus.publish("disruption.detected", event_data)
            logger.info(f"Published disruption event: {event_data['disruption_id']}")


async def main():
    agent = IntelligenceAgent()
    try:
        await agent.start()
    except KeyboardInterrupt:
        await agent.stop()


if __name__ == "__main__":
    asyncio.run(main())
