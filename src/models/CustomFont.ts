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
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (!base64Regex.test(base64)) {
      throw new Error('Invalid Base64 data');
    }
  }
}
