import { useTranslation } from "react-i18next";
import FotoPlaceholder from "./FotoPlaceholder";

const TARJETAS = [
  { clave: "salon", etiqueta: "Salón" },
  { clave: "horno", etiqueta: "Paellero" },
  { clave: "terraza", etiqueta: "Terraza" },
  { clave: "arroz", etiqueta: "Arroces" },
] as const;

export default function Galeria() {
  const { t } = useTranslation();

  return (
    <section id="galeria" className="py-20 px-6 sm:px-10 bg-mediterraneo-800">
      <p className="text-xs tracking-[0.25em] uppercase text-socarrat-300 text-center mb-3">
        {t("nav.galeria")}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl text-white text-center mb-12 max-w-2xl mx-auto">
        {t("galeria.titulo")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px max-w-6xl mx-auto">
        {TARJETAS.map(({ clave, etiqueta }) => (
          <div key={clave} className="bg-mediterraneo-900">
            <FotoPlaceholder etiqueta={etiqueta} className="aspect-square" />
            <div className="p-5">
              <h3 className="font-display text-lg text-socarrat-200">
                {t(`galeria.${clave}.titulo`)}
              </h3>
              <p className="text-sm text-mediterraneo-300 mt-1">{t(`galeria.${clave}.texto`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
