import { Photo } from "./photos";

export type YearData = {
  year: number;
  title: string;
  description: string;
  photos: Photo[];
};

export const yearsData: YearData[] = [
  {
    year: 2022,
    title: "Donde todo comenzó",
    description:
      "El año que cambió mi vida para siempre. Cada momento contigo fue un regalo.",
    photos: [
      {
        id: "y23-1",
        src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400&h=500&fit=crop",
        title: "Enero 2023",
        description: "El primer capítulo de nuestra historia.",
      },
      {
        id: "y23-2",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        title: "Primavera 2023",
        description: "Florecimos juntos como las flores.",
      },
      {
        id: "y23-3",
        src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
        title: "Verano 2023",
        description: "Días largos y noches mágicas.",
      },
    ],
  },
  {
    year: 2023,
    title: "Donde todo comenzó",
    description:
      "El año que cambió mi vida para siempre. Cada momento contigo fue un regalo.",
    photos: [
      {
        id: "y23-1",
        src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400&h=500&fit=crop",
        title: "Enero 2023",
        description: "El primer capítulo de nuestra historia.",
      },
      {
        id: "y23-2",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        title: "Primavera 2023",
        description: "Florecimos juntos como las flores.",
      },
      {
        id: "y23-3",
        src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
        title: "Verano 2023",
        description: "Días largos y noches mágicas.",
      },
    ],
  },
  {
    year: 2024,
    title: "Creciendo juntos",
    description: "Un año de aventuras, aprendizajes y amor incondicional.",
    photos: [
      {
        id: "y24-1",
        src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=500&fit=crop",
        title: "Inicio de 2024",
        description: "Nuevos propósitos, mismo amor.",
      },
      {
        id: "y24-2",
        src: "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=400&h=500&fit=crop",
        title: "Nuestro aniversario",
        description: "Celebrando lo que somos.",
      },
      {
        id: "y24-3",
        src: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop",
        title: "Vacaciones 2024",
        description: "Explorando el mundo juntos.",
      },
    ],
  },
  {
    year: 2025,
    title: "Más fuertes que nunca",
    description: "Cada día contigo es mejor que el anterior.",
    photos: [
      {
        id: "y25-1",
        src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
        title: "2025",
        description: "Un nuevo año de recuerdos.",
      },
      {
        id: "y25-2",
        src: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=400&h=500&fit=crop",
        title: "Momentos",
        description: "Los pequeños detalles importan más.",
      },
    ],
  },
  {
    year: 2026,
    title: "Nuestro presente",
    description: "Escribiendo nuevas páginas de nuestra historia de amor.",
    photos: [
      {
        id: "y26-1",
        src: "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=500&fit=crop",
        title: "Hoy",
        description: "El presente es nuestro mejor regalo.",
      },
    ],
  },
];
