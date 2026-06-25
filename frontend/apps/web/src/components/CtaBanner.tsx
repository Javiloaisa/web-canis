import { useTranslation } from "react-i18next";
import FotoPlaceholder from "./FotoPlaceholder";

export default function CtaBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative h-[28rem] flex items-center justify-center text-center px-6">
      <FotoPlaceholder etiqueta="Socarrat" className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-mediterraneo-900/70" />

      <div className="space-y-5">
        <h2 className="font-display italic text-4xl sm:text-5xl text-white">
          {t("ctaBanner.titulo")}
        </h2>
        <p className="text-mediterraneo-100 max-w-md mx-auto">{t("ctaBanner.texto")}</p>
        <a
          href="#reserva"
          className="inline-block bg-socarrat-400 text-mediterraneo-900 font-semibold px-8 py-3 rounded-full hover:bg-socarrat-300 transition"
        >
          {t("ctaBanner.boton")}
        </a>
      </div>
    </section>
  );
}
