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
  // Nicht zwei Mal die gleichen Zellen mergen, sondern verschiedene Zellen
  expect(() => table.mergeCells(2, 2, 3, 3)).not.toThrow();
});

test('PdfTable: should throw an error for invalid merge coordinates', () => {
  const table = createTable();
  // Ungültige Koordinaten (außerhalb der Tabelle)
  expect(() => table.mergeCells(5, 5, 6, 6)).toThrowError('Invalid cell coordinates');
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

  // Prüfen Sie nur die explizit gesetzten Eigenschaften, nicht den gesamten kombinierten Stil
  const retrievedStyle = table.getCellStyle(0, 0);
  expect(retrievedStyle?.fontSize).toBe(style.fontSize);
  expect(retrievedStyle?.alignment).toBe(style.alignment);
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

test('PdfTable: should correctly get row count', () => {
  const table = createTable();
  expect(table.getRowCount()).toBe(4);

  table.addRow();
  expect(table.getRowCount()).toBe(5);

  table.removeRow(4);
  expect(table.getRowCount()).toBe(4);
});

test('PdfTable: should correctly get column count', () => {
  const table = createTable();
  expect(table.getColumnCount()).toBe(4);

  table.addColumn();
  expect(table.getColumnCount()).toBe(5);

  table.removeColumn(4);
  expect(table.getColumnCount()).toBe(4);
});

test('PdfTable: should get design config correctly', () => {
  const designConfig = {
    fontSize: 12,
    fontColor: { r: 10, g: 20, b: 30 },
    backgroundColor: { r: 240, g: 240, b: 240 },
  };

  const table = new PdfTable({
    columns: 3,
    rows: 3,
    designConfig,
  });

  const retrievedConfig = table.getDesignConfig();
  expect(retrievedConfig.fontSize).toBe(designConfig.fontSize);
  expect(retrievedConfig.fontColor).toEqual(designConfig.fontColor);
  expect(retrievedConfig.backgroundColor).toEqual(designConfig.backgroundColor);
});

test('PdfTable: should apply design config correctly', () => {
  const table = createTable();
  const newConfig = {
    fontSize: 16,
    fontColor: { r: 50, g: 60, b: 70 },
  };

  table.applyDesignConfig(newConfig);
  const retrievedConfig = table.getDesignConfig();

  expect(retrievedConfig.fontSize).toBe(newConfig.fontSize);
  expect(retrievedConfig.fontColor).toEqual(newConfig.fontColor);
});

test('PdfTable: should merge two tables correctly using instance method', () => {
  const table1 = createTable();
  const table2 = createTable();

  table1.setCell(0, 0, 'Table 1');
  table2.setCell(0, 0, 'Table 2');

  const mergedTable = table1.merge([table2]);

  expect(mergedTable.getRowCount()).toBe(8); // 4 + 4 rows
  expect(mergedTable.getColumnCount()).toBe(4);
  expect(mergedTable.getCell(0, 0)).toBe('Table 1');
  expect(mergedTable.getCell(4, 0)).toBe('Table 2'); // First row of second table
});

test('PdfTable: should merge tables correctly using static method', () => {
  const table1 = createTable();
  const table2 = createTable();

  table1.setCell(0, 0, 'Static 1');
  table2.setCell(0, 0, 'Static 2');

  const mergedTable = PdfTable.mergeTables([table1, table2], { direction: 'horizontal' });

  expect(mergedTable.getRowCount()).toBe(4);
  expect(mergedTable.getColumnCount()).toBe(8); // 4 + 4 columns
  expect(mergedTable.getCell(0, 0)).toBe('Static 1');
  expect(mergedTable.getCell(0, 4)).toBe('Static 2'); // First column of second table
});
