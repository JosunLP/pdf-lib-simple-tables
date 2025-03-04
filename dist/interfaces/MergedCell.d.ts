/**
 * Merged cell
 * @interface MergedCell
 * @property {number} startRow - Start row
 * @property {number} startCol - Start column
 * @property {number} endRow - End row
 * @property {number} endCol - End column
 */
export interface MergedCell {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}
