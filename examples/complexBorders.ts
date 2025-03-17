import { PdfTable } from '../src';
import fs from 'fs';

async function createComplexBordersTable(): Promise<void> {
  const table = new PdfTable({
    columns: 4,
    rows: 5,
    colWidth: 120,
    rowHeight: 40,
  });

  // Überschriftzeile mit unterer Grenze
  for (let col = 0; col < 4; col++) {
    table.setCell(0, col, `Überschrift ${col + 1}`);
    table.setCellStyle(0, col, {
      fontSize: 14,
      fontColor: { r: 50, g: 50, b: 50 },
      backgroundColor: { r: 240, g: 240, b: 240 },
      bottomBorder: {
        color: { r: 0, g: 0, b: 0 },
        width: 2,
        style: 'solid',
      },
    });
  }

  // Rechnungsposition mit gestrichelter oberer und unterer Linie
  table.setCell(1, 0, 'Position 1');
  table.setCell(1, 1, 'Beschreibung der Position');
  table.setCell(1, 2, '10 Stück');
  table.setCell(1, 3, '100,00 €');

  // Besondere Zellenformatierung
  for (let col = 0; col < 4; col++) {
    table.setCellStyle(1, col, {
      topBorder: {
        color: { r: 150, g: 150, b: 150 },
        width: 1,
        style: 'dashed',
        dashArray: [3, 3],
      },
      bottomBorder: {
        color: { r: 150, g: 150, b: 150 },
        width: 1,
        style: 'dashed',
        dashArray: [3, 3],
      },
    });
  }

  // Weitere Positionen
  table.setCell(2, 0, 'Position 2');
  table.setCell(2, 1, 'Weitere Beschreibung');
  table.setCell(2, 2, '5 Stück');
  table.setCell(2, 3, '75,00 €');

  table.setCell(3, 0, 'Position 3');
  table.setCell(3, 1, 'Letzte Beschreibung');
  table.setCell(3, 2, '1 Stück');
  table.setCell(3, 3, '25,00 €');

  // Trenner vor Summenzeile
  for (let col = 0; col < 4; col++) {
    table.setCellStyle(3, col, {
      bottomBorder: {
        color: { r: 0, g: 0, b: 0 },
        width: 1,
        style: 'solid',
      },
    });
  }

  // Summenzeile mit dickerem Unterstrich - nutzt jetzt modularisierte Rahmenrenderer
  table.setCell(4, 0, '');
  table.setCell(4, 1, '');
  table.setCell(4, 2, 'Summe:');
  table.setCell(4, 3, '200,00 €');

  table.setCellStyle(4, 2, {
    fontSize: 14,
    fontColor: { r: 0, g: 0, b: 0 },
    alignment: 'right',
  });

  table.setCellStyle(4, 3, {
    fontSize: 14,
    fontColor: { r: 0, g: 0, b: 0 },
    bottomBorder: {
      color: { r: 0, g: 0, b: 0 },
      width: 2,
      style: 'solid', // 'double' border style not supported, using 'solid' instead
    },
  });

  const pdfDoc = await table.toPDF();
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('complex_borders_example.pdf', pdfBytes);
}

createComplexBordersTable().catch((error) => {
  process.stderr.write(`PDF generation error: ${error}\n`);
  process.exit(1);
});
