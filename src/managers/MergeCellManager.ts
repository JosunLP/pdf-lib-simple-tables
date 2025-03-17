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

  // Angepasste Prüfung: Gibt einen zusammengeführten Bereich zurück,
  // wenn (row, col) innerhalb des Bereichs liegt.
  findMergedCell(row: number, col: number): MergedCell | undefined {
    return this.mergedCells.find(
      (mc) => row >= mc.startRow && row <= mc.endRow && col >= mc.startCol && col <= mc.endCol,
    );
  }
}
