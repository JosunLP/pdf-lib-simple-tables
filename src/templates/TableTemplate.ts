import { BorderStyle, TableCellStyle } from '../interfaces/TableCellStyle';
import { DesignConfig } from '../config/DesignConfig';

/**
 * Definition eines Tabellen-Templates
 * @interface TableTemplate
 */
export interface TableTemplate {
  name: string;
  description?: string;
  version?: string;
  author?: string;

  // Basis-Stil, wird auf alle Zellen angewendet
  baseStyle: TableCellStyle;

  // Spezifische Zeilen- und Spalten-Stile
  headerRow?: TableCellStyle;
  firstRow?: TableCellStyle;
  lastRow?: TableCellStyle;
  firstColumn?: TableCellStyle;
  lastColumn?: TableCellStyle;
  footerRow?: TableCellStyle; // Added property for footer row styling

  // Zebrierung (für abwechselnde Zeilenfarben)
  evenRows?: TableCellStyle;
  oddRows?: TableCellStyle;

  // Rahmen-Definitionen
  borders?: {
    top?: BorderStyle;
    right?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
    headerTop?: BorderStyle;
    headerBottom?: BorderStyle;
    footerTop?: BorderStyle;
  };

  // Abschnitts-Stile
  sections?: {
    thead?: {
      backgroundColor?: { r: number; g: number; b: number };
      borderTop?: BorderStyle;
      borderBottom?: BorderStyle;
      defaultCellStyle?: TableCellStyle;
    };
    tbody?: {
      backgroundColor?: { r: number; g: number; b: number };
      borderTop?: BorderStyle;
      borderBottom?: BorderStyle;
      defaultCellStyle?: TableCellStyle;
    };
    tfoot?: {
      backgroundColor?: { r: number; g: number; b: number };
      borderTop?: BorderStyle;
      borderBottom?: BorderStyle;
      defaultCellStyle?: TableCellStyle;
    };
  };

  // Erweiterte Konfiguration
  advanced?: {
    dynamicRowHeight?: boolean;
    wordWrap?: 'normal' | 'break-word' | 'none';
    verticalAlignment?: 'top' | 'middle' | 'bottom';
    horizontalAlignment?: 'left' | 'center' | 'right';
    alternateRowColoring?: boolean;
    textDecoration?: 'none' | 'underline' | 'line-through';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    textOverflow?: 'clip' | 'ellipsis';
    whiteSpace?: 'normal' | 'nowrap' | 'pre';
    boxShadow?: string;
    opacity?: number;
    borderCollapse?: 'separate' | 'collapse';
    hoverRowHighlight?: { r: number; g: number; b: number };
    columnSpan?: number;
    rowSpan?: number;
  };

  // Spezialisierte Designs für bestimmte Zellen (per Position oder Regel)
  specialCells?: Array<{
    selector: 'coordinates' | 'row' | 'column' | 'pattern';
    row?: number;
    column?: number;
    pattern?: string; // z.B. "total", "sum", "header"
    style: TableCellStyle;
  }>;

  // Konvertierungsfunktion zu DesignConfig
  toDesignConfig?: () => DesignConfig;
}
