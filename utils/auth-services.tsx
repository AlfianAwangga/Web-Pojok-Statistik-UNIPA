import { UserModel } from "@/data/user-model";
import { auth } from "./google-auth";
import { google } from "googleapis";
import { saveToSheets } from "./google-sheets";
import bcrypt from "bcryptjs";

// GET ALL USERS
export async function getUsers(): Promise<UserModel[]> {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "user!A2:G",
    });

    const rows = res.data.values || [];

    const formattedUsers: UserModel[] = rows.map((row) => ({
      id: Number(row[0]),
      username: row[1] || "",
      password: row[2] || "",
      nama: row[3] || "",
      role: row[4] as "admin" | "mahasiswa",
      bio: "",
      status: row[6] as "active" | "inactive",
    }));

    return formattedUsers;
  } catch (error) {
    console.error("Error getUsers:", error);
    return [];
  }
}

// LOGIN SERVICE
export async function loginUser(username: string, password: string) {
  try {
    // VALIDASI INPUT
    if (!username || !password) {
      return {
        success: false,
        message: "Username dan password wajib diisi",
      };
    }

    // AMBIL DATA USER
    const users = await getUsers();

    // CARI USER
    const user = users.find(
      (item) => item.username === username && item.password === password,
    );

    // USER TIDAK DITEMUKAN
    if (!user) {
      return {
        success: false,
        message: "Username atau password salah",
      };
    }

    // CEK STATUS
    if (user.status !== "active") {
      return {
        success: false,
        message: "Akun tidak aktif",
      };
    }

    // SUCCESS
    return {
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role,
        status: user.status,
      },
    };
  } catch (error: any) {
    console.error("Login Error:", error);

    return {
      success: false,
      message: "Terjadi kesalahan server",
    };
  }
}

export async function getUserLastId(): Promise<number> {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) return 0; // Fallback aman jika env belum siap

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "user!A2:A", // ambil kolom ID saja
    });

    const rows = res.data.values;

    if (!rows || rows.length === 0) return 0;

    const lastRow = rows[rows.length - 1];
    const lastId = Number(lastRow[0]);

    return isNaN(lastId) ? 0 : lastId;
  } catch (error) {
    console.error("Error getLastId:", error);
    return 0; // Mengembalikan 0 jika gagal agar proses create tidak ikut rusak
  }
}

export async function createUser(req: Request) {
  try {
    const formData = await req.formData();

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const nama = formData.get("nama") as string;
    const role = formData.get("role") as string;
    const status = formData.get("status") as string;

    const lastId = await getUserLastId();
    const id = lastId + 1;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Upload ke Drive (Cek status success-nya!)
    // const uploadResult = await uploadToDrive(file, folderId);
    // if (!uploadResult.success) {
    //   return {
    //     success: false,
    //     message: `Gagal upload gambar: ${uploadResult.error}`,
    //   };
    // }

    // // Ambil data dari uploadResult karena kita tahu prosesnya sukses
    // const fileId = uploadResult.fileId;
    // const imageUrl = uploadResult.imageUrl;

    // 2. Simpan ke Sheets (Cek status success-nya juga!)
    const sheetResult = await saveToSheets({
      range: "user!A2:G",
      values: [[id, username, hashedPassword, nama, role, "", status]],
    });

    if (!sheetResult.success) {
      return {
        success: false,
        message: `Gagal menyimpan data ke database: ${sheetResult.error}`,
      };
    }

    return {
      success: true,
      message: "Berhasil buat akun user baru",
      data: {
        id,
        username,
        password: hashedPassword,
        nama,
        role,
        bio: "",
        status,
      },
    };
  } catch (error) {
    console.error("Error createUser (Catch block):", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan internal server saat upload",
    };
  }
}

export async function updateUser(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string | null;
    const nama = formData.get("nama") as string;
    const role = formData.get("role") as string;
    const status = formData.get("status") as string;

    const spreadsheetId = process.env.SPREADSHEET_ID!;
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "user!A2:G", // Sesuaikan dengan range data User Anda
    });

    const rows = res.data.values || [];
    const rowIndex = rows.findIndex((row) => String(row[0]) === String(id));

    if (rowIndex === -1) throw new Error("User tidak ditemukan");

    const oldRow = rows[rowIndex];

    // TENTUKAN PASSWORD YANG AKAN DISIMPAN
    let finalPassword = oldRow[2]; // Anggap kolom ke-3 (index 2) adalah password lama

    // Jika admin memasukkan password baru di form, hash password barunya
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      finalPassword = await bcrypt.hash(password, salt);
    }

    const updatedRow = [
      oldRow[0], // ID
      username,
      finalPassword, // Password Hash Baru / Hash Lama
      nama,
      role,
      "",
      status,
    ];

    const actualRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `user!A${actualRow}:G${actualRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [updatedRow] },
    });

    return { success: true, message: "User berhasil diperbarui" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
