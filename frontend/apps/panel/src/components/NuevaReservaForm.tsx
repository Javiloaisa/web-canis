import { useState, type FormEvent } from "react";
import { FRANJAS, type ApiClient } from "shared";
import CamposReserva from "./CamposReserva";

interface Props {
  api: ApiClient;
  fecha: string;
  franjaInicial?: string;
  onCreada: () => void;
}

export default function NuevaReservaForm({ api, fecha, franjaInicial, onCreada }: Props) {
  const [franja, setFranja] = useState<string>(franjaInicial ?? FRANJAS[0]);
  const [quierePaella, setQuierePaella] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [personas, setPersonas] = useState(2);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await api.crearReserva({
        fecha,
        franja,
        quiere_paella: quierePaella,
        nombre,
        telefono,
        personas,
        origen: "panel",
      });
      onCreada();
    } catch {
      setError("No se ha podido crear la reserva (sin cupo en esa franja).");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CamposReserva
        idPrefix="nr"
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
        {enviando ? "Creando..." : "Crear reserva"}
      </button>
    </form>
  );
}
