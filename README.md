# PDF.js Table Library

## Overview

The PDF.js Table Library is a TypeScript library that allows you to create and integrate tables into PDF documents. This library uses `pdf-lib` for PDF creation and offers advanced features such as custom fonts, cell styles, and cell merging.

## Installation

Use npm or yarn to install the library:

```bash
npm install pdfjs-table-lib
# or
yarn add pdfjs-table-lib
```

## Usage

### Basic Example

```typescript
import { PdfTable } from 'pdfjs-table-lib';

const table = new PdfTable({
  columns: 3,
  rows: 5,
});

table.setCell(0, 0, 'Header 1');
table.setCell(0, 1, 'Header 2');
table.setCell(0, 2, 'Header 3');

const pdfDoc = await table.toPDF();
const pdfBytes = await pdfDoc.save();
```

### Advanced Options

#### Cell Styles

```typescript
table.setCellStyle(0, 0, {
  fontSize: 14,
  fontColor: { r: 0, g: 0, b: 0 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderColor: { r: 0, g: 0, b: 0 },
  borderWidth: 1,
  alignment: 'center',
});
```

#### Merging Cells

```typescript
table.mergeCells(1, 0, 1, 2);
```

#### Custom Fonts

```typescript
import { CustomFont } from 'pdfjs-table-lib';

const customFont = new CustomFont('MyFont', 'base64-encoded-font-data');
table.setCustomFont(customFont);
```

### New Methods

#### Reading Cells

```typescript
const cellValue = table.getCell(0, 0);
const cellStyle = table.getCellStyle(0, 0);
```

#### Editing Cells

```typescript
table.removeCell(0, 0);
```

#### Adding/Removing Rows and Columns

```typescript
table.addRow();
table.addColumn();
table.removeRow(0);
table.removeColumn(0);
```

### Design Templates

PDF.js Table Library bietet nun mehrere Design Templates:

- `materialDesignConfig`: Material Design.
- `classicDesignConfig`: Klassischer Look mit Serifenschrift.
- `modernDesignConfig`: Moderner, minimalistischer Stil.
- `highContrastDesignConfig`: Hoher Kontrast für verbesserte Lesbarkeit.

Beispiel:

```typescript
import { PdfTable, modernDesignConfig } from 'pdfjs-table-lib';

const table = new PdfTable({
  columns: 3,
  rows: 5,
  designConfig: modernDesignConfig,
});

table.setCell(0, 0, 'Header 1');
// ...weitere Zellzuweisungen...

const pdfDoc = await table.toPDF();
const pdfBytes = await pdfDoc.save();
```

## Erweiterte Funktionen

Die Bibliothek unterstützt nun auch das Einbetten von Tabellen in bereits bestehende PDF-Dokumente – sowohl als echte, formatierte Tabellen als auch alternativ als eingebettetes Bild.

### Echte Tabellen einbetten

Verwenden Sie die Methode `embedInPDF`, um die Tabelle in ein bestehendes PDF-Dokument einzufügen:

```typescript
import { PDFDocument } from 'pdf-lib';
import { PdfTable } from 'pdfjs-table-lib';

async function embedTable() {
  const existingPdf = await PDFDocument.load(existingPdfBytes);
  const table = new PdfTable({ columns: 4, rows: 4, rowHeight: 20, colWidth: 80 });
  table.setCell(0, 0, 'Header 1');
  // ...weitere Zellzuweisungen...
  await table.embedInPDF(existingPdf, { x: 50, y: 300 });
  const updatedPdfBytes = await existingPdf.save();
}
```

### Tabelle als Bild einbetten

Alternativ können Sie den Tabelleninhalt als Bild in Ihr PDF einbetten. Dazu erzeugen Sie zunächst ein Bild (z. B. über einen Canvas-Renderer) und verwenden dann `embedTableAsImage`:

```typescript
import { PDFDocument } from 'pdf-lib';
import { PdfTable } from 'pdfjs-table-lib';

async function embedTableImage() {
  const existingPdf = await PDFDocument.load(existingPdfBytes);
  const table = new PdfTable({ columns: 4, rows: 4, rowHeight: 20, colWidth: 80 });
  // ...Tabellendaten setzen...

  // Angenommen, imageBytes enthält das PNG-Bild der Tabelle
  const imageBytes = await generateTableImageBytes(table); // Implementierung extern
  await table.embedTableAsImage(existingPdf, imageBytes, { x: 50, y: 300, width: 320, height: 80 });
  const updatedPdfBytes = await existingPdf.save();
}
```

Weitere Details und Optionen finden Sie in der API-Dokumentation unten.

## API

### Classes

#### `PdfTable`

- **Constructor**: `new PdfTable(options: TableOptions)`
- **Methods**:
  - `setCell(row: number, col: number, value: string): void`
  - `setCellStyle(row: number, col: number, style: TableCellStyle): void`
  - `mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void`
  - `setCustomFont(font: CustomFont): void`
  - `toPDF(): Promise<PDFDocument>`
  - `getCell(row: number, col: number): string`
  - `getCellStyle(row: number, col: number): TableCellStyle`
  - `removeCell(row: number, col: number): void`
  - `addRow(): void`
  - `addColumn(): void`
  - `removeRow(row: number): void`
  - `removeColumn(col: number): void`

#### `CustomFont`

- **Constructor**: `new CustomFont(name: string, base64: string, extension?: string)`

### Interfaces

#### `TableOptions`

- `columns: number`
- `rows: number`
- `rowHeight?: number`
- `colWidth?: number`

#### `TableCellStyle`

- `fontSize?: number`
- `fontColor?: { r: number; g: number; b: number }`
- `backgroundColor?: { r: number; g: number; b: number }`
- `borderColor?: { r: number; g: number; b: number }`
- `borderWidth?: number`
- `alignment?: 'left' | 'center' | 'right'`

#### `MergedCell`

- `startRow: number`
- `startCol: number`
- `endRow: number`
- `endCol: number`

## Development

### Prerequisites

- Node.js
- npm or yarn

### Installing Dependencies

```bash
npm install
# or
yarn install
```

### Running Tests

```bash
npm test
# or
yarn test
```

### Linting and Formatting

```bash
npm run lint
npm run format
# or
yarn lint
yarn format
```

## License

This project is licensed under the MIT License. For more information, see the [LICENSE](./LICENSE) file.
