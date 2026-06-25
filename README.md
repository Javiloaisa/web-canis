# Restaurante Cañís — sistema de reservas

Monorepo: `backend/` (FastAPI + PostgreSQL) y `frontend/` (web pública + panel de
administración, pnpm workspace).

## Backend — arrancar en local

Requiere Docker (para Postgres) y Python 3.11+.

```bash
docker compose up -d db
cd backend
python -m venv .venv && source .venv/Scripts/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Tests (usan automáticamente una base de datos separada, `canis_test`, para no
tocar nunca los datos de desarrollo — ver `tests/conftest.py`):

```bash
cd backend
pytest
```

`pytest` incluye los tests de concurrencia que comprueban que nunca se cuela una
8ª paella ni una 11ª mesa cuando llegan dos reservas a la vez.

### Login del panel (desarrollo)

- Usuario: `admin`
- Contraseña: `canis-admin-dev`

Cambiar en producción vía las variables de entorno `ADMIN_USERNAME` y
`ADMIN_PASSWORD_HASH` (hash bcrypt — generar con
`python -c "import bcrypt; print(bcrypt.hashpw(b'tu-password', bcrypt.gensalt()).decode())"`)
y `JWT_SECRET`.

## Frontend — arrancar en local

Requiere Node y pnpm.

```bash
cd frontend
pnpm install
pnpm dev:web     # http://localhost:5173 — web pública
pnpm dev:panel   # http://localhost:5174 — panel de administración
```

Cada app necesita `VITE_API_URL` apuntando al backend (ver `.env.example` en
`apps/web` y `apps/panel`; por defecto usa `http://localhost:8000`).

Verificación:

```bash
pnpm typecheck && pnpm test && pnpm build
```
