import { FRANJAS } from "shared";

interface Props {
  franja: string;
  setFranja: (v: string) => void;
  personas: number;
  setPersonas: (v: number) => void;
  nombre: string;
  setNombre: (v: string) => void;
  telefono: string;
  setTelefono: (v: string) => void;
  quierePaella: boolean;
  setQuierePaella: (v: boolean) => void;
  idPrefix?: string;
}

const labelCls = "mb-1.5 block text-[12.5px] font-semibold text-[#6b7682]";
const campo =
  "w-full rounded-[10px] border border-[#e3ddd0] bg-white px-3.5 py-2.5 text-sm text-[#22323d] placeholder:text-[#b6bcc3] transition focus:border-mediterraneo-400 focus:outline-none focus:ring-2 focus:ring-mediterraneo-200";

export default function CamposReserva({
  franja,
  setFranja,
  personas,
  setPersonas,
  nombre,
  setNombre,
  telefono,
  setTelefono,
  quierePaella,
  setQuierePaella,
  idPrefix = "r",
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${idPrefix}-turno`} className={labelCls}>
            Turno
          </label>
          <select
            id={`${idPrefix}-turno`}
            value={franja}
            onChange={(e) => setFranja(e.target.value)}
            className={campo}
          >
            {FRANJAS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-personas`} className={labelCls}>
            Comensales
          </label>
          <input
            id={`${idPrefix}-personas`}
            type="number"
            min={1}
            value={personas}
            onChange={(e) => setPersonas(Number(e.target.value))}
            className={campo}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-nombre`} className={labelCls}>
          Nombre
        </label>
        <input
          id={`${idPrefix}-nombre`}
          placeholder="Nombre y apellidos"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={campo}
          required
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-telefono`} className={labelCls}>
          Teléfono
        </label>
        <input
          id={`${idPrefix}-telefono`}
          inputMode="tel"
          placeholder="Ej. 600 123 456"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={campo}
          required
        />
      </div>

      <button
        type="button"
        onClick={() => setQuierePaella(!quierePaella)}
        aria-pressed={quierePaella}
        className={`flex w-full items-center justify-between rounded-[10px] border px-3.5 py-3 text-left transition ${
          quierePaella ? "border-socarrat-300 bg-socarrat-50" : "border-[#e3ddd0] bg-white hover:bg-[#faf8f3]"
        }`}
      >
        <span>
          <span className="block text-sm font-semibold text-[#22323d]">¿Lleva paella?</span>
          <span className="mt-0.5 block text-[12px] text-[#8a929b]">
            Cuenta para el cupo de 7 paellas del turno
          </span>
        </span>
        <span
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            quierePaella ? "bg-socarrat-400" : "bg-[#d6d0c2]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              quierePaella ? "left-[22px]" : "left-0.5"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
