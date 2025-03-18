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

## Basic Example

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

## Key Features

- Table creation with customizable rows, columns, and cell sizes
- Styling: fonts, colors, borders, alignment, and more
- Cell merging for complex layouts
- Custom font support
- Predefined design templates
- Text formatting options (wrapping, alignment, decoration)
- Dynamic row heights based on content
- Complex border styles
- Embedding tables into existing PDFs
- Full browser support

## Documentation

For detailed documentation, including all features, options, and examples, see [API-DOCUMENTATION.md](./API-DOCUMENTATION.md).

## Design Templates

PDF-lib Table Library offers multiple design templates:

- `materialDesignConfig`: Material Design
- `classicDesignConfig`: Classic look with serif font
- `modernDesignConfig`: Modern, minimalist style
- `highContrastDesignConfig`: High contrast for improved readability
- `financialTableDesign`: Professional style for financial reports and invoices
- `dataTableDesign`: For scientific or data-intensive applications
- `darkModeTableDesign`: Eye-friendly design for dark interfaces

## Browser Support

This project fully supports both Node.js and browser environments.

```bash
# Generate browser build (IIFE format)
npm run build:browser
```

## Development

### Prerequisites

- Node.js
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint and format
npm run lint
npm run format
```

## License

This project is licensed under the MIT License. For more information, see the [LICENSE](./LICENSE) file.
