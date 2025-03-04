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
export interface DesignConfig {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: {
        r: number;
        g: number;
        b: number;
    };
    backgroundColor?: {
        r: number;
        g: number;
        b: number;
    };
    borderColor?: {
        r: number;
        g: number;
        b: number;
    };
    borderWidth?: number;
    headingRowStyle?: Partial<DesignConfig>;
    headingColumnStyle?: Partial<DesignConfig>;
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
export declare const defaultDesignConfig: DesignConfig;
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
export declare const materialDesignConfig: DesignConfig;
export declare const classicDesignConfig: DesignConfig;
export declare const modernDesignConfig: DesignConfig;
export declare const highContrastDesignConfig: DesignConfig;
