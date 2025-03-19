import { PDFDocument, StandardFonts } from 'pdf-lib';
import { FontManager } from '../src/managers/FontManager';
import { CustomFont } from '../src/models/CustomFont';

// Mock für embedFont, um Probleme mit ungültigen Font-Daten zu umgehen
jest.mock('pdf-lib', () => ({
  PDFDocument: {
    create: jest.fn().mockImplementation(() => ({
      registerFontkit: jest.fn(),
      embedFont: jest.fn().mockImplementation((fontData, options) => {
        // Simulieren einer erfolgreichen Font-Einbettung
        return Promise.resolve({
          name: options?.customName || StandardFonts.Helvetica,
        });
      }),
    })),
  },
  StandardFonts: {
    Helvetica: 'Helvetica',
  },
}));

describe('FontManager', () => {
  let fontManager: FontManager;

  beforeEach(() => {
    fontManager = new FontManager();
  });

  test('should set custom font', () => {
    const customFont = new CustomFont('TestFont', 'dGVzdGJhc2U2NA==', 'ttf');
    fontManager.setCustomFont(customFont);

    expect(fontManager.getCustomFont()).toBe(customFont);
  });

  test('should throw error for invalid Base64 data', () => {
    expect(() => new CustomFont('InvalidFont', 'invalid_base64')).toThrowError(
      'Invalid Base64 data for font "InvalidFont"',
    );
  });

  test('should embed custom font in PDF document', async () => {
    // Verwende einen einfachen gültigen Base64-String für den Test
    const validBase64 = 'dGVzdGJhc2U2NA=='; // Dies ist "testbase64" in Base64
    const customFont = new CustomFont('TestFont', validBase64, 'ttf');
    fontManager.setCustomFont(customFont);

    const pdfDoc = await PDFDocument.create();
    const embeddedFont = await fontManager.embedFont(pdfDoc);

    // Prüfe, ob der Font-Name korrekt übernommen wurde
    expect(embeddedFont.name).toBe('TestFont');
  });

  test('should fallback to standard font if no custom font is set', async () => {
    const pdfDoc = await PDFDocument.create();
    const embeddedFont = await fontManager.embedFont(pdfDoc);

    expect(embeddedFont.name).toBe(StandardFonts.Helvetica);
  });

  test('should handle Base64 data with prefixes', () => {
    // Wir müssen die private Methode über einen Workaround testen
    const customFont = new CustomFont(
      'PrefixedFont',
      'data:font/ttf;base64,dGVzdGJhc2U2NA==',
      'ttf',
    );

    // Hier können wir nur indirekt testen, indem wir prüfen, ob setCustomFont kein Fehler wirft
    expect(() => {
      fontManager.setCustomFont(customFont);
    }).not.toThrow();

    expect(fontManager.getCustomFont()).toBe(customFont);
  });
});
