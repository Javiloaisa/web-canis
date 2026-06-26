import type { ApiClient } from "shared";
import NuevaReservaForm from "./NuevaReservaForm";

interface Props {
  api: ApiClient;
  fecha: string;
  franja: string;
  onCerrar: () => void;
  onCreada: () => void;
}

function fechaLegible(fechaISO: string): string {
  const texto = new Date(`${fechaISO}T00:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function ModalNuevaReserva({ api, fecha, franja, onCerrar, onCreada }: Props) {
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
              Nueva reserva
            </h3>
            <p className="mt-1 text-[13px] text-[#8a929b]">{fechaLegible(fecha)}</p>
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="-mr-1 -mt-1 flex h-9 w-9 items-center justify-center rounded-lg text-[#b6bcc3] transition hover:bg-[#f5f3ee] hover:text-[#5a626b]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <NuevaReservaForm
          key={franja}
          api={api}
          fecha={fecha}
          franjaInicial={franja}
          onCreada={() => {
            onCreada();
            onCerrar();
          }}
        />
      </div>
    </div>
  );
}
