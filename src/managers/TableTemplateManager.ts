import { TableTemplate } from '../templates/TableTemplate';
import { DesignConfig } from '../config/DesignConfig';
import { TableCellStyle } from '../interfaces/TableCellStyle';

/**
 * Manager für Tabellen-Templates
 * Kümmert sich um das Laden, Speichern und Konvertieren von Templates
 */
export class TableTemplateManager {
  private templates: Map<string, TableTemplate> = new Map();

  /**
   * Fügt ein Template hinzu
   * @param template TableTemplate-Objekt
   */
  addTemplate(template: TableTemplate): void {
    if (!template.name) {
      throw new Error('Template muss einen Namen haben');
    }
    this.templates.set(template.name, template);
  }

  /**
   * Lädt ein Template aus einem JSON-String
   * @param jsonString JSON-String mit Template-Definition
   */
  loadTemplateFromJson(jsonString: string): void {
    try {
      const template = JSON.parse(jsonString) as TableTemplate;
      this.addTemplate(template);
    } catch (error) {
      throw new Error(`Fehler beim Laden des Templates: ${error}`);
    }
  }

  /**
   * Gibt ein Template anhand seines Namens zurück
   * @param name Name des Templates
   */
  getTemplate(name: string): TableTemplate | undefined {
    return this.templates.get(name);
  }

  /**
   * Konvertiert ein Template in ein DesignConfig-Objekt
   * @param template TableTemplate oder Template-Name
   */
  /**
   * Konvertiert TableCellStyle zu Partial<DesignConfig>
   * und stellt Typkompatibilität sicher
   */
  private convertCellStyle(
    style: Partial<DesignConfig> | TableCellStyle | undefined,
  ): Partial<DesignConfig> | undefined {
    if (!style) return undefined;

    const result = { ...style };
    // Konvertiere borderRadius von number zu string falls nötig
    if (typeof result.borderRadius === 'number') {
      result.borderRadius = (result.borderRadius as number).toString();
    }

    return result as Partial<DesignConfig>;
  }

  convertTemplateToDesignConfig(template: TableTemplate | string): DesignConfig {
    let templateObj: TableTemplate | undefined;

    if (typeof template === 'string') {
      templateObj = this.getTemplate(template);
      if (!templateObj) {
        throw new Error(`Template mit Namen "${template}" nicht gefunden`);
      }
    } else {
      templateObj = template;
    }

    // Implementierung der Konvertierungslogik von Template zu DesignConfig
    const designConfig: DesignConfig = {
      // Basis-Eigenschaften
      fontFamily: templateObj.baseStyle.fontFamily,
      fontSize: templateObj.baseStyle.fontSize,
      fontColor: templateObj.baseStyle.fontColor,
      backgroundColor: templateObj.baseStyle.backgroundColor,
      borderColor: templateObj.baseStyle.borderColor,
      borderWidth: templateObj.baseStyle.borderWidth,
      padding: templateObj.baseStyle.padding,

      // Spezielle Zeilen-Stile
      headingRowStyle: this.convertCellStyle(templateObj.headerRow),
      firstColumnStyle: this.convertCellStyle(templateObj.firstColumn),
      lastColumnStyle: this.convertCellStyle(templateObj.lastColumn),

      // Zebrierung
      evenRowStyle: this.convertCellStyle(templateObj.evenRows),
      oddRowStyle: this.convertCellStyle(templateObj.oddRows),

      // Rahmen-Stile
      defaultTopBorder: templateObj.borders?.top,
      defaultRightBorder: templateObj.borders?.right,
      defaultBottomBorder: templateObj.borders?.bottom,
      defaultLeftBorder: templateObj.borders?.left,

      // Erweiterte Optionen
      dynamicRowHeight: templateObj.advanced?.dynamicRowHeight,
      wordWrap: templateObj.advanced?.wordWrap,
      verticalAlignment: templateObj.advanced?.verticalAlignment,
      alignment: templateObj.advanced?.horizontalAlignment,
    };

    // Spezielle Zellen-Stile konvertieren
    if (templateObj.specialCells && templateObj.specialCells.length > 0) {
      designConfig.specialCells = templateObj.specialCells.map((cell) => {
        return {
          selector:
            cell.selector === 'coordinates'
              ? 'coordinates'
              : cell.selector === 'row'
              ? 'nth-row'
              : cell.selector === 'column'
              ? 'nth-column'
              : 'first-row',
          index:
            cell.selector === 'row'
              ? cell.row
              : cell.selector === 'column'
              ? cell.column
              : undefined,
          coordinates:
            cell.selector === 'coordinates'
              ? { row: cell.row || 0, col: cell.column || 0 }
              : undefined,
          style: cell.style,
        };
      });
    }

    return designConfig;
  }

  /**
   * Gibt alle verfügbaren Templates zurück
   */
  getAllTemplates(): TableTemplate[] {
    return Array.from(this.templates.values());
  }
}
