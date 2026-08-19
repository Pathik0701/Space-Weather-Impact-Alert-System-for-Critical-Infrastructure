from datetime import datetime, timezone

from fastapi import APIRouter

from config import settings
from services.noaa_service import noaa_service

router = APIRouter(
    prefix="/api/health",
    tags=["Health"],
)


@router.get("")
async def health():

    noaa_status = "unknown"

    try:

        await noaa_service.get_json("/products/noaa-scales.json")

        noaa_status = "online"

    except Exception:
        noaa_status = "offline"

    return {
        "status": ("healthy" if noaa_status == "online" else "degraded"),
        "noaa": noaa_status,
        "cache": noaa_service.cache_status(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": settings.app_version,
    }
