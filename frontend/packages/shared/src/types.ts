export type Origen = "web" | "bot" | "panel";
export type Estado = "confirmada" | "cancelada";

export interface FranjaDisponibilidad {
  franja: string;
  ocupadas: number;
  con_paella: number;
  libres_total: number;
  puede_paella: boolean;
  puede_sin_paella: boolean;
}

export interface ReservaCreate {
  fecha: string;
  franja: string;
  quiere_paella: boolean;
  nombre: string;
  telefono: string;
  personas: number;
  origen: Origen;
}

export interface ReservaUpdate {
  franja?: string;
  quiere_paella?: boolean;
  nombre?: string;
  telefono?: string;
  personas?: number;
  ha_llegado?: boolean;
}

export interface Reserva {
  id: number;
  fecha: string;
  franja: string;
  quiere_paella: boolean;
  nombre: string;
  telefono: string;
  personas: number;
  estado: Estado;
  origen: Origen;
  ha_llegado: boolean;
  creada_en: string;
}

export interface ErrorCupo {
  detail: { motivo: "mesas" | "paellas" };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
