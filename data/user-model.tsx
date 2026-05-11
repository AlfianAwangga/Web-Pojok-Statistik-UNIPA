export interface UserModel {
  id: number;
  username: string;
  password: string;
  nama: string;
  role: "admin" | "mahasiswa";
  bio?: string;
  status: "active" | "inactive";
}
