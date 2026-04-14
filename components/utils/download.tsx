export const imageDownloader = (imageUrl: string, title: string): void => {
  fetch(imageUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      window.open(imageUrl, "_blank");
    });
};
