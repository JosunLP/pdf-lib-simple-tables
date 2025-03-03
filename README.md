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
