import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings

from routers import (
    alerts,
    geospace,
    health,
    risk,
    weather,
)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Real-time NOAA space-weather monitoring " "and infrastructure risk assessment."
    ),
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(weather.router)

app.include_router(risk.router)

app.include_router(alerts.router)

app.include_router(geospace.router)

app.include_router(health.router)


@app.get("/")
async def root():

    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "online",
        "docs": "/docs",
    }


if __name__ == "__main__":

    uvicorn.run(
        "main:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=settings.server_reload,
    )
