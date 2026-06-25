import es from "./es.json";
import va from "./va.json";

export const idiomas = ["es", "va"] as const;
export type Idioma = (typeof idiomas)[number];

export const recursosI18n = {
  es: { translation: es },
  va: { translation: va },
} as const;
