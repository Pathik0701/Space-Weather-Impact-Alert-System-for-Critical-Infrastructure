from fastapi import APIRouter, HTTPException

from replay.replay_service import list_events, run_replay
from sector.sector_mapper import build_sector_cards
from services.alert_service import check_and_trigger
from models.risk import SpaceWeatherRisk

router = APIRouter(
    prefix="/api/replay",
    tags=["Replay"],
)


@router.get("/events")
async def replay_events():
    return {"events": list_events()}


@router.post("/{event_id}/start")
async def start_replay(event_id: str):
    """
    Replays a historical storm's data through the real risk engine,
    step by step, persisting each step so /api/weather/history and
    the dashboard graph pick it up live during a demo.
    """

    try:
        timeline = run_replay(event_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    # Fire an alert off the peak of the replayed event, same as a
    # live High/Severe crossing would.
    peak_step = max(timeline, key=lambda step: step["risk"]["overall_score"])
    peak_risk = SpaceWeatherRisk(**peak_step["risk"])
    alert = check_and_trigger(peak_risk, source="replay")

    return {
        "event_id": event_id,
        "steps": len(timeline),
        "timeline": timeline,
        "peak_sectors": build_sector_cards(peak_risk),
        "alert_triggered": alert,
    }
