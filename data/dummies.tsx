import { LOREM, loremIpsum } from "@/components/utils/strings";

export interface InfografisModel {
  id: number;
  title: string;
  date: string;
  author: string;
  image: string;
  category: string;
  description: string;
  area: String;
}

export interface ArtikelModel {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  category: string;
  content: string;
  image: string;
  readTime: string;
  slug: string;
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
    description: LOREM,
    area: "Papua Barat Daya",
  },
  {
    id: 2,
    title: "Infografis 2",
    date: "1 Januari 2027",
    author: "Author 2",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
    description: LOREM,
    area: "Papua Barat Daya",
  },
  {
    id: 3,
    title: "Infografis 3",
    date: "1 Januari 2027",
    author: "Author 3",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
    description: LOREM,
    area: "Papua Barat Daya",
  },
  {
    id: 4,
    title: "Infografis 4",
    date: "1 Januari 2027",
    author: "Author 4",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
    description: LOREM,
    area: "Papua Barat Daya",
  },
  {
    id: 5,
    title: "Infografis 5",
    date: "1 Januari 2027",
    author: "Author 5",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
    description: LOREM,
    area: "Papua Barat Daya",
  },
  {
    id: 6,
    title: "Infografis 6",
    date: "1 Januari 2027",
    author: "Author 6",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
    description: LOREM,
    area: "Papua Barat Daya",
  },
  {
    id: 7,
    title: "Infografis 7",
    date: "1 Januari 2027",
    author: "Author 7",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Sosial",
    description: LOREM,
    area: "Papua Barat Daya",
  },
  {
    id: 8,
    title: "Infografis 8",
    date: "1 Januari 2027",
    author: "Author 8",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Ekonomi",
    description: LOREM,
    area: "Papua Barat Daya",
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
    content: loremIpsum,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    readTime: "2 Menit",
    slug: "artikel-1",
  },
  {
    id: 2,
    title: "Artikel 2",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 2",
    category: "Sosial",
    content: loremIpsum,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    readTime: "2 Menit",
    slug: "artikel-2",
  },
  {
    id: 3,
    title: "Artikel 3",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 3",
    category: "Sosial",
    content: loremIpsum,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    readTime: "2 Menit",
    slug: "artikel-3",
  },
  {
    id: 4,
    title: "Artikel 4",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 4",
    category: "Sosial",
    content: loremIpsum,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    readTime: "2 Menit",
    slug: "artikel-4",
  },
  {
    id: 5,
    title: "Artikel 5",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 5",
    category: "Sosial",
    content: loremIpsum,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    readTime: "2 Menit",
    slug: "artikel-5",
  },
  {
    id: 6,
    title: "Artikel 6",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 6",
    category: "Sosial",
    content: loremIpsum,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    readTime: "2 Menit",
    slug: "artikel-6",
  },
  {
    id: 7,
    title: "Artikel 7",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 7",
    category: "Sosial",
    content: loremIpsum,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    readTime: "2 Menit",
    slug: "artikel-7",
  },
  {
    id: 8,
    title: "Artikel 8",
    excerpt: LOREM,
    date: "1 Januari 2027",
    author: "Author 8",
    category: "Ekonomi",
    content: loremIpsum,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    readTime: "2 Menit",
    slug: "artikel-8",
  },
];
