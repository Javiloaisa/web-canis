import { useTranslation } from "react-i18next";
import { carta } from "../data/carta";

export default function Carta() {
  const { t } = useTranslation();

  return (
    <section id="carta" className="py-20 px-6 bg-mediterraneo-900">
      <h2 className="font-display italic text-4xl text-socarrat-300 text-center mb-2">{t("carta.titulo")}</h2>
      <p className="text-center text-sm text-mediterraneo-300 mb-10">{t("carta.nota")}</p>

      <div className="max-w-3xl mx-auto grid gap-10 sm:grid-cols-2">
        {carta.map((seccion) => (
          <div key={seccion.titulo}>
            <h3 className="font-display text-xl text-socarrat-200 mb-4">{seccion.titulo}</h3>
            <ul className="space-y-3">
              {seccion.platos.map((plato) => (
                <li key={plato.nombre} className="flex justify-between gap-4 text-mediterraneo-100">
                  <div>
                    <p className="font-medium">{plato.nombre}</p>
                    <p className="text-sm text-mediterraneo-300">{plato.descripcion}</p>
                  </div>
                  <span className="text-socarrat-300 whitespace-nowrap">{plato.precio}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
