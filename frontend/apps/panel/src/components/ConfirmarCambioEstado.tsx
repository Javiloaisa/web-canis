import type { Reserva } from "shared";

interface Props {
  reserva: Reserva;
  onConfirmar: () => void;
  onCerrar: () => void;
}

export default function ConfirmarCambioEstado({ reserva, onConfirmar, onCerrar }: Props) {
  const vaACancelar = reserva.estado === "confirmada";

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-40 p-4"
      onClick={onCerrar}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-lg text-gray-900 mb-1">
          {vaACancelar ? "¿Cancelar esta reserva?" : "¿Confirmar esta reserva?"}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {reserva.nombre} · {reserva.franja.slice(0, 5)} · {reserva.personas}p
          {reserva.quiere_paella ? " · paella" : ""}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCerrar}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Volver
          </button>
          <button
            onClick={onConfirmar}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              vaACancelar ? "bg-red-600 hover:bg-red-700" : "bg-mediterraneo-600 hover:bg-mediterraneo-700"
            }`}
          >
            {vaACancelar ? "Sí, cancelar" : "Sí, confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
