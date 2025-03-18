# PDF-lib Simple Tables API Documentation

## Table of Contents

- [PDF-lib Simple Tables API Documentation](#pdf-lib-simple-tables-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Core Classes](#core-classes)
    - [PdfTable](#pdftable)
      - [Constructor](#constructor)
      - [Options](#options)
      - [Basic Methods](#basic-methods)
      - [Examples](#examples)
    - [CustomFont](#customfont)
      - [Constructor](#constructor-1)
      - [Parameters](#parameters)
      - [Example](#example)
  - [Styling Options](#styling-options)
    - [Cell Styles](#cell-styles)
      - [Examples](#examples-1)
    - [Border Styling](#border-styling)
      - [Examples](#examples-2)
    - [Text Formatting](#text-formatting)
    - [Background Effects](#background-effects)
  - [Design Templates](#design-templates)
    - [Predefined Configurations](#predefined-configurations)
    - [Custom Templates](#custom-templates)
  - [Advanced Features](#advanced-features)
    - [Cell Merging](#cell-merging)
    - [Dynamic Row Heights](#dynamic-row-heights)
    - [PDF Embedding](#pdf-embedding)
  - [Architecture](#architecture)
    - [Core Modules](#core-modules)
    - [Module Relationships](#module-relationships)
  - [API Reference](#api-reference)
    - [Interfaces](#interfaces)
      - [`DesignConfig`](#designconfig)
      - [`AdditionalBorder`](#additionalborder)
      - [`TableTemplate`](#tabletemplate)
      - [`SectionStyle`](#sectionstyle)
      - [`CellSelector`](#cellselector)
    - [Browser Support](#browser-support)
  - [Conclusion](#conclusion)

## Core Classes

### PdfTable

The main class for creating and manipulating tables.

#### Constructor

```typescript
new PdfTable(options: TableOptions)
```

#### Options

```typescript
interface TableOptions {
  columns: number;             // Number of columns
  rows: number;                // Number of rows
  rowHeight?: number;          // Height of each row (default: 30)
  colWidth?: number;           // Width of each column (default: 100)
  designConfig?: DesignConfig; // Design configuration
  tableWidth?: number;         // Total table width
  tableHeight?: number;        // Total table height
  repeatHeaderRows?: number;   // Number of header rows to repeat on new pages
  headerRepetition?: boolean;  // Whether to repeat headers
  pageBreakThreshold?: number; // When to break to a new page
}
```

#### Basic Methods

```typescript
// Content management
setCell(row: number, col: number, value: string): void
getCell(row: number, col: number): string
removeCell(row: number, col: number): void

// Style management
setCellStyle(row: number, col: number, style: TableCellStyle): void
getCellStyle(row: number, col: number): TableCellStyle

// Structure management
addRow(): void
addColumn(): void
removeRow(row: number): void
removeColumn(col: number): void
mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void

// Font management
setCustomFont(font: CustomFont): void

// Output
toPDF(): Promise<PDFDocument>
embedInPDF(document: PDFDocument, options: { x: number, y: number }): Promise<void>
embedTableAsImage(document: PDFDocument, imageBytes: Uint8Array, options: { x: number, y: number, width: number, height: number }): Promise<void>

// Template application
applyTemplate(template: string | TableTemplate): void
```

#### Examples

Basic table creation:

```typescript
const table = new PdfTable({ columns: 4, rows: 5 });

// Set header cells
table.setCell(0, 0, 'ID');
table.setCell(0, 1, 'Name');
table.setCell(0, 2, 'Email');
table.setCell(0, 3, 'Status');

// Apply header style
for (let col = 0; col < 4; col++) {
  table.setCellStyle(0, col, {
    fontWeight: 'bold',
    backgroundColor: { r: 240, g: 240, b: 240 },
    alignment: 'center',
  });
}

// Add data rows
table.setCell(1, 0, '1001');
table.setCell(1, 1, 'John Doe');
table.setCell(1, 2, 'john@example.com');
table.setCell(1, 3, 'Active');

// Generate PDF
const pdfDoc = await table.toPDF();
const pdfBytes = await pdfDoc.save();
```

### CustomFont

Class for handling custom fonts in tables.

#### Constructor

```typescript
new CustomFont(name: string, base64: string, extension?: string)
```

#### Parameters

- `name`: Font name to reference
- `base64`: Base64-encoded font data
- `extension` (optional): Font file extension ('ttf', 'otf', etc.)

#### Example

```typescript
// Load a custom font
const fontData = 'base64-encoded-font-data';
const customFont = new CustomFont('Montserrat', fontData, 'ttf');
table.setCustomFont(customFont);

// Use the custom font in a cell
table.setCellStyle(1, 1, {
  fontFamily: 'Montserrat',
  fontSize: 12,
});
```

## Styling Options

### Cell Styles

The `TableCellStyle` interface allows detailed styling of cells:

```typescript
interface TableCellStyle {
  // Basic properties
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  backgroundColor?: { r: number; g: number; b: number };
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;
  
  // Text formatting
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  alignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  textOverflow?: 'clip' | 'ellipsis';
  whiteSpace?: 'normal' | 'nowrap' | 'pre';
  
  // Border control
  topBorder?: BorderStyle;
  rightBorder?: BorderStyle;
  bottomBorder?: BorderStyle;
  leftBorder?: BorderStyle;
  additionalBorders?: AdditionalBorder[];
  
  // Layout
  padding?: string | number;
  wordWrap?: 'normal' | 'break-word' | 'none';
  
  // Advanced
  borderRadius?: string | number;
  boxShadow?: string;
  opacity?: number;
  
  // Cell spanning
  columnSpan?: number;
  rowSpan?: number;
  
  // Effects
  backgroundGradient?: {
    type: 'linear' | 'radial';
    colors: { position: number; color: { r: number; g: number; b: number } }[];
    angle?: number;
    center?: { x: number; y: number };
  };
  
  // Interaction states
  hoverStyle?: TableCellStyle;
  printStyle?: TableCellStyle;
  className?: string;
}
```

#### Examples

Basic cell style:

```typescript
table.setCellStyle(1, 1, {
  fontSize: 14,
  fontColor: { r: 50, g: 50, b: 50 },
  backgroundColor: { r: 245, g: 245, b: 245 },
  alignment: 'center',
  padding: '8 12 8 12', // top right bottom left
});
```

Advanced text formatting:

```typescript
table.setCellStyle(2, 1, {
  fontWeight: 'bold',
  fontStyle: 'italic',
  textDecoration: 'underline',
  textTransform: 'uppercase',
  verticalAlignment: 'middle',
});
```

### Border Styling

Control individual borders around cells:

```typescript
interface BorderStyle {
  display?: boolean;
  color?: { r: number; g: number; b: number };
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  dashArray?: number[];
  dashPhase?: number;
}
```

#### Examples

Custom borders:

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
    dashArray: [3, 3],
  },
});
```

Additional internal borders:

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

### Text Formatting

Control text wrapping and layout:

```typescript
// Table level
const table = new PdfTable({
  columns: 3,
  rows: 5,
  designConfig: {
    wordWrap: 'normal',
    dynamicRowHeight: true,
  },
});

// Cell level
table.setCellStyle(1, 1, {
  wordWrap: 'break-word',
  verticalAlignment: 'top',
  padding: '10 5 10 5',
});
```

### Background Effects

Create gradient backgrounds:

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

## Design Templates

### Predefined Configurations

The library includes several predefined design configurations:

```typescript
import { 
  materialDesignConfig,
  classicDesignConfig,
  modernDesignConfig,
  highContrastDesignConfig,
  financialTableDesign,
  dataTableDesign,
  darkModeTableDesign
} from 'pdf-lib-simple-tables';

const table = new PdfTable({
  columns: 3,
  rows: 5,
  designConfig: modernDesignConfig,
});
```

### Custom Templates

Complete table templates for common use cases:

```typescript
import { PdfTable, predefinedTemplates } from 'pdf-lib-simple-tables';

// Available templates:
// - modernBusinessTemplate: Modern business document style
// - invoiceTemplate: Professional invoice format
// - minimalistTemplate: Clean, minimal design

const table = new PdfTable({
  columns: 4,
  rows: 10,
});

// Apply template
table.applyTemplate(predefinedTemplates[0]); // modernBusinessTemplate
// OR by name
table.applyTemplate('Invoice');
```

## Advanced Features

### Cell Merging

Merge cells to create complex layouts:

```typescript
// Merge cells from row 1, column 0 to row 1, column 2
table.mergeCells(1, 0, 1, 2);

// Set content in the merged cell (use top-left coordinates)
table.setCell(1, 0, 'This content spans 3 columns');

// Style the merged cell
table.setCellStyle(1, 0, {
  alignment: 'center',
  backgroundColor: { r: 240, g: 240, b: 240 },
});
```

### Dynamic Row Heights

Automatically adjust row heights based on content:

```typescript
const table = new PdfTable({
  columns: 3,
  rows: 5,
  designConfig: {
    dynamicRowHeight: true,
    wordWrap: 'normal',
  },
});

// Add long content that will automatically expand the row height
table.setCell(1, 1, 'This is a very long text that will wrap to multiple lines, causing the row to expand in height to accommodate all the content.');
```

### PDF Embedding

Embed tables into existing PDFs:

```typescript
import { PDFDocument } from 'pdf-lib';
import { PdfTable } from 'pdf-lib-simple-tables';

async function embedTable() {
  // Load existing PDF
  const existingPdf = await PDFDocument.load(existingPdfBytes);
  
  // Create table
  const table = new PdfTable({ columns: 4, rows: 4 });
  table.setCell(0, 0, 'Header 1');
  // ...more cell assignments...
  
  // Embed at specific coordinates
  await table.embedInPDF(existingPdf, { x: 50, y: 300 });
  
  // Save updated PDF
  const updatedPdfBytes = await existingPdf.save();
}
```

Alternatively, embed as an image:

```typescript
async function embedTableImage() {
  const existingPdf = await PDFDocument.load(existingPdfBytes);
  const table = new PdfTable({ columns: 4, rows: 4 });
  // ...set table data...

  // Assume imageBytes contains the PNG image of the table
  const imageBytes = await generateTableImageBytes(table); // Your implementation
  await table.embedTableAsImage(existingPdf, imageBytes, { 
    x: 50, 
    y: 300, 
    width: 320, 
    height: 80 
  });
  
  const updatedPdfBytes = await existingPdf.save();
}
```

## Architecture

### Core Modules

The library uses a modular architecture:

- **TableDataManager**: Manages the table data (cell content, styles, rows/columns)
- **MergeCellManager**: Handles cell merging operations
- **FontManager**: Manages custom fonts and font embedding
- **TableStyleManager**: Applies and combines styles from different sources
- **BorderRenderer**: Renders different types of borders (solid, dashed, dotted)
- **TableRenderer**: Renders the complete table with all its elements
- **ImageEmbedder**: Handles embedding tables as images in PDFs
- **TableTemplateManager**: Manages and applies predefined templates

### Module Relationships

The `PdfTable` class serves as a facade, coordinating these modules to provide a simple API for users:

```plaintext
┌───────────────────┐          ┌──────────────────┐
│     PdfTable        │ uses     │  TableRenderer     │
│   (Facade Class)    │ ◄───────┤                    │
└───────────────────┘          └────────┬─────────┘
         │                              │
         │ delegates                    │ uses
         ▼                              ▼
┌───────────────────┐          ┌──────────────────┐
│  TableDataManager   │          │  BorderRenderer    │
└───────────────────┘          └──────────────────┘
         │                              │
         │                              │ uses
         ▼                              ▼
┌───────────────────┐          ┌──────────────────┐
│  MergeCellManager   │          │ TableStyleManager  |
└───────────────────┘          └──────────────────┘
         │
         │
         ▼
┌───────────────────┐          ┌──────────────────┐
│    FontManager      │          │   ImageEmbedder    │
└───────────────────┘          └──────────────────┘
```

## API Reference

### Interfaces

#### `DesignConfig`

Design configuration for table styling:

```typescript
interface DesignConfig {
  fontFamily?: string;
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  backgroundColor?: { r: number; g: number; b: number };
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;
  
  // Border properties
  borderTop?: BorderStyle;
  borderRight?: BorderStyle;
  borderBottom?: BorderStyle;
  borderLeft?: BorderStyle;
  
  // Header styles
  headingRowStyle?: Partial<DesignConfig>;
  headingColumnStyle?: Partial<DesignConfig>;
  
  // Default border styles
  defaultTopBorder?: BorderStyle;
  defaultRightBorder?: BorderStyle;
  defaultBottomBorder?: BorderStyle;
  defaultLeftBorder?: BorderStyle;
  
  // Additional styling
  additionalBorders?: AdditionalBorder[];
  padding?: string | number;
  fontWeight?: 'normal' | 'bold' | 'lighter' | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  alignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  borderRadius?: string | number;
  wordWrap?: 'normal' | 'break-word' | 'none';
  
  // Special row/column styling
  evenRowStyle?: TableCellStyle;
  oddRowStyle?: TableCellStyle;
  firstRowStyle?: TableCellStyle;
  lastRowStyle?: TableCellStyle;
  firstColumnStyle?: TableCellStyle;
  lastColumnStyle?: TableCellStyle;
  
  // Section styling
  theadStyle?: SectionStyle;
  tbodyStyle?: SectionStyle;
  tfootStyle?: SectionStyle;
  
  // Table borders
  tableBorder?: BorderStyle;
  
  // Special cell styling
  specialCells?: CellSelector[];
  
  // Misc styling options
  dynamicRowHeight?: boolean;
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  textOverflow?: 'clip' | 'ellipsis';
  whiteSpace?: 'normal' | 'nowrap' | 'pre';
  boxShadow?: string;
  hoverRowHighlight?: { r: number; g: number; b: number };
  borderCollapse?: 'separate' | 'collapse';
}
```

#### `AdditionalBorder`

Definition for additional borders within cells:

```typescript
interface AdditionalBorder {
  yOffset: number;
  style: BorderStyle;
}
```

#### `TableTemplate`

Definition for a table template:

```typescript
interface TableTemplate {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  
  baseStyle: {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: { r: number; g: number; b: number };
    backgroundColor?: { r: number; g: number; b: number };
    borderWidth?: number;
    padding?: string | number;
    // ... and other style properties
  };
  
  headerRow?: TableCellStyle;
  footerRow?: TableCellStyle;
  firstColumn?: TableCellStyle;
  lastColumn?: TableCellStyle;
  evenRows?: TableCellStyle;
  oddRows?: TableCellStyle;
  
  borders?: {
    headerBottom?: BorderStyle;
    footerTop?: BorderStyle;
    top?: BorderStyle;
    right?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
  };
  
  specialCells?: {
    selector: string;
    pattern?: string;
    coordinates?: { row: number; col: number };
    style: TableCellStyle;
  }[];
  
  advanced?: {
    dynamicRowHeight?: boolean;
    wordWrap?: 'normal' | 'break-word' | 'none';
    verticalAlignment?: 'top' | 'middle' | 'bottom';
    horizontalAlignment?: 'left' | 'center' | 'right';
    alternateRowColoring?: boolean;
  };
}
```

#### `SectionStyle`

For styling table sections:

```typescript
interface SectionStyle {
  backgroundColor?: { r: number; g: number; b: number };
  borderTop?: BorderStyle;
  borderBottom?: BorderStyle;
  defaultCellStyle?: TableCellStyle;
}
```

#### `CellSelector`

For targeting specific cells:

```typescript
interface CellSelector {
  selector: 'coordinates' | 'first-row' | 'first-column' | 'nth-row' | 'nth-column' | 'last-row' | 'last-column' | 'pattern';
  coordinates?: { row: number; col: number };
  index?: number;
  pattern?: string | RegExp;
  style: TableCellStyle;
}
```

### Browser Support

The library supports both Node.js and browser environments. For browsers, use the bundle in `build/index.browser.js`:

```html
<script src="path/to/pdf-lib-simple-tables/build/index.browser.js"></script>
<script>
  const { PdfTable, modernDesignConfig } = PdfLibSimpleTables;
  
  async function createTable() {
    const table = new PdfTable({
      columns: 3,
      rows: 5,
      designConfig: modernDesignConfig
    });
    
    // ...configure table...
    
    const pdfDoc = await table.toPDF();
    const pdfBytes = await pdfDoc.save();
    
    // Download or display the PDF
    download(pdfBytes, "table.pdf", "application/pdf");
  }
  
  // Helper function to download the PDF
  function download(data, filename, type) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }
</script>
```

## Conclusion

This API documentation provides a comprehensive overview of the PDF-lib Table Library. For specific examples and use cases, refer to the examples directory in the repository.
