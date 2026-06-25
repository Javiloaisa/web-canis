interface Props {
  etiqueta: string;
  valor: number | string;
  acento?: string;
}

export default function StatCard({ etiqueta, valor, acento }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
      <p className="text-sm text-gray-500">{etiqueta}</p>
      <p className={`text-2xl font-semibold mt-1 ${acento ?? "text-gray-900"}`}>{valor}</p>
    </div>
  );
}
