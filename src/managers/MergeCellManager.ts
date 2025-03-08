import { MergedCell } from '../interfaces/MergedCell';

export class MergeCellManager {
  private mergedCells: MergedCell[] = [];

  getMergedCells(): MergedCell[] {
    return this.mergedCells;
  }

  mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void {
    if (startRow > endRow || startCol > endCol) {
      throw new Error('Invalid cell coordinates for mergeCells');
    }
    this.mergedCells.push({ startRow, startCol, endRow, endCol });
  }

  findMergedCell(row: number, col: number): MergedCell | undefined {
    return this.mergedCells.find((mc) => mc.startRow === row && mc.startCol === col);
  }
}
