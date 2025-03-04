import { PdfTable } from '../src/classes/Table';
import { PDFDocument } from 'pdf-lib';
import { TableOptions } from '../src/interfaces/TableOptions';
import { CustomFont } from '../src';

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

test('PdfTable: should add and remove rows correctly', () => {
  const table = createTable();
  table.addRow();
  expect(table.getCell(4, 0)).toBe('');
  table.removeRow(4);
  expect(() => table.getCell(4, 0)).toThrowError('Invalid cell coordinates');
});

test('PdfTable: should add and remove columns correctly', () => {
  const table = createTable();
  table.addColumn();
  expect(table.getCell(0, 4)).toBe('');
  table.removeColumn(4);
  expect(() => table.getCell(0, 4)).toThrowError('Invalid cell coordinates');
});

test('PdfTable: should set and get cell styles correctly', () => {
  const table = createTable();
  const style = { fontSize: 16, alignment: 'center' as const };
  table.setCellStyle(0, 0, style);
  expect(table.getCellStyle(0, 0)).toEqual(style);
});

test('PdfTable: should throw error for invalid cell coordinates', () => {
  const table = createTable();
  expect(() => table.getCell(10, 10)).toThrowError('Invalid cell coordinates');
  expect(() => table.setCellStyle(10, 10, {})).toThrowError('Invalid cell coordinates');
});

test('PdfTable: should set and get custom font correctly', () => {
  const table = createTable();
  const font = new CustomFont('TestFont', 'dGVzdGJhc2U2NA==');
  table.setCustomFont(font);
  expect(() => table.setCustomFont(new CustomFont('InvalidFont', 'invalid_base64'))).toThrowError(
    'Invalid Base64 data',
  );
});
