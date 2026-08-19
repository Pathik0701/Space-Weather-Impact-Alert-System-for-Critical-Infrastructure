from typing import Any

from services.noaa_service import noaa_service

ALERTS_URL = "/products/alerts.json"


def get_alert_severity(
    message: str,
) -> str:

    text = message.upper()

    if any(
        word in text
        for word in [
            "WARNING",
            "EXTREME",
            "CRITICAL",
        ]
    ):
        return "CRITICAL"

    if any(
        word in text
        for word in [
            "WATCH",
            "STORM",
        ]
    ):
        return "WARNING"

    if any(
        word in text
        for word in [
            "ADVISORY",
            "ALERT",
        ]
    ):
        return "ADVISORY"

    return "INFO"


async def get_noaa_alerts() -> list[dict[str, Any]]:

    data = await noaa_service.get_json(ALERTS_URL)

    if not isinstance(data, list):
        return []

    alerts = []

    for index, item in enumerate(data):

        if isinstance(item, dict):

            message = item.get("message") or item.get("description") or str(item)

            alerts.append(
                {
                    "id": str(
                        item.get(
                            "id",
                            index,
                        )
                    ),
                    "issue_time": (
                        item.get("issue_datetime")
                        or item.get("issue_time")
                        or item.get("time_tag")
                    ),
                    "product_id": (item.get("product_id") or item.get("product")),
                    "message": message,
                    "severity": get_alert_severity(message),
                }
            )

    return alerts
