import { useState } from "react";
import { getToken, setToken } from "./auth";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

export default function App() {
  const [token, setTokenState] = useState<string | null>(getToken());

  function handleLogin(nuevoToken: string) {
    setToken(nuevoToken);
    setTokenState(nuevoToken);
  }

  function handleLogout() {
    setToken(null);
    setTokenState(null);
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
