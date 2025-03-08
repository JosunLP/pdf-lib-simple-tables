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
 */
export interface DesignConfig {
  fontFamily?: string;
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  backgroundColor?: { r: number; g: number; b: number };
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;

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
}

// Import BorderStyle and AdditionalBorder definitions
import { BorderStyle } from '../interfaces/TableCellStyle';
import { AdditionalBorder } from '../interfaces/AdditionalBorder';

/**
 * Default design config
 * @constant
 * @default
 * {
 *  fontFamily: 'Helvetica, Arial, sans-serif',
 * fontSize: 12,
 * fontColor: { r: 0, g: 0, b: 0 },
 * backgroundColor: { r: 255, g: 255, b: 255 },
 * borderColor: { r: 200, g: 200, b: 200 },
 * borderWidth: 1,
 * headingRowStyle: {
 *  backgroundColor: { r: 220, g: 220, b: 220 },
 *  fontSize: 13,
 * },
 * headingColumnStyle: {
 *  backgroundColor: { r: 240, g: 240, b: 240 },
 *  fontSize: 13,
 * }
 * }
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
    // further adjustments if needed...
  },
  headingColumnStyle: {
    backgroundColor: { r: 240, g: 240, b: 240 },
    fontSize: 13,
    // further adjustments if needed...
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
};

// Modern: Clean lines and minimalist design.
export const modernDesignConfig: DesignConfig = {
  fontFamily: 'Arial, sans-serif',
  fontSize: 11,
  fontColor: { r: 50, g: 50, b: 50 },
  backgroundColor: { r: 245, g: 245, b: 245 },
  borderColor: { r: 200, g: 200, b: 200 },
  borderWidth: 0.5,
};

// High Contrast: For good visibility with strong contrast.
export const highContrastDesignConfig: DesignConfig = {
  fontFamily: 'Verdana, sans-serif',
  fontSize: 13,
  fontColor: { r: 255, g: 255, b: 255 },
  backgroundColor: { r: 0, g: 0, b: 0 },
  borderColor: { r: 255, g: 255, b: 255 },
  borderWidth: 2,
};

// Additional design templates can be added here...
