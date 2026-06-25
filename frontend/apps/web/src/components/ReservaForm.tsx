import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError, createApiClient, formatoISOLocal, type FranjaDisponibilidad } from "shared";

const api = createApiClient(import.meta.env.VITE_API_URL ?? "http://localhost:8000");

type Paso = "fecha" | "paella" | "turno" | "datos" | "exito";

function hoyISO(): string {
  return formatoISOLocal(new Date());
}

export default function ReservaForm() {
  const { t } = useTranslation();

  const [paso, setPaso] = useState<Paso>("fecha");
  const [fecha, setFecha] = useState(hoyISO());
  const [quierePaella, setQuierePaella] = useState<boolean | null>(null);
  const [franja, setFranja] = useState<string | null>(null);
  const [franjas, setFranjas] = useState<FranjaDisponibilidad[]>([]);
  const [cargandoTurnos, setCargandoTurnos] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [personas, setPersonas] = useState(2);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function irAPasoTurno(paella: boolean) {
    setQuierePaella(paella);
    setError(null);
    setCargandoTurnos(true);
    setPaso("turno");
    try {
      setFranjas(await api.getDisponibilidad(fecha));
    } catch {
      setFranjas([]);
    } finally {
      setCargandoTurnos(false);
    }
  }

  function elegirFranja(valor: string) {
    setFranja(valor);
    setError(null);
    setPaso("datos");
  }

  async function confirmarReserva() {
    if (!franja || quierePaella === null) return;
    setEnviando(true);
    setError(null);
    try {
      await api.crearReserva({
        fecha,
        franja,
        quiere_paella: quierePaella,
        nombre,
        telefono,
        personas,
        origen: "web",
      });
      setPaso("exito");
    } catch (err) {
      if (err instanceof ApiError && err.motivo) {
        setError(t(`reserva.error_${err.motivo}`));
      } else {
        setError(t("reserva.error_generico"));
      }
    } finally {
      setEnviando(false);
    }
  }

  function reiniciar() {
    setPaso("fecha");
    setQuierePaella(null);
    setFranja(null);
    setNombre("");
    setTelefono("");
    setPersonas(2);
    setError(null);
  }

  const franjasDisponibles = franjas.filter((f) =>
    quierePaella ? f.puede_paella : f.puede_sin_paella,
  );

  return (
    <section id="reserva" className="py-20 px-6 bg-mediterraneo-800 min-h-[32rem]">
      <h2 className="font-display italic text-4xl text-socarrat-300 text-center mb-10">{t("reserva.titulo")}</h2>

      <div className="max-w-md mx-auto bg-mediterraneo-900 rounded-2xl p-8 text-mediterraneo-100">
        {paso === "fecha" && (
          <div className="space-y-6">
            <p className="text-lg">{t("reserva.paso_fecha")}</p>
            <input
              type="date"
              value={fecha}
              min={hoyISO()}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 rounded text-mediterraneo-900"
            />
            <button
              onClick={() => setPaso("paella")}
              className="w-full bg-socarrat-400 text-mediterraneo-900 font-semibold py-3 rounded-full hover:bg-socarrat-300 transition"
            >
              {t("comun.siguiente")}
            </button>
          </div>
        )}

        {paso === "paella" && (
          <div className="space-y-6">
            <p className="text-lg">{t("reserva.paso_paella")}</p>
            <p className="text-sm text-socarrat-300">{t("reserva.paella_argumento")}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => irAPasoTurno(true)}
                className="w-full bg-socarrat-400 text-mediterraneo-900 font-semibold py-3 rounded-full hover:bg-socarrat-300 transition"
              >
                {t("reserva.paella_si")}
              </button>
              <button
                onClick={() => irAPasoTurno(false)}
                className="w-full border border-mediterraneo-300 py-3 rounded-full hover:border-socarrat-300 hover:text-socarrat-300 transition"
              >
                {t("reserva.paella_no")}
              </button>
            </div>
            <button onClick={() => setPaso("fecha")} className="text-sm text-mediterraneo-300 hover:text-socarrat-300">
              {t("comun.atras")}
            </button>
          </div>
        )}

        {paso === "turno" && (
          <div className="space-y-6">
            <p className="text-lg">{t("reserva.paso_turno")}</p>
            {cargandoTurnos ? (
              <p>{t("comun.cargando")}</p>
            ) : franjasDisponibles.length === 0 ? (
              <p className="text-socarrat-300">{t("reserva.sin_turnos")}</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {franjasDisponibles.map((f) => (
                  <button
                    key={f.franja}
                    onClick={() => elegirFranja(f.franja)}
                    className="py-2 rounded-lg border border-mediterraneo-300 hover:border-socarrat-300 hover:text-socarrat-300 transition"
                  >
                    {f.franja}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setPaso("paella")} className="text-sm text-mediterraneo-300 hover:text-socarrat-300">
              {t("comun.atras")}
            </button>
          </div>
        )}

        {paso === "datos" && (
          <div className="space-y-4">
            <p className="text-lg">{t("reserva.paso_datos")}</p>
            <input
              type="text"
              placeholder={t("reserva.nombre")}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 rounded text-mediterraneo-900"
            />
            <input
              type="tel"
              placeholder={t("reserva.telefono")}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-3 py-2 rounded text-mediterraneo-900"
            />
            <input
              type="number"
              min={1}
              placeholder={t("reserva.personas")}
              value={personas}
              onChange={(e) => setPersonas(Number(e.target.value))}
              className="w-full px-3 py-2 rounded text-mediterraneo-900"
            />
            {error && <p className="text-socarrat-300">{error}</p>}
            <button
              onClick={confirmarReserva}
              disabled={enviando || !nombre || !telefono || personas < 1}
              className="w-full bg-socarrat-400 text-mediterraneo-900 font-semibold py-3 rounded-full hover:bg-socarrat-300 transition disabled:opacity-50"
            >
              {enviando ? t("reserva.enviando") : t("reserva.confirmar")}
            </button>
            <button onClick={() => setPaso("turno")} className="text-sm text-mediterraneo-300 hover:text-socarrat-300">
              {t("comun.atras")}
            </button>
          </div>
        )}

        {paso === "exito" && (
          <div className="space-y-6 text-center">
            <p className="text-xl text-socarrat-300">{t("reserva.exito")}</p>
            <button
              onClick={reiniciar}
              className="w-full border border-mediterraneo-300 py-3 rounded-full hover:border-socarrat-300 hover:text-socarrat-300 transition"
            >
              {t("reserva.otra_reserva")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
