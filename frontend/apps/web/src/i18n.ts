import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { recursosI18n } from "shared";

void i18next.use(initReactI18next).init({
  resources: recursosI18n,
  lng: "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export default i18next;
