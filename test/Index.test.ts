import { PdfTable, CustomFont } from '../src/index';

describe('Index Exports', () => {
  test('sollte PdfTable exportieren', () => {
    expect(PdfTable).toBeDefined();
  });

  test('sollte CustomFont exportieren', () => {
    expect(CustomFont).toBeDefined();
  });
});
