from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth import crear_token, verificar_password
from app.config import settings

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/auth/login", response_model=TokenResponse)
async def login(data: LoginRequest) -> TokenResponse:
    credenciales_validas = data.username == settings.admin_username and verificar_password(
        data.password, settings.admin_password_hash
    )
    if not credenciales_validas:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return TokenResponse(access_token=crear_token(data.username))
