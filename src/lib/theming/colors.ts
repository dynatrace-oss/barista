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

  YELLOW_200 = '#FFF29A',
  YELLOW_300 = '#FFEE7C',
  YELLOW_600 = '#E6BE00',
  YELLOW_700 = '#C9A999',
  YELLOW_800 = '#AB8300',
  YELLOW_900 = '#8E6500',

  ORANGE_200 = '#FFD0AB',
  ORANGE_300 = '#FFA86C',
  ORANGE_400 = '#FD8232',
  ORANGE_500 = '#EF651F',
  ORANGE_600 = '#C95218',
  ORANGE_700 = '#B64915',
  ORANGE_800 = '#8D380F',

  GRAY_100 = '#f8f8f8',
  GRAY_130 = '#f2f2f2',
  GRAY_200 = '#e6e6e6',
  GRAY_300 = '#ccc',
  GRAY_400 = '#b7b7b7',
  GRAY_500 = '#898989',
  GRAY_600 = '#6d6d6d',
  GRAY_640 = '#525252',
  GRAY_700 = '#454646',
  GRAY_800 = '#353535',
  GRAY_860 = '#242424',
  GRAY_900 = '#191919',
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

const yellow: ChartColorPalette = {
  single: Colors.YELLOW_600,
  multi: [
    Colors.YELLOW_900,
    Colors.YELLOW_800,
    Colors.YELLOW_700,
    Colors.YELLOW_600,
    Colors.YELLOW_300,
    Colors.YELLOW_200,
  ],
};

const orange: ChartColorPalette = {
  single: Colors.ORANGE_500,
  multi: [
    Colors.ORANGE_800,
    Colors.ORANGE_700,
    Colors.ORANGE_600,
    Colors.ORANGE_500,
    Colors.ORANGE_400,
    Colors.ORANGE_300,
    Colors.ORANGE_200,
  ],
};

export const CHART_COLOR_PALETTES = {
  purple,
  royalblue,
  turquoise,
  yellow,
  orange,
};
