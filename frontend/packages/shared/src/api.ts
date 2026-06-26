import type {
  FranjaDisponibilidad,
  LoginRequest,
  Reserva,
  ReservaCreate,
  ReservaUpdate,
  TokenResponse,
} from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public motivo?: "mesas" | "paellas",
  ) {
    super(message);
  }
}

async function manejarRespuesta<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const cuerpo = await response.json().catch(() => null);
    const motivo = cuerpo?.detail?.motivo as "mesas" | "paellas" | undefined;
    throw new ApiError(cuerpo?.detail ?? response.statusText, response.status, motivo);
  }
  return response.json() as Promise<T>;
}

export function createApiClient(baseUrl: string, token?: string | null) {
  const cabecerasAuth: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  return {
    async login(data: LoginRequest): Promise<TokenResponse> {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return manejarRespuesta(response);
    },

    async getDisponibilidad(fecha: string): Promise<FranjaDisponibilidad[]> {
      const response = await fetch(`${baseUrl}/disponibilidad?fecha=${fecha}`);
      return manejarRespuesta(response);
    },

    async crearReserva(data: ReservaCreate): Promise<Reserva> {
      const response = await fetch(`${baseUrl}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return manejarRespuesta(response);
    },

    async getReservas(fecha: string): Promise<Reserva[]> {
      const response = await fetch(`${baseUrl}/reservas?fecha=${fecha}`, {
        headers: cabecerasAuth,
      });
      return manejarRespuesta(response);
    },

    async actualizarReserva(id: number, data: ReservaUpdate): Promise<Reserva> {
      const response = await fetch(`${baseUrl}/reservas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...cabecerasAuth },
        body: JSON.stringify(data),
      });
      return manejarRespuesta(response);
    },

    async eliminarReserva(id: number): Promise<void> {
      const response = await fetch(`${baseUrl}/reservas/${id}`, {
        method: "DELETE",
        headers: cabecerasAuth,
      });
      if (!response.ok) {
        const cuerpo = await response.json().catch(() => null);
        throw new ApiError(cuerpo?.detail ?? response.statusText, response.status);
      }
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
