from typing import Annotated, Any, Literal, Union

from dotenv import load_dotenv
from pydantic import (
    AnyUrl,
    BeforeValidator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv(override=True)


def parse_cors(v: Any) -> Union[list[str], str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list or str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )
    OPENAI_API_KEY: str = ""
    API_V1_STR: str = "/api/v1"
    DOMAIN: str = "localhost"
    BASE_PATH: str = ".conan"
    LOG_LEVEL: str = "DEBUG"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    BACKEND_CORS_ORIGINS: Annotated[
        Union[list[AnyUrl], str], BeforeValidator(parse_cors)
    ] = []

    PROJECT_NAME: str = "conan"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "conan"

    CHROMA_HOST_ADDR: str = "chroma"
    CHROMA_HOST_PORT: int = 8080

    TWITTER_TOKEN: str = ""

    COLLECTION_NAME: str = "documents"
    CHUNK_SIZE: int = 250
    CHUNK_OVERLAP: int = 16

    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8000"

    def get_db_url(self) -> str:
        url = f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        print(f"db_url: {url}")
        return url


settings = Settings()  # type: ignore
