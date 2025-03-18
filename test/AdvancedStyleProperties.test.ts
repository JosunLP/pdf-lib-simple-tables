import { TableStyleManager } from '../src/managers/TableStyleManager';
import { DesignConfig } from '../src/config/DesignConfig';
import { TableCellStyle } from '../src/interfaces/TableCellStyle';

describe('TableStyleManager - Advanced Properties', () => {
  test('should apply all DesignConfig properties to cell styles', () => {
    // Erstelle eine umfassende DesignConfig mit allen möglichen Eigenschaften
    const designConfig: DesignConfig = {
      fontFamily: 'Arial, sans-serif',
      fontSize: 12,
      fontColor: { r: 0, g: 0, b: 0 },
      backgroundColor: { r: 255, g: 255, b: 255 },
      borderColor: { r: 200, g: 200, b: 200 },
      borderWidth: 1,
      fontWeight: 'bold',
      fontStyle: 'italic',
      alignment: 'center',
      padding: '5 10 5 10',
      verticalAlignment: 'middle',
      borderRadius: '2',
      wordWrap: 'normal',
      defaultTopBorder: {
        display: true,
        color: { r: 100, g: 100, b: 100 },
        width: 2,
        style: 'solid',
      },
    };

    const styleManager = new TableStyleManager(designConfig);

    // Leerer Benutzerstil
    const userStyle: TableCellStyle = {};

    // Hole den effektiven Stil
    const effectiveStyle = styleManager.getEffectiveCellStyle(1, 1, userStyle);

    // Prüfe, ob alle Eigenschaften korrekt übernommen wurden
    expect(effectiveStyle.fontFamily).toBe('Arial, sans-serif');
    expect(effectiveStyle.fontSize).toBe(12);
    expect(effectiveStyle.fontColor).toEqual({ r: 0, g: 0, b: 0 });
    expect(effectiveStyle.backgroundColor).toEqual({ r: 255, g: 255, b: 255 });
    expect(effectiveStyle.fontWeight).toBe('bold');
    expect(effectiveStyle.fontStyle).toBe('italic');
    expect(effectiveStyle.alignment).toBe('center');
    expect(effectiveStyle.padding).toBe('5 10 5 10');
    expect(effectiveStyle.verticalAlignment).toBe('middle');
    expect(effectiveStyle.borderRadius).toBe('2');
    expect(effectiveStyle.wordWrap).toBe('normal');
    expect(effectiveStyle.topBorder).toEqual({
      display: true,
      color: { r: 100, g: 100, b: 100 },
      width: 2,
      style: 'solid',
    });
  });

  test('should apply special cell styles based on row and column', () => {
    const designConfig: DesignConfig = {
      evenRowStyle: {
        backgroundColor: { r: 240, g: 240, b: 240 },
      },
      oddRowStyle: {
        backgroundColor: { r: 255, g: 255, b: 255 },
      },
      firstRowStyle: {
        fontWeight: 'bold',
      },
      firstColumnStyle: {
        fontStyle: 'italic',
      },
    };

    const styleManager = new TableStyleManager(designConfig);

    // Erste Zeile
    const headerRowStyle = styleManager.getEffectiveCellStyle(0, 1, {});
    expect(headerRowStyle.fontWeight).toBe('bold');

    // Erste Spalte
    const headerColStyle = styleManager.getEffectiveCellStyle(1, 0, {});
    expect(headerColStyle.fontStyle).toBe('italic');

    // Gerade Zeile
    const evenRowStyle = styleManager.getEffectiveCellStyle(2, 1, {});
    expect(evenRowStyle.backgroundColor).toEqual({ r: 240, g: 240, b: 240 });

    // Ungerade Zeile
    const oddRowStyle = styleManager.getEffectiveCellStyle(1, 1, {});
    expect(oddRowStyle.backgroundColor).toEqual({ r: 255, g: 255, b: 255 });
  });

  test('should prioritize user styles over design config', () => {
    const designConfig: DesignConfig = {
      fontSize: 12,
      fontColor: { r: 0, g: 0, b: 0 },
      backgroundColor: { r: 255, g: 255, b: 255 },
    };

    const styleManager = new TableStyleManager(designConfig);

    // Benutzerstil überschreibt DesignConfig
    const userStyle: TableCellStyle = {
      fontSize: 16,
      fontColor: { r: 255, g: 0, b: 0 },
    };

    const effectiveStyle = styleManager.getEffectiveCellStyle(1, 1, userStyle);

    expect(effectiveStyle.fontSize).toBe(16);
    expect(effectiveStyle.fontColor).toEqual({ r: 255, g: 0, b: 0 });
    expect(effectiveStyle.backgroundColor).toEqual({ r: 255, g: 255, b: 255 });
  });

  test('should handle numeric font weights', () => {
    const designConfig: DesignConfig = {
      fontFamily: 'Arial, sans-serif',
      fontSize: 12,
      fontColor: { r: 0, g: 0, b: 0 },
      backgroundColor: { r: 255, g: 255, b: 255 },
    };

    const styleManager = new TableStyleManager(designConfig);

    // Numerischer fontWeight-Wert
    const userStyle: TableCellStyle = {
      fontWeight: 500,
    };

    const effectiveStyle = styleManager.getEffectiveCellStyle(1, 1, userStyle);

    // Überprüfe, ob der numerische Wert korrekt übernommen wurde
    expect(effectiveStyle.fontWeight).toBe(500);
  });
});
