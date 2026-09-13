from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://conceptiq:conceptiq_password@localhost:5432/conceptiq_db"
    SECRET_KEY: str = "changeme-use-a-long-random-string-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    NVIDIA_API_KEY: str = ""

    class Config:
        env_file = "backend/.env"
        case_sensitive = True


settings = Settings()
