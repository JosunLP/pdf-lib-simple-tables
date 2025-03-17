import { DesignConfig } from '../config/DesignConfig';

/**
 * Table options
 * @interface TableOptions
 * @property {number} columns - Number of columns
 * @property {number} rows - Number of rows
 * @property {number} [rowHeight] - Height of a row
 * @property {number} [colWidth] - Width of a column
 * @property {DesignConfig} [designConfig] - Abstract design configuration
 * @property {number} [tableWidth] - Total width of the table
 * @property {number} [tableHeight] - Total height of the table
 * @property {number} [repeatHeaderRows] - Number of header rows to repeat on each page
 * @property {number} [pageBreakThreshold] - Distance to the page end at which a page break should occur
 */
export interface TableOptions {
  columns: number;
  rows: number;
  rowHeight?: number; // Height of a row (default value will be set)
  colWidth?: number; // Width of a column (default value will be set)
  designConfig?: DesignConfig;
  tableWidth?: number;
  tableHeight?: number;
  repeatHeaderRows?: number; // Number of header rows to repeat on each page
  pageBreakThreshold?: number; // Distance to the page end at which a page break should occur
}
