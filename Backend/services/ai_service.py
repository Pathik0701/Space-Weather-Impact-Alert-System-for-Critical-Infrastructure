from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from langchain_ollama import ChatOllama

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


def create_llm() -> ChatOllama:
    """
    Create the appropriate Ollama model based on the environment.

    Development:
        Local Ollama
        Example: http://localhost:11434

    Production:
        Ollama Cloud
        MiniMax model
        Uses MINIMAX_API_KEY
    """

    if settings.environment.lower() == "production":
        return ChatOllama(
            model=settings.minimax_model,
            base_url=settings.ollama_cloud_url,
            client_kwargs={
                "headers": {
                    "Authorization": f"Bearer {settings.minimax_api_key}",
                }
            },
            temperature=0,
        )

    # ChatOpneAI

    # Production:
    #         ChatOpenAI -> OpenAI API
    #     """

    #     if settings.environment == "production":
    #         return ChatOpenAI(
    #             model=settings.openai_model,
    #             api_key=settings.openai_api_key,
    #             temperature=0,
    #         )

    # Development
    return ChatOllama(
        model=settings.ai_model,
        temperature=0,
    )


llm = create_llm()


# Bind tools

llm_with_tools = llm.bind_tools(TOOLS)


# Chat


async def chat(
    message: str,
    history: list[dict] | None = None,
) -> str:

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
    ]

    # Restore previous conversation

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

    # Current user message

    messages.append(HumanMessage(content=message))

    # Initial LLM call

    response = await llm_with_tools.ainvoke(messages)

    # Tool-calling loop

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

        # Send tool results back to the model

        response = await llm_with_tools.ainvoke(messages)

    # Final response

    return response.content
