import { useTranslation } from "react-i18next";
import FotoPlaceholder from "./FotoPlaceholder";

export default function Argumento() {
  const { t } = useTranslation();

  return (
    <section className="grid sm:grid-cols-2 bg-mediterraneo-50">
      <div className="flex flex-col justify-center gap-5 px-8 sm:px-16 py-20 text-mediterraneo-900">
        <p className="text-xs tracking-[0.25em] uppercase text-socarrat-600">
          {t("argumento.eyebrow")}
        </p>
        <h2 className="font-display text-4xl sm:text-5xl leading-tight">
          {t("argumento.titulo_pre")}{" "}
          <em className="italic text-socarrat-600">{t("argumento.titulo_post")}</em>
        </h2>
        <p className="text-mediterraneo-700 max-w-md">{t("argumento.texto")}</p>
      </div>
      <FotoPlaceholder etiqueta="Paellero a leña" className="min-h-[20rem]" />
    </section>
  );
}
