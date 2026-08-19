from typing import Any

from services.noaa_service import noaa_service

XRAY_URL = "/json/goes/primary/xray-flares-latest.json"

PROTON_URL = "/json/goes/primary/integral-protons-1-day.json"


def rows_to_dicts(
    data: list[list[Any]],
) -> list[dict[str, Any]]:

    if not data or len(data) < 2:
        return []

    headers = data[0]

    return [dict(zip(headers, row)) for row in data[1:]]


def to_float(value: Any) -> float | None:

    try:
        if value in (None, "", "null"):
            return None

        return float(value)

    except (TypeError, ValueError):
        return None


def find_latest_number(
    row: dict[str, Any],
) -> float | None:

    preferred = [
        "flux",
        "flux_integral",
        "proton_flux",
        "value",
    ]

    for key in preferred:
        value = to_float(row.get(key))

        if value is not None:
            return value

    return None


async def get_solar_activity() -> dict:

    xray_data, proton_data = await noaa_service.get_many(
        [
            XRAY_URL,
            PROTON_URL,
        ]
    )

    xray_rows = rows_to_dicts(xray_data)
    proton_rows = rows_to_dicts(proton_data)

    latest_xray = xray_rows[-1] if xray_rows else {}

    latest_proton = proton_rows[-1] if proton_rows else {}

    return {
        "time_tag": (latest_xray.get("time_tag") or latest_proton.get("time_tag")),
        "xray_flux": find_latest_number(latest_xray),
        "flare_class": (latest_xray.get("class") or latest_xray.get("flare_class")),
        "proton_flux": find_latest_number(latest_proton),
        "flares": xray_rows[-20:],
        "proton_history": [
            {
                "time_tag": row.get("time_tag"),
                "value": find_latest_number(row),
            }
            for row in proton_rows[-120:]
        ],
    }
