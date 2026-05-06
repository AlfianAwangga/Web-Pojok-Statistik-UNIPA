export const imageDownloader = async (
  driveImageId: string,
  title: string,
): Promise<void> => {
  try {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveImageId}`;

    const response = await fetch(downloadUrl);

    if (!response.ok) throw new Error("Gagal download");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    const fallbackUrl = `https://drive.google.com/file/d/${driveImageId}/view`;
    window.open(fallbackUrl, "_blank");
  }
};
