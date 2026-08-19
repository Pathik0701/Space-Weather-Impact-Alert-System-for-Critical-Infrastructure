from fastapi import APIRouter, HTTPException

from schemas import NOAAAlertsResponse
from services.alert_service import (
    get_noaa_alerts,
)

router = APIRouter(
    prefix="/api/alerts",
    tags=["Alerts"],
)


@router.get(
    "/noaa",
    response_model=NOAAAlertsResponse,
)
async def noaa_alerts():

    try:

        alerts = await get_noaa_alerts()

        return {
            "count": len(alerts),
            "alerts": alerts,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve NOAA alerts: {exc}",
        )


@router.get("/current")
async def current_alert():

    try:

        alerts = await get_noaa_alerts()

        if not alerts:

            return {
                "active": False,
                "alert": None,
            }

        priority = {
            "CRITICAL": 3,
            "WARNING": 2,
            "ADVISORY": 1,
            "INFO": 0,
        }

        alerts.sort(
            key=lambda item: priority.get(
                item["severity"],
                0,
            ),
            reverse=True,
        )

        return {
            "active": True,
            "alert": alerts[0],
        }

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve current alert: {exc}",
        )
