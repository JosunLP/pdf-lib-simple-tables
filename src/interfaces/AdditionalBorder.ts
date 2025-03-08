import { BorderStyle } from './TableCellStyle';

export interface AdditionalBorder {
  // yOffset in Punkten vom oberen Rand der Zelle (0 = oben, cellHeight = unten)
  yOffset: number;
  style: BorderStyle;
}
