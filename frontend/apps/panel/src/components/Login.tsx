import { useState, type FormEvent } from "react";
import { createApiClient } from "shared";

const api = createApiClient(import.meta.env.VITE_API_URL ?? "http://localhost:8000");

interface Props {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const { access_token } = await api.login({ username, password });
      onLogin(access_token);
    } catch {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setEnviando(false);
    }
  }

  const campo =
    "w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-mediterraneo-400 focus:border-mediterraneo-400";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-5 w-full max-w-sm"
      >
        <div className="text-center">
          <p className="font-display italic text-3xl text-mediterraneo-700">Cañís</p>
          <p className="text-sm text-gray-500 mt-1">Panel de gestión</p>
        </div>
        <div className="space-y-3">
          <input
            className={campo}
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={campo}
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          disabled={enviando}
          className="w-full bg-mediterraneo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-mediterraneo-700 transition disabled:opacity-50"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
