import { useMemo, useState } from "react";
import { formatoISOLocal } from "shared";
import { IconoFlechaDer, IconoFlechaIzq } from "./Iconos";

interface Props {
  value: string; // ISO YYYY-MM-DD
  onSelect: (iso: string) => void;
}

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function parseISO(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

export default function CalendarioFecha({ value, onSelect }: Props) {
  const sel = parseISO(value);
  const [vista, setVista] = useState({ y: sel.getFullYear(), m: sel.getMonth() });

  const hoyISO = formatoISOLocal(new Date());

  const celdas = useMemo(() => {
    const primero = new Date(vista.y, vista.m, 1);
    const offset = (primero.getDay() + 6) % 7; // lunes = 0
    const inicio = new Date(vista.y, vista.m, 1 - offset);
    return Array.from({ length: 42 }, (_, i) =>
      new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i),
    );
  }, [vista]);

  function cambiarMes(delta: number) {
    setVista((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[300px] rounded-2xl border border-[#e3ddd0] bg-white p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-[17px] font-semibold text-mediterraneo-700">
          {MESES[vista.m]} {vista.y}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => cambiarMes(-1)}
            aria-label="Mes anterior"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-mediterraneo-600 transition hover:bg-mediterraneo-50"
          >
            <IconoFlechaIzq className="h-4 w-4" />
          </button>
          <button
            onClick={() => cambiarMes(1)}
            aria-label="Mes siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-mediterraneo-600 transition hover:bg-mediterraneo-50"
          >
            <IconoFlechaDer className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {DIAS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold uppercase text-[#9aa3ad]">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((d, i) => {
          const iso = formatoISOLocal(d);
          const mesActual = d.getMonth() === vista.m;
          const esSel = iso === value;
          const esHoy = iso === hoyISO;
          return (
            <button
              key={i}
              onClick={() => onSelect(iso)}
              className={`flex h-9 items-center justify-center rounded-lg text-[13.5px] tabular-nums transition ${
                esSel
                  ? "bg-mediterraneo-600 font-bold text-white"
                  : !mesActual
                    ? "font-medium text-[#c8ccd1] hover:bg-[#f5f3ee]"
                    : esHoy
                      ? "font-bold text-mediterraneo-700 ring-1 ring-inset ring-mediterraneo-300 hover:bg-mediterraneo-50"
                      : "font-medium text-[#3a4650] hover:bg-mediterraneo-50"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#f1ede4] pt-3">
        <span className="text-[12px] text-[#9aa3ad]">Elige un día</span>
        <button
          onClick={() => onSelect(hoyISO)}
          className="text-sm font-semibold text-mediterraneo-600 transition hover:text-mediterraneo-700"
        >
          Hoy
        </button>
      </div>
    </div>
  );
}
