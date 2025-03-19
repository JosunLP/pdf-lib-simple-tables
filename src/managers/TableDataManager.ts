import { TableCellStyle } from '../interfaces/TableCellStyle';
import { TableOptions } from '../interfaces/TableOptions';

export class TableDataManager {
  private data!: string[][];
  private cellStyles!: TableCellStyle[][];
  private options: TableOptions;

  constructor(options: TableOptions) {
    this.options = options;
    this.initData();
  }

  private initData(): void {
    this.data = Array.from({ length: this.options.rows }, () =>
      Array(this.options.columns).fill(''),
    );
    this.cellStyles = Array.from({ length: this.options.rows }, () =>
      Array.from({ length: this.options.columns }, () => ({})),
    );
  }

  getData(): string[][] {
    return this.data;
  }

  getCellStyles(): TableCellStyle[][] {
    return this.cellStyles;
  }

  validateCellIndices(row: number, col: number): void {
    if (row < 0 || row >= this.options.rows || col < 0 || col >= this.options.columns) {
      throw new Error(`Invalid cell coordinates: row=${row}, col=${col}`);
    }
  }

  setCell(row: number, col: number, value: string): void {
    this.validateCellIndices(row, col);
    this.data[row][col] = value;
  }

  setCellStyle(row: number, col: number, style: TableCellStyle): void {
    this.validateCellIndices(row, col);
    this.cellStyles[row][col] = style;
  }

  getCell(row: number, col: number): string {
    this.validateCellIndices(row, col);
    return this.data[row][col];
  }

  getCellStyle(row: number, col: number): TableCellStyle {
    this.validateCellIndices(row, col);
    return this.cellStyles[row][col];
  }

  removeCell(row: number, col: number): void {
    this.validateCellIndices(row, col);
    this.data[row][col] = '';
    this.cellStyles[row][col] = {};
  }

  addRow(): void {
    this.options.rows += 1;
    this.data.push(Array(this.options.columns).fill(''));
    this.cellStyles.push(Array(this.options.columns).fill({}));
  }

  addColumn(): void {
    this.options.columns += 1;
    this.data.forEach((row) => row.push(''));
    this.cellStyles.forEach((row) => row.push({}));
  }

  removeRow(row: number): void {
    if (row < this.options.rows) {
      this.data.splice(row, 1);
      this.cellStyles.splice(row, 1);
      this.options.rows -= 1;
    } else {
      throw new Error('Invalid row coordinate');
    }
  }

  removeColumn(col: number): void {
    if (col < this.options.columns) {
      this.data.forEach((row) => row.splice(col, 1));
      this.cellStyles.forEach((row) => row.splice(col, 1));
      this.options.columns -= 1;
    } else {
      throw new Error('Invalid column coordinate');
    }
  }

  /**
   * Returns the current table options
   * @returns {TableOptions} The current table options
   */
  getOptions(): TableOptions {
    return { ...this.options }; // Return a copy to prevent modification
  }

  /**
   * Gibt die Anzahl der Zeilen zurück
   * @returns Anzahl der Zeilen
   */
  getRowCount(): number {
    return this.options.rows;
  }

  /**
   * Gibt die Anzahl der Spalten zurück
   * @returns Anzahl der Spalten
   */
  getColumnCount(): number {
    return this.options.columns;
  }
}
