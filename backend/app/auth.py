import datetime as dt
from typing import Annotated

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.config import settings

ALGORITHM = "HS256"
bearer_scheme = HTTPBearer(auto_error=False)


def verificar_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def crear_token(username: str) -> str:
    expira = dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=settings.jwt_expire_minutes)
    return jwt.encode({"sub": username, "exp": expira}, settings.jwt_secret, algorithm=ALGORITHM)


async def get_admin_actual(
    credenciales: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> str:
    error_auth = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No autorizado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credenciales is None:
        raise error_auth
    try:
        payload = jwt.decode(credenciales.credentials, settings.jwt_secret, algorithms=[ALGORITHM])
    except JWTError:
        raise error_auth

    username = payload.get("sub")
    if username != settings.admin_username:
        raise error_auth
    return username
