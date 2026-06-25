export interface PlatoCarta {
  nombre: string;
  descripcion: string;
  precio: string;
}

export interface SeccionCarta {
  titulo: string;
  platos: PlatoCarta[];
}

// Platos reales según reseñas públicas del restaurante (TripAdvisor); precios
// estimados — pendiente de confirmar la carta y los precios definitivos.
export const carta: SeccionCarta[] = [
  {
    titulo: "Arroces a leña",
    platos: [
      { nombre: "Paella valenciana", descripcion: "Pollo, conejo, judía verde y garrofó", precio: "18€/pers." },
      { nombre: "Paella de marisco", descripcion: "Gambas, mejillones, calamar y sepia", precio: "22€/pers." },
      { nombre: "Paella señoret", descripcion: "Marisco pelado, lista para comer sin cáscaras", precio: "22€/pers." },
    ],
  },
  {
    titulo: "Para empezar",
    platos: [
      { nombre: "Alcachofas crujientes", descripcion: "Con jamón y huevo", precio: "10€" },
      { nombre: "Pata de pulpo", descripcion: "A la brasa", precio: "14€" },
      { nombre: "Frito de marisco variado", descripcion: "Selección del día", precio: "16€" },
    ],
  },
  {
    titulo: "Carnes",
    platos: [{ nombre: "Lomo de cerdo ibérico", descripcion: "A la brasa", precio: "15€" }],
  },
];
