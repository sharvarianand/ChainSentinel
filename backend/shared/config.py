from pydantic_settings import BaseSettings
from functools import lru_cache
import os


def _find_env_file() -> str:
    """Search for .env file in backend/, project root, or frontend/.env.local"""
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend/
    candidates = [
        os.path.join(here, ".env"),
        os.path.join(os.path.dirname(here), ".env"),
        os.path.join(os.path.dirname(here), "frontend", ".env.local"),
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    return ".env"  # fallback (won't exist, but that's fine)


# Build an absolute SQLite path so it works regardless of cwd
_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_default_sqlite = f"sqlite+aiosqlite:///{os.path.join(_backend_dir, 'chainsentinel.db')}"


class Settings(BaseSettings):
    app_name: str = "ChainSentinel"
    version: str = "1.0.0"

    db_password: str = "chainsentinel_secure_2026"
    database_url: str = _default_sqlite
    neo4j_password: str = "chainsentinel_neo4j"
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"

    redis_url: str = "redis://localhost:6379"

    gemini_api_key: str = ""

    jwt_secret: str = "chainsentinel_jwt_secret_2026"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60

    next_public_api_url: str = "http://localhost:8000"
    next_public_ws_url: str = "ws://localhost:8000/ws/live"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    class Config:
        env_file = _find_env_file()
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
