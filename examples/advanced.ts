import { PdfTable, CustomFont } from '../src';
import fs from 'fs';

async function createAdvancedTable(): Promise<void> {
  const table = new PdfTable({
    columns: 4,
    rows: 6,
  });

  table.setCell(0, 0, 'Header 1');
  table.setCell(0, 1, 'Header 2');
  table.setCell(0, 2, 'Header 3');
  table.setCell(0, 3, 'Header 4');

  for (let row = 1; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      table.setCell(row, col, `Row ${row} Col ${col}`);
      table.setCellStyle(row, col, {
        fontSize: 12 + row,
        fontColor: { r: 0, g: 0, b: 0 },
        backgroundColor: { r: 255 - row * 20, g: 255 - col * 20, b: 255 },
        borderColor: { r: 0, g: 0, b: 0 },
        borderWidth: 1,
        alignment: 'center',
      });
    }
  }

  const name = 'TestFont';
  const base64 = 'dGVzdGJhc2U2NA==';
  const extension = 'ttf';
  const font = new CustomFont(name, base64, extension);
  table.setCustomFont(font);

  const pdfDoc = await table.toPDF();
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('output.pdf', pdfBytes);
}

createAdvancedTable();
