import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { CustomFont } from '../models/CustomFont';
import { defaultDesignConfig, DesignConfig } from '../config/DesignConfig';
import { TableCellStyle } from '../interfaces/TableCellStyle';
import { TableOptions } from '../interfaces/TableOptions';
import { BorderRenderer } from '../renderers/BorderRenderer';
import { TableStyleManager } from '../managers/TableStyleManager';
import { TableRenderer } from '../renderers/TableRenderer';
import { TableDataManager } from '../managers/TableDataManager';
import { MergeCellManager } from '../managers/MergeCellManager';
import { FontManager } from '../managers/FontManager';
import { ImageEmbedder } from '../embedders/ImageEmbedder';

/**
 * Pdf table
 * @param {TableOptions} options - Table options
 * @example
 * const pdfTable = new PdfTable({ columns: 3, rows: 3 });
 */
export class PdfTable {
  private designConfig: DesignConfig;

  // Module für verschiedene Funktionalitäten
  private borderRenderer: BorderRenderer;
  private styleManager: TableStyleManager;
  private tableRenderer: TableRenderer;
  private dataManager: TableDataManager;
  private mergeCellManager: MergeCellManager;
  private fontManager: FontManager;
  private imageEmbedder: ImageEmbedder;

  constructor(options: TableOptions) {
    // Set default values if not present and merge design config
    const completeOptions = {
      rowHeight: 20,
      colWidth: 80,
      ...options,
    };
    this.designConfig = { ...defaultDesignConfig, ...options.designConfig };

    // Initialisierung der Module
    this.borderRenderer = new BorderRenderer();
    this.styleManager = new TableStyleManager(this.designConfig);
    this.tableRenderer = new TableRenderer(this.borderRenderer, this.styleManager);
    this.dataManager = new TableDataManager(completeOptions);
    this.mergeCellManager = new MergeCellManager();
    this.fontManager = new FontManager();
    this.imageEmbedder = new ImageEmbedder();
  }

  // Validierung und Delegate an den DataManager
  setCell(row: number, col: number, value: string): void {
    this.dataManager.setCell(row, col, value);
  }

  setCellStyle(row: number, col: number, style: TableCellStyle): void {
    this.dataManager.setCellStyle(row, col, style);
  }

  // Delegate an den MergeCellManager
  mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void {
    this.dataManager.validateCellIndices(startRow, startCol);
    this.dataManager.validateCellIndices(endRow, endCol);
    this.mergeCellManager.mergeCells(startRow, startCol, endRow, endCol);
  }

  // Delegate an den FontManager
  setCustomFont(font: CustomFont): void {
    this.fontManager.setCustomFont(font);
  }

  // Data access delegates
  getCell(row: number, col: number): string {
    return this.dataManager.getCell(row, col);
  }

  getCellStyle(row: number, col: number): TableCellStyle {
    return this.dataManager.getCellStyle(row, col);
  }

  removeCell(row: number, col: number): void {
    this.dataManager.removeCell(row, col);
  }

  addRow(): void {
    this.dataManager.addRow();
  }

  addColumn(): void {
    this.dataManager.addColumn();
  }

  removeRow(row: number): void {
    this.dataManager.removeRow(row);
  }

  removeColumn(col: number): void {
    this.dataManager.removeColumn(col);
  }

  // Rendering methods
  async toPDF(): Promise<PDFDocument> {
    const pdfDoc = await PDFDocument.create();
    const pdfFont = await this.fontManager.embedFont(pdfDoc);
    const opts = this.dataManager.getOptions();
    const tableOptions = {
      rowHeight: opts.rowHeight ?? 20,
      colWidth: opts.colWidth ?? 80,
      rows: opts.rows,
      columns: opts.columns,
    };

    await this.tableRenderer.drawTable(
      pdfDoc,
      pdfFont,
      this.dataManager.getData(),
      this.dataManager.getCellStyles(),
      this.mergeCellManager.getMergedCells(),
      tableOptions,
    );

    return pdfDoc;
  }

  // PDF embedding
  async embedInPDF(existingDoc: PDFDocument, startX: number, startY: number): Promise<PDFDocument> {
    if (startX < 0 || startY < 0) {
      throw new Error('Invalid coordinates for embedInPDF');
    }

    let page = existingDoc.addPage();
    let currentY = startY;
    const options = this.dataManager.getOptions();
    const rowHeight = options.rowHeight || 20;
    const colWidth = options.colWidth || 80;
    const pdfFont = await existingDoc.embedFont(StandardFonts.Helvetica);

    for (let row = 0; row < options.rows; row++) {
      if (currentY - rowHeight < 50) {
        page = existingDoc.addPage();
        currentY = page.getSize().height - 50;
      }
      let x = startX;
      for (let col = 0; col < options.columns; col++) {
        const text = this.dataManager.getCell(row, col);
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

  // Delegate an den ImageEmbedder
  async embedTableAsImage(
    existingDoc: PDFDocument,
    imageBytes: Uint8Array,
    options: { x: number; y: number; width: number; height: number },
  ): Promise<PDFDocument> {
    return this.imageEmbedder.embedTableAsImage(existingDoc, imageBytes, options);
  }
}
