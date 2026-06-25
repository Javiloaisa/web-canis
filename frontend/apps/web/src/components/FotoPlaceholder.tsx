import { useTranslation } from "react-i18next";

interface Props {
  etiqueta: string;
  className?: string;
}

export default function FotoPlaceholder({ etiqueta, className = "" }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-gradient-to-br from-mediterraneo-600 via-mediterraneo-800 to-socarrat-800 flex flex-col items-center justify-center text-center p-4 ${className}`}
    >
      <span className="text-mediterraneo-100 font-medium">{etiqueta}</span>
      <span className="text-xs text-mediterraneo-300">{t("comun.foto_proximamente")}</span>
    </div>
  );
}
