export interface DesignConfig {
  fontFamily?: string;
  fontSize?: number;
  fontColor?: { r: number; g: number; b: number };
  backgroundColor?: { r: number; g: number; b: number };
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;
}

export const defaultDesignConfig: DesignConfig = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: 12,
  fontColor: { r: 0, g: 0, b: 0 },
  backgroundColor: { r: 255, g: 255, b: 255 },
  borderColor: { r: 200, g: 200, b: 200 },
  borderWidth: 1,
};
