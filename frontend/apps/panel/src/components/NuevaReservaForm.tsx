import { useState, type FormEvent } from "react";
import { FRANJAS, type ApiClient } from "shared";

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
      setNombre("");
      setTelefono("");
      setPersonas(2);
      setQuierePaella(false);
      onCreada();
    } catch {
      setError("No se ha podido crear la reserva (sin cupo en esa franja)");
    } finally {
      setEnviando(false);
    }
  }

  const campo =
    "px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mediterraneo-400 focus:border-mediterraneo-400";

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-6 gap-3 items-end">
      <select value={franja} onChange={(e) => setFranja(e.target.value)} className={campo}>
        {FRANJAS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className={campo}
        required
      />
      <input
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className={campo}
        required
      />
      <input
        type="number"
        min={1}
        placeholder="Personas"
        value={personas}
        onChange={(e) => setPersonas(Number(e.target.value))}
        className={campo}
      />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={quierePaella}
          onChange={(e) => setQuierePaella(e.target.checked)}
          className="accent-mediterraneo-600"
        />
        Paella
      </label>
      <button
        disabled={enviando}
        className="bg-mediterraneo-600 text-white font-semibold py-2 rounded-lg hover:bg-mediterraneo-700 transition disabled:opacity-50"
      >
        {enviando ? "Creando..." : "Crear reserva"}
      </button>
      {error && <p className="col-span-full text-red-600 text-sm">{error}</p>}
    </form>
  );
}
