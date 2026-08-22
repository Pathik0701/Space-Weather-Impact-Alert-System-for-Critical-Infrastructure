import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query

from schemas import SpaceWeatherCurrent
from services.geomagnetic_service import (
    get_geomagnetic_data,
    get_kp_forecast,
)
from services.risk_service import calculate_risk
from services.solar_activity_service import (
    get_solar_activity,
)
from services.solar_wind_service import (
    get_solar_wind,
)

router = APIRouter(
    prefix="/api/weather",
    tags=["Weather"],
)


@router.get(
    "/current",
    response_model=SpaceWeatherCurrent,
)
async def current_weather():

    try:

        geomagnetic, solar_wind, solar_activity = await asyncio.gather(
            get_geomagnetic_data(),
            get_solar_wind(),
            get_solar_activity(),
        )

        risk = calculate_risk(
            geomagnetic,
            solar_wind,
            solar_activity,
        )

        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "geomagnetic": geomagnetic,
            "solar_wind": solar_wind,
            "solar_activity": solar_activity,
            "risk": risk,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=("Unable to retrieve NOAA " f"space-weather data: {exc}"),
        )


@router.get("/forecast")
async def weather_forecast():

    try:
        return await get_kp_forecast()

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve forecast: {exc}",
        )
