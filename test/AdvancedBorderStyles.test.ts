import { PdfTable } from '../src/classes/Table';

function createTable(): PdfTable {
  return new PdfTable({ columns: 3, rows: 3, rowHeight: 20, colWidth: 80 });
}

describe('PdfTable - Advanced Border Styles', () => {
  test('should apply custom border styles for individual sides', () => {
    const table = createTable();

    const borderStyle = {
      topBorder: {
        display: true,
        color: { r: 255, g: 0, b: 0 },
        width: 2,
        style: 'solid' as const,
      },
      rightBorder: {
        display: true,
        color: { r: 0, g: 255, b: 0 },
        width: 1,
        style: 'dashed' as const,
        dashArray: [5, 5],
      },
      bottomBorder: {
        display: true,
        color: { r: 0, g: 0, b: 255 },
        width: 1.5,
        style: 'dotted' as const,
      },
      leftBorder: {
        display: false,
      },
    };

    table.setCellStyle(0, 0, borderStyle);
    const retrievedStyle = table.getCellStyle(0, 0);

    expect(retrievedStyle.topBorder).toEqual(borderStyle.topBorder);
    expect(retrievedStyle.rightBorder).toEqual(borderStyle.rightBorder);
    expect(retrievedStyle.bottomBorder).toEqual(borderStyle.bottomBorder);
    expect(retrievedStyle.leftBorder).toEqual(borderStyle.leftBorder);
  });

  test('should handle dashArray and dashPhase border properties', () => {
    const table = createTable();

    const style = {
      topBorder: {
        display: true,
        color: { r: 0, g: 0, b: 0 },
        width: 1,
        style: 'dashed' as const,
        dashArray: [3, 3],
        dashPhase: 1,
      },
    };

    table.setCellStyle(1, 1, style);
    const retrievedStyle = table.getCellStyle(1, 1);

    expect(retrievedStyle.topBorder?.dashArray).toEqual(style.topBorder.dashArray);
    expect(retrievedStyle.topBorder?.dashPhase).toBe(style.topBorder.dashPhase);
  });
});
