interface Props {
  etiqueta: string;
  valor: number | string;
  sublabel?: string;
  variante?: "default" | "destacado" | "atenuado";
}

export default function StatCard({ etiqueta, valor, sublabel, variante = "default" }: Props) {
  const destacado = variante === "destacado";
  const atenuado = variante === "atenuado";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white px-[18px] py-4 shadow-[0_1px_2px_rgba(20,40,55,0.04)] border ${
        destacado ? "border-socarrat-100" : "border-[#ece7dc]"
      }`}
    >
      {destacado && <div className="absolute top-0 left-0 h-full w-[3px] bg-socarrat-400" />}
      <p className="text-[12.5px] font-medium text-[#8a929b]">{etiqueta}</p>
      <p
        className={`mt-[7px] text-[30px] font-bold leading-none tabular-nums ${
          destacado ? "text-socarrat-500" : atenuado ? "text-[#aab1b8]" : "text-[#1f2d37]"
        }`}
      >
        {valor}
      </p>
      {sublabel && (
        <p className={`mt-[7px] text-[11.5px] ${destacado ? "text-[#bba66f]" : "text-[#aab1b8]"}`}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
