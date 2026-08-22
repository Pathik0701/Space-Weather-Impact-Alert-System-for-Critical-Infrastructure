from pydantic import BaseModel, Field


class AuroraPoint(BaseModel):
    latitude: float
    longitude: float
    value: float = Field(ge=0)


class AuroraMapResponse(BaseModel):
    observation_time: str | None = None
    forecast_time: str | None = None
    points: list[AuroraPoint]
    min_value: float
    max_value: float
