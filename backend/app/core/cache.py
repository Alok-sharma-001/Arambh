import os
import json
import logging
from typing import Optional, Any

logger = logging.getLogger(__name__)

_redis_client = None

def get_redis_client():
    global _redis_client
    if _redis_client is not None:
        return _redis_client

    redis_url = os.getenv("REDIS_URL")
    if redis_url:
        try:
            import redis
            _redis_client = redis.from_url(redis_url, decode_responses=True)
            logger.info("Connected to Redis cache.")
        except Exception as e:
            logger.warning(f"Could not connect to Redis ({e}). Using in-memory fallback cache.")
            _redis_client = False
    else:
        _redis_client = False

    return _redis_client

# Simple in-memory fallback cache dict
_memory_cache: dict = {}

def cache_get(key: str) -> Optional[Any]:
    client = get_redis_client()
    if client:
        try:
            val = client.get(key)
            return json.loads(val) if val else None
        except Exception as e:
            logger.warning(f"Redis get error ({e})")
            return None
    
    # In-memory fallback
    item = _memory_cache.get(key)
    if item:
        from datetime import datetime, timezone
        if item["expires_at"] and datetime.now(timezone.utc).timestamp() > item["expires_at"]:
            _memory_cache.pop(key, None)
            return None
        return item["value"]
    return None

def cache_set(key: str, value: Any, ttl_seconds: int = 300):
    client = get_redis_client()
    if client:
        try:
            client.setex(key, ttl_seconds, json.dumps(value))
            return
        except Exception as e:
            logger.warning(f"Redis set error ({e})")

    # In-memory fallback
    from datetime import datetime, timezone
    _memory_cache[key] = {
        "value": value,
        "expires_at": datetime.now(timezone.utc).timestamp() + ttl_seconds
    }

def cache_invalidate(key: str):
    client = get_redis_client()
    if client:
        try:
            client.delete(key)
        except Exception as e:
            logger.warning(f"Redis delete error ({e})")
    
    _memory_cache.pop(key, None)
