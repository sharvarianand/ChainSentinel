import json
import logging
import asyncio
from typing import Optional, Any, AsyncGenerator

logger = logging.getLogger(__name__)


class EventBus:
    def __init__(self):
        self.client = None
        self._connected = False
        self._memory_store = {}
        self.streams = {
            "disruption.detected": "disruptions",
            "risk.assessed": "risks",
            "simulation.complete": "simulations",
            "action.recommended": "actions",
            "action.executed": "executions",
            "learning.updated": "learning",
        }

    async def connect(self):
        try:
            import redis.asyncio as redis
            from shared.config import settings
            
            self.client = redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
            await self.client.ping()
            self._connected = True
            logger.info("Connected to Redis event bus")
        except Exception as e:
            logger.warning(f"Redis not available, using in-memory event bus: {e}")
            self._connected = False
            self.client = None

    async def disconnect(self):
        if self.client:
            await self.client.close()
        self._connected = False

    async def publish(self, event_type: str, data: dict) -> str:
        stream_name = self.streams.get(event_type, "events")
        event_id = f"{event_type}-{asyncio.get_event_loop().time()}"
        
        if self._connected and self.client:
            try:
                event_data = {
                    "event_type": event_type,
                    "data": json.dumps(data),
                }
                event_id = await self.client.xadd(stream_name, event_data)
            except Exception as e:
                logger.warning(f"Failed to publish to Redis, using memory: {e}")
                self._memory_store.setdefault(stream_name, []).append({
                    "id": event_id,
                    "event_type": event_type,
                    "data": data
                })
        else:
            self._memory_store.setdefault(stream_name, []).append({
                "id": event_id,
                "event_type": event_type,
                "data": data
            })
        
        logger.info(f"Published event {event_type} to {stream_name}: {event_id}")
        return event_id

    async def subscribe(self, stream_name: str, group_name: str, consumer_name: str) -> AsyncGenerator:
        while True:
            if self._connected and self.client:
                try:
                    import redis.asyncio as redis
                    try:
                        await self.client.xgroup_create(
                            stream_name, 
                            group_name, 
                            id="0", 
                            mkstream=True
                        )
                    except redis.ResponseError as e:
                        if "BUSYGROUP" not in str(e):
                            raise
                    
                    events = await self.client.xreadgroup(
                        groupname=group_name,
                        consumername=consumer_name,
                        streams={stream_name: ">"},
                        count=1,
                        block=5000
                    )
                    
                    for stream, messages in events:
                        for event_id, event_data in messages:
                            yield event_id, event_data
                            await self.client.xack(stream_name, group_name, event_id)
                except Exception as e:
                    logger.warning(f"Redis subscribe error: {e}")
                    await asyncio.sleep(5)
            else:
                await asyncio.sleep(5)

    async def get_latest_events(self, stream_name: str, count: int = 10) -> list:
        if self._connected and self.client:
            try:
                events = await self.client.xrevrange(stream_name, count=count)
                return [
                    {
                        "id": event_id,
                        **{k: json.loads(v) if k == "data" else v for k, v in event_data.items()}
                    }
                    for event_id, event_data in events
                ]
            except Exception as e:
                logger.warning(f"Failed to get events from Redis: {e}")
        
        events = self._memory_store.get(stream_name, [])[-count:]
        return events


event_bus = EventBus()
