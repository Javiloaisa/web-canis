import { useTranslation } from "react-i18next";
import FotoPlaceholder from "./FotoPlaceholder";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen flex items-center px-6 sm:px-16">
      <FotoPlaceholder etiqueta="Paella a leña" className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-mediterraneo-900/95 via-mediterraneo-900/60 to-mediterraneo-900/20" />

      <div className="max-w-xl space-y-6">
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-socarrat-300">
          Cocina valenciana · Benissa
        </p>
        <h1 className="font-display text-6xl sm:text-8xl italic font-semibold leading-none text-white">
          {t("hero.titulo")}
        </h1>
        <p className="text-lg text-mediterraneo-100 max-w-md">{t("hero.subtitulo")}</p>
        <a
          href="#reserva"
          className="inline-block bg-socarrat-400 text-mediterraneo-900 font-semibold px-8 py-4 rounded-full hover:bg-socarrat-300 transition text-lg"
        >
          {t("hero.cta")}
        </a>
      </div>
    </section>
  );
}
