import { isValidBase64 } from '../utils/validateBase64';

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
export class CustomFont {
  constructor(public name: string, public base64: string, public extension?: string) {
    if (!isValidBase64(base64)) {
      throw new Error(`Invalid Base64 data for font "${name}"`);
    }
  }
}
