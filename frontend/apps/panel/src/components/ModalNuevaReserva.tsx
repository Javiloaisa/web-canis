import type { ApiClient } from "shared";
import NuevaReservaForm from "./NuevaReservaForm";

interface Props {
  api: ApiClient;
  fecha: string;
  franja: string;
  onCerrar: () => void;
  onCreada: () => void;
}

export default function ModalNuevaReserva({ api, fecha, franja, onCerrar, onCreada }: Props) {
  return (
    <div
      className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-30 p-4"
      onClick={onCerrar}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Nueva reserva — {franja}</h3>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-700">
            ✕
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
