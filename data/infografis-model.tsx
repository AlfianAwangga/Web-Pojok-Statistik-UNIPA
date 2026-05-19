export interface InfografisModel {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  description: string;
  drive_image_id: string;
  image_url: string;
  status: "menunggu" | "disetujui" | "revisi";
  revisi_msg: string;
}
