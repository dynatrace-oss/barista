/**
 * Colors Enumeration used in typescript (only charts for now)
 */
export enum Colors {
  WHITE = '#ffffff',
  PURPLE_200 = '#debbf3',
  PURPLE_300 = '#c396e0',
  PURPLE_400 = '#a972cc',
  PURPLE_500 = '#9355b7',
  PURPLE_600 = '#7c38a1',
  PURPLE_700 = '#612c85',
  ROYALBLUE_200 = '#b9c5ff',
  ROYALBLUE_300 = '#97a9ff',
  ROYALBLUE_400 = '#748cff',
  ROYALBLUE_500 = '#526cff',
  ROYALBLUE_600 = '#4556d7',
  ROYALBLUE_700 = '#393db0',

  TURQUOISE_200 = '#aeebf0',
  TURQUOISE_300 = '#74dee6',
  TURQUOISE_400 = '#4fd5e0',
  TURQUOISE_500 = '#00b9cc',
  TURQUOISE_600 = '#00a1b2',
  TURQUOISE_700 = '#00848e',
  TURQUOISE_800 = '#006d75',
  TURQUOISE_900 = '#005559',
}

/**
 * Interface that specifies the structure for the palettes in charts
 */
export interface ChartColorPalette {
  single: string;
  multi: string[];
}

const purple: ChartColorPalette = {
  single: Colors.PURPLE_500,
  multi: [
    Colors.PURPLE_700,
    Colors.PURPLE_600,
    Colors.PURPLE_500,
    Colors.PURPLE_400,
    Colors.PURPLE_300,
    Colors.PURPLE_200,
  ],
};

const royalblue: ChartColorPalette = {
  single: Colors.ROYALBLUE_500,
  multi: [
    Colors.ROYALBLUE_700,
    Colors.ROYALBLUE_600,
    Colors.ROYALBLUE_500,
    Colors.ROYALBLUE_400,
    Colors.ROYALBLUE_300,
    Colors.ROYALBLUE_200,
  ],
};

const turquoise: ChartColorPalette = {
  single: Colors.TURQUOISE_500,
  multi: [
    Colors.TURQUOISE_900,
    Colors.TURQUOISE_800,
    Colors.TURQUOISE_700,
    Colors.TURQUOISE_600,
    Colors.TURQUOISE_500,
    Colors.TURQUOISE_400,
    Colors.TURQUOISE_300,
    Colors.TURQUOISE_200,
  ],
};

export const CHART_COLOR_PALETTES = {
  purple,
  royalblue,
  turquoise,
};
