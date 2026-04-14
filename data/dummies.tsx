import { LOREM } from "@/components/utils/strings";

export interface InfografisModel {
  id: number;
  title: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

export interface ArtikelModel {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  category: string;
}

export const infografisData: InfografisModel[] = [
  {
    id: 1,
    title: "Infografis 1",
    date: "1 Januari 2027",
    author: "Author 1",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
  },
  {
    id: 2,
    title: "Infografis 2",
    date: "1 Januari 2027",
    author: "Author 2",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
  },
  {
    id: 3,
    title: "Infografis 3",
    date: "1 Januari 2027",
    author: "Author 3",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
  },
  {
    id: 4,
    title: "Infografis 4",
    date: "1 Januari 2027",
    author: "Author 4",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
  },
  {
    id: 5,
    title: "Infografis 5",
    date: "1 Januari 2027",
    author: "Author 5",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
  },
  {
    id: 6,
    title: "Infografis 6",
    date: "1 Januari 2027",
    author: "Author 6",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
  },
  {
    id: 7,
    title: "Infografis 7",
    date: "1 Januari 2027",
    author: "Author 7",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
  },
  {
    id: 8,
    title: "Infografis 8",
    date: "1 Januari 2027",
    author: "Author 8",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
  },
];

export const artikelData: ArtikelModel[] = [
  {
    id: 1,
    title: "Artikel 1",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 1",
    category: "Sosial",
  },
  {
    id: 2,
    title: "Artikel 2",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 2",
    category: "Sosial",
  },
  {
    id: 3,
    title: "Artikel 3",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 3",
    category: "Sosial",
  },
  {
    id: 4,
    title: "Artikel 4",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 4",
    category: "Sosial",
  },
  {
    id: 5,
    title: "Artikel 5",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 5",
    category: "Sosial",
  },
  {
    id: 6,
    title: "Artikel 6",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 6",
    category: "Sosial",
  },
  {
    id: 7,
    title: "Artikel 7",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 7",
    category: "Sosial",
  },
  {
    id: 8,
    title: "Artikel 8",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 8",
    category: "Sosial",
  },
];
