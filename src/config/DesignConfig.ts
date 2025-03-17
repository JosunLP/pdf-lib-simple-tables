/**
 * Design config
 * @interface DesignConfig
 * @property {string} [fontFamily] - Font family
 * @property {number} [fontSize] - Font size
 * @property {{ r: number; g: number; b: number }} [fontColor] - Font color
 * @property {{ r: number; g: number; b: number }} [backgroundColor] - Background color
 * @property {{ r: number; g: number; b: number }} [borderColor] - Border color
 * @property {number} [borderWidth] - Border width
 * @property {Partial<DesignConfig>} [headingRowStyle] - Heading row style
 * @property {Partial<DesignConfig>} [headingColumnStyle] - Heading column style
 * @property {BorderStyle} [defaultTopBorder] - Default top border style
 * @property {BorderStyle} [defaultRightBorder] - Default right border style
 * @property {BorderStyle} [defaultBottomBorder] - Default bottom border style
 * @property {BorderStyle} [defaultLeftBorder] - Default left border style
 * @property {AdditionalBorder[]} [additionalBorders] - Additional borders
 * @property {string | number} [padding] - Default cell padding
 * @property {'top' | 'middle' | 'bottom'} [verticalAlignment] - Default vertical alignment
 * @property {string} [borderRadius] - Default border radius
 * @property {'normal' | 'bold' | 'lighter' | number} [fontWeight] - Default font weight
 * @property {'normal' | 'italic' | 'oblique'} [fontStyle] - Default font style
 * @property {'left' | 'center' | 'right'} [alignment] - Default horizontal alignment
 * @property {string} [tableClassName] - Default CSS class name for the table
 * @property {{ r: number; g: number; b: number }} [alternateRowColor] - Alternate row coloring (zebra effect)
 * @property {boolean} [responsiveBreakpoints] - Enable responsive styling
 * @property {{ r: number; g: number; b: number }} [hoverRowHighlight] - Hover row highlight color
 * @property {TableCellStyle} [selectedCellStyle] - Selected cell style
 * @property {number} [cellSpacing] - Space between cells
 * @property {boolean} [collapseBorders] - Whether borders should collapse
 * @property {'separate' | 'collapse'} [borderCollapse] - Border collapse mode like in CSS
 * @property {SectionStyle} [theadStyle] - Table header section style
 * @property {SectionStyle} [tbodyStyle] - Table body section style
 * @property {SectionStyle} [tfootStyle] - Table footer section style
 * @property {BorderStyle} [tableBorder] - Border around entire table
 * @property {CellSelector[]} [specialCells] - Special styling for specific cells
 * @property {string} [boxShadow] - CSS-style box shadow for table
 * @property {string} [caption] - Table caption
 * @property {{ position: 'top' | 'bottom'; style: TableCellStyle }} [captionStyle] - Caption styling
 * @property {TableCellStyle} [evenRowStyle] - Style for even rows
 * @property {TableCellStyle} [oddRowStyle] - Style for odd rows
 * @property {TableCellStyle} [firstRowStyle] - Style for the first row
 * @property {TableCellStyle} [lastRowStyle] - Style for the last row
 * @property {TableCellStyle} [firstColumnStyle] - Style for the first column
 * @property {TableCellStyle} [lastColumnStyle] - Style for the last column
 * @property {'normal' | 'break-word' | 'none'} [wordWrap] - Text wrapping behavior
 * @property {boolean} [dynamicRowHeight] - Whether rows should grow to fit content
 */
export interface DesignConfig {
  fontFamily?: string;
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  backgroundColor?: { r: number; g: number; b: number };
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;

  // Border properties for direct border styling
  borderTop?: BorderStyle;
  borderRight?: BorderStyle;
  borderBottom?: BorderStyle;
  borderLeft?: BorderStyle;

  // New options for headers
  headingRowStyle?: Partial<DesignConfig>;
  headingColumnStyle?: Partial<DesignConfig>;

  // New default border style options
  defaultTopBorder?: BorderStyle;
  defaultRightBorder?: BorderStyle;
  defaultBottomBorder?: BorderStyle;
  defaultLeftBorder?: BorderStyle;

  // New option for additional borders (e.g., for invoices)
  additionalBorders?: AdditionalBorder[];

  // Erweiterte CSS-ähnliche Styling-Optionen
  padding?: string | number;
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  borderRadius?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  alignment?: 'left' | 'center' | 'right';
  tableClassName?: string;

  // Zusätzliche Tabellenstyling-Optionen
  alternateRowColor?: { r: number; g: number; b: number };
  responsiveBreakpoints?: boolean;
  hoverRowHighlight?: { r: number; g: number; b: number };
  selectedCellStyle?: TableCellStyle;

  // Erweiterte HTML/CSS-ähnliche Tabellen-Funktionen
  cellSpacing?: number; // Abstand zwischen Zellen (wie cellspacing in HTML)
  borderCollapse?: 'separate' | 'collapse'; // Ähnlich wie in CSS
  theadStyle?: SectionStyle; // Stil für den Tabellenkopfbereich
  tbodyStyle?: SectionStyle; // Stil für den Tabellenhauptteil
  tfootStyle?: SectionStyle; // Stil für den Tabellenfußbereich
  tableBorder?: BorderStyle; // Rahmen um die gesamte Tabelle
  specialCells?: CellSelector[]; // Spezielle Stile für bestimmte Zellen
  boxShadow?: string; // CSS-ähnlicher Schatten für die Tabelle
  caption?: string; // Tabellenbeschriftung
  captionStyle?: {
    // Stil für die Beschriftung
    position: 'top' | 'bottom';
    style: TableCellStyle;
  };

  // Zebra-Muster und erweiterte Zeilenformatierung
  evenRowStyle?: TableCellStyle; // Stil für gerade Zeilen
  oddRowStyle?: TableCellStyle; // Stil für ungerade Zeilen
  firstRowStyle?: TableCellStyle; // Spezielle Formatierung für erste Zeile
  lastRowStyle?: TableCellStyle; // Spezielle Formatierung für letzte Zeile
  firstColumnStyle?: TableCellStyle; // Spezielle Formatierung für erste Spalte
  lastColumnStyle?: TableCellStyle; // Spezielle Formatierung für letzte Spalte

  // Neue Eigenschaften für Textumbruch und dynamische Zeilenhöhe
  wordWrap?: 'normal' | 'break-word' | 'none';
  dynamicRowHeight?: boolean;
}

// Import BorderStyle and AdditionalBorder definitions
import { BorderStyle, TableCellStyle } from '../interfaces/TableCellStyle';
import { AdditionalBorder } from '../interfaces/AdditionalBorder';

/**
 * Definition für Abschnitts-Stile (thead, tbody, tfoot)
 */
export interface SectionStyle {
  backgroundColor?: { r: number; g: number; b: number };
  borderTop?: BorderStyle;
  borderBottom?: BorderStyle;
  defaultCellStyle?: TableCellStyle;
}

/**
 * Zellenauswahl für spezielle Formatierung
 */
export interface CellSelector {
  selector:
    | 'first-row'
    | 'last-row'
    | 'first-column'
    | 'last-column'
    | 'even-rows'
    | 'odd-rows'
    | 'nth-row'
    | 'nth-column'
    | 'coordinates';
  index?: number; // Für nth-row/column
  coordinates?: { row: number; col: number }; // Für spezifische Zellen
  style: TableCellStyle;
}

/**
 * Default design config
 * @constant
 * @default
 */
export const defaultDesignConfig: DesignConfig = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: 12,
  fontColor: { r: 0, g: 0, b: 0 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderColor: { r: 200, g: 200, b: 200 },
  borderWidth: 1,
  // Default header styles
  headingRowStyle: {
    backgroundColor: { r: 220, g: 220, b: 220 },
    fontSize: 13,
    fontWeight: 'bold',
  },
  headingColumnStyle: {
    backgroundColor: { r: 240, g: 240, b: 240 },
    fontSize: 13,
    fontWeight: 'bold',
  },
  // Default border configurations
  defaultTopBorder: {
    display: true,
    color: { r: 200, g: 200, b: 200 },
    width: 1,
    style: 'solid',
  },
  defaultRightBorder: {
    display: true,
    color: { r: 200, g: 200, b: 200 },
    width: 1,
    style: 'solid',
  },
  defaultBottomBorder: {
    display: true,
    color: { r: 200, g: 200, b: 200 },
    width: 1,
    style: 'solid',
  },
  defaultLeftBorder: {
    display: true,
    color: { r: 200, g: 200, b: 200 },
    width: 1,
    style: 'solid',
  },
  // Default: no additional borders
  additionalBorders: [],
  // HTML/CSS-ähnliche Standardeinstellungen
  borderCollapse: 'collapse',
  padding: '5 5 5 5', // Oben, Rechts, Unten, Links
  verticalAlignment: 'middle',
  alignment: 'left',

  // Neue Standardwerte für Textumbruch und dynamische Zeilenhöhe
  wordWrap: 'normal',
  dynamicRowHeight: true,
};

/**
 * Material Design config
 * @constant
 * @default
 * {
 *  fontFamily: 'Roboto, sans-serif',
 * fontSize: 14,
 * fontColor: { r: 33, g: 33, b: 33 },
 * backgroundColor: { r: 255, g: 255, b: 255 },
 * borderColor: { r: 224, g: 224, b: 224 },
 * borderWidth: 1,
 * headingRowStyle: {
 *  backgroundColor: { r: 245, g: 245, b: 245 },
 * },
 * headingColumnStyle: {
 *  backgroundColor: { r: 250, g: 250, b: 250 },
 * }
 * }
 */
export const materialDesignConfig: DesignConfig = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: 14,
  fontColor: { r: 33, g: 33, b: 33 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderColor: { r: 224, g: 224, b: 224 },
  borderWidth: 1,
  headingRowStyle: {
    backgroundColor: { r: 245, g: 245, b: 245 },
  },
  headingColumnStyle: {
    backgroundColor: { r: 250, g: 250, b: 250 },
  },
  wordWrap: 'normal',
  dynamicRowHeight: true,
};

// New design templates

// Classic: Serif font with a traditional look.
export const classicDesignConfig: DesignConfig = {
  fontFamily: 'Times New Roman, Times, serif',
  fontSize: 12,
  fontColor: { r: 0, g: 0, b: 0 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderColor: { r: 150, g: 150, b: 150 },
  borderWidth: 1,
  wordWrap: 'normal',
  dynamicRowHeight: true,
};

// Modern: Clean lines and minimalist design.
export const modernDesignConfig: DesignConfig = {
  fontFamily: 'Arial, sans-serif',
  fontSize: 11,
  fontColor: { r: 50, g: 50, b: 50 },
  backgroundColor: { r: 245, g: 245, b: 245 },
  borderColor: { r: 200, g: 200, b: 200 },
  borderWidth: 0.5,
  wordWrap: 'normal',
  dynamicRowHeight: true,
};

// High Contrast: For good visibility with strong contrast.
export const highContrastDesignConfig: DesignConfig = {
  fontFamily: 'Verdana, sans-serif',
  fontSize: 13,
  fontColor: { r: 255, g: 255, b: 255 },
  backgroundColor: { r: 0, g: 0, b: 0 },
  borderColor: { r: 255, g: 255, b: 255 },
  borderWidth: 2,
  wordWrap: 'normal',
  dynamicRowHeight: true,
};

/**
 * Finanz- und Rechnungstabelle
 * Professionell gestaltete Tabelle für Finanzberichte und Rechnungen
 */
export const financialTableDesign: DesignConfig = {
  fontFamily: 'Arial, sans-serif',
  fontSize: 11,
  fontColor: { r: 50, g: 50, b: 50 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderColor: { r: 230, g: 230, b: 230 },
  borderWidth: 0.5,
  headingRowStyle: {
    backgroundColor: { r: 240, g: 240, b: 240 },
    fontWeight: 'bold',
    borderBottom: {
      display: true,
      color: { r: 180, g: 180, b: 180 },
      width: 1,
      style: 'solid',
    },
  },
  evenRowStyle: {
    backgroundColor: { r: 250, g: 250, b: 250 },
  },
  oddRowStyle: {
    backgroundColor: { r: 255, g: 255, b: 255 },
  },
  // Fußzeile für Summen
  tfootStyle: {
    backgroundColor: { r: 245, g: 245, b: 245 },
    borderTop: {
      display: true,
      color: { r: 180, g: 180, b: 180 },
      width: 1,
      style: 'solid',
    },
    defaultCellStyle: {
      fontWeight: 'bold',
    },
  },
  wordWrap: 'normal',
  dynamicRowHeight: true,
};

/**
 * Dashboard-Tabelle
 * Moderne Tabelle mit abgerundeten Ecken für Dashboards
 */
export const dashboardTableDesign: DesignConfig = {
  fontFamily: 'Segoe UI, Roboto, sans-serif',
  fontSize: 12,
  fontColor: { r: 60, g: 60, b: 60 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderWidth: 0,
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  headingRowStyle: {
    backgroundColor: { r: 250, g: 250, b: 250 },
    fontWeight: 'bold',
    fontSize: 13,
  },
  hoverRowHighlight: { r: 245, g: 245, b: 252 },
  defaultTopBorder: {
    display: false,
  },
  defaultRightBorder: {
    display: false,
  },
  defaultBottomBorder: {
    display: true,
    color: { r: 240, g: 240, b: 240 },
    width: 1,
    style: 'solid',
  },
  defaultLeftBorder: {
    display: false,
  },
  padding: '12 16 12 16',
  wordWrap: 'normal',
  dynamicRowHeight: true,
};

/**
 * Daten-Präsentations-Tabelle
 * Für wissenschaftliche oder datenintensive Anwendungen
 */
export const dataTableDesign: DesignConfig = {
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 11,
  fontColor: { r: 20, g: 20, b: 20 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderCollapse: 'collapse',
  headingRowStyle: {
    backgroundColor: { r: 230, g: 240, b: 250 },
    fontWeight: 'bold',
    alignment: 'center',
  },
  alternateRowColor: { r: 245, g: 250, b: 253 },
  defaultTopBorder: {
    display: true,
    color: { r: 210, g: 220, b: 230 },
    width: 1,
    style: 'solid',
  },
  defaultRightBorder: {
    display: true,
    color: { r: 210, g: 220, b: 230 },
    width: 1,
    style: 'solid',
  },
  defaultBottomBorder: {
    display: true,
    color: { r: 210, g: 220, b: 230 },
    width: 1,
    style: 'solid',
  },
  defaultLeftBorder: {
    display: true,
    color: { r: 210, g: 220, b: 230 },
    width: 1,
    style: 'solid',
  },
  specialCells: [
    {
      selector: 'first-column',
      style: {
        fontWeight: 'bold',
      },
    },
  ],
  wordWrap: 'normal',
  dynamicRowHeight: true,
};

/**
 * Minimalistisches Design
 * Sehr reduzierte Tabelle mit minimalen Designelementen
 */
export const minimalistTableDesign: DesignConfig = {
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  fontSize: 11,
  fontColor: { r: 80, g: 80, b: 80 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderWidth: 0,
  headingRowStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    borderBottom: {
      display: true,
      color: { r: 230, g: 230, b: 230 },
      width: 1,
      style: 'solid',
    },
    backgroundColor: { r: 252, g: 252, b: 252 },
    padding: '10 16 10 16',
  },
  defaultTopBorder: { display: false },
  defaultRightBorder: { display: false },
  defaultBottomBorder: {
    display: true,
    color: { r: 240, g: 240, b: 240 },
    width: 0.5,
    style: 'solid',
  },
  defaultLeftBorder: { display: false },
  padding: '8 16 8 16',
  wordWrap: 'normal',
  dynamicRowHeight: true,
  verticalAlignment: 'middle',
};

/**
 * Bootstrap-inspiriertes Design
 * Responsive und moderne Tabelle im Bootstrap-Stil
 */
export const bootstrapTableDesign: DesignConfig = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 14,
  fontColor: { r: 33, g: 37, b: 41 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderCollapse: 'collapse',
  headingRowStyle: {
    backgroundColor: { r: 248, g: 249, b: 250 },
    fontWeight: 'bold',
    alignment: 'left',
    verticalAlignment: 'middle',
  },
  defaultTopBorder: {
    display: true,
    color: { r: 222, g: 226, b: 230 },
    width: 1,
    style: 'solid',
  },
  defaultRightBorder: {
    display: true,
    color: { r: 222, g: 226, b: 230 },
    width: 1,
    style: 'solid',
  },
  defaultBottomBorder: {
    display: true,
    color: { r: 222, g: 226, b: 230 },
    width: 1,
    style: 'solid',
  },
  defaultLeftBorder: {
    display: true,
    color: { r: 222, g: 226, b: 230 },
    width: 1,
    style: 'solid',
  },
  padding: '8 12 8 12',
  hoverRowHighlight: { r: 242, g: 245, b: 250 },
  wordWrap: 'normal',
  dynamicRowHeight: true,
  evenRowStyle: {
    backgroundColor: { r: 255, g: 255, b: 255 },
  },
  oddRowStyle: {
    backgroundColor: { r: 249, g: 250, b: 251 },
  },
  responsiveBreakpoints: true,
  verticalAlignment: 'middle',
};

/**
 * Dark Mode Table Design
 * Augenschonendes Design für Nachtarbeit und dunkle Benutzeroberflächen
 */
export const darkModeTableDesign: DesignConfig = {
  fontFamily: 'Inter, Roboto, system-ui, sans-serif',
  fontSize: 13,
  fontColor: { r: 220, g: 220, b: 220 },
  backgroundColor: { r: 33, g: 37, b: 43 },
  borderColor: { r: 60, g: 65, b: 70 },
  borderWidth: 1,
  headingRowStyle: {
    backgroundColor: { r: 42, g: 47, b: 55 },
    fontColor: { r: 240, g: 240, b: 240 },
    fontWeight: 'bold',
    borderBottom: {
      display: true,
      color: { r: 70, g: 75, b: 80 },
      width: 1,
      style: 'solid',
    },
  },
  defaultTopBorder: {
    display: true,
    color: { r: 60, g: 65, b: 70 },
    width: 1,
    style: 'solid',
  },
  defaultRightBorder: {
    display: true,
    color: { r: 60, g: 65, b: 70 },
    width: 1,
    style: 'solid',
  },
  defaultBottomBorder: {
    display: true,
    color: { r: 60, g: 65, b: 70 },
    width: 1,
    style: 'solid',
  },
  defaultLeftBorder: {
    display: true,
    color: { r: 60, g: 65, b: 70 },
    width: 1,
    style: 'solid',
  },
  evenRowStyle: {
    backgroundColor: { r: 33, g: 37, b: 43 },
  },
  oddRowStyle: {
    backgroundColor: { r: 38, g: 42, b: 48 },
  },
  hoverRowHighlight: { r: 45, g: 50, b: 60 },
  padding: '8 12 8 12',
  borderCollapse: 'collapse',
  wordWrap: 'normal',
  dynamicRowHeight: true,
  verticalAlignment: 'middle',
};
