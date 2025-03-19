import { modernDesignConfig } from '../src';
import { PdfTable } from '../src/classes/Table';

describe('TableMerger with DesignConfig', () => {
  // Hilfsfunktion zum Erstellen einer Testtabelle
  function createTable(): PdfTable {
    return new PdfTable({ columns: 3, rows: 3, rowHeight: 20, colWidth: 80 });
  }

  test('should apply custom design config to merged table', () => {
    // Erstelle zwei Tabellen mit unterschiedlichen Designs
    const table1 = createTable();
    table1.applyDesignConfig({
      backgroundColor: { r: 255, g: 0, b: 0 },
      fontColor: { r: 255, g: 255, b: 255 },
    });
    table1.setCell(0, 0, 'Tabelle 1');

    const table2 = createTable();
    table2.applyDesignConfig({
      backgroundColor: { r: 0, g: 0, b: 255 },
      fontColor: { r: 255, g: 255, b: 255 },
    });
    table2.setCell(0, 0, 'Tabelle 2');

    // Führe die Tabellen zusammen mit einem neuen Design
    const mergedTable = PdfTable.mergeTables([table1, table2], {
      direction: 'vertical',
      designConfig: modernDesignConfig,
    });

    // Überprüfe, ob das neue Design angewendet wurde
    const designConfig = mergedTable.getDesignConfig();
    expect(designConfig.fontFamily).toBe(modernDesignConfig.fontFamily);
    expect(designConfig.fontSize).toBe(modernDesignConfig.fontSize);

    // Überprüfe, dass die Originalinhalte erhalten bleiben
    expect(mergedTable.getCell(0, 0)).toBe('Tabelle 1');
    expect(mergedTable.getCell(3, 0)).toBe('Tabelle 2');
  });

  test('should override maintainStyles when designConfig is provided', () => {
    // Erstelle zwei Tabellen mit unterschiedlichen Designs
    const table1 = createTable();
    table1.setCellStyle(0, 0, {
      backgroundColor: { r: 200, g: 200, b: 200 },
    });
    table1.setCell(0, 0, 'Zelle 1');

    const table2 = createTable();
    table2.setCellStyle(0, 0, {
      backgroundColor: { r: 100, g: 100, b: 100 },
    });
    table2.setCell(0, 0, 'Zelle 2');

    // Führe die Tabellen zusammen mit maintainStyles=true aber eigenem Design
    const mergedTable = PdfTable.mergeTables([table1, table2], {
      maintainStyles: true,
      designConfig: {
        backgroundColor: { r: 240, g: 240, b: 240 },
        fontColor: { r: 50, g: 50, b: 50 },
      },
    });

    // Das übergebene Design sollte höhere Priorität haben
    const designConfig = mergedTable.getDesignConfig();
    expect(designConfig.backgroundColor).toEqual({ r: 240, g: 240, b: 240 });
    expect(designConfig.fontColor).toEqual({ r: 50, g: 50, b: 50 });
  });

  test('should work correctly with instance merge method', () => {
    const table1 = createTable();
    const table2 = createTable();

    table1.setCell(0, 0, 'T1');
    table2.setCell(0, 0, 'T2');

    // Verwende die Instanzmethode für das Zusammenführen
    const mergedTable = table1.merge([table2], {
      designConfig: modernDesignConfig,
    });

    // Überprüfe, ob das Design korrekt angewendet wurde
    const designConfig = mergedTable.getDesignConfig();
    expect(designConfig.fontFamily).toBe(modernDesignConfig.fontFamily);

    // Inhalte sollten erhalten bleiben
    expect(mergedTable.getCell(0, 0)).toBe('T1');
    expect(mergedTable.getCell(3, 0)).toBe('T2');
  });
});
