from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_name: str = "TransitOps API"
    app_version: str = "0.1.0"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
