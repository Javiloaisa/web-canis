import { IconoCalendario } from "./Iconos";

interface Props {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: Props) {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 bg-white border-r border-[#ece7dc] flex-col min-h-screen sticky top-0">
      <div className="px-6 pt-[26px] pb-5">
        <p className="font-display italic font-semibold text-[30px] leading-none text-mediterraneo-700">
          Cañís
        </p>
        <div className="w-[26px] h-[3px] rounded-sm bg-socarrat-400 mt-[11px] mb-[9px]" />
        <p className="text-[10.5px] tracking-[1.6px] uppercase font-semibold text-[#9aa3ad]">
          Panel de gestión
        </p>
      </div>

      <nav className="flex-1 px-[14px] py-2">
        <span className="flex items-center gap-[11px] px-[13px] py-[11px] rounded-[10px] bg-mediterraneo-50 text-mediterraneo-700 font-semibold text-sm">
          <IconoCalendario className="w-[17px] h-[17px]" />
          Reservas
        </span>
      </nav>

      <div className="px-[14px] py-[14px] border-t border-[#ece7dc]">
        <div className="flex items-center gap-[10px] px-3 py-2 text-[13.5px] text-[#6b7682]">
          <span className="w-7 h-7 rounded-full bg-mediterraneo-50 text-mediterraneo-700 flex items-center justify-center font-bold text-xs">
            A
          </span>
          admin
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-[9px] rounded-lg text-[13.5px] text-[#8a929b] hover:bg-[#f5f3ee] hover:text-[#5a626b] transition"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
