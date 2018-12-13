import { DtColors } from '@dynatrace/angular-components/theming';

export const DT_CHART_COLOR_PALETTE_ORDERED: string[] = [
  DtColors.PURPLE_600, /* 1 */
  DtColors.YELLOW_200, /* 2 */
  DtColors.TURQUOISE_400, /* 3 */
  DtColors.PURPLE_200, /* 4 */
  DtColors.ORANGE_500, /* 5 */
  DtColors.YELLOW_500, /* 6 */
  DtColors.ROYALBLUE_600, /* 7 */
  DtColors.ORANGE_300, /* 8 */
  DtColors.PURPLE_400, /* 9 */
  DtColors.ORANGE_200, /* 10 */
  DtColors.TURQUOISE_600, /* 11 */
  DtColors.ROYALBLUE_300, /* 12 */
  DtColors.YELLOW_700, /* 13 */
  DtColors.TURQUOISE_200, /* 14 */
  DtColors.ROYALBLUE_400, /* 15 */
];

// @deprecated Use `DT_CHART_COLOR_PALETTE_ORDERED` instead.
// @breaking-change To be changed to `DT_CHART_COLOR_PALETTE_ORDERED`
export const CHART_COLOR_PALETTE_ORDERED = DT_CHART_COLOR_PALETTE_ORDERED;

/** Chart colors for the purple theme up to 3 metrics */
const DT_COLOR_PALETTE_PURPLE: string[] = [
  DtColors.PURPLE_700,
  DtColors.PURPLE_200,
  DtColors.PURPLE_400,
];

/** Chart colors for the royalblue theme up to 3 metrics */
const DT_COLOR_PALETTE_ROYALBLUE: string[] = [
  DtColors.ROYALBLUE_800,
  DtColors.ROYALBLUE_200,
  DtColors.ROYALBLUE_400,
];

/** Chart colors for the blue theme up to 3 metrics */
const DT_COLOR_PALETTE_BLUE: string[] = [
  DtColors.BLUE_700,
  DtColors.BLUE_200,
  DtColors.BLUE_400,
];

export const DT_CHART_COLOR_PALETTES = {
  purple: DT_COLOR_PALETTE_PURPLE,
  royalblue: DT_COLOR_PALETTE_ROYALBLUE,
  blue: DT_COLOR_PALETTE_BLUE,
};

// @deprecated Use `DT_CHART_COLOR_PALETTES` instead.
// @breaking-change To be changed to `DT_CHART_COLOR_PALETTES`
export const CHART_COLOR_PALETTES = DT_CHART_COLOR_PALETTES;
