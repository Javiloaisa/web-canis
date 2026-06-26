import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createApiClient, formatoISOLocal, FRANJAS, type FranjaDisponibilidad, type Reserva } from "shared";
import CalendarioDia from "./CalendarioDia";
import CalendarioFecha from "./CalendarioFecha";
import ConfirmarEliminar from "./ConfirmarEliminar";
import EditarReservaModal from "./EditarReservaModal";
import { IconoBuscar, IconoCalendario, IconoFlechaDer, IconoFlechaIzq } from "./Iconos";
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
    year: "numeric",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatoFechaCorta(fechaISO: string): string {
  return new Date(`${fechaISO}T00:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
  const [reservaEditar, setReservaEditar] = useState<Reserva | null>(null);
  const [reservaEliminar, setReservaEliminar] = useState<Reserva | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [soloPaellas, setSoloPaellas] = useState(false);
  const [mostrarCal, setMostrarCal] = useState(false);
  const navFechaRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!mostrarCal) return;
    function alClicarFuera(e: MouseEvent) {
      if (navFechaRef.current && !navFechaRef.current.contains(e.target as Node)) {
        setMostrarCal(false);
      }
    }
    function alPulsarEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMostrarCal(false);
    }
    document.addEventListener("mousedown", alClicarFuera);
    document.addEventListener("keydown", alPulsarEsc);
    return () => {
      document.removeEventListener("mousedown", alClicarFuera);
      document.removeEventListener("keydown", alPulsarEsc);
    };
  }, [mostrarCal]);

  async function toggleLlegada(reserva: Reserva) {
    try {
      await api.actualizarReserva(reserva.id, { ha_llegado: !reserva.ha_llegado });
      await cargar();
    } catch {
      setSesionExpirada(true);
    }
  }

  async function confirmarEliminar() {
    if (!reservaEliminar) return;
    await api.eliminarReserva(reservaEliminar.id);
    setReservaEliminar(null);
    cargar();
  }

  function cambiarDia(delta: number) {
    const d = new Date(`${fecha}T00:00:00`);
    d.setDate(d.getDate() + delta);
    setFecha(formatoISOLocal(d));
  }

  if (sesionExpirada) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f2ea] text-gray-900">
        <p>Tu sesión ha caducado.</p>
        <button onClick={onLogout} className="text-mediterraneo-600 underline">
          Volver a entrar
        </button>
      </div>
    );
  }

  const confirmadas = reservas.filter((r) => r.estado === "confirmada");
  const reservasConfirmadas = confirmadas.length;
  const comensales = confirmadas.reduce((suma, r) => suma + r.personas, 0);
  const paellasTotal = franjas.reduce((suma, f) => suma + f.con_paella, 0);

  const q = busqueda.trim().toLowerCase();
  const filtrando = q !== "" || soloPaellas;
  const reservasFiltradas = confirmadas.filter((r) => {
    if (soloPaellas && !r.quiere_paella) return false;
    if (q && !`${r.nombre} ${r.telefono}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#f5f2ea] text-[#1f2d37]">
      <Sidebar onLogout={onLogout} />

      <main className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-[#ece7dc] bg-white px-4 py-3 lg:hidden">
          <span className="font-display text-[22px] font-semibold italic text-mediterraneo-700">
            Cañís
          </span>
          <button onClick={onLogout} className="text-[13px] font-medium text-[#8a929b]">
            Cerrar sesión
          </button>
        </div>

        <div className="px-4 py-5 lg:px-[34px] lg:pb-12 lg:pt-[30px]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[28px] font-semibold tracking-[-0.3px] text-mediterraneo-700 sm:text-[34px]">
                Reservas
              </h1>
              <p className="mt-[7px] text-sm text-[#8a929b]">{formatoFechaLarga(fecha)}</p>
            </div>

            <div ref={navFechaRef} className="relative flex items-center gap-2">
              <button
                onClick={() => setFecha(hoyISO())}
                className="hidden h-11 items-center rounded-[12px] border border-mediterraneo-200 bg-white px-4 text-sm font-semibold text-mediterraneo-700 transition hover:bg-mediterraneo-50 sm:inline-flex"
              >
                Hoy
              </button>
              <div className="flex items-center overflow-hidden rounded-[12px] border border-mediterraneo-200 bg-white shadow-sm">
                <button
                  onClick={() => cambiarDia(-1)}
                  className="flex h-11 w-11 items-center justify-center border-r border-mediterraneo-100 text-mediterraneo-600 transition hover:bg-mediterraneo-50"
                  aria-label="Día anterior"
                >
                  <IconoFlechaIzq className="h-[18px] w-[18px]" />
                </button>
                <button
                  onClick={() => setMostrarCal((v) => !v)}
                  aria-label="Elegir fecha"
                  className="flex h-11 items-center gap-2 px-4 text-[15px] font-bold text-mediterraneo-700 transition hover:bg-mediterraneo-50"
                >
                  <IconoCalendario className="h-[18px] w-[18px] text-mediterraneo-600" />
                  {formatoFechaCorta(fecha)}
                </button>
                <button
                  onClick={() => cambiarDia(1)}
                  className="flex h-11 w-11 items-center justify-center border-l border-mediterraneo-100 text-mediterraneo-600 transition hover:bg-mediterraneo-50"
                  aria-label="Día siguiente"
                >
                  <IconoFlechaDer className="h-[18px] w-[18px]" />
                </button>
              </div>

              {mostrarCal && (
                <CalendarioFecha
                  value={fecha}
                  onSelect={(iso) => {
                    setFecha(iso);
                    setMostrarCal(false);
                  }}
                />
              )}
            </div>
          </div>

          <div className="mb-[18px] grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-[14px]">
            <StatCard
              etiqueta="Reservas confirmadas"
              valor={reservasConfirmadas}
              sublabel="en los 8 turnos de hoy"
            />
            <StatCard etiqueta="Comensales" valor={comensales} sublabel="personas en sala" />
            <StatCard
              etiqueta="Paellas reservadas"
              valor={paellasTotal}
              sublabel="máx. 7 por turno"
              variante="destacado"
            />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3ad]">
                <IconoBuscar />
              </span>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o teléfono"
                className="w-full rounded-[10px] border border-[#e3ddd0] bg-white py-2.5 pl-10 pr-3 text-sm text-[#22323d] placeholder:text-[#b6bcc3] transition focus:border-mediterraneo-400 focus:outline-none focus:ring-2 focus:ring-mediterraneo-200"
              />
            </div>
            <button
              onClick={() => setSoloPaellas((v) => !v)}
              aria-pressed={soloPaellas}
              className={`flex items-center gap-2 rounded-[10px] border px-3.5 py-2.5 text-sm font-semibold transition ${
                soloPaellas
                  ? "border-socarrat-300 bg-socarrat-50 text-socarrat-600"
                  : "border-[#e3ddd0] bg-white text-[#6b7682] hover:bg-[#f5f3ee]"
              }`}
            >
              Solo paellas
            </button>
          </div>

          {cargando ? (
            <p className="text-[#8a929b]">Cargando...</p>
          ) : reservasConfirmadas === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d6d0c2] bg-white/60 px-6 py-16 text-center">
              <p className="font-display text-[22px] font-semibold text-mediterraneo-700">
                Sin reservas todavía
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[#8a929b]">
                No hay ninguna reserva para este día. Crea la primera o espera a que entren desde la
                web o el teléfono.
              </p>
              <button
                onClick={() => setFranjaModal(FRANJAS[0])}
                className="mt-5 inline-flex rounded-[10px] bg-mediterraneo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-mediterraneo-700"
              >
                Crear primera reserva
              </button>
            </div>
          ) : filtrando && reservasFiltradas.length === 0 ? (
            <div className="rounded-2xl border border-[#ece7dc] bg-white px-6 py-14 text-center text-sm text-[#8a929b]">
              No hay reservas que coincidan con la búsqueda.
            </div>
          ) : (
            <CalendarioDia
              franjas={franjas}
              reservas={reservasFiltradas}
              filtrando={filtrando}
              onToggleLlegada={toggleLlegada}
              onEditar={setReservaEditar}
              onEliminar={setReservaEliminar}
              onNuevaEnFranja={setFranjaModal}
            />
          )}
        </div>
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

      {reservaEditar && (
        <EditarReservaModal
          api={api}
          reserva={reservaEditar}
          onCerrar={() => setReservaEditar(null)}
          onGuardada={cargar}
        />
      )}

      {reservaEliminar && (
        <ConfirmarEliminar
          reserva={reservaEliminar}
          onConfirmar={confirmarEliminar}
          onCerrar={() => setReservaEliminar(null)}
        />
      )}
    </div>
  );
}
