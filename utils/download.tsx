export const imageDownloader = (driveImageId: string, title: string): void => {
  // URL ini secara otomatis memaksa browser untuk mengunduh file
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveImageId}`;

  const link = document.createElement("a");
  link.href = downloadUrl;

  // Atribut download terkadang diabaikan oleh browser untuk link beda domain (cross-origin),
  // namun header dari Google Drive biasanya akan tetap memaksa file untuk diunduh.
  link.setAttribute("download", `${title}.jpg`);

  // Tambahkan target _blank agar jika browser memblokir unduhan langsung,
  // ia tidak akan merusak tampilan halaman web Anda saat ini
  link.target = "_blank";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
