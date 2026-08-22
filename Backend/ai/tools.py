from langchain_core.tools import tool

from services.alert_service import get_noaa_alerts
from services.geomagnetic_service import get_geomagnetic_data
from services.risk_service import calculate_risk
from services.solar_activity_service import get_solar_activity
from services.solar_wind_service import get_solar_wind


@tool
async def get_current_geomagnetic() -> dict:
    """
    Get the current geomagnetic space-weather conditions,
    including Kp and Dst values.
    """
    data = await get_geomagnetic_data()

    if hasattr(data, "model_dump"):
        return data.model_dump()

    return data


@tool
async def get_current_solar_wind() -> dict:
    """
    Get the current solar-wind conditions, including
    speed, density, temperature and magnetic-field values.
    """
    data = await get_solar_wind()

    if hasattr(data, "model_dump"):
        return data.model_dump()

    return data


@tool
async def get_current_solar_activity() -> dict:
    """
    Get current solar activity including X-ray flux,
    flare information and proton flux.
    """
    data = await get_solar_activity()

    if hasattr(data, "model_dump"):
        return data.model_dump()

    return data


@tool
async def get_infrastructure_risk() -> dict:
    """
    Get the current infrastructure risk assessment,
    including risk scores, levels, confidence and
    risk drivers for supported infrastructure.
    """
    data = await calculate_risk()

    if hasattr(data, "model_dump"):
        return data.model_dump()

    return data


@tool
async def get_active_noaa_alerts() -> dict:
    """
    Get the latest NOAA space-weather alerts.
    """
    data = await get_noaa_alerts()

    if hasattr(data, "model_dump"):
        return data.model_dump()

    return data
