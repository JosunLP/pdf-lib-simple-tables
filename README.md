# PDF-lib Table Library

## Overview

The PDF-lib Table Library is a TypeScript library that allows you to create and integrate tables into PDF documents. This library uses `pdf-lib` for PDF creation and offers advanced features such as custom fonts, cell styles, and cell merging.

## Installation

Use npm or yarn to install the library:

```bash
npm install pdf-lib-simple-tables
# or
yarn add pdf-lib-simple-tables
```

## Usage

### Basic Example

```typescript
import { PdfTable } from 'pdf-lib-simple-tables';

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
import { CustomFont } from 'pdf-lib-simple-tables';

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

PDF-lib Table Library now offers multiple design templates:

- `materialDesignConfig`: Material Design.
- `classicDesignConfig`: Classic look with serif font.
- `modernDesignConfig`: Modern, minimalist style.
- `highContrastDesignConfig`: High contrast for improved readability.

Example:

```typescript
import { PdfTable, modernDesignConfig } from 'pdf-lib-simple-tables';

const table = new PdfTable({
  columns: 3,
  rows: 5,
  designConfig: modernDesignConfig,
});

table.setCell(0, 0, 'Header 1');
// ...more cell assignments...

const pdfDoc = await table.toPDF();
const pdfBytes = await pdfDoc.save();
```

## Advanced Features

The library now also supports embedding tables into existing PDF documents – both as real, formatted tables and alternatively as embedded images.

### Embedding Real Tables

Use the `embedInPDF` method to insert the table into an existing PDF document:

```typescript
import { PDFDocument } from 'pdf-lib';
import { PdfTable } from 'pdf-lib-simple-tables';

async function embedTable() {
  const existingPdf = await PDFDocument.load(existingPdfBytes);
  const table = new PdfTable({ columns: 4, rows: 4, rowHeight: 20, colWidth: 80 });
  table.setCell(0, 0, 'Header 1');
  // ...more cell assignments...
  await table.embedInPDF(existingPdf, { x: 50, y: 300 });
  const updatedPdfBytes = await existingPdf.save();
}
```

### Embedding Table as Image

Alternatively, you can embed the table content as an image in your PDF. First, generate an image (e.g., via a canvas renderer) and then use `embedTableAsImage`:

```typescript
import { PDFDocument } from 'pdf-lib';
import { PdfTable } from 'pdf-lib-simple-tables';

async function embedTableImage() {
  const existingPdf = await PDFDocument.load(existingPdfBytes);
  const table = new PdfTable({ columns: 4, rows: 4, rowHeight: 20, colWidth: 80 });
  // ...set table data...

  // Assume imageBytes contains the PNG image of the table
  const imageBytes = await generateTableImageBytes(table); // External implementation
  await table.embedTableAsImage(existingPdf, imageBytes, { x: 50, y: 300, width: 320, height: 80 });
  const updatedPdfBytes = await existingPdf.save();
}
```

For more details and options, see the API documentation below.

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
