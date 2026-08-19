from models.risk import InfrastructureRisk, SpaceWeatherRisk
from sector.sector_data import get_sector_impact

SECTOR_LABELS = {
    "power_grid": "Power grid",
    "telecommunications": "Telecom",
    "aviation": "Aviation",
    "railways": "Railways",
}


def build_sector_card(item: InfrastructureRisk) -> dict:
    impact = get_sector_impact(item.infrastructure, item.level)

    return {
        "sector": item.infrastructure.value,
        "label": SECTOR_LABELS[item.infrastructure.value],
        "risk_level": item.level.value,
        "score": item.score,
        "impact": impact["impact"],
        "action": impact["action"],
    }


def build_sector_cards(risk: SpaceWeatherRisk) -> list[dict]:
    return [build_sector_card(item) for item in risk.infrastructure]
