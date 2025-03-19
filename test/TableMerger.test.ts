import { PdfTable } from '../src/classes/Table';
import { TableOptions } from '../src/interfaces/TableOptions';
import { TableMerger, MergeDirection, MergeTableOptions } from '../src/managers/TableMerger';

function createTestTable(options?: Partial<TableOptions>): PdfTable {
  const defaultOptions: TableOptions = {
    columns: 3,
    rows: 2,
    rowHeight: 20,
    colWidth: 80,
  };
  return new PdfTable({ ...defaultOptions, ...options });
}

describe('TableMerger', () => {
  test('should throw error if less than two tables are provided', () => {
    const table = createTestTable();
    expect(() => TableMerger.mergeTables([table])).toThrowError(
      'At least two tables are required for merging',
    );
  });

  test('should merge two tables horizontally', () => {
    // Erstelle zwei Test-Tabellen
    const table1 = createTestTable();
    const table2 = createTestTable();

    // Fülle die Tabellen mit Daten
    table1.setCell(0, 0, 'T1-A1');
    table1.setCell(0, 1, 'T1-A2');
    table1.setCell(0, 2, 'T1-A3');
    table1.setCell(1, 0, 'T1-B1');
    table1.setCell(1, 1, 'T1-B2');
    table1.setCell(1, 2, 'T1-B3');

    table2.setCell(0, 0, 'T2-A1');
    table2.setCell(0, 1, 'T2-A2');
    table2.setCell(0, 2, 'T2-A3');
    table2.setCell(1, 0, 'T2-B1');
    table2.setCell(1, 1, 'T2-B2');
    table2.setCell(1, 2, 'T2-B3');

    // Führe die Tabellen horizontal zusammen
    const mergedTable = TableMerger.mergeTables([table1, table2], { direction: 'horizontal' });

    // Prüfe die Dimensionen
    expect(mergedTable.getRowCount()).toBe(2);
    expect(mergedTable.getColumnCount()).toBe(6);

    // Prüfe den Inhalt
    expect(mergedTable.getCell(0, 0)).toBe('T1-A1');
    expect(mergedTable.getCell(0, 2)).toBe('T1-A3');
    expect(mergedTable.getCell(0, 3)).toBe('T2-A1'); // Erste Spalte der zweiten Tabelle
    expect(mergedTable.getCell(0, 5)).toBe('T2-A3');
    expect(mergedTable.getCell(1, 0)).toBe('T1-B1');
    expect(mergedTable.getCell(1, 5)).toBe('T2-B3');
  });

  test('should merge two tables vertically', () => {
    // Erstelle zwei Test-Tabellen
    const table1 = createTestTable();
    const table2 = createTestTable();

    // Fülle die Tabellen mit Daten
    table1.setCell(0, 0, 'T1-A1');
    table1.setCell(0, 1, 'T1-A2');
    table1.setCell(0, 2, 'T1-A3');
    table1.setCell(1, 0, 'T1-B1');
    table1.setCell(1, 1, 'T1-B2');
    table1.setCell(1, 2, 'T1-B3');

    table2.setCell(0, 0, 'T2-A1');
    table2.setCell(0, 1, 'T2-A2');
    table2.setCell(0, 2, 'T2-A3');
    table2.setCell(1, 0, 'T2-B1');
    table2.setCell(1, 1, 'T2-B2');
    table2.setCell(1, 2, 'T2-B3');

    // Führe die Tabellen vertikal zusammen
    const mergedTable = TableMerger.mergeTables([table1, table2], { direction: 'vertical' });

    // Prüfe die Dimensionen
    expect(mergedTable.getRowCount()).toBe(4);
    expect(mergedTable.getColumnCount()).toBe(3);

    // Prüfe den Inhalt
    expect(mergedTable.getCell(0, 0)).toBe('T1-A1');
    expect(mergedTable.getCell(1, 2)).toBe('T1-B3');
    expect(mergedTable.getCell(2, 0)).toBe('T2-A1'); // Erste Zeile der zweiten Tabelle
    expect(mergedTable.getCell(3, 2)).toBe('T2-B3');
  });

  test('should maintain cell styles when merging with maintainStyles option', () => {
    // Erstelle zwei Test-Tabellen
    const table1 = createTestTable();
    const table2 = createTestTable();

    // Setze Stile für einige Zellen
    table1.setCellStyle(0, 0, { fontWeight: 'bold', backgroundColor: { r: 255, g: 0, b: 0 } });
    table2.setCellStyle(0, 0, { fontStyle: 'italic', backgroundColor: { r: 0, g: 0, b: 255 } });

    // Führe die Tabellen zusammen mit Stil-Erhaltung
    const mergedTable = TableMerger.mergeTables([table1, table2], {
      direction: 'horizontal',
      maintainStyles: true,
    });

    // Prüfe, ob die Stile erhalten bleiben
    const style1 = mergedTable.getRawCellStyle(0, 0);
    const style2 = mergedTable.getRawCellStyle(0, 3); // Erste Zelle der zweiten Tabelle

    expect(style1?.fontWeight).toBe('bold');
    expect(style1?.backgroundColor).toEqual({ r: 255, g: 0, b: 0 });
    expect(style2?.fontStyle).toBe('italic');
    expect(style2?.backgroundColor).toEqual({ r: 0, g: 0, b: 255 });
  });

  test('should correctly transfer merged cells when merging', () => {
    // Erstelle zwei Test-Tabellen
    const table1 = createTestTable();
    const table2 = createTestTable();

    // Führe Zellen zusammen
    table1.mergeCells(0, 0, 0, 1);
    table2.mergeCells(0, 1, 1, 1);

    // Führe die Tabellen zusammen
    const horizontalMerged = TableMerger.mergeTables([table1, table2], { direction: 'horizontal' });
    const verticalMerged = TableMerger.mergeTables([table1, table2], { direction: 'vertical' });

    // Prüfe, ob die zusammengeführten Zellen richtig übertragen wurden
    const horizontalMergedCells = horizontalMerged.getMergedCells();
    const verticalMergedCells = verticalMerged.getMergedCells();

    // Horizontal: erste Tabelle behält 0,0,0,1 und zweite bekommt 0,4,1,4
    expect(horizontalMergedCells).toContainEqual({
      startRow: 0,
      startCol: 0,
      endRow: 0,
      endCol: 1,
    });
    expect(horizontalMergedCells).toContainEqual({
      startRow: 0,
      startCol: 4,
      endRow: 1,
      endCol: 4,
    });

    // Vertikal: erste Tabelle behält 0,0,0,1 und zweite bekommt 2,1,3,1
    expect(verticalMergedCells).toContainEqual({ startRow: 0, startCol: 0, endRow: 0, endCol: 1 });
    expect(verticalMergedCells).toContainEqual({ startRow: 2, startCol: 1, endRow: 3, endCol: 1 });
  });

  test('should use instance method merge correctly', () => {
    const table1 = createTestTable();
    const table2 = createTestTable();

    table1.setCell(0, 0, 'T1-A1');
    table2.setCell(0, 0, 'T2-A1');

    // Verwende die Instanz-Methode merge
    const mergedTable = table1.merge([table2], { direction: 'horizontal' });

    expect(mergedTable.getRowCount()).toBe(2);
    expect(mergedTable.getColumnCount()).toBe(6);
    expect(mergedTable.getCell(0, 0)).toBe('T1-A1');
    expect(mergedTable.getCell(0, 3)).toBe('T2-A1');
  });

  test('should use static mergeTables method correctly', () => {
    const table1 = createTestTable();
    const table2 = createTestTable();

    table1.setCell(0, 0, 'T1-A1');
    table2.setCell(0, 0, 'T2-A1');

    // Verwende die statische Methode mergeTables
    const mergedTable = PdfTable.mergeTables([table1, table2], { direction: 'vertical' });

    expect(mergedTable.getRowCount()).toBe(4);
    expect(mergedTable.getColumnCount()).toBe(3);
    expect(mergedTable.getCell(0, 0)).toBe('T1-A1');
    expect(mergedTable.getCell(2, 0)).toBe('T2-A1');
  });

  test('should use vertical direction as default', () => {
    const table1 = createTestTable();
    const table2 = createTestTable();

    // Ohne direction-Angabe sollte vertikal zusammengeführt werden
    const mergedTable = TableMerger.mergeTables([table1, table2]);

    expect(mergedTable.getRowCount()).toBe(4);
    expect(mergedTable.getColumnCount()).toBe(3);
  });
});
