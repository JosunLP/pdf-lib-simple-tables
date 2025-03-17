import { TableTemplateManager } from '../src/managers/TableTemplateManager';
import { TableTemplate } from '../src/templates/TableTemplate';
import { DesignConfig } from '../src/config/DesignConfig';

describe('TableTemplateManager', () => {
  let templateManager: TableTemplateManager;

  beforeEach(() => {
    templateManager = new TableTemplateManager();
  });

  test('should add a template', () => {
    const template: TableTemplate = {
      name: 'TestTemplate',
      baseStyle: {
        fontFamily: 'Arial',
        fontSize: 12,
      },
    };

    templateManager.addTemplate(template);
    expect(templateManager.getTemplate('TestTemplate')).toBe(template);
  });

  test('should throw error when adding a template without a name', () => {
    const template: TableTemplate = {
      name: '',
      baseStyle: {
        fontFamily: 'Arial',
        fontSize: 12,
      },
    };

    expect(() => templateManager.addTemplate(template)).toThrowError(
      'Template muss einen Namen haben',
    );
  });

  test('should load a template from JSON string', () => {
    const jsonString = JSON.stringify({
      name: 'JsonTemplate',
      baseStyle: {
        fontFamily: 'Arial',
        fontSize: 12,
      },
    });

    templateManager.loadTemplateFromJson(jsonString);
    expect(templateManager.getTemplate('JsonTemplate')).toBeDefined();
  });

  test('should throw error when loading invalid JSON string', () => {
    const invalidJsonString = '{ name: "InvalidJsonTemplate"';

    expect(() => templateManager.loadTemplateFromJson(invalidJsonString)).toThrow(
      /Fehler beim Laden des Templates: SyntaxError:/,
    );
  });

  test('should convert template to DesignConfig', () => {
    const template: TableTemplate = {
      name: 'ConvertTemplate',
      baseStyle: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontColor: { r: 0, g: 0, b: 0 },
        backgroundColor: { r: 255, g: 255, b: 255 },
        borderColor: { r: 200, g: 200, b: 200 },
        borderWidth: 1,
        padding: '5px',
      },
    };

    templateManager.addTemplate(template);
    const designConfig: DesignConfig =
      templateManager.convertTemplateToDesignConfig('ConvertTemplate');

    expect(designConfig.fontFamily).toBe('Arial');
    expect(designConfig.fontSize).toBe(12);
    expect(designConfig.fontColor).toEqual({ r: 0, g: 0, b: 0 });
    expect(designConfig.backgroundColor).toEqual({ r: 255, g: 255, b: 255 });
    expect(designConfig.borderColor).toEqual({ r: 200, g: 200, b: 200 });
    expect(designConfig.borderWidth).toBe(1);
    expect(designConfig.padding).toBe('5px');
  });

  test('should get all templates', () => {
    const template1: TableTemplate = {
      name: 'Template1',
      baseStyle: {
        fontFamily: 'Arial',
        fontSize: 12,
      },
    };

    const template2: TableTemplate = {
      name: 'Template2',
      baseStyle: {
        fontFamily: 'Helvetica',
        fontSize: 10,
      },
    };

    templateManager.addTemplate(template1);
    templateManager.addTemplate(template2);

    const allTemplates = templateManager.getAllTemplates();
    expect(allTemplates.length).toBe(2);
    expect(allTemplates).toContain(template1);
    expect(allTemplates).toContain(template2);
  });
});
