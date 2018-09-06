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
  YELLOW_500 = '#F5D30F',
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

/** Chart colors for the purple theme up to 3 metrics */
const purple: string[] = [
  Colors.PURPLE_700,
  Colors.PURPLE_200,
  Colors.PURPLE_400,
];

/** Chart colors for the royalblue theme up to 3 metrics */
const royalblue: string[] = [
  Colors.ROYALBLUE_800,
  Colors.ROYALBLUE_200,
  Colors.ROYALBLUE_400,
];

/** Chart colors for the blue theme up to 3 metrics */
const blue: string[] = [
  Colors.ROYALBLUE_700,
  Colors.ROYALBLUE_200,
  Colors.ROYALBLUE_400,
];

export const CHART_COLOR_PALETTE_ORDERED: string[] = [
  Colors.PURPLE_600, /* 1 */
  Colors.YELLOW_200, /* 2 */
  Colors.TURQUOISE_400, /* 3 */
  Colors.PURPLE_200, /* 4 */
  Colors.ORANGE_500, /* 5 */
  Colors.YELLOW_500, /* 6 */
  Colors.ROYALBLUE_600, /* 7 */
  Colors.ORANGE_300, /* 8 */
  Colors.PURPLE_400, /* 9 */
  Colors.ORANGE_200, /* 10 */
  Colors.TURQUOISE_600, /* 11 */
  Colors.ROYALBLUE_300, /* 12 */
  Colors.YELLOW_700, /* 13 */
  Colors.TURQUOISE_200, /* 14 */
  Colors.ROYALBLUE_400, /* 15 */
];

export const CHART_COLOR_PALETTES = {
  purple,
  royalblue,
  blue,
};
