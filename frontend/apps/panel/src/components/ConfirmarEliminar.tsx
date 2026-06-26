import type { Reserva } from "shared";

interface Props {
  reserva: Reserva;
  onConfirmar: () => void;
  onCerrar: () => void;
}

export default function ConfirmarEliminar({ reserva, onConfirmar, onCerrar }: Props) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1f2d37]/40 p-4"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-1 text-lg font-semibold text-[#22323d]">¿Cancelar esta reserva?</p>
        <p className="mb-6 text-sm text-[#8a929b]">
          {reserva.nombre} · {reserva.franja.slice(0, 5)} · {reserva.personas} pers.
          {reserva.quiere_paella ? " · paella" : ""}
          <br />
          Se eliminará y la mesa quedará libre. No se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCerrar}
            className="rounded-[10px] border border-[#e3ddd0] px-4 py-2 text-sm text-[#3a4650] transition hover:bg-[#f5f3ee]"
          >
            Volver
          </button>
          <button
            onClick={onConfirmar}
            className="rounded-[10px] bg-[#c0392b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a93226]"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
