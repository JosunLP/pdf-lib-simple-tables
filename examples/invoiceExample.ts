import { PdfTable } from '../src';
import fs from 'fs';

async function createInvoiceExample(): Promise<void> {
  console.log('Erstelle Beispiel-Rechnung mit Template-System...');

  // Speichere die Anzahl der Kopfzeilen für spätere Verwendung
  const repeatHeaderRows = 0;

  // Erstelle eine Tabelle mit ausreichend Zeilen und Spalten für eine komplette Rechnung
  const table = new PdfTable({
    columns: 6,
    rows: 55, // Erhöht auf 55, um genügend Platz für alle Einträge zu bieten
    colWidth: 90, // Tabellenspaltenbreite
    rowHeight: 30, // Standard-Zeilenhöhe
    repeatHeaderRows: repeatHeaderRows, // Die Kopfzeilen bis einschließlich der Spaltenüberschriften wiederholen
    pageBreakThreshold: 70, // Seitenumbruch, wenn weniger als 70 Punkte Platz verbleiben
  });

  // Template "Invoice" anwenden
  const template = table.templateManager.getTemplate('Invoice');
  if (!template) {
    throw new Error('Template "Invoice" not found');
  }
  table.applyTemplate(template);

  // ---- KOPFBEREICH MIT FIRMENINFOS UND LOGO ----

  // Firmenname und Logo-Platzhalter
  table.setCell(0, 0, 'MUSTERFIRMA GMBH');
  table.mergeCells(0, 0, 0, 2);
  table.setCellStyle(0, 0, {
    fontSize: 24,
    fontWeight: 'bold',
    padding: '10 5 5 5',
    alignment: 'left',
    backgroundColor: { r: 240, g: 240, b: 240 },
    borderWidth: 0,
  });

  // Logo-Platzhalter
  table.setCell(0, 3, '[LOGO]');
  table.mergeCells(0, 3, 0, 5);
  table.setCellStyle(0, 3, {
    fontSize: 12,
    fontStyle: 'italic',
    padding: '10 5 5 5',
    alignment: 'right',
    verticalAlignment: 'middle',
    backgroundColor: { r: 240, g: 240, b: 240 },
    borderWidth: 0,
  });

  // Adresszeile der Musterfirma
  table.setCell(1, 0, 'Musterstraße 123, 12345 Musterstadt');
  table.mergeCells(1, 0, 1, 5);
  table.setCellStyle(1, 0, {
    fontSize: 10,
    padding: '2 5 10 5',
    alignment: 'left',
    backgroundColor: { r: 240, g: 240, b: 240 },
    borderWidth: 0,
    bottomBorder: {
      width: 1,
      color: { r: 200, g: 200, b: 200 },
      style: 'solid',
    },
  });

  // ---- ADRESSBEREICH ----

  // Absenderzeile (klein)
  table.setCell(2, 0, 'Musterfirma GmbH • Musterstraße 123 • 12345 Musterstadt');
  table.mergeCells(2, 0, 2, 5);
  table.setCellStyle(2, 0, {
    fontSize: 8,
    fontStyle: 'italic',
    padding: '15 5 0 5',
    borderWidth: 0,
  });

  // Empfängeradresse
  table.setCell(3, 0, 'Max Mustermann • Beispielweg 42 • 54321 Beispielstadt');
  table.mergeCells(3, 0, 5, 2);
  // Hier können wir auf Template-Formatierung für Adressen vertrauen

  // ---- RECHNUNGSDETAILS ----

  // Rechnung Titel
  table.setCell(3, 3, 'RECHNUNG');
  table.mergeCells(3, 3, 3, 5);
  // Styling vom Template übernehmen, nur Ausrichtung anpassen
  table.setCellStyle(3, 3, {
    fontSize: 16,
    fontWeight: 'bold',
    alignment: 'right',
  });

  // Rechnungsnummer, Datum etc.
  const invoiceDetails = [
    ['Rechnungsnr.:', 'R-2023-0042'],
    ['Datum:', '01.04.2023'],
    ['Kundennr.:', 'K-12345'],
  ];

  for (let i = 0; i < invoiceDetails.length; i++) {
    // Beschriftung
    table.setCell(4 + i, 3, invoiceDetails[i][0]);
    table.mergeCells(4 + i, 3, 4 + i, 4);
    // Template-konforme Formatierung

    // Wert
    table.setCell(4 + i, 5, invoiceDetails[i][1]);
    // Template-konforme Formatierung mit Fettschrift
    table.setCellStyle(4 + i, 5, {
      fontWeight: 'bold',
    });
  }

  // ---- TITEL UND BESCHREIBUNG ----

  // Leere Zeile als Abstand
  table.setCell(7, 0, '');
  table.mergeCells(7, 0, 7, 5);

  // Rechnungsbetreff
  table.setCell(8, 0, 'Rechnung für erbrachte Dienstleistungen im März 2023');
  table.mergeCells(8, 0, 8, 5);
  table.setCellStyle(8, 0, {
    fontSize: 14,
    fontWeight: 'bold',
  });

  // Anrede und Text - Aufteilen in zwei separate Zellen
  table.setCell(9, 0, 'Sehr geehrter Herr Mustermann,');
  table.mergeCells(9, 0, 9, 5);

  // Zweiter Teil des Texts in neuer Zelle
  table.setCell(10, 0, 'hiermit stellen wir Ihnen die folgenden Leistungen in Rechnung:');
  table.mergeCells(10, 0, 10, 5);

  // ---- TABELLENKOPF FÜR POSITIONEN ----

  const headers = ['Pos.', 'Beschreibung', 'Anzahl', 'Einheit', 'Einzelpreis', 'Gesamtpreis'];

  for (let i = 0; i < headers.length; i++) {
    table.setCell(11, i, headers[i]);
    // Das Template kümmert sich um die Header-Formatierung
  }

  // ---- POSITIONEN ----

  // Erweiterte Liste mit mehr Positionen, um Mehrseitigkeit zu erzwingen
  const items = [
    ['1', 'Webseiten-Entwicklung', '20', 'Std.', '95,00 €', '1.900,00 €'],
    ['2', 'Grafikdesign für Firmenlogo', '1', 'Pauschal', '450,00 €', '450,00 €'],
    ['3', 'SEO-Optimierung', '10', 'Std.', '85,00 €', '850,00 €'],
    ['4', 'Server-Setup und Konfiguration', '5', 'Std.', '110,00 €', '550,00 €'],
    [
      '5',
      'Responsive Design Anpassungen für verschiedene Endgeräte (Desktop, Tablet, Smartphone)',
      '15',
      'Std.',
      '95,00 €',
      '1.425,00 €',
    ],
    ['6', 'Inhaltsmanagement und Content-Struktur', '8', 'Std.', '75,00 €', '600,00 €'],
    [
      '7',
      'Newsletter-Integration mit Anmeldeformular und Datenbank-Anbindung',
      '4',
      'Std.',
      '85,00 €',
      '340,00 €',
    ],
    [
      '8',
      'Social-Media-Integration mit automatischen Sharing-Funktionen',
      '6',
      'Std.',
      '85,00 €',
      '510,00 €',
    ],
    [
      '9',
      'Performance-Optimierung und Caching-Implementierung',
      '5',
      'Std.',
      '95,00 €',
      '475,00 €',
    ],
    [
      '10',
      'Browsertest und Debugging für Chrome, Firefox, Safari und Edge',
      '8',
      'Std.',
      '85,00 €',
      '680,00 €',
    ],
    [
      '11',
      'Implementierung eines Kontaktformulars mit Spamschutz',
      '3',
      'Std.',
      '85,00 €',
      '255,00 €',
    ],
    ['12', 'Einrichtung von Google Analytics und Tag Manager', '4', 'Std.', '95,00 €', '380,00 €'],
    [
      '13',
      'Erstellung eines Cookie-Consent-Banners gemäß DSGVO',
      '5',
      'Std.',
      '95,00 €',
      '475,00 €',
    ],
    [
      '14',
      'Implementierung von Lazy Loading für Bilder und Inhalte',
      '3',
      'Std.',
      '95,00 €',
      '285,00 €',
    ],
    [
      '15',
      'Einrichtung eines Content Management Systems mit individuellen Benutzerrollen',
      '12',
      'Std.',
      '95,00 €',
      '1.140,00 €',
    ],
    [
      '16',
      'Programmierung eines Online-Shop-Moduls mit Warenkorb-Funktion',
      '20',
      'Std.',
      '110,00 €',
      '2.200,00 €',
    ],
    [
      '17',
      'Integration von Zahlungsanbietern (PayPal, Kreditkarte, Banküberweisung)',
      '8',
      'Std.',
      '110,00 €',
      '880,00 €',
    ],
    [
      '18',
      'Datenschutzrichtlinien und Impressum nach aktueller Rechtslage',
      '4',
      'Std.',
      '75,00 €',
      '300,00 €',
    ],
    [
      '19',
      'Multilingual-Funktionalität mit Deutsch und Englisch',
      '10',
      'Std.',
      '95,00 €',
      '950,00 €',
    ],
    [
      '20',
      'Erstellung einer Sitemap und Implementierung von Schema.org-Markup',
      '6',
      'Std.',
      '85,00 €',
      '510,00 €',
    ],
    [
      '21',
      'Mobile-First-Optimierung und Progressive Web App Funktionalität',
      '14',
      'Std.',
      '95,00 €',
      '1.330,00 €',
    ],
    [
      '22',
      'Integration von Google Maps mit individuellen Standortmarkern',
      '3',
      'Std.',
      '85,00 €',
      '255,00 €',
    ],
    ['23', 'Setup eines Blog-Systems mit Kategorien und Tags', '7', 'Std.', '85,00 €', '595,00 €'],
    [
      '24',
      'Erstellung eines individuellen 404-Fehlerseiten-Designs',
      '2',
      'Std.',
      '75,00 €',
      '150,00 €',
    ],
    ['25', 'Projektmanagement und Kundenabstimmung', '15', 'Std.', '65,00 €', '975,00 €'],
    [
      '26',
      'Serverseitige Skripte zur automatisierten Datensicherung',
      '6',
      'Std.',
      '110,00 €',
      '660,00 €',
    ],
    [
      '27',
      'Suchfunktion mit Autovervollständigung und Filteroptionen',
      '8',
      'Std.',
      '95,00 €',
      '760,00 €',
    ],
    [
      '28',
      'Erstellung einer Bildergalerie mit Lightbox-Funktion',
      '5',
      'Std.',
      '85,00 €',
      '425,00 €',
    ],
    [
      '29',
      'Integration eines Live-Chat-Systems für Kundenservice',
      '7',
      'Std.',
      '95,00 €',
      '665,00 €',
    ],
    [
      '30',
      'Finale Qualitätssicherung und Bugfixing vor Launch',
      '10',
      'Std.',
      '85,00 €',
      '850,00 €',
    ],
  ];

  for (let row = 0; row < items.length; row++) {
    for (let col = 0; col < items[row].length; col++) {
      table.setCell(12 + row, col, items[row][col]);
      // Hier nutzen wir die Template-Formatierung für Zellen
      // Die Ausrichtung für numerische Spalten ist bereits im Template definiert
    }
  }

  // Berechnen der neuen Gesamtsumme basierend auf den erweiterten Positionen
  let subtotal = 0;
  items.forEach((item) => {
    // Extrahiere den Preis aus dem letzten Element jeder Position
    const priceString = item[5].replace('.', '').replace(',', '.').replace(' €', '');
    subtotal += parseFloat(priceString);
  });

  const formattedSubtotal =
    subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const vat = subtotal * 0.19;
  const formattedVat =
    vat.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const total = subtotal + vat;
  const formattedTotal =
    total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  // ---- SUMMEN ----

  // Index für die Summenzeilen berechnen (nach den Produktpositionen)
  const summaryRowStart = 12 + items.length + 1;

  // Leerzeile
  table.setCell(summaryRowStart - 1, 0, '');
  table.mergeCells(summaryRowStart - 1, 0, summaryRowStart - 1, 5);

  // Zwischensumme
  table.setCell(summaryRowStart, 3, 'Zwischensumme:');
  table.mergeCells(summaryRowStart, 3, summaryRowStart, 4);
  // Das Template kümmert sich um die Formatierung für Summen

  table.setCell(summaryRowStart, 5, formattedSubtotal);

  // MwSt
  table.setCell(summaryRowStart + 1, 3, 'MwSt. 19%:');
  table.mergeCells(summaryRowStart + 1, 3, summaryRowStart + 1, 4);

  table.setCell(summaryRowStart + 1, 5, formattedVat);

  // Gesamtsumme
  table.setCell(summaryRowStart + 2, 3, 'Gesamtbetrag:');
  table.mergeCells(summaryRowStart + 2, 3, summaryRowStart + 2, 4);
  table.setCellStyle(summaryRowStart + 2, 3, {
    fontWeight: 'bold',
  });

  table.setCell(summaryRowStart + 2, 5, formattedTotal);
  table.setCellStyle(summaryRowStart + 2, 5, {
    fontWeight: 'bold',
  });

  // ---- ZAHLUNGSINFORMATIONEN ----

  // Leerzeile
  table.setCell(summaryRowStart + 3, 0, '');
  table.mergeCells(summaryRowStart + 3, 0, summaryRowStart + 3, 5);

  // Zahlungsbedingungen
  table.setCell(summaryRowStart + 4, 0, 'Zahlungsbedingungen:');
  table.setCellStyle(summaryRowStart + 4, 0, {
    fontWeight: 'bold',
  });

  table.setCell(summaryRowStart + 4, 1, 'Bitte überweisen Sie den Betrag innerhalb von 14 Tagen.');
  table.mergeCells(summaryRowStart + 4, 1, summaryRowStart + 4, 5);

  // Bankdaten
  table.setCell(summaryRowStart + 5, 0, 'Bankverbindung:');
  table.setCellStyle(summaryRowStart + 5, 0, {
    fontWeight: 'bold',
  });

  table.setCell(
    summaryRowStart + 5,
    1,
    'Musterfirma GmbH • IBAN: DE12 3456 7890 1234 5678 90 • BIC: DEUTDEMMXXX',
  );
  table.mergeCells(summaryRowStart + 5, 1, summaryRowStart + 5, 5);

  // Zusätzliche Hinweise für die Mehrseitigkeit
  table.setCell(summaryRowStart + 6, 0, 'Hinweise:');
  table.setCellStyle(summaryRowStart + 6, 0, {
    fontWeight: 'bold',
  });

  table.setCell(
    summaryRowStart + 6,
    1,
    'Diese Rechnung ist mehrseitig und wurde automatisch generiert. Bitte beachten Sie, dass alle Seiten zur Rechnung gehören.',
  );
  table.mergeCells(summaryRowStart + 6, 1, summaryRowStart + 6, 5);

  // ---- FUSSZEILE ----

  // Leerzeile vor Fußzeile
  table.setCell(summaryRowStart + 7, 0, '');
  table.mergeCells(summaryRowStart + 7, 0, summaryRowStart + 7, 5);

  // Trennlinie
  table.setCell(summaryRowStart + 8, 0, '');
  table.mergeCells(summaryRowStart + 8, 0, summaryRowStart + 8, 5);
  table.setCellStyle(summaryRowStart + 8, 0, {
    topBorder: {
      width: 1,
      color: { r: 200, g: 200, b: 200 },
      style: 'solid',
    },
  });

  // Firmeninformationen in der Fußzeile
  table.setCell(
    summaryRowStart + 9,
    0,
    'Musterfirma GmbH • Musterstraße 123 • 12345 Musterstadt • Tel: +49 123 456789 • E-Mail: info@musterfirma.de',
  );
  table.mergeCells(summaryRowStart + 9, 0, summaryRowStart + 9, 5);
  table.setCellStyle(summaryRowStart + 9, 0, {
    fontSize: 8,
    alignment: 'center',
  });

  // Generieren des PDFs
  const pdfDoc = await table.toPDF();
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('invoice_example.pdf', pdfBytes);

  console.log('Mehrseitige Rechnung wurde erstellt und als invoice_example.pdf gespeichert.');
  console.log(
    'Die ersten ' + repeatHeaderRows + ' Zeilen werden als Kopfzeilen auf jeder Seite wiederholt.',
  );
  console.log('Gesamtbetrag: ' + formattedTotal + ' (inkl. MwSt)');
  console.log('Das Template "Invoice" wurde für die Formatierung verwendet.');
}

// Ausführen der Beispielfunktion
createInvoiceExample().catch((error) => {
  console.error('Fehler beim Erstellen der Rechnung:', error);
});
