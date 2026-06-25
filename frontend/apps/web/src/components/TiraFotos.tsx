import FotoPlaceholder from "./FotoPlaceholder";

const ETIQUETAS = ["Horno de leña", "Paella valenciana", "Terraza", "Peñón de Ifach"];

export default function TiraFotos() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 h-40 sm:h-56">
      {ETIQUETAS.map((etiqueta) => (
        <FotoPlaceholder key={etiqueta} etiqueta={etiqueta} className="h-full" />
      ))}
    </div>
  );
}
