import { IconoCalendario, IconoUsuario } from "./Iconos";

interface Props {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: Props) {
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-gray-100">
        <p className="font-display italic text-2xl text-mediterraneo-700">Cañís</p>
        <p className="text-xs uppercase tracking-wider text-gray-400 mt-0.5">Panel de gestión</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-mediterraneo-50 text-mediterraneo-700 font-medium text-sm">
          <IconoCalendario className="w-4 h-4" />
          Reservas
        </span>
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
          <IconoUsuario className="w-4 h-4" />
          admin
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
