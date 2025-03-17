import { DesignConfig } from '../config/DesignConfig';
import { TableCellStyle } from '../interfaces/TableCellStyle';

/**
 * Manager für Tabellen-Stile
 * Kümmert sich um die Anwendung und Kombination von Zellen-Styles
 */
export class TableStyleManager {
  private designConfig: DesignConfig;

  constructor(designConfig: DesignConfig) {
    this.designConfig = designConfig;
  }

  /**
   * Ermittelt den effektiven Stil für eine Zelle
   * indem Designkonfiguration und Benutzerstil kombiniert werden
   */
  getEffectiveCellStyle(row: number, col: number, userStyle: TableCellStyle): TableCellStyle {
    let effectiveStyle: TableCellStyle = { ...userStyle };

    // Anwenden von Kopfzeilenstilen, wenn anwendbar
    if (row === 0 && this.designConfig.headingRowStyle) {
      effectiveStyle = { ...this.designConfig.headingRowStyle, ...effectiveStyle };
    }
    if (col === 0 && this.designConfig.headingColumnStyle) {
      effectiveStyle = { ...this.designConfig.headingColumnStyle, ...effectiveStyle };
    }

    // Vereinfachte Zusammenführung der Standard-Rahmenlinien
    const borderMapping: { [key: string]: string } = {
      topBorder: 'defaultTopBorder',
      rightBorder: 'defaultRightBorder',
      bottomBorder: 'defaultBottomBorder',
      leftBorder: 'defaultLeftBorder',
    };
    Object.keys(borderMapping).forEach((borderKey) => {
      if (
        !(effectiveStyle as Record<string, unknown>)[borderKey] &&
        (this.designConfig as Record<string, unknown>)[borderMapping[borderKey]]
      ) {
        (effectiveStyle as Record<string, unknown>)[borderKey] = {
          ...((this.designConfig as Record<string, unknown>)[borderMapping[borderKey]] as object),
        };
      }
    });

    // Merge additionalBorders aus DesignConfig und userStyle
    effectiveStyle.additionalBorders = [
      ...(this.designConfig.additionalBorders || []),
      ...(userStyle.additionalBorders || []),
    ];

    return effectiveStyle;
  }

  /**
   * Normalisiert RGB-Farbwerte (0-255 oder 0-1)
   */
  normalizeColor(color: { r: number; g: number; b: number } | string): {
    r: number;
    g: number;
    b: number;
  } {
    if (typeof color === 'string') {
      // Hex-String verarbeiten, z.B. "#ff0000" oder "ff0000"
      let hex = color.replace('#', '');
      if (hex.length === 3) {
        // Kurzform erweitern
        hex = hex
          .split('')
          .map((ch) => ch + ch)
          .join('');
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r: r / 255, g: g / 255, b: b / 255 };
    }
    return {
      r: color.r > 1 ? color.r / 255 : color.r,
      g: color.g > 1 ? color.g / 255 : color.g,
      b: color.b > 1 ? color.b / 255 : color.b,
    };
  }
}
