# Siguientes pasos — Restaurante Cañís

> Hoja de ruta para retomar el proyecto. Última actualización: 26 jun 2026.

## Estado actual

- **Backend** (FastAPI + PostgreSQL): reservas con validación atómica de cupo
  (10 mesas / 7 paellas), auth del panel, campo `ha_llegado`, editar y borrar
  reservas. En local corre sobre **SQLite** (esta máquina no tiene Docker).
- **Panel** (`frontend/apps/panel`): **rediseñado por completo** con la identidad
  Cañís. Incluye: marcar llegada del cliente con un clic (verde "En sala"),
  editar reserva, cancelar = borrar, buscar por nombre/teléfono, filtro "solo
  paellas", estado vacío, layout responsive, teléfono visible y clicable, paella
  resaltada (fondo dorado) y selector de día con calendario propio.
  Login: `admin` / `12345678`.
- **Web pública** (`frontend/apps/web`): **funcional** (flujo fecha → ¿paella? →
  turno → datos) pero con el **diseño original** y **fotos de relleno**. Sin tocar.
- **Despliegue**: no hecho. **Bot de teléfono**: no hecho (enfoque ya decidido,
  ver punto 5).

## Prioridades (en orden recomendado)

### 1. Web pública  ← empezar aquí (recomendado)
- Rediseño con la identidad Cañís (azul mediterráneo + dorado socarrat), al nivel
  del panel.
- Contenido real: fotos del local y los arroces, carta, horarios, ubicación +
  mapa, teléfono.
- Pulir el formulario de reservas con el mismo lenguaje visual.
- Mantener bilingüe castellano/valencià (i18n ya iniciado en
  `packages/shared/src/i18n`).
- Archivos: `frontend/apps/web/src/components/*` (Hero, Galeria, Carta,
  ReservaForm…), `frontend/apps/web/src/data/carta.ts`.

### 2. Confirmaciones y avisos
- Hoy una reserva solo se guarda en la BD: **nadie recibe nada**.
- Cliente: confirmación de su reserva. Restaurante: aviso de cada reserva nueva.
- Empezar por **email** (lo más simple, p. ej. Resend/SMTP); WhatsApp requiere API.
- Tocar el backend al crear reserva (`POST /reservas`) + plantillas.

### 3. Reglas de negocio
- No permitir reservar **fechas pasadas** (validar en backend y deshabilitar en el
  calendario del cliente).
- **Días de cierre** del restaurante (configurable).
- Antelación mínima/máxima (p. ej. no reservar para dentro de 5 min; máx. X días).
- Posible tope de personas por reserva.

### 4. Desplegar online
- Recomendado: **Render** (backend Docker + Postgres gestionado + las 2 webs como
  Static Sites) en un solo panel. Alternativa barata: **VPS Hetzner** + Docker
  Compose + Caddy.
- Pendiente: que el `Dockerfile` escuche en `$PORT`, crear `render.yaml`, definir
  variables de entorno (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_USERNAME`,
  `ADMIN_PASSWORD_HASH`, `CORS_ORIGINS`, `VITE_API_URL`), ejecutar
  `alembic upgrade head`, y resolver el detalle del monorepo pnpm (paquete
  `shared`) en el build de las webs.

### 5. Bot de teléfono (Fase 4)
- Entra **por desvío "si no contesta / comunica"** hacia un número en la nube,
  **sin portar el número** del restaurante. El bot es consciente de la hora
  (fuera de horario solo informa / toma recado).
- Piezas: telefonía (Twilio/Telnyx) → STT → Claude con *tool use* sobre
  `/disponibilidad` y `/reservas` → TTS, en castellano/valencià.
- Las reservas entran con origen `bot` (se ven como "Teléfono" en el panel).

## Notas técnicas del entorno local

- Sin Docker/Postgres → backend en SQLite vía `backend/.env`
  (`DATABASE_URL=sqlite+aiosqlite:///./canis_dev.db`). El advisory lock de Postgres
  está condicionado al dialecto, así que en SQLite se omite.
- ⚠️ `pytest` del backend necesita **Postgres** (`canis_test`, usa `TRUNCATE`): no
  corre en esta máquina. Verificar en un entorno con Postgres antes de desplegar.
- Arranque local:
  - Backend: `cd backend && .venv/Scripts/python.exe -m uvicorn app.main:app --port 8000`
  - Web pública: `pnpm dev:web` → http://localhost:5173
  - Panel: `pnpm dev:panel` → http://localhost:5174
- ⚠️ `12345678` es la contraseña por defecto (solo desarrollo). En producción
  usar una fuerte vía la variable `ADMIN_PASSWORD_HASH`.
