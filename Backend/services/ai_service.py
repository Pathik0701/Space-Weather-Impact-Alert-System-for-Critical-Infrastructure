from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)

from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

from ai.prompt import SYSTEM_PROMPT
from ai.tools import (
    get_active_noaa_alerts,
    get_current_geomagnetic,
    get_current_solar_activity,
    get_current_solar_wind,
    get_infrastructure_risk,
)
from config import settings

# Tools

TOOLS = [
    get_current_geomagnetic,
    get_current_solar_wind,
    get_current_solar_activity,
    get_infrastructure_risk,
    get_active_noaa_alerts,
]

TOOL_MAP = {tool.name: tool for tool in TOOLS}


# LLM configuration


def create_llm():
    """
    Create the appropriate chat model based on the environment.

    Development:
        ChatOllama -> local Ollama instance

    Production:
        ChatOpenAI -> OpenAI API
    """

    if settings.environment == "production":
        return ChatOpenAI(
            model=settings.openai_model,
            api_key=settings.openai_api_key,
            temperature=0,
        )

    return ChatOllama(
        model=settings.ai_model,
        temperature=0,
    )


llm = create_llm()

# Bind the same tools regardless of the selected provider.
llm_with_tools = llm.bind_tools(TOOLS)


# Chat


async def chat(
    message: str,
    history: list[dict] | None = None,
) -> str:

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
    ]

    if history:
        for item in history:
            role = item.get("role")
            content = item.get("content", "")

            if not content:
                continue

            if role == "user":
                messages.append(HumanMessage(content=content))

            elif role == "assistant":
                messages.append(AIMessage(content=content))

    messages.append(HumanMessage(content=message))

    response = await llm_with_tools.ainvoke(messages)

    while response.tool_calls:

        messages.append(response)

        for tool_call in response.tool_calls:

            tool_name = tool_call["name"]
            tool_args = tool_call.get("args", {})

            tool = TOOL_MAP.get(tool_name)

            if tool is None:

                tool_result = {"error": f"Unknown tool: {tool_name}"}

            else:

                try:
                    tool_result = await tool.ainvoke(tool_args)

                except Exception as exc:

                    tool_result = {"error": str(exc)}

            messages.append(
                ToolMessage(
                    content=str(tool_result),
                    tool_call_id=tool_call["id"],
                )
            )

        response = await llm_with_tools.ainvoke(messages)

    return response.content
