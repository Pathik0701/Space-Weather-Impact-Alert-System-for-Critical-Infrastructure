from typing import Any

from models.risk_models import (
    InfrastructureRisk,
    InfrastructureType,
    RiskFactor,
    RiskLevel,
    SpaceWeatherRisk,
)


def clamp(
    value: float,
    minimum: float = 0,
    maximum: float = 100,
) -> float:

    return max(
        minimum,
        min(maximum, value),
    )


def normalize_kp(kp: float | None) -> float:

    if kp is None:
        return 0

    return clamp((kp / 9.0) * 100)


def normalize_dst(dst: float | None) -> float:

    if dst is None:
        return 0

    if dst >= 0:
        return 0

    return clamp(abs(dst) / 250 * 100)


def normalize_speed(
    speed: float | None,
) -> float:

    if speed is None:
        return 0

    if speed <= 350:
        return 0

    return clamp(((speed - 350) / 450) * 100)


def normalize_bz(
    bz: float | None,
) -> float:

    if bz is None or bz >= 0:
        return 0

    return clamp(abs(bz) / 20 * 100)


def normalize_density(
    density: float | None,
) -> float:

    if density is None:
        return 0

    if density <= 5:
        return 0

    return clamp(((density - 5) / 25) * 100)


def normalize_proton_flux(
    flux: float | None,
) -> float:

    if flux is None or flux <= 0:
        return 0

    # Log-like scaling without requiring
    # a specific statistical distribution.
    import math

    return clamp(math.log10(max(flux, 1)) * 20)


def normalize_xray(
    flux: float | None,
) -> float:

    if flux is None or flux <= 0:
        return 0

    # Approximate logarithmic severity.
    # 1e-8 ~ A class, 1e-6 ~ C class,
    # 1e-5 ~ M class, 1e-4 ~ X class.
    import math

    score = ((math.log10(flux) + 8) / 4) * 100

    return clamp(score)


def severity(score: float) -> str:

    if score >= 80:
        return "critical"

    if score >= 60:
        return "high"

    if score >= 40:
        return "moderate"

    if score >= 20:
        return "low"

    return "minimal"


def risk_level(score: float) -> RiskLevel:

    if score >= 80:
        return RiskLevel.CRITICAL

    if score >= 60:
        return RiskLevel.WARNING

    if score >= 40:
        return RiskLevel.ADVISORY

    if score >= 20:
        return RiskLevel.WATCH

    return RiskLevel.NORMAL


def make_factor(
    name: str,
    value: Any,
    normalized: float,
    weight: float,
) -> RiskFactor:

    contribution = normalized * weight

    return RiskFactor(
        name=name,
        value=value,
        normalized_score=round(
            normalized,
            1,
        ),
        contribution=round(
            contribution,
            1,
        ),
        severity=severity(normalized),
        available=value is not None,
    )


def calculate_infrastructure_risk(
    infrastructure: InfrastructureType,
    factors: dict[str, float | None],
    confidence: float,
) -> InfrastructureRisk:

    weights = {
        InfrastructureType.POWER_GRID: {
            "kp": 0.35,
            "dst": 0.25,
            "speed": 0.20,
            "bz": 0.15,
            "density": 0.05,
        },
        InfrastructureType.GNSS: {
            "kp": 0.25,
            "speed": 0.20,
            "bz": 0.15,
            "dst": 0.15,
            "xray": 0.10,
            "proton": 0.15,
        },
        InfrastructureType.TELECOMMUNICATIONS: {
            "xray": 0.35,
            "kp": 0.20,
            "bz": 0.10,
            "speed": 0.10,
            "proton": 0.10,
            "dst": 0.15,
        },
        InfrastructureType.SATELLITES: {
            "proton": 0.30,
            "kp": 0.20,
            "speed": 0.15,
            "bz": 0.10,
            "xray": 0.10,
            "dst": 0.15,
        },
    }

    selected_weights = weights[infrastructure]

    normalizers = {
        "kp": normalize_kp,
        "dst": normalize_dst,
        "speed": normalize_speed,
        "bz": normalize_bz,
        "density": normalize_density,
        "proton": normalize_proton_flux,
        "xray": normalize_xray,
    }

    risk_factors: list[RiskFactor] = []

    for name, weight in selected_weights.items():

        value = factors.get(name)

        normalized = normalizers[name](value)

        risk_factors.append(
            make_factor(
                name=name,
                value=value,
                normalized=normalized,
                weight=weight,
            )
        )

    available_weights = sum(
        selected_weights[f.name] for f in risk_factors if f.available
    )

    weighted_sum = sum(f.contribution for f in risk_factors)

    # Avoid penalizing the score merely because
    # an optional NOAA data source is unavailable.
    if available_weights > 0:
        score = weighted_sum / available_weights
    else:
        score = 0

    score = clamp(score)

    return InfrastructureRisk(
        infrastructure=infrastructure,
        score=round(score, 1),
        level=risk_level(score),
        confidence=round(confidence, 1),
        drivers=sorted(
            risk_factors,
            key=lambda item: item.contribution,
            reverse=True,
        ),
    )


def calculate_confidence(
    factors: dict[str, float | None],
) -> float:

    expected = len(factors)

    if expected == 0:
        return 0

    available = sum(value is not None for value in factors.values())

    return (available / expected) * 100


def calculate_risk(
    geomagnetic: dict,
    solar_wind: dict,
    solar_activity: dict,
) -> SpaceWeatherRisk:

    factors = {
        "kp": geomagnetic.get("kp"),
        "dst": geomagnetic.get("dst"),
        "speed": solar_wind.get("speed"),
        "bz": solar_wind.get("bz"),
        "density": solar_wind.get("density"),
        "xray": solar_activity.get("xray_flux"),
        "proton": solar_activity.get("proton_flux"),
    }

    confidence = calculate_confidence(factors)

    infrastructure = [
        calculate_infrastructure_risk(
            item,
            factors,
            confidence,
        )
        for item in InfrastructureType
    ]

    overall_score = max(item.score for item in infrastructure)

    all_drivers = [driver for item in infrastructure for driver in item.drivers]

    # Deduplicate factors.
    best_drivers: dict[str, RiskFactor] = {}

    for driver in all_drivers:
        current = best_drivers.get(driver.name)

        if current is None or driver.contribution > current.contribution:
            best_drivers[driver.name] = driver

    primary_drivers = sorted(
        best_drivers.values(),
        key=lambda item: item.contribution,
        reverse=True,
    )[:5]

    return SpaceWeatherRisk(
        overall_score=round(
            overall_score,
            1,
        ),
        overall_level=risk_level(overall_score),
        confidence=round(
            confidence,
            1,
        ),
        infrastructure=infrastructure,
        primary_drivers=primary_drivers,
    )
