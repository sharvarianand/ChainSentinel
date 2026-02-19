from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "ChainSentinel"
    version: str = "1.0.0"
    
    db_password: str = "chainsentinel_secure_2026"
    database_url: str = "postgresql://cs_user:chainsentinel_secure_2026@localhost:5432/chainsentinel"
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
    cors_origins: list[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
