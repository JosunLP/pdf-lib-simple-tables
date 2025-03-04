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
export declare class CustomFont {
    name: string;
    base64: string;
    extension?: string | undefined;
    constructor(name: string, base64: string, extension?: string | undefined);
}
