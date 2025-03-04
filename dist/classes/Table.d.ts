import { PDFDocument } from 'pdf-lib';
import { CustomFont } from '../models/CustomFont';
import { TableCellStyle } from '../interfaces/TableCellStyle';
import { TableOptions } from '../interfaces/TableOptions';
/**
 * Pdf table
 * @param {TableOptions} options - Table options
 * @example
 * const pdfTable = new PdfTable({ columns: 3, rows: 3 });
 */
export declare class PdfTable {
    private options;
    private data;
    private cellStyles;
    private mergedCells;
    private customFont?;
    private designConfig;
    constructor(options: TableOptions);
    private initData;
    setCell(row: number, col: number, value: string): void;
    setCellStyle(row: number, col: number, style: TableCellStyle): void;
    mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void;
    setCustomFont(font: CustomFont): void;
    getCell(row: number, col: number): string;
    getCellStyle(row: number, col: number): TableCellStyle;
    removeCell(row: number, col: number): void;
    addRow(): void;
    addColumn(): void;
    removeRow(row: number): void;
    removeColumn(col: number): void;
    private isValidBase64;
    private base64ToUint8Array;
    private normalizeColor;
    toPDF(): Promise<PDFDocument>;
    embedInPDF(existingDoc: PDFDocument, startX: number, startY: number): Promise<PDFDocument>;
    embedTableAsImage(existingDoc: PDFDocument, imageBytes: Uint8Array, options: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): Promise<PDFDocument>;
    private getEffectiveCellStyle;
}
