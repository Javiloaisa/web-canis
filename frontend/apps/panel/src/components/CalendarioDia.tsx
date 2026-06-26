import { LIMITE_PAELLA, LIMITE_TOTAL, type FranjaDisponibilidad, type Origen, type Reserva } from "shared";
import { IconoCheck, IconoLapiz, IconoTelefono, IconoX } from "./Iconos";

interface Props {
  franjas: FranjaDisponibilidad[];
  reservas: Reserva[];
  filtrando: boolean;
  onToggleLlegada: (reserva: Reserva) => void;
  onEditar: (reserva: Reserva) => void;
  onEliminar: (reserva: Reserva) => void;
  onNuevaEnFranja: (franja: string) => void;
}

const ORIGEN_META: Record<Origen, { label: string; color: string }> = {
  web: { label: "Web", color: "#246a88" },
  bot: { label: "Teléfono", color: "#1f8a4d" },
  panel: { label: "Sala", color: "#b87f1d" },
};

function colorMesas(n: number): string {
  return n >= LIMITE_TOTAL ? "#c0392b" : n >= LIMITE_TOTAL - 2 ? "#b87f1d" : "#3a4650";
}

function colorPaellas(n: number): string {
  return n >= LIMITE_PAELLA ? "#c0392b" : n >= LIMITE_PAELLA - 2 ? "#b87f1d" : "#3a4650";
}

export default function CalendarioDia({
  franjas,
  reservas,
  filtrando,
  onToggleLlegada,
  onEditar,
  onEliminar,
  onNuevaEnFranja,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ece7dc] bg-white shadow-[0_1px_3px_rgba(20,40,55,0.04)]">
      {franjas.map((f) => {
        const reservasFranja = reservas.filter(
          (r) => r.franja.slice(0, 5) === f.franja && r.estado === "confirmada",
        );
        if (filtrando && reservasFranja.length === 0) return null;

        const completo = f.ocupadas >= LIMITE_TOTAL;
        const paellasLlenas = f.con_paella >= LIMITE_PAELLA;

        return (
          <div key={f.franja} className="flex flex-col border-b border-[#f1ede4] last:border-b-0 sm:flex-row">
            <div className="flex w-full items-center justify-between border-b border-[#f1ede4] bg-[#faf8f3] px-4 py-2.5 sm:w-[130px] sm:flex-col sm:items-stretch sm:justify-start sm:border-b-0 sm:border-r sm:px-[18px] sm:py-4">
              <p className="text-[19px] font-bold tracking-[-0.2px] tabular-nums text-[#243b4a]">
                {f.franja}
              </p>
              <div className="flex items-center gap-3 sm:mt-[11px] sm:flex-col sm:items-stretch sm:gap-1">
                <span className="flex items-center gap-1.5 text-[11.5px] text-[#9aa3ad] sm:justify-between">
                  <span>mesas</span>
                  <span className="font-bold tabular-nums" style={{ color: colorMesas(f.ocupadas) }}>
                    {f.ocupadas}/{LIMITE_TOTAL}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-[11.5px] text-[#9aa3ad] sm:justify-between">
                  <span>paellas</span>
                  <span className="font-bold tabular-nums" style={{ color: colorPaellas(f.con_paella) }}>
                    {f.con_paella}/{LIMITE_PAELLA}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap content-start gap-2.5 p-4">
              {reservasFranja.map((r) => {
                const origen = ORIGEN_META[r.origen];
                const llego = r.ha_llegado;
                const paella = r.quiere_paella;

                const chipClase = llego
                  ? "border border-[#bfe0cc] bg-[#eaf6ee]"
                  : paella
                    ? "border border-[#ecd6a3] bg-[#fdf4e3] shadow-[0_1px_2px_rgba(146,98,23,0.10)]"
                    : "border border-[#e7e1d4] bg-white shadow-[0_1px_2px_rgba(20,40,55,0.05)]";
                const leftBorder = llego
                  ? "3px solid #1f8a4d"
                  : paella
                    ? "4px solid #d29a2c"
                    : undefined;

                return (
                  <div
                    key={r.id}
                    onClick={() => onToggleLlegada(r)}
                    role="button"
                    title={llego ? "Quitar llegada" : "Marcar que han llegado"}
                    className={`flex w-full cursor-pointer flex-col gap-1.5 rounded-xl p-3 transition hover:shadow-[0_4px_12px_rgba(20,40,55,0.09)] sm:w-[204px] ${chipClase}`}
                    style={leftBorder ? { borderLeft: leftBorder } : undefined}
                  >
                    <div className="flex min-h-[14px] items-center justify-between gap-1">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: origen.color }} />
                        <span
                          className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.6px]"
                          style={{ color: origen.color }}
                        >
                          {origen.label}
                        </span>
                      </span>
                      <span className="ml-auto flex shrink-0 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditar(r);
                          }}
                          title="Editar reserva"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#b6bcc3] transition hover:bg-[#eef4f7] hover:text-mediterraneo-500"
                        >
                          <IconoLapiz className="h-[15px] w-[15px]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEliminar(r);
                          }}
                          title="Cancelar reserva"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#b6bcc3] transition hover:bg-[#fbeaea] hover:text-[#c0392b]"
                        >
                          <IconoX className="h-4 w-4" />
                        </button>
                      </span>
                    </div>

                    <p
                      className={`text-sm font-semibold leading-tight ${
                        llego ? "text-[#1c6b3f]" : "text-[#22323d]"
                      }`}
                    >
                      {r.nombre}
                    </p>

                    <div className="flex flex-wrap items-center gap-[7px] text-xs text-[#7a828b]">
                      <span>{r.personas} pers.</span>
                      {r.quiere_paella && (
                        <span className="inline-flex items-center rounded-full bg-[#f7ead0] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.2px] text-[#946217]">
                          Paella
                        </span>
                      )}
                      {llego && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#d7efe0] px-2 py-0.5 text-[10.5px] font-bold text-[#1f7a44]">
                          <IconoCheck className="h-3 w-3" />
                          En sala
                        </span>
                      )}
                    </div>

                    <a
                      href={`tel:${r.telefono.replace(/\s+/g, "")}`}
                      onClick={(e) => e.stopPropagation()}
                      title="Llamar"
                      className="flex w-fit items-center gap-1.5 text-xs text-[#8a929b] transition hover:text-mediterraneo-600"
                    >
                      <IconoTelefono className="h-3.5 w-3.5" />
                      {r.telefono}
                    </a>
                  </div>
                );
              })}

              {!filtrando &&
                (completo ? (
                  <div className="flex min-h-[94px] w-full items-center justify-center rounded-xl border border-[#f0d9d6] bg-[#fbf2f1] text-xs font-bold uppercase tracking-[0.5px] text-[#c0392b] sm:w-[204px]">
                    Turno completo
                  </div>
                ) : (
                  <button
                    onClick={() => onNuevaEnFranja(f.franja)}
                    className="flex min-h-[94px] w-full flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-[#d6d0c2] bg-transparent text-[13.5px] font-semibold text-[#a39c8c] transition hover:border-mediterraneo-500 hover:bg-[#f3f8fa] hover:text-mediterraneo-500 sm:w-[204px]"
                  >
                    + Nueva reserva
                    {paellasLlenas && (
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.4px] text-[#c0392b]">
                        Sin paella · 7/7
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
