import { useTranslation } from "react-i18next";

const TELEFONO = "+34 965 74 72 15";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-mediterraneo-900 border-t border-socarrat-400/20 text-mediterraneo-200">
      <div className="max-w-5xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-12">
        <div>
          <p className="font-display italic text-2xl text-socarrat-300">{t("hero.titulo")}</p>
          <p className="text-sm mt-1">{t("footer.subtitulo")}</p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-socarrat-300 mb-3">
            {t("footer.direccion_titulo")}
          </p>
          <p className="text-sm">{t("footer.direccion")}</p>

          <p className="text-xs tracking-[0.2em] uppercase text-socarrat-300 mb-2 mt-6">
            {t("footer.horario_titulo")}
          </p>
          <p className="text-sm">{t("footer.horario_mediodia")}</p>
          <p className="text-sm">{t("footer.horario_noche")}</p>
          <p className="text-sm text-socarrat-200">{t("footer.horario_cerrado")}</p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-socarrat-300 mb-3">
            {t("footer.reservas_titulo")}
          </p>
          <a href="#reserva" className="inline-block bg-socarrat-400 text-mediterraneo-900 font-semibold px-5 py-2 rounded-full hover:bg-socarrat-300 transition text-sm mb-4">
            {t("nav.reservar")}
          </a>
          <p className="text-sm">
            {t("footer.reservas_tel")}:{" "}
            <a href={`tel:${TELEFONO}`} className="hover:text-socarrat-300">
              {TELEFONO}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
