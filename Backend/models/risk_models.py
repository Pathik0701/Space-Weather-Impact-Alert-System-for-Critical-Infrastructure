from enum import Enum

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    NORMAL = "NORMAL"
    WATCH = "WATCH"
    ADVISORY = "ADVISORY"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class InfrastructureType(str, Enum):
    POWER_GRID = "power_grid"
    GNSS = "gnss"
    TELECOMMUNICATIONS = "telecommunications"
    SATELLITES = "satellites"


class RiskFactor(BaseModel):
    name: str
    value: float | str | None
    normalized_score: float = Field(ge=0, le=100)
    contribution: float
    severity: str
    available: bool = True


class InfrastructureRisk(BaseModel):
    infrastructure: InfrastructureType
    score: float = Field(ge=0, le=100)
    level: RiskLevel
    confidence: float = Field(ge=0, le=100)
    drivers: list[RiskFactor]


class SpaceWeatherRisk(BaseModel):
    overall_score: float = Field(ge=0, le=100)
    overall_level: RiskLevel
    confidence: float = Field(ge=0, le=100)

    infrastructure: list[InfrastructureRisk]

    primary_drivers: list[RiskFactor]
