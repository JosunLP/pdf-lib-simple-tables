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
   * Berechnet die Textbreite unter Berücksichtigung der Schriftgröße
   */
  private calculateTextWidth(text: string, fontSize: number, pdfFont: PDFFont): number {
    return pdfFont.widthOfTextAtSize
      ? pdfFont.widthOfTextAtSize(text, fontSize)
      : text.length * fontSize * 0.6;
  }

  /**
   * Teilt den Text in Zeilen auf, die in die gegebene Breite passen
   */
  private wrapText(text: string, maxWidth: number, fontSize: number, pdfFont: PDFFont): string[] {
    if (!text) return [''];

    const wordWrapWidth = maxWidth - 10; // Etwas Platz für Padding lassen
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = this.calculateTextWidth(testLine, fontSize, pdfFont);

      if (testWidth <= wordWrapWidth) {
        currentLine = testLine;
      } else {
        // Wenn die Zeile bereits leer ist und das Wort nicht passt,
        // müssen wir das Wort selbst umbrechen
        if (currentLine === '') {
          // Zeichen für Zeichen hinzufügen, bis die maxWidth erreicht ist
          let charLine = '';
          for (let j = 0; j < word.length; j++) {
            const testChar = charLine + word[j];
            const testCharWidth = this.calculateTextWidth(testChar, fontSize, pdfFont);
            if (testCharWidth <= wordWrapWidth) {
              charLine = testChar;
            } else {
              lines.push(charLine);
              charLine = word[j];
            }
          }
          if (charLine) {
            currentLine = charLine;
          }
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Berechnet die erforderliche Zellenhöhe für umgebrochenen Text
   */
  private calculateRequiredHeight(
    text: string,
    width: number,
    style: TableCellStyle,
    pdfFont: PDFFont,
    padding: { top: number; right: number; bottom: number; left: number },
  ): number {
    const fontSize = style.fontSize || 12;
    const wordWrap = style.wordWrap || this.styleManager.designConfig.wordWrap || 'normal';

    if (wordWrap === 'none') {
      return fontSize + padding.top + padding.bottom;
    }

    const availableWidth = width - padding.left - padding.right;
    const textLines = this.wrapText(text, availableWidth, fontSize, pdfFont);
    const lineHeight = fontSize * 1.2; // Standardzeilenhöhe
    return textLines.length * lineHeight + padding.top + padding.bottom;
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
    options: {
      rowHeight: number;
      colWidth: number;
      rows: number;
      columns: number;
      repeatHeaderRows?: number;
      headerRepetition?: boolean; // Neue Option: steuert, ob Headers wiederholt werden
      pageBreakThreshold?: number;
      startX?: number;
      startY?: number;
      useExistingPages?: boolean;
    },
  ): Promise<PDFDocument> {
    // Verwende bestehende Seite oder füge eine neue hinzu
    let page: PDFPage;

    if (options.useExistingPages && pdfDoc.getPageCount() > 0) {
      page = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    } else {
      page = pdfDoc.addPage();
    }

    const { height } = page.getSize();

    // Start position for the table
    const startX = options.startX ?? 50;
    let currentY = options.startY ?? height - 50;
    const { colWidth } = options;
    const pageBreakThreshold = options.pageBreakThreshold ?? 50;
    const repeatHeaderRows = options.repeatHeaderRows ?? 0;

    // Prüfen, ob dynamische Zeilenhöhe aktiviert ist
    const dynamicRowHeight = this.styleManager.designConfig.dynamicRowHeight !== false;

    // Array für die tatsächliche Höhe jeder Zeile
    const rowHeights: number[] = new Array(options.rows).fill(options.rowHeight);

    // Berechnen der Zeilenhöhen, wenn dynamische Höhenanpassung aktiviert ist
    if (dynamicRowHeight) {
      for (let row = 0; row < options.rows; row++) {
        let maxRowHeight = options.rowHeight;

        for (let col = 0; col < options.columns; col++) {
          // Überprüfen, ob die Zelle Teil einer zusammengeführten Zelle ist
          const merged = this.findPrimaryMergedCell(row, col, mergedCells);

          // Nur für die erste Zelle einer zusammengeführten Gruppe oder für reguläre Zellen
          if (merged) {
            if (row === merged.startRow && col === merged.startCol) {
              const cellWidth = colWidth * (merged.endCol - merged.startCol + 1);
              const style = this.styleManager.getEffectiveCellStyle(row, col, cellStyles[row][col]);
              const text = data[row][col] || '';
              const padding = this.calculateCellPadding(style);

              // Berechnen der erforderlichen Höhe für diese Zelle
              const requiredHeight = this.calculateRequiredHeight(
                text,
                cellWidth,
                style,
                pdfFont,
                padding,
              );

              const rowsSpanned = merged.endRow - merged.startRow + 1;
              const heightPerRow = requiredHeight / rowsSpanned;
              maxRowHeight = Math.max(maxRowHeight, heightPerRow);
            }
          } else {
            const style = this.styleManager.getEffectiveCellStyle(row, col, cellStyles[row][col]);
            const text = data[row][col] || '';
            const padding = this.calculateCellPadding(style);

            // Berechnen der erforderlichen Höhe für diese Zelle
            const requiredHeight = this.calculateRequiredHeight(
              text,
              colWidth,
              style,
              pdfFont,
              padding,
            );

            maxRowHeight = Math.max(maxRowHeight, requiredHeight);
          }
        }

        rowHeights[row] = maxRowHeight;
      }
    }

    // Definition einer Funktion zur Identifikation und Berechnung von Zelleneigenschaften
    interface CellRenderInfo {
      row: number;
      col: number;
      x: number;
      y: number;
      width: number;
      height: number;
      content: string;
      style: TableCellStyle;
      isHeader: boolean;
    }

    // Funktion zur Berechnung der zu rendernden Zelleninformationen
    const calculateCellsToRender = (
      startRow: number,
      endRow: number,
      isHeaderSection: boolean,
      startingY: number,
    ): CellRenderInfo[] => {
      const cellsToRender: CellRenderInfo[] = [];
      let currentY = startingY;

      // Speichern der belegten Bereiche für vertikal zusammengeführte Zellen
      // Format: [spalte, endZeile, breite]
      const occupiedCells: [number, number, number][] = [];

      for (let row = startRow; row <= endRow; row++) {
        let x = startX;
        let col = 0;

        while (col < options.columns) {
          // Prüfen, ob die aktuelle Position von einer vertikalen Zusammenführung aus einer oberen Zeile belegt ist
          const occupiedIndex = occupiedCells.findIndex(
            ([occupiedCol, occupiedEndRow]) => col === occupiedCol && row <= occupiedEndRow,
          );

          if (occupiedIndex !== -1) {
            // Position ist durch eine vertikale Zusammenführung belegt - überspringe die Spalte
            const occupiedWidth = occupiedCells[occupiedIndex][2];
            x += occupiedWidth;
            col++;
            continue;
          }

          // Finde die zusammengeführte Zelle, die diese Position enthält (falls vorhanden)
          const mergedCell = this.findMergedCellContaining(row, col, mergedCells);

          // Wenn diese Position keine primäre Zelle einer zusammengeführten Zelle ist, überspringen
          if (mergedCell && (row !== mergedCell.startRow || col !== mergedCell.startCol)) {
            // Nur zur nächsten Spalte gehen, ohne die x-Position zu verändern
            col++;
            continue;
          }

          // Berechne Zellenbreite und -höhe
          let cellWidth = colWidth;
          let cellHeight = rowHeights[row];

          // Anpassung für zusammengeführte Zellen
          if (mergedCell) {
            cellWidth = colWidth * (mergedCell.endCol - mergedCell.startCol + 1);
            cellHeight =
              mergedCell.endRow > row
                ? rowHeights.slice(row, mergedCell.endRow + 1).reduce((sum, h) => sum + h, 0)
                : rowHeights[row];

            // Bei vertikalen Zusammenführungen merken wir uns die belegten Spalten für nachfolgende Zeilen
            if (mergedCell.endRow > row) {
              occupiedCells.push([col, mergedCell.endRow, cellWidth]);
            }

            const style = this.styleManager.getEffectiveCellStyle(row, col, cellStyles[row][col]);

            cellsToRender.push({
              row,
              col,
              x,
              y: currentY,
              width: cellWidth,
              height: cellHeight,
              content: data[row][col] || '',
              style,
              isHeader: isHeaderSection,
            });

            // Erhöhe X-Position und überspringe alle Spalten, die von dieser zusammengeführten Zelle abgedeckt sind
            x += cellWidth;
            col = mergedCell.endCol + 1;
          } else {
            // Normale, nicht zusammengeführte Zelle
            const style = this.styleManager.getEffectiveCellStyle(row, col, cellStyles[row][col]);

            cellsToRender.push({
              row,
              col,
              x,
              y: currentY,
              width: cellWidth,
              height: cellHeight,
              content: data[row][col] || '',
              style,
              isHeader: isHeaderSection,
            });

            // Erhöhe X-Position für die nächste Zelle
            x += cellWidth;
            col++;
          }
        }

        currentY -= rowHeights[row];
      }

      return cellsToRender;
    };

    // Funktion zum Zeichnen einer Header-Zeile
    const drawHeaderRows = (): number => {
      if (repeatHeaderRows <= 0) return currentY;

      const headerCells = calculateCellsToRender(0, repeatHeaderRows - 1, true, currentY);

      for (const cell of headerCells) {
        this.drawCell(
          page,
          cell.x,
          cell.y,
          cell.width,
          cell.height,
          cell.content,
          cell.style,
          pdfFont,
        );
      }

      return (
        currentY -
        headerCells
          .filter((cell) => cell.row === repeatHeaderRows - 1)
          .reduce((max, cell) => Math.max(max, cell.height), 0)
      );
    };

    // Zeichne Tabelleninhalt zeilenweise
    let row = 0;
    while (row < options.rows) {
      const rowHeight = rowHeights[row];

      // Erstelle eine neue Seite, wenn nicht genug Platz vorhanden ist
      if (currentY - rowHeight < pageBreakThreshold) {
        page = pdfDoc.addPage();
        currentY = page.getSize().height - 50;

        // Zeichne Header-Zeilen wenn nötig
        if (repeatHeaderRows > 0 && options.headerRepetition !== false) {
          currentY = drawHeaderRows();
        }
      }

      // Überspringe Header-Zeilen, wenn sie bereits als wiederholende Header gezeichnet wurden
      if (row < repeatHeaderRows && currentY !== height - 50 && currentY !== options.startY) {
        row++;
        continue;
      }

      // Bestimme Endzeile für aktuellen Zeichenvorgang (bis Seitenumbruch oder Tabellenende)
      let endRow = row;
      let accumulatedHeight = rowHeights[row];

      while (
        endRow + 1 < options.rows &&
        currentY - accumulatedHeight - rowHeights[endRow + 1] >= pageBreakThreshold
      ) {
        endRow++;
        accumulatedHeight += rowHeights[endRow];
      }

      // Berechne und rendere die Zellen für den aktuellen Zeilenbereich
      const cellsToRender = calculateCellsToRender(row, endRow, false, currentY);

      for (const cell of cellsToRender) {
        this.drawCell(
          page,
          cell.x,
          cell.y,
          cell.width,
          cell.height,
          cell.content,
          cell.style,
          pdfFont,
        );
      }

      // Aktualisiere currentY für die nächste Zeile
      currentY -= accumulatedHeight;
      row = endRow + 1;
    }

    return pdfDoc;
  }

  /**
   * Berechnet das Padding für eine Zelle basierend auf dem angegebenen Style
   */
  private calculateCellPadding(style: TableCellStyle): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    let padding = { top: 5, right: 5, bottom: 5, left: 5 };

    if (style.padding) {
      if (typeof style.padding === 'number') {
        padding = {
          top: style.padding,
          right: style.padding,
          bottom: style.padding,
          left: style.padding,
        };
      } else {
        // Parse CSS-style padding
        const parts = style.padding.split(' ').map((p) => parseInt(p, 10));
        switch (parts.length) {
          case 1:
            padding = { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
            break;
          case 2:
            padding = { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
            break;
          case 4:
            padding = { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
            break;
        }
      }
    }

    return padding;
  }

  /**
   * Findet die Haupt-Zelle (Start-Zelle) einer zusammengeführten Zelle
   * die die gegebene Position enthält, oder undefined wenn keine gefunden wird
   */
  private findPrimaryMergedCell(
    row: number,
    col: number,
    mergedCells: MergedCell[],
  ): MergedCell | undefined {
    for (const mc of mergedCells) {
      if (row >= mc.startRow && row <= mc.endRow && col >= mc.startCol && col <= mc.endCol) {
        return mc;
      }
    }
    return undefined;
  }

  /**
   * Prüft, ob eine Position innerhalb einer zusammengeführten Zelle liegt
   */
  private findMergedCellContaining(
    row: number,
    col: number,
    mergedCells: MergedCell[],
  ): MergedCell | undefined {
    return mergedCells.find(
      (mc) => row >= mc.startRow && row <= mc.endRow && col >= mc.startCol && col <= mc.endCol,
    );
  }

  /**
   * Zeichnet eine einzelne Zelle
   */
  drawCell(
    page: PDFPage,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    style: TableCellStyle,
    pdfFont: PDFFont,
  ): void {
    // Berechne Padding
    let padding = { top: 5, right: 5, bottom: 5, left: 5 };
    if (style.padding) {
      if (typeof style.padding === 'number') {
        padding = {
          top: style.padding,
          right: style.padding,
          bottom: style.padding,
          left: style.padding,
        };
      } else {
        // Parse CSS-style padding
        const parts = style.padding.split(' ').map((p) => parseInt(p, 10));
        switch (parts.length) {
          case 1:
            padding = { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
            break;
          case 2:
            padding = { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
            break;
          case 4:
            padding = { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
            break;
        }
      }
    }

    // Draw background with support for opacity
    if (style.backgroundColor) {
      const bg = this.styleManager.normalizeColor(style.backgroundColor);
      const opacity = style.opacity !== undefined ? style.opacity : 1;

      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        color: rgb(bg.r, bg.g, bg.b),
        opacity: opacity,
      });
    }

    // Apply text transformations if needed
    let displayText = text || '';
    if (style.textTransform) {
      switch (style.textTransform) {
        case 'uppercase':
          displayText = displayText.toUpperCase();
          break;
        case 'lowercase':
          displayText = displayText.toLowerCase();
          break;
        case 'capitalize':
          displayText = displayText.replace(/\b\w/g, (c) => c.toUpperCase());
          break;
      }
    }

    // Text styling
    const fontSize = style.fontSize || 12;
    const textColor = style.fontColor || { r: 0, g: 0, b: 0 };
    const normTextColor = this.styleManager.normalizeColor(textColor);

    // Textumbruch basierend auf wordWrap-Eigenschaft
    const wordWrap = style.wordWrap || this.styleManager.designConfig.wordWrap || 'normal';
    const availableWidth = width - padding.left - padding.right;

    if (wordWrap === 'none') {
      // Kein Textumbruch, ggf. abschneiden
      let textToDisplay = displayText;
      let textWidth = this.calculateTextWidth(textToDisplay, fontSize, pdfFont);

      // Ggf. Text abschneiden und Ellipsis hinzufügen
      if (style.textOverflow === 'ellipsis' && textWidth > availableWidth) {
        let cutText = textToDisplay;
        while (textWidth > availableWidth && cutText.length > 0) {
          cutText = cutText.slice(0, -1);
          textWidth = this.calculateTextWidth(cutText + '...', fontSize, pdfFont);
        }
        textToDisplay = cutText + '...';
      }

      // X-Position basierend auf Ausrichtung
      let textX = x + padding.left;
      if (style.alignment === 'center') {
        textX = x + (width - this.calculateTextWidth(textToDisplay, fontSize, pdfFont)) / 2;
      } else if (style.alignment === 'right') {
        textX =
          x + width - this.calculateTextWidth(textToDisplay, fontSize, pdfFont) - padding.right;
      }

      // Y-Position basierend auf vertikaler Ausrichtung
      let textY = y - height + (height - fontSize) / 2; // Standard ist 'middle'
      if (style.verticalAlignment === 'top') {
        textY = y - padding.top - fontSize;
      } else if (style.verticalAlignment === 'bottom') {
        textY = y - height + padding.bottom;
      }

      // Text zeichnen
      page.drawText(textToDisplay, {
        x: textX,
        y: textY,
        size: fontSize,
        color: rgb(normTextColor.r, normTextColor.g, normTextColor.b),
        font: pdfFont,
      });
    } else {
      // Textumbruch implementieren
      const textLines = this.wrapText(displayText, availableWidth, fontSize, pdfFont);
      const lineHeight = fontSize * 1.2; // Standard-Zeilenhöhe
      const totalTextHeight = textLines.length * lineHeight;

      // Startposition für den Text basierend auf vertikaler Ausrichtung
      let startY;
      if (style.verticalAlignment === 'top') {
        startY = y - padding.top;
      } else if (style.verticalAlignment === 'bottom') {
        startY = y - height + padding.bottom + totalTextHeight;
      } else {
        // middle
        startY = y - (height - totalTextHeight) / 2;
      }

      // Jede Zeile zeichnen
      for (let i = 0; i < textLines.length; i++) {
        const line = textLines[i];
        const lineWidth = this.calculateTextWidth(line, fontSize, pdfFont);

        // X-Position basierend auf Ausrichtung
        let textX = x + padding.left;
        if (style.alignment === 'center') {
          textX = x + (width - lineWidth) / 2;
        } else if (style.alignment === 'right') {
          textX = x + width - lineWidth - padding.right;
        }

        // Zeile zeichnen
        page.drawText(line, {
          x: textX,
          y: startY - i * lineHeight - fontSize,
          size: fontSize,
          color: rgb(normTextColor.r, normTextColor.g, normTextColor.b),
          font: pdfFont,
        });
      }
    }

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
