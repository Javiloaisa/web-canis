import { useTranslation } from "react-i18next";

export default function Cita() {
  const { t } = useTranslation();

  return (
    <section className="bg-mediterraneo-900 py-20 px-6">
      <blockquote className="max-w-3xl mx-auto text-center">
        <p className="font-display italic text-2xl sm:text-3xl leading-relaxed text-mediterraneo-100">
          “{t("argumento.cita")}”
        </p>
        <footer className="mt-6 text-sm tracking-wide text-socarrat-300 uppercase">Cañís</footer>
      </blockquote>
    </section>
  );
}
