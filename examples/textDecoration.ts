import * as fs from 'fs';
import { PdfTable } from '../src';

/**
 * Beispiel zur Demonstration von Text-Dekoration in Tabellen
 */
async function createTextDecorationExample(): Promise<void> {
  const table = new PdfTable({
    columns: 3,
    rows: 4,
    colWidth: 150,
    rowHeight: 40,
  });

  // Überschrift
  table.setCell(0, 0, 'Text-Formatierung');
  table.setCellStyle(0, 0, {
    fontSize: 16,
    fontWeight: 'bold',
    textDecoration: 'underline',
    alignment: 'center',
    columnSpan: 3,
  });

  // Beschreibungen in der ersten Spalte
  table.setCell(1, 0, 'Normaler Text');
  table.setCell(2, 0, 'Unterstrichener Text');
  table.setCell(3, 0, 'Durchgestrichener Text');

  // Beispiele für unterschiedliche Textformatierungen in der zweiten Spalte
  table.setCell(1, 1, 'Dieser Text hat keine Formatierung');
  table.setCellStyle(1, 1, {
    fontSize: 12,
  });

  table.setCell(2, 1, 'Dieser Text ist unterstrichen');
  table.setCellStyle(2, 1, {
    fontSize: 12,
    textDecoration: 'underline',
  });

  table.setCell(3, 1, 'Dieser Text ist durchgestrichen');
  table.setCellStyle(3, 1, {
    fontSize: 12,
    textDecoration: 'line-through',
  });

  // Beispiele mit umgebrochenem Text in der dritten Spalte
  table.setCell(
    1,
    2,
    'Dieser längere Text hat keinen besonderen Stil und zeigt, wie der Textumbruch funktioniert.',
  );
  table.setCellStyle(1, 2, {
    fontSize: 12,
    wordWrap: 'normal',
  });

  table.setCell(
    2,
    2,
    'Dieser längere Text ist unterstrichen und demonstriert, wie die Unterstreichung auch bei umgebrochenem Text korrekt angewendet wird.',
  );
  table.setCellStyle(2, 2, {
    fontSize: 12,
    wordWrap: 'normal',
    textDecoration: 'underline',
  });

  table.setCell(
    3,
    2,
    'Dieser längere Text ist durchgestrichen und demonstriert, wie der Durchstrich auch bei umgebrochenem Text korrekt angewendet wird.',
  );
  table.setCellStyle(3, 2, {
    fontSize: 12,
    wordWrap: 'normal',
    textDecoration: 'line-through',
  });

  // Erzeuge das PDF-Dokument
  const pdfDoc = await table.toPDF();
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('text-decoration-example.pdf', pdfBytes);

  console.log('PDF mit Text-Dekoration-Beispielen wurde erstellt: text-decoration-example.pdf');
}

// Führe das Beispiel aus
createTextDecorationExample().catch(console.error);
