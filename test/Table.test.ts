import { PdfTable } from '../src/classes/Table';
import { PDFDocument } from 'pdf-lib';
import { TableOptions } from '../src/interfaces/TableOptions';

function createTable(): PdfTable {
  const options: TableOptions = { columns: 4, rows: 4, rowHeight: 20, colWidth: 80 };
  return new PdfTable(options);
}

test('PdfTable: sollte eine PDF-Seite erstellen', async () => {
  const table = createTable();
  const pdfDoc: PDFDocument = await table.toPDF();
  const pages = pdfDoc.getPages();
  expect(pages.length).toBeGreaterThan(0);
});

test('PdfTable: sollte Zellen mit Inhalt setzen können', () => {
  const table = createTable();
  // First call to set the cell should succeed.
  table.setCell(1, 1, 'Test');
  // The following call should not throw.
  expect(() => table.setCell(1, 1, 'Test')).not.toThrow();
});

test('PdfTable: sollte individuelle Zellenstile setzen können', () => {
  const table = createTable();
  const style = { fontSize: 16, alignment: 'center' as const };
  table.setCellStyle(0, 0, style);
  expect(() => table.setCellStyle(0, 0, style)).not.toThrow();
});

test('PdfTable: sollte Zellen korrekt zusammenführen', () => {
  const table = createTable();
  table.mergeCells(0, 0, 1, 1);
  expect(() => table.mergeCells(0, 0, 1, 1)).not.toThrow();
});

test('PdfTable: sollte einen Fehler bei ungültigen Merge-Koordinaten werfen', () => {
  const table = createTable();
  expect(() => table.mergeCells(2, 2, 1, 1)).toThrowError(
    'Ungültige Zellenkoordinaten für mergeCells',
  );
});
