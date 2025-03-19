import { PdfTable, modernDesignConfig } from '../src';
import fs from 'fs';
import path from 'path';

/**
 * Dieses Beispiel demonstriert, wie man Tabellen mit einem
 * einheitlichen Design zusammenführt.
 */
async function createMergedTablesWithDesign(): Promise<void> {
  // Erste Tabelle mit einfachem Design
  const leftTable = new PdfTable({
    columns: 2,
    rows: 3,
    designConfig: {
      backgroundColor: { r: 245, g: 245, b: 245 },
      fontColor: { r: 50, g: 50, b: 50 },
    },
  });

  leftTable.setCell(0, 0, 'Linke Tabelle');
  leftTable.setCell(0, 1, 'Header');
  leftTable.setCell(1, 0, 'Daten 1');
  leftTable.setCell(1, 1, 'Wert 1');
  leftTable.setCell(2, 0, 'Daten 2');
  leftTable.setCell(2, 1, 'Wert 2');

  // Zweite Tabelle mit anderem Design
  const rightTable = new PdfTable({
    columns: 2,
    rows: 3,
    designConfig: {
      backgroundColor: { r: 230, g: 240, b: 255 },
      fontColor: { r: 30, g: 30, b: 100 },
    },
  });

  rightTable.setCell(0, 0, 'Rechte Tabelle');
  rightTable.setCell(0, 1, 'Header');
  rightTable.setCell(1, 0, 'Info 1');
  rightTable.setCell(1, 1, 'Wert A');
  rightTable.setCell(2, 0, 'Info 2');
  rightTable.setCell(2, 1, 'Wert B');

  // Tabellen horizontal zusammenführen mit einem neuen, einheitlichen Design
  const mergedTable = PdfTable.mergeTables([leftTable, rightTable], {
    direction: 'horizontal',
    designConfig: modernDesignConfig, // Verwenden von vordefiniertem Template
  });

  // PDF generieren und speichern
  const pdfDoc = await mergedTable.toPDF();
  const pdfBytes = await pdfDoc.save();

  // Ausgabeverzeichnis erstellen, falls nicht vorhanden
  const outputDir = path.join(__dirname, '../');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // PDF speichern
  fs.writeFileSync(path.join(outputDir, 'mergedWithDesign.pdf'), pdfBytes);
  console.log('PDF wurde erstellt: mergedWithDesign.pdf');
}

// Beispiel ausführen
createMergedTablesWithDesign().catch((error) => {
  console.error('Fehler bei der Erstellung des PDFs:', error);
});
