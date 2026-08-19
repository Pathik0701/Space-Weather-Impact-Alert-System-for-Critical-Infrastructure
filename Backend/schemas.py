from typing import Any

from pydantic import BaseModel, Field

from models.risk import SpaceWeatherRisk


class DataPoint(BaseModel):
    time_tag: str
    value: float | None = None


class SolarWindData(BaseModel):
    time_tag: str | None = None

    speed: float | None = None
    density: float | None = None
    temperature: float | None = None

    bx: float | None = None
    by: float | None = None
    bz: float | None = None
    bt: float | None = None

    history: list[dict[str, Any]] = Field(default_factory=list)


class GeomagneticData(BaseModel):
    time_tag: str | None = None

    kp: float | None = None
    dst: float | None = None

    kp_history: list[dict[str, Any]] = Field(default_factory=list)
    dst_history: list[dict[str, Any]] = Field(default_factory=list)


class SolarActivityData(BaseModel):
    time_tag: str | None = None

    xray_flux: float | None = None
    flare_class: str | None = None
    proton_flux: float | None = None

    flares: list[dict[str, Any]] = Field(default_factory=list)
    proton_history: list[dict[str, Any]] = Field(default_factory=list)


class SpaceWeatherCurrent(BaseModel):
    timestamp: str

    geomagnetic: GeomagneticData
    solar_wind: SolarWindData
    solar_activity: SolarActivityData

    risk: SpaceWeatherRisk


class AlertItem(BaseModel):
    id: str
    issue_time: str | None = None
    product_id: str | None = None
    message: str
    severity: str = "UNKNOWN"


class NOAAAlertsResponse(BaseModel):
    count: int
    alerts: list[AlertItem]


class RegionalRiskRequest(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    name: str | None = None


class HealthResponse(BaseModel):
    status: str
    noaa: str
    cache: str
    timestamp: str
