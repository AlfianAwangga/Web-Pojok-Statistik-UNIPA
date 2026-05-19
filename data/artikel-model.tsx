export interface ArticleSection {
  id: number;
  artikel_id: number;
  type: "subtitle" | "paragraph" | "highlight" | "quote";
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
  tags: string[];
  status: "menunggu" | "disetujui" | "revisi";
  revisi_msg: string;
  sections: ArticleSection[];
}
