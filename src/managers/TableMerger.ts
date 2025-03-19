import { PdfTable } from '../classes/Table';

export type MergeDirection = 'horizontal' | 'vertical';

export interface MergeTableOptions {
  direction?: MergeDirection;
  maintainStyles?: boolean;
}

export class TableMerger {
  /**
   * Fügt mehrere Tabellen zu einer Tabelle zusammen
   * @param tables Array von Tabellen, die zusammengeführt werden sollen
   * @param options Optionen für die Zusammenführung
   * @returns Eine neue zusammengeführte PdfTable-Instanz
   */
  static mergeTables(tables: PdfTable[], options: MergeTableOptions = {}): PdfTable {
    if (tables.length <= 1) {
      throw new Error('At least two tables are required for merging');
    }

    const direction = options.direction || 'vertical';

    if (direction === 'vertical') {
      return this.mergeVertical(tables, options);
    } else {
      return this.mergeHorizontal(tables, options);
    }
  }

  /**
   * Fügt Tabellen horizontal zusammen (nebeneinander)
   */
  private static mergeHorizontal(tables: PdfTable[], options: MergeTableOptions): PdfTable {
    const baseTable = tables[0];
    const totalRows = Math.max(...tables.map((t) => t.getRowCount()));
    const totalCols = tables.reduce((sum, table) => sum + table.getColumnCount(), 0);

    // Erstelle eine neue Tabelle mit kombinierten Dimensionen
    const mergedTable = new PdfTable({
      rows: totalRows,
      columns: totalCols,
    });

    // Design-Konfiguration der ersten Tabelle übernehmen, falls gewünscht
    if (options.maintainStyles) {
      mergedTable.applyDesignConfig(baseTable.getDesignConfig());
    }

    let currentColOffset = 0;

    // Tabellen nebeneinander anordnen
    for (const table of tables) {
      const tableRows = table.getRowCount();
      const tableCols = table.getColumnCount();

      // Kopiere Zellendaten und Stile
      for (let row = 0; row < tableRows; row++) {
        for (let col = 0; col < tableCols; col++) {
          try {
            const cellContent = table.getCell(row, col);
            mergedTable.setCell(row, currentColOffset + col, cellContent);

            if (options.maintainStyles) {
              // Verwenden des expliziten Stils anstelle des kombinierten Stils
              const cellStyle = table.getRawCellStyle(row, col);
              if (cellStyle && Object.keys(cellStyle).length > 0) {
                mergedTable.setCellStyle(row, currentColOffset + col, cellStyle);
              }
            }
          } catch (error) {
            // Ignoriere Zellen, die durch Merging nicht mehr existieren
          }
        }
      }

      // Zellenverbindungen übernehmen
      const mergedCells = table.getMergedCells();
      for (const mergedCell of mergedCells) {
        const { startRow, startCol, endRow, endCol } = mergedCell;
        mergedTable.mergeCells(
          startRow,
          currentColOffset + startCol,
          endRow,
          currentColOffset + endCol,
        );
      }

      currentColOffset += tableCols;
    }

    return mergedTable;
  }

  /**
   * Fügt Tabellen vertikal zusammen (untereinander)
   */
  private static mergeVertical(tables: PdfTable[], options: MergeTableOptions): PdfTable {
    const baseTable = tables[0];
    const totalRows = tables.reduce((sum, table) => sum + table.getRowCount(), 0);
    const totalCols = Math.max(...tables.map((t) => t.getColumnCount()));

    // Erstelle eine neue Tabelle mit kombinierten Dimensionen
    const mergedTable = new PdfTable({
      rows: totalRows,
      columns: totalCols,
    });

    // Design-Konfiguration der ersten Tabelle übernehmen, falls gewünscht
    if (options.maintainStyles) {
      mergedTable.applyDesignConfig(baseTable.getDesignConfig());
    }

    let currentRowOffset = 0;

    // Tabellen untereinander anordnen
    for (const table of tables) {
      const tableRows = table.getRowCount();
      const tableCols = table.getColumnCount();

      // Kopiere Zellendaten und Stile
      for (let row = 0; row < tableRows; row++) {
        for (let col = 0; col < tableCols; col++) {
          try {
            const cellContent = table.getCell(row, col);
            mergedTable.setCell(currentRowOffset + row, col, cellContent);

            if (options.maintainStyles) {
              // Verwenden des expliziten Stils anstelle des kombinierten Stils
              const cellStyle = table.getRawCellStyle(row, col);
              if (cellStyle && Object.keys(cellStyle).length > 0) {
                mergedTable.setCellStyle(currentRowOffset + row, col, cellStyle);
              }
            }
          } catch (error) {
            // Ignoriere Zellen, die durch Merging nicht mehr existieren
          }
        }
      }

      // Zellenverbindungen übernehmen
      const mergedCells = table.getMergedCells();
      for (const mergedCell of mergedCells) {
        const { startRow, startCol, endRow, endCol } = mergedCell;
        mergedTable.mergeCells(
          currentRowOffset + startRow,
          startCol,
          currentRowOffset + endRow,
          endCol,
        );
      }

      currentRowOffset += tableRows;
    }

    return mergedTable;
  }
}
