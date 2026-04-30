import { LOREM, loremIpsum } from "@/components/utils/strings";

export interface ArticleSection {
  id: number;
  type: "subtitle" | "paragraph" | "highlight" | "quote" | "image";
  content: string;
}

export interface ArtikelModel {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  thumbnail: string;
  author: string;
  publishDate: string;
  readTime: string;
  featured?: boolean;
  tags?: string[];
  sections: ArticleSection[];
}

export const artikelData: ArtikelModel[] = [
  {
    id: 1,
    title: "Perkembangan Inflasi Papua Barat Tahun 2027",
    slug: "perkembangan-inflasi-papua-barat-2027",
    category: "Ekonomi",
    excerpt:
      "Inflasi daerah menunjukkan tren kenaikan pada triwulan pertama tahun 2027.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    author: "Author 1",
    publishDate: "1 Januari 2027",
    readTime: "5 Menit",
    featured: true,
    tags: ["Inflasi", "Ekonomi", "Papua Barat"],
    sections: [
      {
        id: 1,
        type: "subtitle",
        content: "Kondisi Inflasi Triwulan I",
      },
      {
        id: 2,
        type: "paragraph",
        content:
          "Berdasarkan hasil pemantauan BPS, inflasi pada triwulan pertama mengalami peningkatan terutama pada kelompok makanan dan minuman.",
      },
      {
        id: 3,
        type: "highlight",
        content:
          "Inflasi tertinggi terjadi pada kelompok makanan, minuman, dan tembakau.",
      },
      {
        id: 4,
        type: "subtitle",
        content: "Perbandingan dengan Tahun Sebelumnya",
      },
      {
        id: 5,
        type: "quote",
        content:
          "Dibandingkan tahun sebelumnya, laju inflasi meningkat sebesar 1,2 persen dan menunjukkan tekanan harga yang lebih tinggi.",
      },
    ],
  },
];

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

export interface FotoModel {
  id: number;
  url: string;
  caption: string;
  lokasi: string;
  tanggal: string;
  uploader: string;
}

export interface VideoModel {
  id: number;
  title: string;
  youtubeId: string;
  deskripsi: string;
  durasi: string;
}

export type DialogItem = InfografisModel | ArtikelModel;

export const infografisData: InfografisModel[] = [
  {
    id: 1,
    title: "Perkembangan Inflasi Papua Barat Tahun 2027",
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
      "https://images.unsplash.com/photo-1775507685032-579ab21cdfa3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

export const fotoData: FotoModel[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    caption: "Dokumentasi 1",
    lokasi: "Ruangan 1",
    tanggal: "12 April 2026",
    uploader: "uploader 1",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    caption: "Dokumentasi 2",
    lokasi: "Ruangan 2",
    tanggal: "05 April 2026",
    uploader: "uploader 1",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    caption: "Dokumentasi 3",
    lokasi: "Ruangan 3",
    tanggal: "28 Mar 2026",
    uploader: "uploader 1",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800",
    caption: "Dokumentasi 4",
    lokasi: "Ruangan 4",
    tanggal: "20 Mar 2026",
    uploader: "uploader 1",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800",
    caption: "Dokumentasi 5",
    lokasi: "Ruangan 5",
    tanggal: "10 Mar 2026",
    uploader: "uploader 1",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800",
    caption: "Dokumentasi 6",
    lokasi: "Ruangan 6",
    tanggal: "01 Mar 2026",
    uploader: "uploader 1",
  },
];

export const videoData: VideoModel[] = [
  {
    id: 1,
    youtubeId: "dQw4w9WgXcQ", // ID unik YouTube (Contoh)
    title: "Video 1",
    deskripsi: "Deskripsi Video 1",
    durasi: "02:45",
  },
  {
    id: 2,
    youtubeId: "jNQXAC9IVRw",
    title: "Video 2",
    deskripsi: "Deskripsi Video 2",
    durasi: "15:20",
  },
  {
    id: 3,
    youtubeId: "M7lc1UVf-VE",
    title: "Video 3",
    deskripsi: "Deskripsi Video 3",
    durasi: "05:12",
  },
];
