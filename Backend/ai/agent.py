from langchain_ollama import ChatOllama

from ai.tools import (
    get_current_space_weather,
    get_infrastructure_risk,
    get_active_noaa_alerts,
)

llm = ChatOllama(
    model="minimax-m3:cloud",
    temperature=0,
)

tools = [
    get_current_space_weather,
    get_infrastructure_risk,
    get_active_noaa_alerts,
]

llm_with_tools = llm.bind_tools(tools)
