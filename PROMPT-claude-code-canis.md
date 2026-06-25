# Proyecto: Web + panel de reservas para Restaurante Cañís

## Contexto

Quiero construir el sistema completo de reservas para **Restaurante Cañís**, un
restaurante de cocina valenciana (paella a leña) en Benissa, Alicante. El sistema
tiene tres piezas que comparten una sola base de datos y una sola API, de modo que
todo se sincroniza automáticamente:

1. **Web pública** — visual, con fotos del local, carta y formulario de reservas.
2. **Panel de administración** — el restaurante gestiona las reservas del día.
3. **Bot de llamadas** (fase posterior, opcional) — atiende el teléfono y reserva
   contra el mismo backend.

Trabajo con este stack habitualmente, mantenlo salvo que haya buena razón para cambiarlo:
- Backend: **FastAPI + PostgreSQL** (SQLAlchemy + Alembic para migraciones).
- Frontend web y panel: **React + Vite + TypeScript + Tailwind**.
- Despliegue: **Docker Compose + Caddy** sobre un VPS de Hetzner.

## REGLA DE NEGOCIO CRÍTICA (esto es lo más importante del proyecto)

El restaurante tiene **10 mesas**. Solo se pueden servir **7 paellas a la vez por turno**
(limitación de paelleros/fuego), sin importar en qué mesa.

Por cada franja horaria hay DOS límites simultáneos:
- Máximo **10 mesas** ocupadas en total.
- Máximo **7 reservas con paella**.

Una reserva con paella consume 1 de las 7 Y 1 de las 10.
Una reserva sin paella consume solo 1 de las 10.

Ejemplo del caso máximo válido: 7 mesas con paella + 3 sin paella = 10 mesas llenas.
Nunca puede haber una 8ª paella, aunque queden mesas libres.

Por eso, en el flujo de reserva hay que preguntar SI QUIERE PAELLA **antes** de
mostrar los turnos disponibles: es lo que determina contra qué cupo se valida.

### Detalles confirmados del modelo
- Son **7 paellas en total** (un cupo), no 7 mesas concretas. No importa qué mesa.
- Son **mesas, no personas**: una reserva = una mesa, da igual cuántos comensales.
- Cada reserva ocupa **solo su franja de 30 minutos**. NO bloquea las franjas siguientes.
- Franjas horarias (cenas): 19:00, 19:30, 20:00, 20:30, 21:00, 21:30, 22:00, 22:30.

## Modelo de datos (punto de partida)

```sql
CREATE TABLE reservas (
    id              SERIAL PRIMARY KEY,
    fecha           DATE NOT NULL,
    franja          TIME NOT NULL,
    quiere_paella   BOOLEAN NOT NULL,
    nombre          TEXT NOT NULL,
    telefono        TEXT NOT NULL,
    personas        INTEGER NOT NULL,
    estado          TEXT NOT NULL DEFAULT 'confirmada',  -- confirmada | cancelada
    origen          TEXT NOT NULL,                       -- web | bot | panel
    creada_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservas_disp ON reservas (fecha, franja) WHERE estado = 'confirmada';
```

Constantes en el backend (no en BD):
```python
FRANJAS = ["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"]
LIMITE_TOTAL  = 10
LIMITE_PAELLA = 7
```

## Lógica de disponibilidad y validación atómica

La creación de reserva DEBE ser atómica con bloqueo de fila (`SELECT ... FOR UPDATE`
dentro de una transacción) para evitar overbooking cuando entran dos reservas a la vez
(p. ej. una por la web y otra por el bot en el mismo segundo). Sin esto, el día que se
llene de verdad se colaría una 8ª paella.

Endpoints mínimos del backend:
- `GET  /disponibilidad?fecha=YYYY-MM-DD` → para cada franja devuelve:
  ocupadas, con_paella, libres_total, puede_paella (bool), puede_sin_paella (bool).
- `POST /reservas` → crea reserva con la validación atómica descrita. Devuelve 409 si
  no hay cupo (distinguiendo "sin mesas" de "sin paellas").
- `GET  /reservas?fecha=YYYY-MM-DD` → listado para el panel.
- `PATCH /reservas/{id}` → cambiar estado (confirmar/cancelar).

Lógica de disponibilidad por franja (referencia):
```python
ocupadas   = con_paella + sin_paella
puede_paella     = con_paella < LIMITE_PAELLA and ocupadas < LIMITE_TOTAL
puede_sin_paella = ocupadas < LIMITE_TOTAL
```

## Web pública (muy visual)

- Hero a pantalla con foto del local / paella y CTA "Reservar mesa".
- Galería de fotos del restaurante y los arroces.
- Carta (puede ser estática al principio; estructúrala para mover a CMS después).
- Formulario de reservas con el flujo EN ESTE ORDEN:
  1. Fecha
  2. ¿Paella sí / no?  (obligatorio antes de seguir)
  3. Turno — mostrar solo las franjas disponibles según el paso 2, consultando
     `GET /disponibilidad`. Si pide paella, una franja con 7 paellas ya servidas
     debe aparecer como no disponible para paella aunque queden mesas.
  4. Datos de contacto (nombre, teléfono, nº de personas) y confirmar.
- Identidad visual: cocina valenciana sin caer en tópicos. Azul mediterráneo
  profundo + dorado "socarrat" como acento. El cupo de 7 paellas como argumento
  ("reserva la tuya"), no como limitación.
- Bilingüe castellano / valencià (importante en Benissa). Prepara i18n desde el inicio.

## Panel de administración

- Vista del día con todas las reservas por franja.
- Contador visible por franja: X/10 mesas, Y/7 paellas.
- Confirmar / cancelar reservas; crear reserva manual (origen = panel).
- Acceso protegido (auth sencilla está bien para empezar).

## Fase 4 — Bot de llamadas (OPCIONAL, no empezar hasta que web + panel funcionen)

Bot de voz que atiende llamadas, pregunta lo mismo (fecha → paella → turno) y reserva
contra el MISMO backend. Piezas: telefonía (Twilio o similar) + STT/TTS + agente con
Anthropic API y tool use que llama a los endpoints de disponibilidad y reserva.
Plantear híbrido: si la reserva es sencilla la cierra el bot; si se complica, toma
datos y avisa al restaurante. NO implementar todavía — solo dejar el backend preparado
para que un cuarto cliente (el bot) consuma los mismos endpoints.

## Cómo quiero trabajar

- Empieza por el backend: modelo, migración Alembic, endpoints, y **tests de la
  validación atómica** (incluido el caso de carrera de la 8ª paella).
- Disciplina de Git: una rama por feature, `pnpm typecheck && pnpm test` antes de
  mergear.
- Estructura de monorepo: `/backend` (FastAPI) y `/frontend` (web + panel), o como
  recomiendes; propónmelo antes de generar todo.
- Antes de escribir código masivo, enséñame la estructura de carpetas y el plan de
  fases para validarlo.

Empieza proponiendo la estructura del proyecto y el plan, y luego arranca por el
backend con el modelo de datos y la lógica de disponibilidad.
