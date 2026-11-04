# ============================================================
# AgriSense AI Service — Configuration
# ============================================================

from pydantic_settings import BaseSettings
from pathlib import Path
from typing import Literal

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # API Keys
    gemini_api_key: str = ""
    openai_api_key: str = ""

    # Kaggle
    kaggle_username: str = ""
    kaggle_key: str = ""

    # Database
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "agrisense"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "agrisense"
    postgres_password: str = ""
    postgres_db: str = "agrisense"

    # ChromaDB
    chroma_persist_dir: str = str(BASE_DIR / "chroma_db")
    chroma_collection_market: str = "agrisense_market_docs"
    chroma_collection_agri: str = "agrisense_agri_knowledge"

    # Service
    ai_service_host: str = "0.0.0.0"
    ai_service_port: int = 8000
    log_level: str = "INFO"
    environment: str = "development"

    # Backend communication
    nestjs_backend_url: str = "http://localhost:3000"
    nestjs_internal_api_key: str = ""

    # Paths
    model_artifacts_dir: str = str(BASE_DIR / "artifacts")
    data_dir: str = str(BASE_DIR / "data")

    # LLM
    llm_provider: Literal["gemini", "openai"] = "gemini"
    llm_model_gemini: str = "gemini-1.5-flash"
    llm_model_openai: str = "gpt-4o-mini"

    # Feature flags
    enable_price_forecasting: bool = True
    enable_disease_detection: bool = True
    enable_rag: bool = True
    enable_llm_explanations: bool = True
    enable_external_llms: bool = False

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        case_sensitive = False


settings = Settings()

