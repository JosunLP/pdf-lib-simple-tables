import { CustomFont } from '../src/models/CustomFont';

describe('CustomFont', () => {
  test('should create an instance with name, base64, and optional extension', () => {
    const name = 'TestFont';
    const base64 = 'dGVzdGJhc2U2NA==';
    const extension = 'ttf';
    const font = new CustomFont(name, base64, extension);

    expect(font.name).toBe(name);
    expect(font.base64).toBe(base64);
    expect(font.extension).toBe(extension);
  });

  test('should be instantiated without extension', () => {
    const name = 'TestFont';
    const base64 = 'dGVzdGJhc2U2NA==';
    const font = new CustomFont(name, base64);

    expect(font.name).toBe(name);
    expect(font.base64).toBe(base64);
    expect(font.extension).toBeUndefined();
  });

  test('should throw error for invalid Base64 data', () => {
    expect(() => new CustomFont('TestFont', 'invalid_base64')).toThrowError('Invalid Base64 data');
  });
});
