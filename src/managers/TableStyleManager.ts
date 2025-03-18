import { DesignConfig } from '../config/DesignConfig';
import { TableCellStyle } from '../interfaces/TableCellStyle';

/**
 * Manager für Tabellen-Stile
 * Kümmert sich um die Anwendung und Kombination von Zellen-Styles
 */
export class TableStyleManager {
  // Diese Property muss öffentlich sein, damit der TableRenderer auf die wordWrap-Eigenschaft zugreifen kann
  public designConfig: DesignConfig;

  constructor(designConfig: DesignConfig) {
    this.designConfig = designConfig;
  }

  /**
   * Ermittelt den effektiven Stil für eine Zelle
   * indem Designkonfiguration und Benutzerstil kombiniert werden
   */
  getEffectiveCellStyle(row: number, col: number, userStyle: TableCellStyle): TableCellStyle {
    // Basis-Stil aus der Design-Konfiguration
    const baseStyle: TableCellStyle = {
      // Grundlegende Stileigenschaften
      fontSize: this.designConfig.fontSize,
      fontColor: this.designConfig.fontColor,
      backgroundColor: this.designConfig.backgroundColor,
      borderColor: this.designConfig.borderColor,
      borderWidth: this.designConfig.borderWidth,

      // Basis-Eigenschaften für Text und Ausrichtung
      fontFamily: this.designConfig.fontFamily,
      fontWeight: this.designConfig.fontWeight,
      fontStyle: this.designConfig.fontStyle,
      alignment: this.designConfig.alignment,
      padding: this.designConfig.padding,
      verticalAlignment: this.designConfig.verticalAlignment,
      borderRadius: this.designConfig.borderRadius,
      wordWrap: this.designConfig.wordWrap,

      // Erweiterte Border-Stile
      topBorder: this.designConfig.defaultTopBorder || this.designConfig.borderTop,
      rightBorder: this.designConfig.defaultRightBorder || this.designConfig.borderRight,
      bottomBorder: this.designConfig.defaultBottomBorder || this.designConfig.borderBottom,
      leftBorder: this.designConfig.defaultLeftBorder || this.designConfig.borderLeft,
      additionalBorders: this.designConfig.additionalBorders,

      // Erweiterte Textformatierung
      textDecoration: this.designConfig.textDecoration,
      textTransform: this.designConfig.textTransform,
      textOverflow: this.designConfig.textOverflow,
      whiteSpace: this.designConfig.whiteSpace,

      // Visuelle Effekte
      boxShadow: this.designConfig.boxShadow,
      opacity: this.designConfig.opacity,

      // Erweiterte Layout-Eigenschaften
      columnSpan: this.designConfig.columnSpan,
      rowSpan: this.designConfig.rowSpan,

      // Hintergrund-Gradient
      backgroundGradient: this.designConfig.backgroundGradient,

      // Spezielle Stile
      hoverStyle: this.designConfig.hoverStyle,
      printStyle: this.designConfig.printStyle,
      className: this.designConfig.className,
    };

    // Spezial-Formatierung basierend auf der Position in der Tabelle

    // Header-Zeile
    if (row === 0 && this.designConfig.headingRowStyle) {
      this.applyConfigToStyle(baseStyle, this.designConfig.headingRowStyle);
    }

    // Header-Spalte
    if (col === 0 && this.designConfig.headingColumnStyle) {
      this.applyConfigToStyle(baseStyle, this.designConfig.headingColumnStyle);
    }

    // Erste Zeile
    if (row === 0 && this.designConfig.firstRowStyle) {
      Object.assign(baseStyle, this.designConfig.firstRowStyle);
    }

    // Letzte Zeile
    // (Hier müsste die Zeilenanzahl bekannt sein, daher sollte ein zusätzlicher Parameter eingeführt werden)

    // Erste Spalte
    if (col === 0 && this.designConfig.firstColumnStyle) {
      Object.assign(baseStyle, this.designConfig.firstColumnStyle);
    }

    // Letzte Spalte
    // (Hier müsste die Spaltenanzahl bekannt sein, daher sollte ein zusätzlicher Parameter eingeführt werden)

    // Ungerade/Gerade Zeilen
    if (this.designConfig.oddRowStyle && row % 2 !== 0) {
      Object.assign(baseStyle, this.designConfig.oddRowStyle);
    } else if (this.designConfig.evenRowStyle && row % 2 === 0) {
      Object.assign(baseStyle, this.designConfig.evenRowStyle);
    }

    // Spezielle Zellen über Selektor
    if (this.designConfig.specialCells) {
      for (const specialCell of this.designConfig.specialCells) {
        if (
          specialCell.selector === 'coordinates' &&
          specialCell.coordinates &&
          specialCell.coordinates.row === row &&
          specialCell.coordinates.col === col
        ) {
          Object.assign(baseStyle, specialCell.style);
        } else if (specialCell.selector === 'first-row' && row === 0) {
          Object.assign(baseStyle, specialCell.style);
        } else if (specialCell.selector === 'first-column' && col === 0) {
          Object.assign(baseStyle, specialCell.style);
        } else if (
          specialCell.selector === 'nth-row' &&
          specialCell.index !== undefined &&
          row === specialCell.index
        ) {
          Object.assign(baseStyle, specialCell.style);
        } else if (
          specialCell.selector === 'nth-column' &&
          specialCell.index !== undefined &&
          col === specialCell.index
        ) {
          Object.assign(baseStyle, specialCell.style);
        }
      }
    }

    // Kombiniere Basis-Stil mit Benutzer-Stil (user style überschreibt baseStyle)
    return { ...baseStyle, ...userStyle };
  }

  /**
   * Hilfsmethode zum Anwenden von DesignConfig-Properties auf einen Stil
   */
  private applyConfigToStyle(style: TableCellStyle, config: Partial<DesignConfig>): void {
    // Grundlegende Stileigenschaften
    if (config.fontSize !== undefined) style.fontSize = config.fontSize;
    if (config.fontColor !== undefined) style.fontColor = config.fontColor;
    if (config.backgroundColor !== undefined) style.backgroundColor = config.backgroundColor;
    if (config.borderColor !== undefined) style.borderColor = config.borderColor;
    if (config.borderWidth !== undefined) style.borderWidth = config.borderWidth;
    if (config.fontFamily !== undefined) style.fontFamily = config.fontFamily;
    if (config.fontWeight !== undefined) style.fontWeight = config.fontWeight;
    if (config.fontStyle !== undefined) style.fontStyle = config.fontStyle;
    if (config.alignment !== undefined) style.alignment = config.alignment;
    if (config.padding !== undefined) style.padding = config.padding;
    if (config.verticalAlignment !== undefined) style.verticalAlignment = config.verticalAlignment;
    if (config.borderRadius !== undefined) style.borderRadius = config.borderRadius;
    if (config.borderTop !== undefined) style.topBorder = config.borderTop;
    if (config.borderRight !== undefined) style.rightBorder = config.borderRight;
    if (config.borderBottom !== undefined) style.bottomBorder = config.borderBottom;
    if (config.borderLeft !== undefined) style.leftBorder = config.borderLeft;
    if (config.wordWrap !== undefined) style.wordWrap = config.wordWrap;

    // Erweiterte Textformatierung - type-sicher aufgeschrieben
    if ('textDecoration' in config && config.textDecoration !== undefined)
      style.textDecoration = config.textDecoration;
    if ('textTransform' in config && config.textTransform !== undefined)
      style.textTransform = config.textTransform;
    if ('textOverflow' in config && config.textOverflow !== undefined)
      style.textOverflow = config.textOverflow;
    if ('whiteSpace' in config && config.whiteSpace !== undefined)
      style.whiteSpace = config.whiteSpace;

    // Visuelle Effekte
    if ('boxShadow' in config && config.boxShadow !== undefined) style.boxShadow = config.boxShadow;
    if ('opacity' in config && config.opacity !== undefined) style.opacity = config.opacity;

    // Erweiterte Layout-Eigenschaften
    if ('columnSpan' in config && config.columnSpan !== undefined)
      style.columnSpan = config.columnSpan;
    if ('rowSpan' in config && config.rowSpan !== undefined) style.rowSpan = config.rowSpan;

    // Spezielle Stile und komplexe Eigenschaften
    if ('backgroundGradient' in config && config.backgroundGradient !== undefined)
      style.backgroundGradient = config.backgroundGradient;
    if ('hoverStyle' in config && config.hoverStyle !== undefined)
      style.hoverStyle = config.hoverStyle;
    if ('printStyle' in config && config.printStyle !== undefined)
      style.printStyle = config.printStyle;
    if ('className' in config && config.className !== undefined) style.className = config.className;

    // Zusätzliche Eigenschaften für interne Rahmen
    if (config.additionalBorders !== undefined) style.additionalBorders = config.additionalBorders;
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
