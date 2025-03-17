import { PdfTable } from '../src/classes/Table';

function createTable(): PdfTable {
  return new PdfTable({ columns: 5, rows: 5, rowHeight: 20, colWidth: 80 });
}

describe('PdfTable - Advanced Cell Features', () => {
  test('should set and get background gradient', () => {
    const table = createTable();

    const style = {
      backgroundGradient: {
        type: 'linear' as const,
        colors: [
          { position: 0, color: { r: 255, g: 255, b: 255 } },
          { position: 1, color: { r: 200, g: 220, b: 240 } },
        ],
        angle: 45,
      },
    };

    table.setCellStyle(0, 0, style);
    const retrievedStyle = table.getCellStyle(0, 0);

    expect(retrievedStyle.backgroundGradient).toEqual(style.backgroundGradient);
  });

  test('should set and get additional borders', () => {
    const table = createTable();

    const style = {
      additionalBorders: [
        {
          yOffset: 10,
          style: {
            display: true,
            color: { r: 200, g: 200, b: 200 },
            width: 0.5,
            style: 'solid' as const,
          },
        },
        {
          yOffset: 20,
          style: {
            display: true,
            color: { r: 150, g: 150, b: 150 },
            width: 1,
            style: 'dashed' as const,
            dashArray: [2, 2],
          },
        },
      ],
    };

    table.setCellStyle(1, 1, style);
    const retrievedStyle = table.getCellStyle(1, 1);

    expect(retrievedStyle.additionalBorders).toEqual(style.additionalBorders);
  });

  test('should set and get column and row span', () => {
    const table = createTable();

    const style = {
      columnSpan: 2,
      rowSpan: 3,
    };

    table.setCellStyle(1, 1, style);
    const retrievedStyle = table.getCellStyle(1, 1);

    expect(retrievedStyle.columnSpan).toBe(style.columnSpan);
    expect(retrievedStyle.rowSpan).toBe(style.rowSpan);
  });

  test('should handle cell removal for blank content', () => {
    const table = createTable();

    // Set some content
    table.setCell(2, 2, 'Hello');
    expect(table.getCell(2, 2)).toBe('Hello');

    // Remove the cell (set to blank)
    table.removeCell(2, 2);
    expect(table.getCell(2, 2)).toBe('');
  });
});
