import { DesignConfig } from '../config/DesignConfig';

/**
 * Table options
 * @interface TableOptions
 * @property {number} columns - Number of columns
 * @property {number} rows - Number of rows
 * @property {number} [rowHeight] - Height of a row
 * @property {number} [colWidth] - Width of a column
 * @property {DesignConfig} [designConfig] - Abstract design configuration
 */
export interface TableOptions {
  columns: number;
  rows: number;
  rowHeight?: number; // Height of a row (default value will be set)
  colWidth?: number; // Width of a column (default value will be set)
  designConfig?: DesignConfig;
}
