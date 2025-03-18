import { TableTemplate } from '../templates/TableTemplate';
import { DesignConfig } from '../config/DesignConfig';
import { TableCellStyle } from '../interfaces/TableCellStyle';
import { predefinedTemplates } from '../templates/predefinedTemplates';

/**
 * Manager für Tabellen-Templates
 * Kümmert sich um das Laden, Speichern und Konvertieren von Templates
 */
export class TableTemplateManager {
  private templates: Map<string, TableTemplate>;

  constructor() {
    this.templates = new Map<string, TableTemplate>();

    // Lade vordefinierte Templates
    predefinedTemplates.forEach((template) => {
      this.addTemplate(template);
    });
  }

  /**
   * Fügt ein neues Template hinzu
   * @param template Das hinzuzufügende Template
   * @throws Error wenn das Template keinen Namen hat
   */
  addTemplate(template: TableTemplate): void {
    if (!template.name) {
      throw new Error('Template muss einen Namen haben');
    }
    this.templates.set(template.name, template);
  }

  /**
   * Entfernt ein Template anhand seines Namens
   * @param name Name des zu entfernenden Templates
   */
  removeTemplate(name: string): void {
    this.templates.delete(name);
  }

  /**
   * Lädt ein Template aus einem JSON-String
   * @param jsonString JSON-String mit Template-Definition
   * @throws Error wenn das JSON ungültig ist oder erforderliche Eigenschaften fehlen
   */
  loadTemplateFromJson(jsonString: string): void {
    try {
      const parsed = JSON.parse(jsonString);

      // Überprüfe, ob es sich um ein gültiges Template handelt
      if (!parsed.name || !parsed.baseStyle) {
        throw new Error('Ungültiges Template-Format: name und baseStyle sind erforderlich');
      }

      const template = parsed as TableTemplate;
      this.addTemplate(template);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Fehler beim Laden des Templates: SyntaxError: ${error.message}`);
      }
      throw new Error(`Fehler beim Laden des Templates: ${error}`);
    }
  }

  /**
   * Gibt ein Template anhand seines Namens zurück
   * @param name Name des Templates
   * @param fallbackToDefault Wenn true, wird ein Standard-Template zurückgegeben, falls kein Template gefunden wurde
   * @returns Das gefundene Template oder undefined
   */
  getTemplate(name: string, fallbackToDefault = false): TableTemplate | undefined {
    const template = this.templates.get(name);
    if (!template && fallbackToDefault) {
      return this.templates.get('Default');
    }
    return template;
  }

  /**
   * Exportiert ein Template als JSON-String
   * @param name Name des zu exportierenden Templates
   * @returns JSON-String oder undefined, wenn das Template nicht gefunden wurde
   */
  exportTemplateAsJson(name: string): string | undefined {
    const template = this.getTemplate(name);
    if (!template) return undefined;
    return JSON.stringify(template, null, 2);
  }

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

  /**
   * Konvertiert ein Template in ein DesignConfig-Objekt
   * @param template TableTemplate oder Template-Name
   */
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

      // Weitere Basis-Eigenschaften aus baseStyle übernehmen
      fontWeight: templateObj.baseStyle.fontWeight,
      fontStyle: templateObj.baseStyle.fontStyle,
      alignment: templateObj.advanced?.horizontalAlignment || templateObj.baseStyle.alignment,
      borderRadius:
        typeof templateObj.baseStyle.borderRadius === 'number'
          ? templateObj.baseStyle.borderRadius.toString()
          : templateObj.baseStyle.borderRadius,
      textDecoration: templateObj.baseStyle.textDecoration,
      textTransform: templateObj.baseStyle.textTransform,
      verticalAlignment:
        templateObj.advanced?.verticalAlignment || templateObj.baseStyle.verticalAlignment,

      // Additionale Borders unterstützen
      additionalBorders: templateObj.baseStyle.additionalBorders,

      // Spezielle Zeilen-Stile
      headingRowStyle: this.convertCellStyle(templateObj.headerRow),
      firstColumnStyle: this.convertCellStyle(templateObj.firstColumn),
      lastColumnStyle: this.convertCellStyle(templateObj.lastColumn),
      firstRowStyle: this.convertCellStyle(templateObj.firstRow),
      lastRowStyle: this.convertCellStyle(templateObj.lastRow),

      // Zebrierung
      evenRowStyle: this.convertCellStyle(templateObj.evenRows),
      oddRowStyle: this.convertCellStyle(templateObj.oddRows),

      // Rahmen-Stile
      defaultTopBorder: templateObj.borders?.top || templateObj.borders?.headerTop,
      defaultRightBorder: templateObj.borders?.right,
      defaultBottomBorder: templateObj.borders?.bottom || templateObj.borders?.headerBottom,
      defaultLeftBorder: templateObj.borders?.left,

      // Sektionen
      theadStyle: templateObj.sections?.thead
        ? {
            backgroundColor: templateObj.sections.thead.backgroundColor,
            borderTop: templateObj.sections.thead.borderTop,
            borderBottom: templateObj.sections.thead.borderBottom,
            defaultCellStyle: templateObj.sections.thead.defaultCellStyle,
          }
        : undefined,

      tbodyStyle: templateObj.sections?.tbody
        ? {
            backgroundColor: templateObj.sections.tbody.backgroundColor,
            borderTop: templateObj.sections.tbody.borderTop,
            borderBottom: templateObj.sections.tbody.borderBottom,
            defaultCellStyle: templateObj.sections.tbody.defaultCellStyle,
          }
        : undefined,

      tfootStyle:
        templateObj.sections?.tfoot || templateObj.footerRow
          ? {
              backgroundColor: templateObj.sections?.tfoot?.backgroundColor,
              borderTop: templateObj.sections?.tfoot?.borderTop,
              borderBottom: templateObj.sections?.tfoot?.borderBottom,
              defaultCellStyle:
                templateObj.footerRow || templateObj.sections?.tfoot?.defaultCellStyle,
            }
          : undefined,

      // Erweiterte Optionen
      dynamicRowHeight: templateObj.advanced?.dynamicRowHeight,
      wordWrap: templateObj.advanced?.wordWrap,

      // Erweiterte Formatierungsoptionen
      textOverflow: templateObj.advanced?.textOverflow || templateObj.baseStyle.textOverflow,
      whiteSpace: templateObj.advanced?.whiteSpace || templateObj.baseStyle.whiteSpace,
      boxShadow: templateObj.advanced?.boxShadow,
      opacity: templateObj.advanced?.opacity,

      // Visuelle Effekte
      backgroundGradient: templateObj.baseStyle.backgroundGradient,
      hoverRowHighlight: templateObj.advanced?.hoverRowHighlight,
      borderCollapse: templateObj.advanced?.borderCollapse || 'collapse',

      // Spezielle Layout-Eigenschaften
      columnSpan: templateObj.advanced?.columnSpan,
      rowSpan: templateObj.advanced?.rowSpan,
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
              : cell.selector === 'pattern'
              ? cell.pattern === 'total'
                ? 'last-row'
                : 'first-row'
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
   * @param includeBuiltIn Wenn true, werden auch vordefinierte Templates zurückgegeben
   */
  getAllTemplates(includeBuiltIn = false): TableTemplate[] {
    // Wenn includeBuiltIn false ist, filtere die vordefinierten Templates heraus
    if (!includeBuiltIn) {
      const predefinedNames = predefinedTemplates.map((t) => t.name);
      return Array.from(this.templates.values()).filter((t) => !predefinedNames.includes(t.name));
    }
    return Array.from(this.templates.values());
  }
}
