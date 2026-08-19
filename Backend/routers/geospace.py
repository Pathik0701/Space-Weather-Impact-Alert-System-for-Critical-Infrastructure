from fastapi import APIRouter, HTTPException

from services.geospace_service import (
    get_aurora,
    get_geospace,
)

router = APIRouter(
    prefix="/api/geospace",
    tags=["Geospace"],
)


@router.get("")
async def geospace():

    try:

        return await get_geospace()

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve geospace data: {exc}",
        )


@router.get("/aurora")
async def aurora():

    try:

        return await get_aurora()

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve aurora data: {exc}",
        )
