from fastapi import APIRouter

from models.map import AuroraMapResponse
from services.map_service import fetch_ovation_data

router = APIRouter(
    prefix="/api/map",
    tags=["Map"],
)


@router.get(
    "/aurora",
    response_model=AuroraMapResponse,
)
async def get_aurora_map() -> AuroraMapResponse:
    return await fetch_ovation_data()
