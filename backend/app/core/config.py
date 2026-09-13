from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database — use Supabase direct connection URL in production
    DATABASE_URL: str = "postgresql://conceptiq:conceptiq_password@localhost:5432/conceptiq_db"

    # JWT
    SECRET_KEY: str = "changeme-use-a-long-random-string-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # AI (NVIDIA NIM)
    NVIDIA_API_KEY: str = ""

    # CORS — comma-separated list of allowed frontend origins
    # Local: http://localhost:5173
    # Production: https://your-app.vercel.app
    FRONTEND_URLS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    @property
    def allowed_origins(self) -> list[str]:
        return [url.strip() for url in self.FRONTEND_URLS.split(",") if url.strip()]

    class Config:
        env_file = "backend/.env"
        case_sensitive = True


settings = Settings()
