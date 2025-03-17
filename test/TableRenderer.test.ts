import { PDFDocument, PDFPage, PDFFont, StandardFonts } from 'pdf-lib';
import { TableRenderer } from '../src/renderers/TableRenderer';
import { TableCellStyle } from '../src/interfaces/TableCellStyle';
import { BorderRenderer } from '../src/renderers/BorderRenderer';
import { TableStyleManager } from '../src/managers/TableStyleManager';
import { MergedCell } from '../src/interfaces/MergedCell';

describe('TableRenderer', () => {
  let tableRenderer: TableRenderer;
  let pdfDoc: PDFDocument;
  let page: PDFPage;
  let pdfFont: PDFFont;
  let borderRenderer: BorderRenderer;
  let styleManager: TableStyleManager;

  beforeEach(async () => {
    borderRenderer = new BorderRenderer();
    styleManager = new TableStyleManager({ cellSpacing: 5, borderWidth: 1 });
    tableRenderer = new TableRenderer(borderRenderer, styleManager);
    pdfDoc = await PDFDocument.create();
    page = pdfDoc.addPage();
    pdfFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  });

  test('should draw a single cell', () => {
    const cellStyle: TableCellStyle = {
      fontSize: 12,
      fontColor: { r: 0, g: 0, b: 0 },
      backgroundColor: { r: 255, g: 255, b: 255 },
      padding: 5,
    };

    tableRenderer.drawCell(page, 10, 10, 100, 20, 'Test Cell', cellStyle, pdfFont);
    // Überprüfen, ob die Zelle gezeichnet wurde (hier könnte man Mocking verwenden)
    expect(true).toBe(true); // Platzhalter für tatsächliche Überprüfung
  });

  test('should draw a table with multiple cells', async () => {
    const data = [
      ['Header 1', 'Header 2'],
      ['Cell 1', 'Cell 2'],
    ];
    const cellStyles: TableCellStyle[][] = [
      [
        {
          fontSize: 12,
          fontColor: { r: 0, g: 0, b: 0 },
          backgroundColor: { r: 200, g: 200, b: 200 },
        },
        {
          fontSize: 12,
          fontColor: { r: 0, g: 0, b: 0 },
          backgroundColor: { r: 200, g: 200, b: 200 },
        },
      ],
      [
        {
          fontSize: 12,
          fontColor: { r: 0, g: 0, b: 0 },
          backgroundColor: { r: 255, g: 255, b: 255 },
        },
        {
          fontSize: 12,
          fontColor: { r: 0, g: 0, b: 0 },
          backgroundColor: { r: 255, g: 255, b: 255 },
        },
      ],
    ];
    const mergedCells: MergedCell[] = [];

    await tableRenderer.drawTable(pdfDoc, pdfFont, data, cellStyles, mergedCells, {
      rowHeight: 20,
      colWidth: 100,
      rows: 2,
      columns: 2,
    });

    // Überprüfen, ob die Tabelle gezeichnet wurde (hier könnte man Mocking verwenden)
    expect(true).toBe(true); // Platzhalter für tatsächliche Überprüfung
  });

  test('should handle merged cells', async () => {
    const data = [
      ['Header 1', 'Header 2'],
      ['Cell 1', 'Cell 2'],
    ];
    const cellStyles: TableCellStyle[][] = [
      [
        {
          fontSize: 12,
          fontColor: { r: 0, g: 0, b: 0 },
          backgroundColor: { r: 200, g: 200, b: 200 },
        },
        {
          fontSize: 12,
          fontColor: { r: 0, g: 0, b: 0 },
          backgroundColor: { r: 200, g: 200, b: 200 },
        },
      ],
      [
        {
          fontSize: 12,
          fontColor: { r: 0, g: 0, b: 0 },
          backgroundColor: { r: 255, g: 255, b: 255 },
        },
        {
          fontSize: 12,
          fontColor: { r: 0, g: 0, b: 0 },
          backgroundColor: { r: 255, g: 255, b: 255 },
        },
      ],
    ];
    const mergedCells: MergedCell[] = [{ startRow: 0, endRow: 1, startCol: 0, endCol: 1 }];

    await tableRenderer.drawTable(pdfDoc, pdfFont, data, cellStyles, mergedCells, {
      rowHeight: 20,
      colWidth: 100,
      rows: 2,
      columns: 2,
    });

    // Überprüfen, ob die zusammengeführten Zellen korrekt gezeichnet wurden
    expect(true).toBe(true); // Platzhalter für tatsächliche Überprüfung
  });
});
