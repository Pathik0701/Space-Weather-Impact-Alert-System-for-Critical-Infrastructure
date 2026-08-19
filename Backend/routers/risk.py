import asyncio

from fastapi import APIRouter, HTTPException, Query

from services.geomagnetic_service import (
    get_geomagnetic_data,
)
from services.risk_service import calculate_risk
from services.solar_activity_service import (
    get_solar_activity,
)
from services.solar_wind_service import (
    get_solar_wind,
)

router = APIRouter(
    prefix="/api/risk",
    tags=["Risk"],
)


async def get_current_risk():

    geomagnetic, solar_wind, solar_activity = await asyncio.gather(
        get_geomagnetic_data(),
        get_solar_wind(),
        get_solar_activity(),
    )

    return calculate_risk(
        geomagnetic,
        solar_wind,
        solar_activity,
    )


@router.get("/current")
async def current_risk():

    try:

        return await get_current_risk()

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to calculate risk: {exc}",
        )


@router.get("/infrastructure/{infrastructure}")
async def infrastructure_risk(
    infrastructure: str,
):

    try:

        risk = await get_current_risk()

        for item in risk.infrastructure:

            if item.infrastructure.value == infrastructure:
                return item

        raise HTTPException(
            status_code=404,
            detail=(f"Unknown infrastructure: " f"{infrastructure}"),
        )

    except HTTPException:
        raise

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to calculate risk: {exc}",
        )


@router.get("/regional")
async def regional_risk(
    latitude: float = Query(
        ...,
        ge=-90,
        le=90,
    ),
    longitude: float = Query(
        ...,
        ge=-180,
        le=180,
    ),
):

    try:

        risk = await get_current_risk()

        # This is intentionally a transparent
        # geographic heuristic, NOT a local K-index.
        #
        # Higher absolute latitude generally means
        # stronger exposure to geomagnetic effects.
        latitude_factor = min(
            abs(latitude) / 70,
            1,
        )

        adjusted = []

        for item in risk.infrastructure:

            if latitude_factor >= 0.8:
                modifier = 1.15

            elif latitude_factor >= 0.5:
                modifier = 1.05

            else:
                modifier = 0.95

            score = min(
                100,
                item.score * modifier,
            )

            adjusted.append(
                {
                    **item.model_dump(),
                    "score": round(score, 1),
                    "latitude_modifier": modifier,
                }
            )

        return {
            "location": {
                "latitude": latitude,
                "longitude": longitude,
            },
            "note": (
                "Regional score is a heuristic "
                "derived from global space-weather "
                "conditions and latitude. It is not "
                "a local geomagnetic measurement."
            ),
            "infrastructure": adjusted,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to calculate regional risk: {exc}",
        )
