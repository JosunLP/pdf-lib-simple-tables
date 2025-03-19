import { MergedCell } from '../interfaces/MergedCell';

export class MergeCellManager {
  private mergedCells: {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  }[] = [];

  /**
   * Führt Zellen zusammen
   * @param startRow Startzeile
   * @param startCol Startspalte
   * @param endRow Endzeile
   * @param endCol Endspalte
   */
  mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void {
    // Überprüfe, ob die Koordinaten nicht doppelt vorkommen
    if (this.isPartOfMergedCell(startRow, startCol) || this.isPartOfMergedCell(endRow, endCol)) {
      throw new Error('One or more cells are already part of a merged cell');
    }

    this.mergedCells.push({
      startRow,
      startCol,
      endRow,
      endCol,
    });
  }

  /**
   * Prüft, ob eine Zelle Teil einer zusammengeführten Zelle ist
   * @param row Zeile
   * @param col Spalte
   */
  isPartOfMergedCell(row: number, col: number): boolean {
    return this.mergedCells.some(
      (cell) =>
        row >= cell.startRow && row <= cell.endRow && col >= cell.startCol && col <= cell.endCol,
    );
  }

  /**
   * Gibt die zusammengeführten Zellen zurück
   */
  getMergedCells(): {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  }[] {
    return [...this.mergedCells];
  }

  // Angepasste Prüfung: Gibt einen zusammengeführten Bereich zurück,
  // wenn (row, col) innerhalb des Bereichs liegt.
  findMergedCell(row: number, col: number): MergedCell | undefined {
    return this.mergedCells.find(
      (mc) => row >= mc.startRow && row <= mc.endRow && col >= mc.startCol && col <= mc.endCol,
    );
  }
}
