from typing import Any

from services.noaa_service import noaa_service

WIND_URL = "/json/rtsw/rtsw_wind_1m.json"
MAG_URL = "/json/rtsw/rtsw_mag_1m.json"


def rows_to_dicts(data: Any) -> list[dict[str, Any]]:
    """
    Normalize NOAA JSON responses.

    NOAA currently returns a list of dictionaries:
        [
            {"time_tag": "...", "proton_speed": 590, ...},
            ...
        ]

    Also supports the older table-style format:
        [
            ["time_tag", "speed"],
            ["...", 590]
        ]
    """

    if not data:
        return []

    # Current NOAA format
    if isinstance(data, list) and isinstance(data[0], dict):
        return data

    # Legacy/table format
    if isinstance(data, list) and len(data) >= 2:
        if isinstance(data[0], list):
            headers = data[0]

            return [
                dict(zip(headers, row)) for row in data[1:] if isinstance(row, list)
            ]

    return []


def to_float(value: Any) -> float | None:
    try:
        if value in (None, "", "null", "None"):
            return None

        return float(value)

    except (TypeError, ValueError):
        return None


def latest_valid(rows: list[dict[str, Any]]) -> dict[str, Any] | None:
    """
    Return the latest usable row based on time_tag.
    """

    for row in reversed(rows):
        if row.get("time_tag"):
            return row

    return None


async def get_solar_wind(
    history_points: int = 120,
) -> dict:

    wind_data, mag_data = await noaa_service.get_many(
        [
            WIND_URL,
            MAG_URL,
        ]
    )

    wind_rows = rows_to_dicts(wind_data)
    mag_rows = rows_to_dicts(mag_data)

    # Keep requested history
    wind_rows = wind_rows[-history_points:]
    mag_rows = mag_rows[-history_points:]

    latest_wind = latest_valid(wind_rows)
    latest_mag = latest_valid(mag_rows)

    return {
        "time_tag": (latest_wind or latest_mag or {}).get("time_tag"),
        # Solar wind
        "speed": to_float((latest_wind or {}).get("proton_speed")),
        "density": to_float((latest_wind or {}).get("proton_density")),
        "temperature": to_float((latest_wind or {}).get("proton_temperature")),
        # Magnetic field
        "bx": to_float((latest_mag or {}).get("bx_gsm")),
        "by": to_float((latest_mag or {}).get("by_gsm")),
        "bz": to_float((latest_mag or {}).get("bz_gsm")),
        "bt": to_float((latest_mag or {}).get("bt")),
        # Historical solar wind data
        "history": [
            {
                "time_tag": row.get("time_tag"),
                "speed": to_float(row.get("proton_speed")),
                "density": to_float(row.get("proton_density")),
                "temperature": to_float(row.get("proton_temperature")),
            }
            for row in wind_rows
        ],
    }
