from typing import Any

from services.noaa_service import noaa_service

KP_URL = "/json/planetary_k_index_1m.json"
DST_URL = "/json/geospace/geospace_dst_1_hour.json"


def rows_to_dicts(data: Any) -> list[dict[str, Any]]:
    """
    Normalize NOAA JSON responses.
    """

    if not data:
        return []

    # Current NOAA format
    if isinstance(data, list) and isinstance(data[0], dict):
        return data

    # Legacy table format
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


def latest_valid(
    rows: list[dict[str, Any]],
) -> dict[str, Any] | None:

    for row in reversed(rows):

        if row.get("time_tag"):
            return row

    return None


async def get_geomagnetic_data(
    history_points: int = 120,
) -> dict:

    kp_data, dst_data = await noaa_service.get_many(
        [
            KP_URL,
            DST_URL,
        ]
    )

    kp_rows = rows_to_dicts(kp_data)
    dst_rows = rows_to_dicts(dst_data)

    kp_rows = kp_rows[-history_points:]
    dst_rows = dst_rows[-history_points:]

    latest_kp = latest_valid(kp_rows) or {}
    latest_dst = latest_valid(dst_rows) or {}

    return {
        "time_tag": (latest_kp.get("time_tag") or latest_dst.get("time_tag")),
        "kp": to_float(latest_kp.get("kp_index")),
        "dst": to_float(latest_dst.get("dst")),
        "kp_history": [
            {
                "time_tag": row.get("time_tag"),
                "kp": to_float(row.get("kp_index")),
            }
            for row in kp_rows
        ],
        "dst_history": [
            {
                "time_tag": row.get("time_tag"),
                "dst": to_float(row.get("dst")),
            }
            for row in dst_rows
        ],
    }


async def get_kp_forecast() -> Any:

    return await noaa_service.get_json("/products/noaa-planetary-k-index-forecast.json")
