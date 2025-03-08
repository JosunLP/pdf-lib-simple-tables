import { PDFDocument, PDFPage, PDFFont, rgb } from 'pdf-lib';
import { TableCellStyle } from '../interfaces/TableCellStyle';
import { BorderRenderer } from './BorderRenderer';
import { TableStyleManager } from '../managers/TableStyleManager';
import { MergedCell } from '../interfaces/MergedCell';

export class TableRenderer {
  private borderRenderer: BorderRenderer;
  private styleManager: TableStyleManager;

  constructor(borderRenderer: BorderRenderer, styleManager: TableStyleManager) {
    this.borderRenderer = borderRenderer;
    this.styleManager = styleManager;
  }

  /**
   * Zeichnet eine Tabelle in ein PDF-Dokument
   */
  async drawTable(
    pdfDoc: PDFDocument,
    pdfFont: PDFFont,
    data: string[][],
    cellStyles: TableCellStyle[][],
    mergedCells: MergedCell[],
    options: { rowHeight: number; colWidth: number; rows: number; columns: number },
  ): Promise<PDFDocument> {
    let page = pdfDoc.addPage();
    const { height } = page.getSize();

    // Start position for the table
    const startX = 50;
    let currentY = height - 50;
    const { rowHeight, colWidth } = options;

    // Iterate over each row and column
    for (let row = 0; row < options.rows; row++) {
      // Create a new page if there is not enough space
      if (currentY - rowHeight < 50) {
        page = pdfDoc.addPage();
        currentY = page.getSize().height - 50;
      }
      let x = startX;
      for (let col = 0; col < options.columns; col++) {
        // Check if this cell is part of a merged cell
        const merged = mergedCells.find((mc) => mc.startRow === row && mc.startCol === col);
        // If merged, calculate total height and width
        let cellWidth = colWidth;
        let cellHeight = rowHeight;
        if (merged) {
          cellWidth = colWidth * (merged.endCol - merged.startCol + 1);
          cellHeight = rowHeight * (merged.endRow - merged.startRow + 1);
        }

        // Hier wird der StyleManager für effektive Styles verwendet
        const style = this.styleManager.getEffectiveCellStyle(row, col, cellStyles[row][col]);

        // Draw background, text, border, etc. only for non-skipped cells
        if (!merged || (merged && row === merged.startRow && col === merged.startCol)) {
          this.drawCell(page, x, currentY, cellWidth, cellHeight, data[row][col], style, pdfFont);
        }
        x += colWidth;
      }
      currentY -= rowHeight;
    }

    return pdfDoc;
  }

  /**
   * Zeichnet eine einzelne Zelle
   */
  private drawCell(
    page: PDFPage,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    style: TableCellStyle,
    pdfFont: PDFFont,
  ): void {
    // Draw background
    if (style.backgroundColor) {
      const bg = this.styleManager.normalizeColor(style.backgroundColor);
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        color: rgb(bg.r, bg.g, bg.b),
      });
    }

    // Draw text content
    const fontSize = style.fontSize || 12;
    const textColor = style.fontColor || { r: 0, g: 0, b: 0 };
    const normTextColor = this.styleManager.normalizeColor(textColor);

    // Calculate text width if possible
    let textWidth = text.length * fontSize * 0.6;
    if (pdfFont.widthOfTextAtSize) {
      textWidth = pdfFont.widthOfTextAtSize(text, fontSize);
    }

    // Determine the x value based on alignment
    let textX = x + 5;
    if (style.alignment === 'center') {
      textX = x + (width - textWidth) / 2;
    } else if (style.alignment === 'right') {
      textX = x + width - textWidth - 5;
    }

    // Draw text
    page.drawText(text, {
      x: textX,
      y: y - height + (height - fontSize) / 2,
      size: fontSize,
      color: rgb(normTextColor.r, normTextColor.g, normTextColor.b),
      font: pdfFont,
    });

    // Draw cell borders - legacy method (for backward compatibility)
    if (
      style.borderColor &&
      style.borderWidth &&
      !style.topBorder &&
      !style.rightBorder &&
      !style.bottomBorder &&
      !style.leftBorder
    ) {
      const normBorderColor = this.styleManager.normalizeColor(style.borderColor);
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        borderColor: rgb(normBorderColor.r, normBorderColor.g, normBorderColor.b),
        borderWidth: style.borderWidth,
        opacity: 0,
      });
    } else {
      // Verwenden des BorderRenderer für individuelle Rahmenlinien
      this.borderRenderer.drawCellBorders(page, x, y, width, height, style);
    }

    // Zeichne zusätzliche Rahmenlinien (z. B. Trennstriche)
    if (style.additionalBorders) {
      style.additionalBorders.forEach((ab) => {
        const yPos = y - ab.yOffset;
        this.borderRenderer.drawBorderLine(page, x, yPos, x + width, yPos, ab.style);
      });
    }
  }
}
