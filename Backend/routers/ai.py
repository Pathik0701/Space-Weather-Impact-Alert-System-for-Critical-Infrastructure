from fastapi import APIRouter

from models.ai import AIChatRequest, AIChatResponse
from services.ai_service import chat as chat_service

router = APIRouter(
    prefix="/api/ai",
    tags=["AI"],
)


@router.post("/chat", response_model=AIChatResponse)
async def chat(request: AIChatRequest):
    history = [item.model_dump() for item in request.history]
    answer = await chat_service(request.message, history=history)
    return AIChatResponse(answer=answer)
