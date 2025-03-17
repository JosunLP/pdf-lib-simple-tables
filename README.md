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
- `financialTableDesign`: Professional style for financial reports and invoices.
- `dataTableDesign`: For scientific or data-intensive applications.
- `darkModeTableDesign`: Eye-friendly design for dark interfaces.

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

### Predefined Table Templates

The library includes complete table templates for common use cases:

```typescript
import { PdfTable, predefinedTemplates } from 'pdf-lib-simple-tables';

// Available templates:
// - modernBusinessTemplate: Modern business document style
// - invoiceTemplate: Professional invoice format
// - minimalistTemplate: Clean, minimal design

const table = new PdfTable({
  columns: 4,
  rows: 10,
  designConfig: predefinedTemplates[0], // modernBusinessTemplate
});
```

### Advanced Styling Options

#### Border Styling

Individual borders with custom styles:

```typescript
table.setCellStyle(1, 1, {
  topBorder: {
    display: true,
    color: { r: 200, g: 0, b: 0 },
    width: 2,
    style: 'solid',
  },
  bottomBorder: {
    display: true,
    color: { r: 0, g: 0, b: 200 },
    width: 1,
    style: 'dashed',
  },
});
```

#### Additional Internal Borders

Add horizontal lines within cells:

```typescript
table.setCellStyle(1, 1, {
  additionalBorders: [
    {
      yOffset: 10, // 10 points from the top of the cell
      style: {
        display: true,
        color: { r: 200, g: 200, b: 200 },
        width: 0.5,
        style: 'solid',
      },
    },
  ],
});
```

#### Text Wrapping and Dynamic Row Height

Control text wrapping and enable dynamic row height:

```typescript
import { PdfTable } from 'pdf-lib-simple-tables';

const table = new PdfTable({
  columns: 3,
  rows: 5,
  designConfig: {
    wordWrap: 'normal', // Options: 'normal', 'break-word', 'none'
    dynamicRowHeight: true, // Rows expand to fit content
  },
});

// Set long text in a cell
table.setCell(
  1,
  1,
  'This is a long text that will wrap according to the cell width and configured word wrap behavior.',
);
```

#### Vertical Alignment

Control vertical text position:

```typescript
table.setCellStyle(1, 1, {
  verticalAlignment: 'middle', // Options: 'top', 'middle', 'bottom'
});
```

#### Alternating Row Colors

Easily create zebra-striped tables:

```typescript
const table = new PdfTable({
  columns: 3,
  rows: 10,
  designConfig: {
    evenRowStyle: {
      backgroundColor: { r: 255, g: 255, b: 255 },
    },
    oddRowStyle: {
      backgroundColor: { r: 245, g: 245, b: 245 },
    },
  },
});
```

#### Section Styling

Apply styles to table sections like headers and footers:

```typescript
const table = new PdfTable({
  columns: 4,
  rows: 10,
  designConfig: {
    theadStyle: {
      backgroundColor: { r: 230, g: 230, b: 230 },
      borderBottom: {
        display: true,
        color: { r: 100, g: 100, b: 100 },
        width: 1,
        style: 'solid',
      },
    },
    tfootStyle: {
      backgroundColor: { r: 240, g: 240, b: 240 },
      borderTop: {
        display: true,
        color: { r: 100, g: 100, b: 100 },
        width: 1,
        style: 'solid',
      },
    },
  },
});
```

#### Advanced Text Formatting

Apply rich text styling:

```typescript
table.setCellStyle(1, 1, {
  fontWeight: 'bold',
  fontStyle: 'italic',
  textDecoration: 'underline',
  textTransform: 'uppercase',
});
```

#### Background Gradients

Create cells with gradient backgrounds:

```typescript
table.setCellStyle(1, 1, {
  backgroundGradient: {
    type: 'linear',
    colors: [
      { position: 0, color: { r: 255, g: 255, b: 255 } },
      { position: 1, color: { r: 200, g: 220, b: 240 } },
    ],
    angle: 45,
  },
});
```

#### Cell Spanning

Span cells across multiple columns or rows:

```typescript
table.setCellStyle(1, 1, {
  columnSpan: 2, // Span 2 columns
  rowSpan: 3, // Span 3 rows
});
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

## Architecture

The library uses a modular architecture to separate concerns and improve maintainability:

### Core Modules

- **TableDataManager**: Manages the table data (cell content, styles, rows/columns)
- **MergeCellManager**: Handles cell merging operations
- **FontManager**: Manages custom fonts and font embedding
- **TableStyleManager**: Applies and combines styles from different sources
- **BorderRenderer**: Renders different types of borders (solid, dashed, dotted)
- **TableRenderer**: Renders the complete table with all its elements
- **ImageEmbedder**: Handles embedding tables as images in PDFs

### Module Relationships

The `PdfTable` class serves as a facade, coordinating these modules to provide a simple API for users. Each module has a specific responsibility:

```
┌───────────────────┐          ┌──────────────────┐
│     PdfTable      │ uses     │  TableRenderer   │
│   (Facade Class)  │ ◄────────┤                  │
└───────────────────┘          └────────┬─────────┘
         │                              │
         │ delegates                    │ uses
         ▼                              ▼
┌───────────────────┐          ┌──────────────────┐
│  TableDataManager │          │  BorderRenderer  │
└───────────────────┘          └──────────────────┘
         │                              │
         │                              │ uses
         ▼                              ▼
┌───────────────────┐          ┌──────────────────┐
│  MergeCellManager │          │ TableStyleManager│
└───────────────────┘          └──────────────────┘
         │
         │
         ▼
┌───────────────────┐          ┌──────────────────┐
│    FontManager    │          │   ImageEmbedder  │
└───────────────────┘          └──────────────────┘
```

## Node.js and Browser Support

This project now fully supports both Node.js and browser environments.  
For browsers, use the bundle in `build/index.browser.js` – this is created using Vite.  
You can generate the browser build with the following npm script:

```bash
npm run build:browser
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

### Core Modules (For Developers/Contributors)

These modules are used internally by the `PdfTable` class:

#### `TableDataManager`

Manages table data and structure.

#### `TableRenderer`

Handles the rendering of tables to PDF.

#### `BorderRenderer`

Specializes in rendering different border styles.

#### `TableStyleManager`

Applies and combines cell styles.

#### `MergeCellManager`

Manages merged cells functionality.

#### `FontManager`

Handles font embedding and custom fonts.

#### `ImageEmbedder`

Embeds tables as images in PDFs.

### Interfaces

#### `TableOptions`

- `columns: number`
- `rows: number`
- `rowHeight?: number`
- `colWidth?: number`
- `designConfig?: DesignConfig`
- `tableWidth?: number`
- `tableHeight?: number`
- `repeatHeaderRows?: number`
- `headerRepetition?: boolean`
- `pageBreakThreshold?: number`

#### `TableCellStyle`

- `fontSize?: number`
- `fontColor?: { r: number; g: number; b: number }`
- `backgroundColor?: { r: number; g: number; b: number }`
- `borderColor?: { r: number; g: number; b: number }`
- `borderWidth?: number`
- `alignment?: 'left' | 'center' | 'right'`
- `topBorder?: BorderStyle`
- `rightBorder?: BorderStyle`
- `bottomBorder?: BorderStyle`
- `leftBorder?: BorderStyle`
- `additionalBorders?: AdditionalBorder[]`
- `padding?: string | number`
- `fontFamily?: string`
- `fontWeight?: 'normal' | 'bold' | 'lighter' | number`
- `fontStyle?: 'normal' | 'italic' | 'oblique'`
- `verticalAlignment?: 'top' | 'middle' | 'bottom'`
- `wordWrap?: 'normal' | 'break-word' | 'none'`
- `backgroundGradient?: {...}`
- `columnSpan?: number`
- `rowSpan?: number`

#### `BorderStyle`

- `display?: boolean`
- `color?: { r: number; g: number; b: number }`
- `width?: number`
- `style?: 'solid' | 'dashed' | 'dotted'`
- `dashArray?: number[]`
- `dashPhase?: number`

#### `DesignConfig`

- `fontFamily?: string`
- `fontSize?: number`
- `fontColor?: { r: number; g: number; b: number }`
- `backgroundColor?: { r: number; g: number; b: number }`
- `borderColor?: { r: number; g: number; b: number }`
- `borderWidth?: number`
- `headingRowStyle?: Partial<DesignConfig>`
- `headingColumnStyle?: Partial<DesignConfig>`
- `defaultTopBorder?: BorderStyle`
- `defaultRightBorder?: BorderStyle`
- `defaultBottomBorder?: BorderStyle`
- `defaultLeftBorder?: BorderStyle`
- `additionalBorders?: AdditionalBorder[]`
- `evenRowStyle?: TableCellStyle`
- `oddRowStyle?: TableCellStyle`
- `theadStyle?: SectionStyle`
- `tbodyStyle?: SectionStyle`
- `tfootStyle?: SectionStyle`
- `wordWrap?: 'normal' | 'break-word' | 'none'`
- `dynamicRowHeight?: boolean`

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

### Build

Use Vite to create the bundle:

```bash
npm run build
```

For the browser build (IIFE format):

```bash
npm run build:browser
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
