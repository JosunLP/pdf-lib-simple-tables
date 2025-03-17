import { PdfTable } from '../src/classes/Table';

describe('PdfTable - Design Features', () => {
  test('should create table with alternating row colors', () => {
    const designConfig = {
      evenRowStyle: {
        backgroundColor: { r: 255, g: 255, b: 255 },
      },
      oddRowStyle: {
        backgroundColor: { r: 245, g: 245, b: 245 },
      },
    };

    const table = new PdfTable({
      columns: 3,
      rows: 10,
      rowHeight: 20,
      colWidth: 80,
      designConfig,
    });

    // Test passes if table creation doesn't throw
    expect(table).toBeDefined();
  });

  test('should create table with section styling', () => {
    const designConfig = {
      theadStyle: {
        backgroundColor: { r: 230, g: 230, b: 230 },
        borderBottom: {
          display: true,
          color: { r: 100, g: 100, b: 100 },
          width: 1,
          style: 'solid' as const,
        },
      },
      tbodyStyle: {
        backgroundColor: { r: 255, g: 255, b: 255 },
      },
      tfootStyle: {
        backgroundColor: { r: 240, g: 240, b: 240 },
        borderTop: {
          display: true,
          color: { r: 100, g: 100, b: 100 },
          width: 1,
          style: 'solid' as const,
        },
      },
    };

    const table = new PdfTable({
      columns: 3,
      rows: 10,
      rowHeight: 20,
      colWidth: 80,
      designConfig,
    });

    // Test passes if table creation doesn't throw
    expect(table).toBeDefined();
  });

  test('should create table with padding configuration', () => {
    const table = new PdfTable({
      columns: 3,
      rows: 3,
      rowHeight: 20,
      colWidth: 80,
    });

    // Test different padding formats
    const paddingStyles = [
      { padding: 5 },
      { padding: '5' },
      { padding: '5 10' },
      { padding: '5 10 15' },
      { padding: '5 10 15 20' },
    ];

    paddingStyles.forEach((style, index) => {
      table.setCellStyle(0, index % 3, style);
      expect(table.getCellStyle(0, index % 3).padding).toEqual(style.padding);
    });
  });
});
