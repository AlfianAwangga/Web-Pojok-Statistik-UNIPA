import { ArtikelModel } from "@/data/artikel-model";
import { FotoModel } from "@/data/foto-model";
import { InfografisModel } from "@/data/infografis-model";

export function getMyInfografisCount(data: InfografisModel[], author?: string) {
  return data.filter((item) => item.author === author).length;
}

export function getMyArtikelCount(data: ArtikelModel[], author?: string) {
  return data.filter((item) => item.author === author).length;
}

export function getMyPhotoCount(data: FotoModel[], author?: string) {
  return data.filter((item) => item.uploader === author).length;
}
