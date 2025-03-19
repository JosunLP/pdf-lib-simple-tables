import { TableCellStyle } from '../src/interfaces/TableCellStyle';
import { PdfTable } from '../src';

describe('TextDecoration Tests', () => {
  // Hilfsfunktion zum Erstellen einer Testtabelle
  function createTable(options?: Partial<{ rows: number; columns: number }>): PdfTable {
    const defaultOptions = {
      columns: 3,
      rows: 3,
      rowHeight: 30,
      colWidth: 100,
    };
    return new PdfTable({ ...defaultOptions, ...options });
  }

  test('should set and get textDecoration property', () => {
    const table = createTable();

    const underlineStyle: TableCellStyle = {
      textDecoration: 'underline',
    };
    const lineThroughStyle: TableCellStyle = {
      textDecoration: 'line-through',
    };

    table.setCellStyle(0, 0, underlineStyle);
    table.setCellStyle(1, 1, lineThroughStyle);

    expect(table.getCellStyle(0, 0).textDecoration).toBe('underline');
    expect(table.getCellStyle(1, 1).textDecoration).toBe('line-through');
    expect(table.getCellStyle(2, 2).textDecoration).toBeUndefined();
  });

  test('should combine textDecoration with other text properties', () => {
    const table = createTable();

    const combinedStyle: TableCellStyle = {
      fontSize: 14,
      fontWeight: 'bold',
      textDecoration: 'underline',
      textTransform: 'uppercase',
    };

    table.setCellStyle(1, 1, combinedStyle);
    const retrievedStyle = table.getCellStyle(1, 1);

    expect(retrievedStyle.textDecoration).toBe('underline');
    expect(retrievedStyle.fontWeight).toBe('bold');
    expect(retrievedStyle.fontSize).toBe(14);
    expect(retrievedStyle.textTransform).toBe('uppercase');
  });

  test('should generate PDF with text decoration without errors', async () => {
    const table = createTable({ rows: 2, columns: 2 });

    // Set cell content and styles with decoration
    table.setCell(0, 0, 'Underlined Text');
    table.setCellStyle(0, 0, { textDecoration: 'underline' });

    table.setCell(0, 1, 'Line-through Text');
    table.setCellStyle(0, 1, { textDecoration: 'line-through' });

    table.setCell(1, 0, 'Normal Text');

    table.setCell(1, 1, 'Mixed Formatting');
    table.setCellStyle(1, 1, {
      textDecoration: 'underline',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    });

    // Test if PDF generation completes without errors
    const pdfDoc = await table.toPDF();
    expect(pdfDoc).toBeDefined();

    // Verify the PDF has been created with at least one page
    expect(pdfDoc.getPageCount()).toBeGreaterThanOrEqual(1);
  });

  test('should render wrapped text with decoration correctly', async () => {
    const table = createTable({ rows: 1, columns: 1 });

    // Create cell with long text content that should wrap
    const longText =
      'This is a very long text that should wrap to multiple lines and have appropriate text decoration applied to each line.';
    table.setCell(0, 0, longText);
    table.setCellStyle(0, 0, {
      textDecoration: 'underline',
      wordWrap: 'normal',
    });

    // Test if PDF generation completes without errors
    const pdfDoc = await table.toPDF();

    // We can only verify that the PDF generation completed successfully
    // Visual inspection would be needed to fully verify the decoration on wrapped text
    expect(pdfDoc).toBeDefined();
  });
});
