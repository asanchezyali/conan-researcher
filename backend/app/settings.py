import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

settings = {}

settings["BASE_PATH"] = Path(os.path.expanduser("~")) / (
    os.getenv("BASE_PATH") or ".conan"
)

settings["LOG_LEVEL"] = os.getenv("LOG_LEVEL") or "INFO"

settings["CHROMA_HOST_ADDR"] = os.getenv("CHROMA_HOST_ADDR") or "localhost"
settings["CHROMA_HOST_PORT"] = os.getenv("CHROMA_HOST_PORT") or "8080"
