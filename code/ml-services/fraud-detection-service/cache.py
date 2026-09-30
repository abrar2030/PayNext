"""
Redis cache wrapper for the Fraud Detection Service.
Caches serialised user behaviour profiles so repeated DB lookups during
high-throughput scoring are avoided.  Falls back silently when Redis is
unavailable - the service stays operational, just without caching.
"""

import json
import logging
import os
from typing import Any, Optional

logger = logging.getLogger(__name__)

_REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
_REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
_CACHE_TTL = int(os.getenv("CACHE_TTL_SECONDS", "300"))  # 5 min default

_redis_client = None


def _client():
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    try:
        import redis as _redis

        c = _redis.Redis(
            host=_REDIS_HOST,
            port=_REDIS_PORT,
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
        c.ping()
        _redis_client = c
        logger.info("Redis connected at %s:%s", _REDIS_HOST, _REDIS_PORT)
    except Exception as exc:
        logger.warning("Redis unavailable (%s). Running without cache.", exc)
        _redis_client = None
    return _redis_client


def get(key: str) -> Optional[Any]:
    c = _client()
    if c is None:
        return None
    try:
        raw = c.get(key)
        return json.loads(raw) if raw else None
    except Exception as exc:
        logger.debug("Cache GET error for %s: %s", key, exc)
        return None


def set(key: str, value: Any, ttl: int = _CACHE_TTL) -> None:
    c = _client()
    if c is None:
        return
    try:
        c.setex(key, ttl, json.dumps(value, default=str))
    except Exception as exc:
        logger.debug("Cache SET error for %s: %s", key, exc)


def delete(key: str) -> None:
    c = _client()
    if c is None:
        return
    try:
        c.delete(key)
    except Exception as exc:
        logger.debug("Cache DELETE error for %s: %s", key, exc)


def user_profile_key(user_id: str) -> str:
    return f"fraud:profile:{user_id}"
