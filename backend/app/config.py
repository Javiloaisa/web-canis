from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = (
        "postgresql+asyncpg://canis:canis@localhost:5432/canis"
    )
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:5174"]

    admin_username: str = "admin"
    # Hash de desarrollo para la contraseña "canis-admin-dev". Cambiar vía
    # variables de entorno (ADMIN_USERNAME / ADMIN_PASSWORD_HASH) en producción.
    admin_password_hash: str = (
        "$2b$12$1DTWKmIo1TlAOKkotRbN2OWd8fr2nQicGQKconyu5gDZTyY9KGiai"
    )
    jwt_secret: str = "dev-secret-cambia-esto-en-produccion"
    jwt_expire_minutes: int = 480


settings = Settings()
