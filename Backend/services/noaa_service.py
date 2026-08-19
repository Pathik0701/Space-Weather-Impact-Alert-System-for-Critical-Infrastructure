import asyncio
import time
from typing import Any

import httpx

from config import settings


class NOAAService:
    def __init__(self):
        self.base_url = settings.noaa_base_url.rstrip("/")
        self.timeout = settings.request_timeout
        self.cache_ttl = settings.cache_ttl

        self._cache: dict[str, tuple[float, Any]] = {}

    async def get_json(
        self,
        path: str,
        *,
        use_cache: bool = True,
    ) -> Any:

        url = path if path.startswith("http") else f"{self.base_url}/{path.lstrip('/')}"

        cached = self._cache.get(url)

        if use_cache and cached:
            timestamp, data = cached

            if time.monotonic() - timestamp < self.cache_ttl:
                return data

        timeout = httpx.Timeout(
            self.timeout,
            connect=5.0,
        )

        async with httpx.AsyncClient(
            timeout=timeout,
            headers={"User-Agent": "SpaceWeatherImpactAlertSystem/2.0"},
        ) as client:

            response = await client.get(url)
            response.raise_for_status()

            data = response.json()

        self._cache[url] = (
            time.monotonic(),
            data,
        )

        return data

    async def get_many(
        self,
        paths: list[str],
    ) -> list[Any]:

        return await asyncio.gather(*[self.get_json(path) for path in paths])

    def cache_status(self) -> str:
        return f"{len(self._cache)} cached NOAA resources"


noaa_service = NOAAService()
