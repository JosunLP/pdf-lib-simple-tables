import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CustomFont } from '../models/CustomFont';
import { defaultDesignConfig, DesignConfig } from '../config/DesignConfig';
import { MergedCell } from '../interfaces/MergedCell';
import { TableCellStyle } from '../interfaces/TableCellStyle';
import { TableOptions } from '../interfaces/TableOptions';

/**
 * Pdf table
 * @param {TableOptions} options - Table options
 * @example
 * const pdfTable = new PdfTable({ columns: 3, rows: 3 });
 */
export class PdfTable {
  private options: TableOptions;
  private data: string[][] = [];
  private cellStyles: TableCellStyle[][] = []; // Matrix for cell styles
  private mergedCells: MergedCell[] = [];
  private customFont?: CustomFont;
  private designConfig: DesignConfig; // new property

  constructor(options: TableOptions) {
    // Set default values if not present and merge design config
    this.options = {
      rowHeight: 20,
      colWidth: 80,
      ...options,
    };
    this.designConfig = { ...defaultDesignConfig, ...options.designConfig };
    this.initData();
  }

  private initData(): void {
    // Ändere cellStyles, um separate Objekte pro Zelle zu erzeugen
    this.data = Array.from({ length: this.options.rows }, () =>
      Array(this.options.columns).fill(''),
    );
    this.cellStyles = Array.from({ length: this.options.rows }, () =>
      Array.from({ length: this.options.columns }, () => ({})),
    );
  }

  // Method to fill a cell
  setCell(row: number, col: number, value: string): void {
    if (row < this.options.rows && col < this.options.columns) {
      this.data[row][col] = value;
    }
  }

  // Angepasste setCellStyle-Methode: nur den übergebenen Stil speichern
  setCellStyle(row: number, col: number, style: TableCellStyle): void {
    if (row < this.options.rows && col < this.options.columns) {
      // Direkte Zuweisung statt Merging mit Default-Stilen
      this.cellStyles[row][col] = style;
    } else {
      throw new Error('Invalid cell coordinates');
    }
  }

  // New method to merge cells with validation
  mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void {
    // Validation: start coordinates must be less than or equal to end coordinates
    if (startRow > endRow || startCol > endCol) {
      throw new Error('Invalid cell coordinates for mergeCells');
    }
    // ...further validations could be done here...
    this.mergedCells.push({ startRow, startCol, endRow, endCol });
  }

  // Method to set a custom font
  setCustomFont(font: CustomFont): void {
    if (!this.isValidBase64(font.base64)) {
      throw new Error('Invalid Base64 data');
    }
    this.customFont = font;
  }

  // Method to read the content of a cell
  getCell(row: number, col: number): string {
    if (row < this.options.rows && col < this.options.columns) {
      return this.data[row][col];
    }
    throw new Error('Invalid cell coordinates');
  }

  // Method to read the style of a cell
  getCellStyle(row: number, col: number): TableCellStyle {
    if (row < this.options.rows && col < this.options.columns) {
      return this.cellStyles[row][col];
    }
    throw new Error('Invalid cell coordinates');
  }

  // Method to remove a cell
  removeCell(row: number, col: number): void {
    if (row < this.options.rows && col < this.options.columns) {
      this.data[row][col] = '';
      this.cellStyles[row][col] = {};
    } else {
      throw new Error('Invalid cell coordinates');
    }
  }

  // Method to add a new row
  addRow(): void {
    this.options.rows += 1;
    this.data.push(Array(this.options.columns).fill(''));
    this.cellStyles.push(Array(this.options.columns).fill({}));
  }

  // Method to add a new column
  addColumn(): void {
    this.options.columns += 1;
    this.data.forEach((row) => row.push(''));
    this.cellStyles.forEach((row) => row.push({}));
  }

  // Method to remove a row
  removeRow(row: number): void {
    if (row < this.options.rows) {
      this.data.splice(row, 1);
      this.cellStyles.splice(row, 1);
      this.options.rows -= 1;
    } else {
      throw new Error('Invalid row coordinate');
    }
  }

  // Method to remove a column
  removeColumn(col: number): void {
    if (col < this.options.columns) {
      this.data.forEach((row) => row.splice(col, 1));
      this.cellStyles.forEach((row) => row.splice(col, 1));
      this.options.columns -= 1;
    } else {
      throw new Error('Invalid column coordinate');
    }
  }

  // Helper function to validate Base64 data
  private isValidBase64(base64: string): boolean {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(base64);
  }

  // Helper function to convert Base64 to Uint8Array
  private base64ToUint8Array(base64: string): Uint8Array {
    if (!this.isValidBase64(base64)) {
      throw new Error('Invalid Base64 data');
    }
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // New method: normalize color values
  private normalizeColor(color: { r: number; g: number; b: number }): {
    r: number;
    g: number;
    b: number;
  } {
    return {
      r: color.r > 1 ? color.r / 255 : color.r,
      g: color.g > 1 ? color.g / 255 : color.g,
      b: color.b > 1 ? color.b / 255 : color.b,
    };
  }

  // Create a PDF document with the table including cell styling
  async toPDF(): Promise<PDFDocument> {
    const pdfDoc = await PDFDocument.create();
    let pdfFont; // Will be set either by CustomFont or as a fallback
    if (this.customFont) {
      const fontData = this.base64ToUint8Array(this.customFont.base64);
      pdfFont = await pdfDoc.embedFont(fontData, { customName: this.customFont.name });
    } else {
      // Fallback to a standard font
      pdfFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
    let page = pdfDoc.addPage();
    const { height } = page.getSize();

    // Start position for the table
    const startX = 50;
    let currentY = height - 50;
    const { rowHeight = 20, colWidth = 80 } = this.options;

    // Iterate over each row and column
    for (let row = 0; row < this.options.rows; row++) {
      // Create a new page if there is not enough space
      if (currentY - rowHeight < 50) {
        page = pdfDoc.addPage();
        currentY = page.getSize().height - 50;
      }
      let x = startX;
      for (let col = 0; col < this.options.columns; col++) {
        // Check if this cell is part of a merged cell
        const merged = this.mergedCells.find((mc) => mc.startRow === row && mc.startCol === col);
        // If merged, calculate total height and width
        let cellWidth = colWidth;
        let cellHeight = rowHeight;
        if (merged) {
          cellWidth = colWidth * (merged.endCol - merged.startCol + 1);
          cellHeight = rowHeight * (merged.endRow - merged.startRow + 1);
        }

        // Merge the individual cell style with the design defaults
        const style = { ...this.designConfig, ...this.cellStyles[row][col] };

        // Draw background, text, border, etc. only for non-skipped cells
        if (!merged || (merged && row === merged.startRow && col === merged.startCol)) {
          if (style.backgroundColor) {
            const bg = this.normalizeColor(style.backgroundColor);
            page.drawRectangle({
              x,
              y: currentY - cellHeight,
              width: cellWidth,
              height: cellHeight,
              color: rgb(bg.r, bg.g, bg.b),
            });
          }
          const fontSize = style.fontSize || 12;
          const textColor = style.fontColor || { r: 0, g: 0, b: 0 };
          const normTextColor = this.normalizeColor(textColor);
          const text = this.data[row][col];

          // Calculate text width if possible
          let textWidth = text.length * fontSize * 0.6;
          if (pdfFont.widthOfTextAtSize) {
            textWidth = pdfFont.widthOfTextAtSize(text, fontSize);
          }

          // Determine the x value based on alignment
          let textX = x + 5;
          if (style.alignment === 'center') {
            textX = x + (cellWidth - textWidth) / 2;
          } else if (style.alignment === 'right') {
            textX = x + cellWidth - textWidth - 5;
          }
          // If a CustomFont is available, it will be used
          page.drawText(text, {
            x: textX,
            y: currentY - cellHeight + (cellHeight - fontSize) / 2,
            size: fontSize,
            color: rgb(normTextColor.r, normTextColor.g, normTextColor.b),
            font: pdfFont, // undefined if no CustomFont is set
          });
          if (style.borderColor && style.borderWidth) {
            const normBorderColor = this.normalizeColor(style.borderColor);
            page.drawRectangle({
              x,
              y: currentY - cellHeight,
              width: cellWidth,
              height: cellHeight,
              borderColor: rgb(normBorderColor.r, normBorderColor.g, normBorderColor.b),
              borderWidth: style.borderWidth,
              opacity: 0,
            });
          }
        }
        x += colWidth;
      }
      currentY -= rowHeight;
    }

    return pdfDoc;
  }

  // New method: Embed table in an existing PDF document (as a real table)
  async embedInPDF(existingDoc: PDFDocument, startX: number, startY: number): Promise<PDFDocument> {
    if (startX < 0 || startY < 0) {
      throw new Error('Invalid coordinates for embedInPDF');
    }
    // For simplicity, use a new page addition
    let page = existingDoc.addPage();
    let currentY = startY; // Use the passed Y coordinate
    const rowHeight = this.options.rowHeight || 20;
    const colWidth = this.options.colWidth || 80;
    const pdfFont = await existingDoc.embedFont(StandardFonts.Helvetica);

    for (let row = 0; row < this.options.rows; row++) {
      // If there is not enough space, add a new page and restore the top margin.
      if (currentY - rowHeight < 50) {
        page = existingDoc.addPage();
        currentY = page.getSize().height - 50;
      }
      let x = startX; // Use the passed X coordinate
      for (let col = 0; col < this.options.columns; col++) {
        // Draw cell contents – additional styles can be integrated here.
        const text = this.data[row][col];
        page.drawText(text, {
          x: x + 5,
          y: currentY - rowHeight + 5,
          size: 12,
          font: pdfFont,
          color: rgb(0, 0, 0),
        });
        x += colWidth;
      }
      currentY -= rowHeight;
    }
    return existingDoc;
  }

  // Angepasste embedTableAsImage-Methode: Fehlerbehandlung für ungültige Bilddaten
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

  private getEffectiveCellStyle(
    row: number,
    col: number,
    userStyle: TableCellStyle,
  ): TableCellStyle {
    let effectiveStyle: TableCellStyle = { ...userStyle };

    if (row === 0 && this.designConfig.headingRowStyle) {
      effectiveStyle = { ...this.designConfig.headingRowStyle, ...effectiveStyle };
    }
    if (col === 0 && this.designConfig.headingColumnStyle) {
      effectiveStyle = { ...this.designConfig.headingColumnStyle, ...effectiveStyle };
    }
    return effectiveStyle;
  }
}
