import { PdfTable } from '../src';
import fs from 'fs';

async function createMergedCellsTable(): Promise<void> {
  const table = new PdfTable({
    columns: 4,
    rows: 4,
  });

  table.mergeCells(0, 0, 1, 1);
  table.setCell(0, 0, 'Merged Cell');

  table.mergeCells(2, 2, 3, 3);
  table.setCell(2, 2, 'Another Merged Cell');

  const pdfDoc = await table.toPDF();
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('output.pdf', pdfBytes);
}

createMergedCellsTable();
