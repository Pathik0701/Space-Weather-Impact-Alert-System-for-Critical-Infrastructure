from typing import Any

from services.noaa_service import noaa_service

GEOSPACE_URL = "/products/geospace/propagated-solar-wind-1-hour.json"


def rows_to_dicts(
    data: list[list[Any]],
) -> list[dict[str, Any]]:

    if not data or len(data) < 2:
        return []

    headers = data[0]

    return [dict(zip(headers, row)) for row in data[1:]]


async def get_geospace() -> dict:

    data = await noaa_service.get_json(GEOSPACE_URL)

    rows = rows_to_dicts(data)

    return {
        "latest": (rows[-1] if rows else {}),
        "history": rows[-120:],
    }


async def get_aurora() -> Any:

    return await noaa_service.get_json("/json/ovation_aurora_latest.json")
