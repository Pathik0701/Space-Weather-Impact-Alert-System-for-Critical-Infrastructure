from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    app_name: str
    app_version: str

    noaa_base_url: str

    request_timeout: float
    cache_ttl: int

    cors_origins: str = "http://localhost:5173"

    server_host: str
    server_port: int
    server_reload: bool

    # Environment
    environment: str = "development"

    # Local Ollama
    ai_model: str = "llama3.2"

    # Ollama Cloud / MiniMax
    minimax_api_key: str | None = None
    minimax_model: str = "minimax-m2"
    ollama_cloud_url: str = "https://ollama.com"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip() for origin in self.cors_origins.split(",") if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
