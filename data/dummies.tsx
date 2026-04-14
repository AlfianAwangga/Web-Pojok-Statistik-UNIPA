import { LOREM } from "@/components/utils/strings";

export interface InfografisModel {
  id: number;
  title: string;
  author: string;
  image: string;
}

export interface ArtikelModel {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  author: string;
}

export const infografisData: InfografisModel[] = [
  {
    id: 1,
    title: "Infografis 1",
    author: "Author 1",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Infografis 2",
    author: "Author 2",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Infografis 3",
    author: "Author 3",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
];

export const artikelData: ArtikelModel[] = [
  {
    id: 1,
    title: "Artikel 1",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 1",
  },
  {
    id: 2,
    title: "Artikel 2",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 2",
  },
  {
    id: 3,
    title: "Artikel 3",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 3",
  },
];
