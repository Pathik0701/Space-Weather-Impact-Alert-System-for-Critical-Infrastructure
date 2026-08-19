from typing import Any

import database
from models.risk import RiskLevel, SpaceWeatherRisk
from services.noaa_service import noaa_service

ALERTS_URL = "/products/alerts.json"

# Risk crossing into WARNING or CRITICAL is a High/Severe event per
# the brief -- this is what should trigger a notification.
NOTIFY_LEVELS = {RiskLevel.WARNING, RiskLevel.CRITICAL}


def check_and_trigger(risk: SpaceWeatherRisk, source: str = "live") -> dict | None:
    """
    Inspect computed overall risk and, if it has crossed into
    High/Severe, log an alert (simulated in-app notification).
    Wire in Twilio here later by calling an SMS send inside the if
    block -- the trigger condition and message are already built.
    """

    if risk.overall_level not in NOTIFY_LEVELS:
        return None

    message = (
        f"Space weather risk is {risk.overall_level.value.upper()} "
        f"(score {risk.overall_score}/100). Check sector impact cards "
        f"for recommended actions."
    )

    database.log_alert(
        overall_level=risk.overall_level.value,
        overall_score=risk.overall_score,
        message=message,
        source=source,
    )

    return {
        "triggered": True,
        "overall_level": risk.overall_level.value,
        "overall_score": risk.overall_score,
        "message": message,
    }


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
