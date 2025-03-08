import { PDFDocument } from 'pdf-lib';

export class ImageEmbedder {
  async embedTableAsImage(
    existingDoc: PDFDocument,
    imageBytes: Uint8Array,
    options: { x: number; y: number; width: number; height: number },
  ): Promise<PDFDocument> {
    if (!(imageBytes instanceof Uint8Array) || imageBytes.length === 0) {
      throw new Error('Invalid image data');
    }
    // Neue Validierung: PNG-Header prüfen
    const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
    if (imageBytes.length < 8 || !PNG_SIGNATURE.every((b, i) => imageBytes[i] === b)) {
      throw new Error('Invalid image data');
    }
    let pngImage;
    try {
      pngImage = await existingDoc.embedPng(imageBytes);
    } catch (error) {
      throw new Error('Invalid image data');
    }
    const page = existingDoc.addPage();
    page.drawImage(pngImage, {
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
    });
    return existingDoc;
  }
}
