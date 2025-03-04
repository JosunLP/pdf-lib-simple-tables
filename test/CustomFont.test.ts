import { CustomFont } from '../src/models/CustomFont';

describe('CustomFont', () => {
  test('sollte Instanz mit Name, Base64 und optionaler Extension erstellen', () => {
    const name = 'TestFont';
    const base64 = 'dGVzdGJhc2U2NA==';
    const extension = 'ttf';
    const font = new CustomFont(name, base64, extension);

    expect(font.name).toBe(name);
    expect(font.base64).toBe(base64);
    expect(font.extension).toBe(extension);
  });

  test('sollte auch ohne Extension instanziiert werden können', () => {
    const name = 'TestFont';
    const base64 = 'dGVzdGJhc2U2NA==';
    const font = new CustomFont(name, base64);

    expect(font.name).toBe(name);
    expect(font.base64).toBe(base64);
    expect(font.extension).toBeUndefined();
  });

  test('sollte Fehler für ungültige Base64-Daten werfen', () => {
    expect(() => new CustomFont('TestFont', 'invalid_base64')).toThrowError('Invalid Base64 data');
  });
});
