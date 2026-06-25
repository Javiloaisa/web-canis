import { useCallback, useEffect, useMemo, useState } from "react";
import { createApiClient, formatoISOLocal, type FranjaDisponibilidad, type Reserva } from "shared";
import CalendarioDia from "./CalendarioDia";
import ConfirmarCambioEstado from "./ConfirmarCambioEstado";
import { IconoFlechaDer, IconoFlechaIzq } from "./Iconos";
import ModalNuevaReserva from "./ModalNuevaReserva";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";

interface Props {
  token: string;
  onLogout: () => void;
}

function hoyISO(): string {
  return formatoISOLocal(new Date());
}

function formatoFechaLarga(fechaISO: string): string {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const texto = fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function Dashboard({ token, onLogout }: Props) {
  const api = useMemo(
    () => createApiClient(import.meta.env.VITE_API_URL ?? "http://localhost:8000", token),
    [token],
  );

  const [fecha, setFecha] = useState(hoyISO());
  const [franjas, setFranjas] = useState<FranjaDisponibilidad[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(false);
  const [sesionExpirada, setSesionExpirada] = useState(false);
  const [franjaModal, setFranjaModal] = useState<string | null>(null);
  const [reservaPendiente, setReservaPendiente] = useState<Reserva | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [disponibilidad, listado] = await Promise.all([
        api.getDisponibilidad(fecha),
        api.getReservas(fecha),
      ]);
      setFranjas(disponibilidad);
      setReservas(listado);
    } catch {
      setSesionExpirada(true);
    } finally {
      setCargando(false);
    }
  }, [api, fecha]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function confirmarCambioEstado() {
    if (!reservaPendiente) return;
    const nuevoEstado = reservaPendiente.estado === "confirmada" ? "cancelada" : "confirmada";
    await api.actualizarReserva(reservaPendiente.id, { estado: nuevoEstado });
    setReservaPendiente(null);
    cargar();
  }

  function cambiarDia(delta: number) {
    const d = new Date(`${fecha}T00:00:00`);
    d.setDate(d.getDate() + delta);
    setFecha(formatoISOLocal(d));
  }

  if (sesionExpirada) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-gray-900">
        <p>Tu sesión ha caducado.</p>
        <button onClick={onLogout} className="text-mediterraneo-600 underline">
          Volver a entrar
        </button>
      </div>
    );
  }

  const reservasConfirmadas = reservas.filter((r) => r.estado === "confirmada").length;
  const reservasCanceladas = reservas.filter((r) => r.estado === "cancelada").length;
  const paellasTotal = franjas.reduce((suma, f) => suma + f.con_paella, 0);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar onLogout={onLogout} />

      <main className="flex-1 px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reservas</h1>
            <p className="text-sm text-gray-500">{formatoFechaLarga(fecha)}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => cambiarDia(-1)}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 transition"
              aria-label="Día anterior"
            >
              <IconoFlechaIzq />
            </button>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700"
            />
            <button
              onClick={() => cambiarDia(1)}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 transition"
              aria-label="Día siguiente"
            >
              <IconoFlechaDer />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <StatCard etiqueta="Reservas confirmadas" valor={reservasConfirmadas} />
          <StatCard etiqueta="Paellas reservadas" valor={`${paellasTotal}/7 por turno`} acento="text-amber-600" />
          <StatCard etiqueta="Canceladas" valor={reservasCanceladas} acento="text-gray-400" />
        </div>

        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <CalendarioDia
            franjas={franjas}
            reservas={reservas}
            onPedirCambioEstado={setReservaPendiente}
            onNuevaEnFranja={setFranjaModal}
          />
        )}
      </main>

      {franjaModal && (
        <ModalNuevaReserva
          api={api}
          fecha={fecha}
          franja={franjaModal}
          onCerrar={() => setFranjaModal(null)}
          onCreada={cargar}
        />
      )}

      {reservaPendiente && (
        <ConfirmarCambioEstado
          reserva={reservaPendiente}
          onConfirmar={confirmarCambioEstado}
          onCerrar={() => setReservaPendiente(null)}
        />
      )}
    </div>
  );
}
