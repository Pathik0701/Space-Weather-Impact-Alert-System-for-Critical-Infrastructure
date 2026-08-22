import httpx

from fastapi import HTTPException

from models.map import AuroraMapResponse, AuroraPoint

NOAA_OVATION_URL = "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json"


async def fetch_ovation_data() -> AuroraMapResponse:
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(NOAA_OVATION_URL)

        response.raise_for_status()

        data = response.json()

    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504,
            detail="NOAA SWPC API request timed out.",
        ) from exc

    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to fetch data from NOAA SWPC.",
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail="NOAA returned invalid JSON data.",
        ) from exc

    coordinates = data.get("coordinates", [])

    points: list[AuroraPoint] = []

    values: list[float] = []

    for coordinate in coordinates:
        if len(coordinate) < 3:
            continue

        longitude = coordinate[0]
        latitude = coordinate[1]
        value = coordinate[2]

        if value is None:
            continue

        try:
            longitude = float(longitude)
            latitude = float(latitude)
            value = float(value)
        except (TypeError, ValueError):
            continue

        points.append(
            AuroraPoint(
                latitude=latitude,
                longitude=longitude,
                value=value,
            )
        )

        values.append(value)

    if not points:
        raise HTTPException(
            status_code=502,
            detail="NOAA OVATION response contained no valid coordinates.",
        )

    return AuroraMapResponse(
        observation_time=data.get("Observation Time"),
        forecast_time=data.get("Forecast Time"),
        points=points,
        min_value=min(values),
        max_value=max(values),
    )
