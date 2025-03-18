import { TableTemplate } from './TableTemplate';

/**
 * Modernes Business-Template
 */
export const modernBusinessTemplate: TableTemplate = {
  name: 'Modern Business',
  description: 'Ein modernes, professionelles Template für Geschäftsberichte',
  version: '1.0.0',
  author: 'PDF-lib Table Library',

  baseStyle: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 11,
    fontColor: { r: 50, g: 50, b: 50 },
    backgroundColor: { r: 255, g: 255, b: 255 },
    borderColor: { r: 230, g: 230, b: 230 },
    borderWidth: 0.5,
    padding: '8 12 8 12',
  },

  headerRow: {
    fontWeight: 'bold',
    backgroundColor: { r: 245, g: 245, b: 245 },
    fontSize: 12,
  },

  footerRow: {
    fontWeight: 'bold',
    backgroundColor: { r: 250, g: 250, b: 250 },
  },

  firstColumn: {
    fontWeight: 'bold',
  },

  evenRows: {
    backgroundColor: { r: 255, g: 255, b: 255 },
  },

  oddRows: {
    backgroundColor: { r: 250, g: 250, b: 250 },
  },

  borders: {
    headerBottom: {
      display: true,
      color: { r: 200, g: 200, b: 200 },
      width: 1,
      style: 'solid',
    },
    footerTop: {
      display: true,
      color: { r: 200, g: 200, b: 200 },
      width: 1,
      style: 'solid',
    },
  },

  advanced: {
    dynamicRowHeight: true,
    wordWrap: 'normal',
    verticalAlignment: 'middle',
    horizontalAlignment: 'left',
    alternateRowColoring: true,
  },
};

/**
 * Rechnungs-Template
 */
export const invoiceTemplate: TableTemplate = {
  name: 'Invoice',
  description: 'Ein Template für Rechnungen und Kalkulationen',
  version: '1.0.0',
  author: 'PDF-lib Table Library',

  baseStyle: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 10,
    fontColor: { r: 40, g: 40, b: 40 },
    backgroundColor: { r: 255, g: 255, b: 255 },
    borderColor: { r: 220, g: 220, b: 220 },
    borderWidth: 0.5,
    padding: '6 10 6 10',
  },

  headerRow: {
    fontWeight: 'bold',
    backgroundColor: { r: 240, g: 240, b: 240 },
    alignment: 'center',
  },

  lastColumn: {
    alignment: 'right',
  },

  borders: {
    top: {
      display: true,
      color: { r: 210, g: 210, b: 210 },
      width: 0.5,
      style: 'solid',
    },
    right: {
      display: true,
      color: { r: 210, g: 210, b: 210 },
      width: 0.5,
      style: 'solid',
    },
    bottom: {
      display: true,
      color: { r: 210, g: 210, b: 210 },
      width: 0.5,
      style: 'solid',
    },
    left: {
      display: true,
      color: { r: 210, g: 210, b: 210 },
      width: 0.5,
      style: 'solid',
    },
  },

  specialCells: [
    {
      selector: 'pattern',
      pattern: 'total',
      style: {
        fontWeight: 'bold',
        backgroundColor: { r: 245, g: 245, b: 245 },
        topBorder: {
          display: true,
          color: { r: 180, g: 180, b: 180 },
          width: 1,
          style: 'solid',
        },
      },
    },
  ],

  advanced: {
    dynamicRowHeight: true,
    wordWrap: 'normal',
    verticalAlignment: 'middle',
  },
};

/**
 * Minimalistisches Template
 */
export const minimalistTemplate: TableTemplate = {
  name: 'Minimalist',
  description: 'Ein reduziertes, minimalistisches Template',
  version: '1.0.0',
  author: 'PDF-lib Table Library',

  baseStyle: {
    fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
    fontSize: 11,
    fontColor: { r: 80, g: 80, b: 80 },
    backgroundColor: { r: 255, g: 255, b: 255 },
    borderWidth: 0,
    padding: '10 16 10 16',
  },

  headerRow: {
    fontWeight: 'bold',
    fontSize: 12,
  },

  borders: {
    headerBottom: {
      display: true,
      color: { r: 230, g: 230, b: 230 },
      width: 1,
      style: 'solid',
    },
    top: { display: false },
    right: { display: false },
    bottom: { display: false },
    left: { display: false },
  },

  advanced: {
    dynamicRowHeight: true,
    wordWrap: 'normal',
    verticalAlignment: 'middle',
    horizontalAlignment: 'left',
  },
};

/**
 * Array aller vordefinierten Templates
 */
export const predefinedTemplates: TableTemplate[] = [
  modernBusinessTemplate,
  invoiceTemplate,
  minimalistTemplate,
];
