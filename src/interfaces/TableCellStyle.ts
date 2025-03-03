/**
 * Table cell style
 * @interface TableCellStyle
 * @property {number} [fontSize] - Font size
 * @property {{ r: number; g: number; b: number }} [fontColor] - Font color
 * @property {{ r: number; g: number; b: number }} [backgroundColor] - Background color
 * @property {{ r: number; g: number; b: number }} [borderColor] - Border color
 * @property {number} [borderWidth] - Border width
 * @property {'left' | 'center' | 'right'} [alignment] - Text alignment
 */
export interface TableCellStyle {
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  backgroundColor?: { r: number; g: number; b: number };
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;
  alignment?: 'left' | 'center' | 'right';
}
