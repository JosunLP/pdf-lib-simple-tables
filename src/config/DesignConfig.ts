/**
 * Design config
 * @interface DesignConfig
 * @property {string} [fontFamily] - Font family
 * @property {number} [fontSize] - Font size
 * @property {{ r: number; g: number; b: number }} [fontColor] - Font color
 * @property {{ r: number; g: number; b: number }} [backgroundColor] - Background color
 * @property {{ r: number; g: number; b: number }} [borderColor] - Border color
 * @property {number} [borderWidth] - Border width
 * @default
 * {
 *  fontFamily: 'Helvetica, Arial, sans-serif',
 * fontSize: 12,
 * fontColor: { r: 0, g: 0, b: 0 },
 * backgroundColor: { r: 255, g: 255, b: 255 },
 * borderColor: { r: 200, g: 200, b: 200 },
 * borderWidth: 1,
 * }
 */
export interface DesignConfig {
  fontFamily?: string;
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  backgroundColor?: { r: number; g: number; b: number };
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;
}

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
 * }
 */
export const defaultDesignConfig: DesignConfig = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: 12,
  fontColor: { r: 0, g: 0, b: 0 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderColor: { r: 200, g: 200, b: 200 },
  borderWidth: 1,
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
 * }
 */
export const materialDesignConfig: DesignConfig = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: 14,
  fontColor: { r: 33, g: 33, b: 33 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderColor: { r: 224, g: 224, b: 224 },
  borderWidth: 1,
};

// Weitere Designvorlagen können hier hinzugefügt werden...
