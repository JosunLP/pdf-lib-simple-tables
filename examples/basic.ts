import { PdfTable } from '../src';
import fs from 'fs';

async function createBasicTable(): Promise<void> {
  const table = new PdfTable({
    columns: 3,
    rows: 5,
    colWidth: 100,
    rowHeight: 50,
  });

  table.setCell(0, 0, 'Header 1');
  table.setCell(0, 1, 'Header 2');
  table.setCell(0, 2, 'Header 3');
  table.setCellStyle(0, 0, { fontSize: 16, alignment: 'center',borderColor: { r: 0, g: 0, b: 0 }, borderWidth: 1 });
  table.setCellStyle(0, 1, { fontSize: 16, alignment: 'center', backgroundColor: { r: 255, g: 0, b: 0 } });
  table.setCellStyle(0, 2, { fontSize: 16, alignment: 'center', backgroundColor: { r: 0, g: 255, b: 0 } });

  for (let row = 1; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      table.setCell(row, col, `Row ${row} Col ${col}`);
    }
  }

  const pdfDoc = await table.toPDF();
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('output.pdf', pdfBytes);
}

createBasicTable();
