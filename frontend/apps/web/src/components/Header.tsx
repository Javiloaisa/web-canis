import { useTranslation } from "react-i18next";
import { idiomas } from "shared";

export default function Header() {
  const { t, i18n } = useTranslation();

  return (
    <header className="fixed top-0 inset-x-0 z-20 flex items-center justify-between px-6 sm:px-10 py-3 bg-mediterraneo-900/90 backdrop-blur border-b border-socarrat-400/20">
      <div className="leading-none">
        <span className="block text-2xl font-display font-semibold italic text-socarrat-300">
          {t("hero.titulo")}
        </span>
        <span className="block text-[10px] tracking-[0.2em] uppercase text-mediterraneo-200">
          Benissa · Costa Blanca
        </span>
      </div>

      <nav className="hidden sm:flex items-center gap-8 text-sm tracking-wide text-mediterraneo-100">
        <a href="#carta" className="hover:text-socarrat-300 transition">
          {t("nav.carta")}
        </a>
        <a href="#galeria" className="hover:text-socarrat-300 transition">
          {t("nav.galeria")}
        </a>
        <a
          href="#reserva"
          className="bg-socarrat-400 text-mediterraneo-900 font-semibold px-5 py-2 rounded-full hover:bg-socarrat-300 transition"
        >
          {t("nav.reservar")}
        </a>
      </nav>

      <div className="flex gap-2">
        {idiomas.map((idioma) => (
          <button
            key={idioma}
            onClick={() => i18n.changeLanguage(idioma)}
            className={`uppercase text-sm ${
              i18n.language === idioma ? "text-socarrat-300" : "text-mediterraneo-200"
            } hover:text-socarrat-300`}
          >
            {idioma}
          </button>
        ))}
      </div>
    </header>
  );
}
