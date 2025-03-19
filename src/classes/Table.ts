import { PDFDocument, StandardFonts } from 'pdf-lib';
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
import { TableTemplate } from '../templates/TableTemplate';
import { TableTemplateManager } from '../managers/TableTemplateManager';
import { predefinedTemplates } from '../templates/predefinedTemplates';
import { TableMerger, MergeDirection, MergeTableOptions } from '../managers/TableMerger';

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
  public templateManager: TableTemplateManager;

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

    // Initialisierung des Template-Managers mit vordefinierten Templates
    this.templateManager = new TableTemplateManager();
    predefinedTemplates.forEach((template) => {
      this.templateManager.addTemplate(template);
    });
  }

  /**
   * Wendet ein Template auf die Tabelle an
   * @param template Name des Templates oder TableTemplate-Objekt
   */
  applyTemplate(template: string | TableTemplate): void {
    const designConfig = this.templateManager.convertTemplateToDesignConfig(template);
    this.designConfig = designConfig;
    this.styleManager = new TableStyleManager(this.designConfig);
    this.tableRenderer = new TableRenderer(this.borderRenderer, this.styleManager);
  }

  /**
   * Erstellt ein benutzerdefiniertes Template
   * @param template TableTemplate-Definition
   */
  createTemplate(template: TableTemplate): void {
    this.templateManager.addTemplate(template);
  }

  /**
   * Lädt ein Template aus einem JSON-String
   * @param jsonString JSON-String mit Template-Definition
   */
  loadTemplateFromJson(jsonString: string): void {
    this.templateManager.loadTemplateFromJson(jsonString);
  }

  /**
   * Gibt alle verfügbaren Template-Namen zurück
   */
  getAvailableTemplates(): string[] {
    return this.templateManager.getAllTemplates().map((t) => t.name);
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
    // Berechne Zellenmaße anhand der Gesamtgröße, falls angegeben
    let rowHeight = opts.rowHeight ?? 20;
    let colWidth = opts.colWidth ?? 80;
    if (opts.tableWidth) {
      colWidth = opts.tableWidth / opts.columns;
    }
    if (opts.tableHeight) {
      rowHeight = opts.tableHeight / opts.rows;
    }

    await this.tableRenderer.drawTable(
      pdfDoc,
      pdfFont,
      this.dataManager.getData(),
      this.dataManager.getCellStyles(),
      this.mergeCellManager.getMergedCells(),
      {
        rowHeight,
        colWidth,
        rows: opts.rows,
        columns: opts.columns,
        repeatHeaderRows: opts.repeatHeaderRows,
        headerRepetition: opts.headerRepetition, // Neue Option weitergeben
        pageBreakThreshold: opts.pageBreakThreshold,
      },
    );

    return pdfDoc;
  }

  async embedInPDF(existingDoc: PDFDocument, startX: number, startY: number): Promise<PDFDocument> {
    if (startX < 0 || startY < 0) {
      throw new Error('Invalid coordinates for embedInPDF');
    }

    const opts = this.dataManager.getOptions();
    const pdfFont = await existingDoc.embedFont(StandardFonts.Helvetica);

    // Berechne Zellenmaße analog zu toPDF
    let rowHeight = opts.rowHeight ?? 20;
    let colWidth = opts.colWidth ?? 80;
    if (opts.tableWidth) {
      colWidth = opts.tableWidth / opts.columns;
    }
    if (opts.tableHeight) {
      rowHeight = opts.tableHeight / opts.rows;
    }

    // Verwende TableRenderer für konsistentes Rendering mit Seitenumbruch
    const tableOptions = {
      rowHeight,
      colWidth,
      rows: opts.rows,
      columns: opts.columns,
      repeatHeaderRows: opts.repeatHeaderRows,
      pageBreakThreshold: opts.pageBreakThreshold ?? 50,
    };

    // Erste Seite hinzufügen wenn noch keine vorhanden
    if (existingDoc.getPageCount() === 0) {
      existingDoc.addPage();
    }

    // Anpassen des initialen Y-Werts
    const firstPage = existingDoc.getPage(existingDoc.getPageCount() - 1);
    const initialY = startY > 0 ? startY : firstPage.getSize().height - 50;

    // Modifizierter TableRenderer für existierendes Dokument
    const customRenderer = new TableRenderer(this.borderRenderer, this.styleManager);

    // Seitenumbruch mit TableRenderer
    await customRenderer.drawTable(
      existingDoc,
      pdfFont,
      this.dataManager.getData(),
      this.dataManager.getCellStyles(),
      this.mergeCellManager.getMergedCells(),
      {
        ...tableOptions,
        startX: startX,
        startY: initialY,
        useExistingPages: true,
        headerRepetition: opts.headerRepetition, // Neue Option weitergeben
      },
    );

    return existingDoc;
  }

  // PDF embedding
  async embedTableAsImage(
    existingDoc: PDFDocument,
    imageBytes: Uint8Array,
    options: { x: number; y: number; width: number; height: number },
  ): Promise<PDFDocument> {
    return this.imageEmbedder.embedTableAsImage(existingDoc, imageBytes, options);
  }

  /**
   * Gibt die aktuelle Design-Konfiguration zurück
   * @returns DesignConfig-Objekt
   */
  getDesignConfig(): DesignConfig {
    return this.designConfig;
  }

  /**
   * Wendet eine Design-Konfiguration auf die Tabelle an
   * @param config Design-Konfiguration
   */
  applyDesignConfig(config: DesignConfig): void {
    this.designConfig = { ...this.designConfig, ...config };
    this.styleManager.updateDesignConfig(this.designConfig);
  }

  /**
   * Gibt die Anzahl der Zeilen zurück
   * @returns Anzahl der Zeilen
   */
  getRowCount(): number {
    return this.dataManager.getRowCount();
  }

  /**
   * Gibt die Anzahl der Spalten zurück
   * @returns Anzahl der Spalten
   */
  getColumnCount(): number {
    return this.dataManager.getColumnCount();
  }

  /**
   * Gibt eine Liste der zusammengeführten Zellen zurück
   * @returns Array von MergedCell-Objekten
   */
  getMergedCells(): { startRow: number; startCol: number; endRow: number; endCol: number }[] {
    return this.mergeCellManager.getMergedCells();
  }

  /**
   * Gibt den explizit gesetzten Stil einer Zelle zurück (ohne Design-Konfiguration)
   * @param row Zeilenindex
   * @param col Spaltenindex
   * @returns TableCellStyle-Objekt oder null
   */
  getRawCellStyle(row: number, col: number): TableCellStyle | null {
    return this.dataManager.getCellStyle(row, col);
  }

  /**
   * Gibt den kombinierten Stil einer Zelle zurück (mit Design-Konfiguration)
   * @param row Zeilenindex
   * @param col Spaltenindex
   * @returns TableCellStyle-Objekt
   */
  getCellStyle(row: number, col: number): TableCellStyle {
    // Überprüfen, ob ein expliziter Style gesetzt wurde
    const userStyle = this.dataManager.getCellStyle(row, col);

    // Effektiven Stil berechnen, der Design-Config und ggf. Benutzer-Stil kombiniert
    return this.styleManager.getEffectiveCellStyle(
      row,
      col,
      userStyle || {},
      this.getRowCount(),
      this.getColumnCount(),
    );
  }

  /**
   * Fügt diese Tabelle mit anderen Tabellen zusammen
   * @param tables Tabellen, die hinzugefügt werden sollen
   * @param options Optionen für die Zusammenführung
   * @returns Eine neue zusammengeführte PdfTable-Instanz
   */
  merge(tables: PdfTable[], options: MergeTableOptions = {}): PdfTable {
    return TableMerger.mergeTables([this, ...tables], options);
  }

  /**
   * Statische Methode zum Zusammenführen mehrerer Tabellen
   * @param tables Array von Tabellen
   * @param options Optionen für die Zusammenführung
   * @returns Eine neue zusammengeführte PdfTable-Instanz
   */
  static mergeTables(tables: PdfTable[], options: MergeTableOptions = {}): PdfTable {
    return TableMerger.mergeTables(tables, options);
  }
}
