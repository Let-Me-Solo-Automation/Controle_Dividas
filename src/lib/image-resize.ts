// Large uploads are decoded once, contained in a square and stored at icon size.
export async function resizeIcon(file: File): Promise<string> {
  if (
    !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
    file.size > 20 * 1024 * 1024
  )
    throw Error("Escolha PNG, JPEG ou WebP de até 20 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) throw Error("Não foi possível processar a imagem.");
    const scale = Math.min(256 / image.naturalWidth, 256 / image.naturalHeight);
    const w = image.naturalWidth * scale,
      h = image.naturalHeight * scale;
    context.drawImage(image, (256 - w) / 2, (256 - h) / 2, w, h);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}
