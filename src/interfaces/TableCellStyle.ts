/**
 * Border style definition for table cells
 * @interface BorderStyle
 * @property {boolean} [display] - Whether to display this border
 * @property {{ r: number; g: number; b: number }} [color] - Border color
 * @property {number} [width] - Border width
 * @property {'solid' | 'dashed' | 'dotted'} [style] - Border style
 * @property {number} [dashArray] - Custom dash array for custom border patterns (for 'dashed' style)
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
}
