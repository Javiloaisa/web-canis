/** Formatea una fecha como YYYY-MM-DD usando el calendario local, no UTC
 * (Date.toISOString() convierte a UTC y puede desplazar el día). */
export function formatoISOLocal(fecha: Date): string {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}
