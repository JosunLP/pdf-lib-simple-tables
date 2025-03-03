import { PdfTable } from '../src/classes/Table';
import { PDFDocument } from 'pdf-lib';
import { TableOptions } from '../src/interfaces/TableOptions';

function createTable(): PdfTable {
  const options: TableOptions = { columns: 4, rows: 4, rowHeight: 20, colWidth: 80 };
  return new PdfTable(options);
}

test('PdfTable: should create a PDF page', async () => {
  const table = createTable();
  const pdfDoc: PDFDocument = await table.toPDF();
  const pages = pdfDoc.getPages();
  expect(pages.length).toBeGreaterThan(0);
});

test('PdfTable: should be able to set cells with content', () => {
  const table = createTable();
  // First call to set the cell should succeed.
  table.setCell(1, 1, 'Test');
  // The following call should not throw.
  expect(() => table.setCell(1, 1, 'Test')).not.toThrow();
});

test('PdfTable: should be able to set individual cell styles', () => {
  const table = createTable();
  const style = { fontSize: 16, alignment: 'center' as const };
  table.setCellStyle(0, 0, style);
  expect(() => table.setCellStyle(0, 0, style)).not.toThrow();
});

test('PdfTable: should merge cells correctly', () => {
  const table = createTable();
  table.mergeCells(0, 0, 1, 1);
  expect(() => table.mergeCells(0, 0, 1, 1)).not.toThrow();
});

test('PdfTable: should throw an error for invalid merge coordinates', () => {
  const table = createTable();
  expect(() => table.mergeCells(2, 2, 1, 1)).toThrowError(
    'Invalid cell coordinates for mergeCells',
  );
});
