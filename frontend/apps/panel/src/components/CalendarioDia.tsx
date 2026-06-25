import type { FranjaDisponibilidad, Reserva } from "shared";
import { IconoCheck, IconoX } from "./Iconos";

interface Props {
  franjas: FranjaDisponibilidad[];
  reservas: Reserva[];
  onPedirCambioEstado: (reserva: Reserva) => void;
  onNuevaEnFranja: (franja: string) => void;
}

export default function CalendarioDia({
  franjas,
  reservas,
  onPedirCambioEstado,
  onNuevaEnFranja,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {franjas.map((f) => {
        const reservasFranja = reservas.filter((r) => r.franja.slice(0, 5) === f.franja);

        return (
          <div key={f.franja} className="flex border-b border-gray-100 last:border-b-0">
            <div className="w-32 shrink-0 px-5 py-4 border-r border-gray-100 bg-gray-50/60">
              <p className="text-base font-semibold text-gray-900">{f.franja}</p>
              <p className="text-xs text-gray-500 mt-1">{f.ocupadas}/10 mesas</p>
              <p className="text-xs text-gray-500">{f.con_paella}/7 paellas</p>
            </div>

            <div className="flex-1 flex flex-wrap gap-2 p-4 items-start content-start">
              {reservasFranja.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-2 pl-3 pr-1 py-2 rounded-lg border text-sm transition ${
                    r.estado === "cancelada"
                      ? "border-gray-200 bg-gray-50 text-gray-400"
                      : r.quiere_paella
                        ? "border-amber-300 bg-amber-50 text-amber-900"
                        : "border-sky-300 bg-sky-50 text-sky-900"
                  }`}
                >
                  <span className={r.estado === "cancelada" ? "line-through" : ""}>
                    <span className="font-medium">{r.nombre}</span>
                    <span className="opacity-70">
                      {" "}
                      · {r.personas}p{r.quiere_paella ? " · paella" : ""}
                    </span>
                  </span>
                  <button
                    onClick={() => onPedirCambioEstado(r)}
                    title={r.estado === "confirmada" ? "Cancelar reserva" : "Confirmar reserva"}
                    className={`p-1.5 rounded-full transition ${
                      r.estado === "confirmada"
                        ? "hover:bg-red-100 hover:text-red-600"
                        : "hover:bg-green-100 hover:text-green-600"
                    }`}
                  >
                    {r.estado === "confirmada" ? <IconoX /> : <IconoCheck />}
                  </button>
                </div>
              ))}

              <button
                onClick={() => onNuevaEnFranja(f.franja)}
                className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-mediterraneo-400 hover:text-mediterraneo-600 text-sm transition"
              >
                + Nueva
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
