import { PdfTable } from '../src/classes/Table';
import { PDFDocument } from 'pdf-lib';

function createTable(): PdfTable {
  return new PdfTable({ columns: 4, rows: 4, rowHeight: 20, colWidth: 80 });
}

test('embedInPDF: should embed a table at given coordinates', async () => {
  const table = createTable();
  const pdfDoc = await PDFDocument.create();
  // Capture the initial number of pages (should be 0 since the PDF is newly created)
  const initialPages = pdfDoc.getPageCount();
  // Use provided coordinates
  await table.embedInPDF(pdfDoc, 100, 700);
  expect(pdfDoc.getPageCount()).toBeGreaterThan(initialPages);
});

test('embedInPDF: should throw error for invalid coordinates', async () => {
  const table = createTable();
  const pdfDoc = await PDFDocument.create();
  await expect(table.embedInPDF(pdfDoc, -100, -700)).rejects.toThrowError();
});

test('embedTableAsImage: should embed a table as an image', async () => {
  const table = createTable();
  const pdfDoc = await PDFDocument.create();
  const initialPages = pdfDoc.getPageCount();

  // Dummy 1x1 transparent PNG as Base64
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
  // Convert Base64 to Uint8Array
  const buffer = Buffer.from(pngBase64, 'base64');
  const pngBytes = new Uint8Array(buffer);

  await table.embedTableAsImage(pdfDoc, pngBytes, { x: 50, y: 300, width: 320, height: 80 });
  expect(pdfDoc.getPageCount()).toBeGreaterThan(initialPages);
});

test('embedTableAsImage: should throw error for invalid image data', async () => {
  const table = createTable();
  const pdfDoc = await PDFDocument.create();
  const invalidImageBytes = new Uint8Array([0, 1, 2, 3]);
  await expect(
    table.embedTableAsImage(pdfDoc, invalidImageBytes, { x: 50, y: 300, width: 320, height: 80 }),
  ).rejects.toThrowError();
});
