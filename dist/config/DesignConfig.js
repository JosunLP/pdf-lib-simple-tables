"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highContrastDesignConfig = exports.modernDesignConfig = exports.classicDesignConfig = exports.materialDesignConfig = exports.defaultDesignConfig = void 0;
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
exports.defaultDesignConfig = {
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
exports.materialDesignConfig = {
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
exports.classicDesignConfig = {
    fontFamily: 'Times New Roman, Times, serif',
    fontSize: 12,
    fontColor: { r: 0, g: 0, b: 0 },
    backgroundColor: { r: 255, g: 255, b: 255 },
    borderColor: { r: 150, g: 150, b: 150 },
    borderWidth: 1,
};
// Modern: Clean lines and minimalist design.
exports.modernDesignConfig = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 11,
    fontColor: { r: 50, g: 50, b: 50 },
    backgroundColor: { r: 245, g: 245, b: 245 },
    borderColor: { r: 200, g: 200, b: 200 },
    borderWidth: 0.5,
};
// High Contrast: For good visibility with strong contrast.
exports.highContrastDesignConfig = {
    fontFamily: 'Verdana, sans-serif',
    fontSize: 13,
    fontColor: { r: 255, g: 255, b: 255 },
    backgroundColor: { r: 0, g: 0, b: 0 },
    borderColor: { r: 255, g: 255, b: 255 },
    borderWidth: 2,
};
// Additional design templates can be added here...
