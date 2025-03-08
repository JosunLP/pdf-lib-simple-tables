import { BorderStyle, TableCellStyle } from '../interfaces/TableCellStyle';
import { PDFPage, rgb } from 'pdf-lib';

/**
 * Renderer für Rahmenlinien in Tabellen
 * Kümmert sich um das Zeichnen verschiedener Rahmenlinien-Stile
 */
export class BorderRenderer {
  /**
   * Normalisiert RGB-Farbwerte (0-255 oder 0-1)
   */
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

  /**
   * Zeichnet alle Rahmenlinien für eine Zelle
   */
  drawCellBorders(
    page: PDFPage,
    x: number,
    y: number,
    width: number,
    height: number,
    style: TableCellStyle,
  ): void {
    // Helper zur Vorbereitung des Rahmenlinienstils
    const prepareBorderStyle = (
      borderStyle?: BorderStyle,
      defaultColor?: { r: number; g: number; b: number },
      defaultWidth?: number,
    ): BorderStyle | null => {
      if (!borderStyle && !defaultColor) return null;

      const display = borderStyle?.display !== false;
      if (!display) return null;

      return {
        color: borderStyle?.color || defaultColor,
        width: borderStyle?.width || defaultWidth || 1,
        style: borderStyle?.style || 'solid',
        dashArray: borderStyle?.dashArray,
        dashPhase: borderStyle?.dashPhase || 0,
      };
    };

    // Standard-Rahmeneinstellungen aus Legacy-Eigenschaften
    const defaultColor = style.borderColor;
    const defaultWidth = style.borderWidth;

    // Bereite jeden Rahmen vor
    const topBorder = prepareBorderStyle(style.topBorder, defaultColor, defaultWidth);
    const rightBorder = prepareBorderStyle(style.rightBorder, defaultColor, defaultWidth);
    const bottomBorder = prepareBorderStyle(style.bottomBorder, defaultColor, defaultWidth);
    const leftBorder = prepareBorderStyle(style.leftBorder, defaultColor, defaultWidth);

    // Zeichne jeden Rahmen, wenn er konfiguriert ist
    if (topBorder) {
      this.drawBorderLine(page, x, y, x + width, y, topBorder);
    }

    if (rightBorder) {
      this.drawBorderLine(page, x + width, y, x + width, y - height, rightBorder);
    }

    if (bottomBorder) {
      this.drawBorderLine(page, x, y - height, x + width, y - height, bottomBorder);
    }

    if (leftBorder) {
      this.drawBorderLine(page, x, y, x, y - height, leftBorder);
    }
  }

  /**
   * Zeichnet eine einzelne Rahmenlinie mit dem angegebenen Stil
   */
  drawBorderLine(
    page: PDFPage,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    borderStyle: BorderStyle,
  ): void {
    const color = borderStyle.color ? this.normalizeColor(borderStyle.color) : { r: 0, g: 0, b: 0 };
    const lineWidth = borderStyle.width || 1;

    if (borderStyle.style === 'solid') {
      page.drawLine({
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
        thickness: lineWidth,
        color: rgb(color.r, color.g, color.b),
      });
    } else if (borderStyle.style === 'dashed' || borderStyle.style === 'dotted') {
      // Implementiere gestrichelte oder gepunktete Linien
      const dashLength = borderStyle.style === 'dashed' ? 5 : 2;
      const gapLength = borderStyle.style === 'dashed' ? 3 : 2;

      // Verwende benutzerdefiniertes dashArray, falls vorhanden
      const dashArray = borderStyle.dashArray || [dashLength, gapLength];
      const dashPhase = borderStyle.dashPhase || 0;

      // Berechne Linienlänge und Winkel
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Zeichne gestrichelte/gepunktete Linie
      let remainingLength = length;
      let pos = 0;
      let index = dashPhase % dashArray.reduce((a, b) => a + b, 0);
      let dashIndex = 0;

      // Finde das Start-Dash-Segment basierend auf dashPhase
      while (index > 0 && dashIndex < dashArray.length) {
        if (index >= dashArray[dashIndex]) {
          index -= dashArray[dashIndex];
          dashIndex = (dashIndex + 1) % dashArray.length;
        } else {
          break;
        }
      }

      // Überspringe initiales Segment, falls notwendig
      if (index > 0) {
        pos += index;
        remainingLength -= index;
      }

      // Zeichne Dash-Segmente
      let isDrawing = dashIndex % 2 === 0; // Gerade Indizes sind Linien, ungerade sind Lücken

      while (remainingLength > 0) {
        const segmentLength = Math.min(dashArray[dashIndex], remainingLength);

        if (isDrawing) {
          const startX = x1 + Math.cos(angle) * pos;
          const startY = y1 + Math.sin(angle) * pos;
          const endX = x1 + Math.cos(angle) * (pos + segmentLength);
          const endY = y1 + Math.sin(angle) * (pos + segmentLength);

          page.drawLine({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            thickness: lineWidth,
            color: rgb(color.r, color.g, color.b),
          });
        }

        pos += segmentLength;
        remainingLength -= segmentLength;
        dashIndex = (dashIndex + 1) % dashArray.length;
        isDrawing = !isDrawing;
      }
    }
  }
}
