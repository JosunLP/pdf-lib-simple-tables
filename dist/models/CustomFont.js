"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFont = void 0;
/**
 * Custom font model
 * @param name: string - font name
 * @param base64: string - base64 string
 * @param extension?: string - font extension (optional)
 * @class CustomFont
 * @constructor
 * @example
 * const customFont = new CustomFont('Roboto', 'base64string', 'ttf');
 */
class CustomFont {
    constructor(name, base64, extension) {
        this.name = name;
        this.base64 = base64;
        this.extension = extension;
        const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        if (!base64Regex.test(base64)) {
            throw new Error('Invalid Base64 data');
        }
    }
}
exports.CustomFont = CustomFont;
