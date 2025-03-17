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

  // Basis-Eigenschaften
  baseStyle: {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: { r: number; g: number; b: number };
    backgroundColor?: { r: number; g: number; b: number };
    borderColor?: { r: number; g: number; b: number };
    borderWidth?: number;
    padding?: string | number;
  };

  // Spezialisierte Styling-Regeln für verschiedene Tabellenteile
  headerRow?: TableCellStyle;
  footerRow?: TableCellStyle;
  firstColumn?: TableCellStyle;
  lastColumn?: TableCellStyle;

  // Zeilen-Styling (gerade/ungerade für Zebra-Effekt)
  evenRows?: TableCellStyle;
  oddRows?: TableCellStyle;

  // Rahmen-Stile
  borders?: {
    top?: BorderStyle;
    right?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
    internal?: BorderStyle;
    headerBottom?: BorderStyle;
    footerTop?: BorderStyle;
  };

  // Erweiterte Optionen
  advanced?: {
    dynamicRowHeight?: boolean;
    wordWrap?: 'normal' | 'break-word' | 'none';
    verticalAlignment?: 'top' | 'middle' | 'bottom';
    horizontalAlignment?: 'left' | 'center' | 'right';
    alternateRowColoring?: boolean;

    // Erweiterte Textformatierung hinzugefügt
    textDecoration?: 'none' | 'underline' | 'line-through';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    textOverflow?: 'clip' | 'ellipsis';
    whiteSpace?: 'normal' | 'nowrap' | 'pre';

    // Visuelle Effekte
    boxShadow?: string;
    opacity?: number;
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
