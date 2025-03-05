import { PdfTable, CustomFont } from '../src/index';

describe('Index Exports', () => {
  test('should export PdfTable', () => {
    expect(PdfTable).toBeDefined();
  });

  test('should export CustomFont', () => {
    expect(CustomFont).toBeDefined();
  });
});
