import { PdfTable } from '../src/classes/Table';
import { TableOptions } from '../src/interfaces/TableOptions';

function createTable(options?: Partial<TableOptions>): PdfTable {
  const defaultOptions: TableOptions = {
    columns: 3,
    rows: 3,
    rowHeight: 20,
    colWidth: 80,
  };
  return new PdfTable({ ...defaultOptions, ...options });
}

describe('PdfTable - Text Formatting', () => {
  test('should set and get vertical alignment', () => {
    const table = createTable();

    const alignments = ['top', 'middle', 'bottom'] as const;

    alignments.forEach((alignment, index) => {
      table.setCellStyle(0, index, { verticalAlignment: alignment });
      expect(table.getCellStyle(0, index).verticalAlignment).toBe(alignment);
    });
  });

  test('should create table with wordWrap configuration', () => {
    const wordWrapOptions = ['normal', 'break-word', 'none'] as const;

    wordWrapOptions.forEach((option) => {
      const table = createTable({
        designConfig: { wordWrap: option },
      });

      // Test passes if table creation doesn't throw
      expect(table).toBeDefined();
    });
  });

  test('should create table with dynamicRowHeight configuration', () => {
    const table = createTable({
      designConfig: { dynamicRowHeight: true },
    });

    // Test passes if table creation doesn't throw
    expect(table).toBeDefined();
  });

  test('should set and get text formatting properties', () => {
    const table = createTable();

    const style = {
      fontWeight: 'bold' as const,
      fontStyle: 'italic' as const,
      textDecoration: 'underline' as const,
      textTransform: 'uppercase' as const,
    };

    table.setCellStyle(1, 1, style);
    const retrievedStyle = table.getCellStyle(1, 1);

    expect(retrievedStyle.fontWeight).toBe(style.fontWeight);
    expect(retrievedStyle.fontStyle).toBe(style.fontStyle);
    expect(retrievedStyle.textDecoration).toBe(style.textDecoration);
    expect(retrievedStyle.textTransform).toBe(style.textTransform);
  });
});
