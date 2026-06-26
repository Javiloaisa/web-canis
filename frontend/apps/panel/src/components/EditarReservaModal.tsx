import { useState, type FormEvent } from "react";
import { ApiError, type ApiClient, type Reserva } from "shared";
import CamposReserva from "./CamposReserva";

interface Props {
  api: ApiClient;
  reserva: Reserva;
  onCerrar: () => void;
  onGuardada: () => void;
}

export default function EditarReservaModal({ api, reserva, onCerrar, onGuardada }: Props) {
  const [franja, setFranja] = useState(reserva.franja.slice(0, 5));
  const [quierePaella, setQuierePaella] = useState(reserva.quiere_paella);
  const [nombre, setNombre] = useState(reserva.nombre);
  const [telefono, setTelefono] = useState(reserva.telefono);
  const [personas, setPersonas] = useState(reserva.personas);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await api.actualizarReserva(reserva.id, {
        franja,
        quiere_paella: quierePaella,
        nombre,
        telefono,
        personas,
      });
      onGuardada();
      onCerrar();
    } catch (err) {
      if (err instanceof ApiError && err.motivo === "paellas") {
        setError("Ese turno ya tiene las 7 paellas. Prueba sin paella u otro turno.");
      } else if (err instanceof ApiError && err.motivo === "mesas") {
        setError("Ese turno está completo (10 mesas). Prueba otro turno.");
      } else {
        setError("No se ha podido guardar la reserva.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[#1f2d37]/40 p-4"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="font-display text-[22px] font-semibold text-mediterraneo-700">
              Editar reserva
            </h3>
            <p className="mt-1 text-[13px] text-[#8a929b]">{reserva.nombre}</p>
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="-mr-1 -mt-1 flex h-9 w-9 items-center justify-center rounded-lg text-[#b6bcc3] transition hover:bg-[#f5f3ee] hover:text-[#5a626b]"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CamposReserva
            idPrefix="ed"
            franja={franja}
            setFranja={setFranja}
            personas={personas}
            setPersonas={setPersonas}
            nombre={nombre}
            setNombre={setNombre}
            telefono={telefono}
            setTelefono={setTelefono}
            quierePaella={quierePaella}
            setQuierePaella={setQuierePaella}
          />

          {error && <p className="text-sm text-[#c0392b]">{error}</p>}

          <button
            disabled={enviando}
            className="w-full rounded-[10px] bg-mediterraneo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-mediterraneo-700 disabled:opacity-50"
          >
            {enviando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
