/**
 * Border style definition for table cells
 * @interface BorderStyle
 * @property {boolean} [display] - Whether to display this border
 * @property {{ r: number; g: number; b: number }} [color] - Border color
 * @property {number} [width] - Border width
 * @property {'solid' | 'dashed' | 'dotted'} [style] - Border style
 * @property {number[]} [dashArray] - Custom dash array for custom border patterns (for 'dashed' style)
 * @property {number} [dashPhase] - Dash phase for custom border patterns
 */
export interface BorderStyle {
  display?: boolean;
  color?: { r: number; g: number; b: number };
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  dashArray?: number[];
  dashPhase?: number;
}

import { AdditionalBorder } from './AdditionalBorder';

/**
 * Table cell style
 * @interface TableCellStyle
 * @property {number} [fontSize] - Font size
 * @property {{ r: number; g: number; b: number }} [fontColor] - Font color
 * @property {{ r: number; g: number; b: number }} [backgroundColor] - Background color
 * @property {{ r: number; g: number; b: number }} [borderColor] - Border color (legacy, applies to all borders)
 * @property {number} [borderWidth] - Border width (legacy, applies to all borders)
 * @property {'left' | 'center' | 'right'} [alignment] - Text alignment
 * @property {BorderStyle} [topBorder] - Top border style
 * @property {BorderStyle} [rightBorder] - Right border style
 * @property {BorderStyle} [bottomBorder] - Bottom border style
 * @property {BorderStyle} [leftBorder] - Left border style
 * @property {AdditionalBorder[]} [additionalBorders] - Neue Option für zusätzliche interne Rahmenlinien
 * @property {string | number} [padding] - CSS-style padding ("5px", "5px 10px 5px 10px" or number)
 * @property {string} [fontFamily] - Font family (e.g. "Helvetica, Arial, sans-serif")
 * @property {'normal' | 'bold' | 'lighter' | number} [fontWeight] - Font weight
 * @property {'normal' | 'italic' | 'oblique'} [fontStyle] - Font style
 * @property {string | number} [borderRadius] - Border radius (CSS-style or points)
 * @property {'top' | 'middle' | 'bottom'} [verticalAlignment] - Vertical text alignment
 * @property {'none' | 'underline' | 'line-through'} [textDecoration] - Text decoration
 * @property {'none' | 'capitalize' | 'uppercase' | 'lowercase'} [textTransform] - Text transformation
 * @property {'clip' | 'ellipsis'} [textOverflow] - Text overflow handling
 * @property {'normal' | 'nowrap' | 'pre'} [whiteSpace] - White space handling
 * @property {string} [boxShadow] - Box shadow (CSS-style like "2px 2px 4px rgba(0,0,0,0.5)")
 * @property {number} [opacity] - Opacity (0-1)
 * @property {TableCellStyle} [hoverStyle] - Style applied in interactive PDFs on hover
 * @property {string} [className] - CSS class name for styling patterns
 * @property {{
    type: 'linear' | 'radial';
    colors: { position: number; color: { r: number; g: number; b: number } }[];
    angle?: number; // Für linear, in Grad
    center?: { x: number; y: number }; // Für radial, als Prozent
  }} [backgroundGradient] - Background gradient
 * @property {number} [columnSpan] - Column span
 * @property {number} [rowSpan] - Row span
 * @property {TableCellStyle} [printStyle] - Style specifically for printing
 */
export interface TableCellStyle {
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  backgroundColor?: { r: number; g: number; b: number };
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;
  alignment?: 'left' | 'center' | 'right';

  // Individual border styling
  topBorder?: BorderStyle;
  rightBorder?: BorderStyle;
  bottomBorder?: BorderStyle;
  leftBorder?: BorderStyle;

  // Neue Option für zusätzliche interne Rahmenlinien
  additionalBorders?: AdditionalBorder[];

  // Erweiterte CSS-ähnliche Styling-Optionen
  padding?: string | number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  borderRadius?: string | number;
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  textOverflow?: 'clip' | 'ellipsis';
  whiteSpace?: 'normal' | 'nowrap' | 'pre';
  boxShadow?: string;
  opacity?: number;
  hoverStyle?: TableCellStyle;
  className?: string;

  // Fortgeschrittene Styling-Optionen
  backgroundGradient?: {
    type: 'linear' | 'radial';
    colors: { position: number; color: { r: number; g: number; b: number } }[];
    angle?: number; // Für linear, in Grad
    center?: { x: number; y: number }; // Für radial, als Prozent
  };

  // Unterstützung für mehrspaltigen/zeiligen Text (wie CSS grid)
  columnSpan?: number;
  rowSpan?: number;

  // Medienspezifisches Styling
  printStyle?: TableCellStyle; // Stil speziell für den Druck
}
