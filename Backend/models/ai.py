from typing import Literal

from pydantic import BaseModel, Field


class AIChatHistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: list[AIChatHistoryItem] = Field(default_factory=list)


class AIChatResponse(BaseModel):
    answer: str
