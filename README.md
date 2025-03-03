# PDF.js Table Library

## Übersicht

Die PDF.js Table Library ist eine TypeScript-Bibliothek, die es ermöglicht, Tabellen in PDF-Dokumente zu erstellen und zu integrieren. Diese Bibliothek nutzt `pdf-lib` zur PDF-Erstellung und bietet erweiterte Funktionen wie benutzerdefinierte Schriftarten, Zellstile und das Zusammenführen von Zellen.

## Installation

Verwenden Sie npm oder yarn, um die Bibliothek zu installieren:

```bash
npm install pdfjs-table-lib
# oder
yarn add pdfjs-table-lib
```

## Verwendung

### Grundlegendes Beispiel

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

### Erweiterte Optionen

#### Zellstile

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

#### Zusammenführen von Zellen

```typescript
table.mergeCells(1, 0, 1, 2);
```

#### Benutzerdefinierte Schriftarten

```typescript
import { CustomFont } from 'pdfjs-table-lib';

const customFont = new CustomFont('MyFont', 'base64-encoded-font-data');
table.setCustomFont(customFont);
```

### Neue Methoden

#### Zellen auslesen

```typescript
const cellValue = table.getCell(0, 0);
const cellStyle = table.getCellStyle(0, 0);
```

#### Zellen bearbeiten

```typescript
table.removeCell(0, 0);
```

#### Zeilen und Spalten hinzufügen/entfernen

```typescript
table.addRow();
table.addColumn();
table.removeRow(0);
table.removeColumn(0);
```

## API

### Klassen

#### `PdfTable`

- **Konstruktor**: `new PdfTable(options: TableOptions)`
- **Methoden**:
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

- **Konstruktor**: `new CustomFont(name: string, base64: string, extension?: string)`

### Schnittstellen

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

## Entwicklung

### Voraussetzungen

- Node.js
- npm oder yarn

### Installation der Abhängigkeiten

```bash
npm install
# oder
yarn install
```

### Tests ausführen

```bash
npm test
# oder
yarn test
```

### Linting und Formatierung

```bash
npm run lint
npm run format
# oder
yarn lint
yarn format
```

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Informationen finden Sie in der [LICENSE](./LICENSE) Datei.
