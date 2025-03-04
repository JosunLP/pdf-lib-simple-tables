import { PdfTable } from '../src/classes/Table';
import { PDFDocument } from 'pdf-lib';

function createTable(): PdfTable {
  return new PdfTable({ columns: 4, rows: 4, rowHeight: 20, colWidth: 80 });
}

test('embedInPDF: sollte eine Tabelle an übergebenen Koordinaten einbetten', async () => {
  const table = createTable();
  const pdfDoc = await PDFDocument.create();
  // Vorhandene Seitenanzahl erfassen (muss 0 sein, da PDF neu erstellt wurde)
  const initialPages = pdfDoc.getPageCount();
  // Verwende bereitgestellte Koordinaten
  await table.embedInPDF(pdfDoc, 100, 700);
  expect(pdfDoc.getPageCount()).toBeGreaterThan(initialPages);
});

test('embedTableAsImage: sollte eine Tabelle als Bild einbetten', async () => {
  const table = createTable();
  const pdfDoc = await PDFDocument.create();
  const initialPages = pdfDoc.getPageCount();

  // Dummy 1x1 transparente PNG als Base64
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
  // Konvertiere Base64 in Uint8Array
  const buffer = Buffer.from(pngBase64, 'base64');
  const pngBytes = new Uint8Array(buffer);

  await table.embedTableAsImage(pdfDoc, pngBytes, { x: 50, y: 300, width: 320, height: 80 });
  expect(pdfDoc.getPageCount()).toBeGreaterThan(initialPages);
});
