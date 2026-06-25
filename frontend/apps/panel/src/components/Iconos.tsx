type Props = { className?: string };

export function IconoCheck({ className = "w-4 h-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconoX({ className = "w-4 h-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}

export function IconoFlechaIzq({ className = "w-4 h-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconoFlechaDer({ className = "w-4 h-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconoCalendario({ className = "w-4 h-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M5 1.5v3M11 1.5v3" strokeLinecap="round" />
    </svg>
  );
}

export function IconoUsuario({ className = "w-4 h-4" }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M2.5 14c.7-2.8 3-4.5 5.5-4.5s4.8 1.7 5.5 4.5" strokeLinecap="round" />
    </svg>
  );
}
