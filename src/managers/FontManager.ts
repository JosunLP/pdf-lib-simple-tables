import { PDFDocument, PDFFont, StandardFonts } from 'pdf-lib';
import { CustomFont } from '../models/CustomFont';
import { isValidBase64 } from '../utils/validateBase64';

export class FontManager {
  private customFont?: CustomFont;

  setCustomFont(font: CustomFont): void {
    if (!isValidBase64(font.base64)) {
      throw new Error(`Invalid Base64 data for font "${font.name}"`);
    }
    this.customFont = font;
  }

  async embedFont(pdfDoc: PDFDocument): Promise<PDFFont> {
    if (this.customFont) {
      const fontData = this.base64ToUint8Array(this.customFont.base64);
      return await pdfDoc.embedFont(fontData, { customName: this.customFont.name });
    } else {
      // Fallback to a standard font
      return await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
  }

  getCustomFont(): CustomFont | undefined {
    return this.customFont;
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    // Verbesserte Implementierung die in allen Umgebungen funktioniert

    // Entferne mögliche Base64 Präfixe wie "data:font/ttf;base64,"
    const cleanedBase64 = base64.replace(/^data:[^;]+;base64,/, '');

    // Wenn Buffer vorhanden ist (Node-Umgebung), diesen verwenden
    if (typeof Buffer !== 'undefined') {
      return Uint8Array.from(Buffer.from(cleanedBase64, 'base64'));
    } else {
      // Browser-Umgebung
      const binaryString = atob(cleanedBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
  }
}
