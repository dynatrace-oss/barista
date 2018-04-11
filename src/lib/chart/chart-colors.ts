import { Provider, InjectionToken, Inject } from '@angular/core';

const PURPLE_200 = '#debbf3';
const PURPLE_300 = '#c396e0';
const PURPLE_400 = '#a972cc';
const PURPLE_500 = '#9355b7';
const PURPLE_600 = '#7c38a1';
const PURPLE_700 = '#612c85';

const ROYALBLUE_200 = '#b9c5ff';
const ROYALBLUE_300 = '#97a9ff';
const ROYALBLUE_400 = '#748cff';
const ROYALBLUE_500 = '#526cff';
const ROYALBLUE_600 = '#4556d7';
const ROYALBLUE_700 = '#393db0';

const TURQUOISE_200 = '#aeebf0';
const TURQUOISE_300 = '#74dee6';
const TURQUOISE_400 = '#4fd5e0';
const TURQUOISE_500 = '#00b9cc';
const TURQUOISE_600 = '#00a1b2';
const TURQUOISE_700 = '#00848e';
const TURQUOISE_800 = '#006d75';
const TURQUOISE_900 = '#005559';

export interface ChartColorPalette {
  single: string;
  multi: string[];
}

const purple: ChartColorPalette = {
  single: PURPLE_500,
  multi: [
    PURPLE_700,
    PURPLE_600,
    PURPLE_500,
    PURPLE_400,
    PURPLE_300,
    PURPLE_200,
  ],
};

const royalblue: ChartColorPalette = {
  single: ROYALBLUE_500,
  multi: [
    ROYALBLUE_700,
    ROYALBLUE_600,
    ROYALBLUE_500,
    ROYALBLUE_400,
    ROYALBLUE_300,
    ROYALBLUE_200,
  ],
};

const turquoise: ChartColorPalette = {
  single: TURQUOISE_500,
  multi: [
    TURQUOISE_900,
    TURQUOISE_800,
    TURQUOISE_700,
    TURQUOISE_600,
    TURQUOISE_500,
    TURQUOISE_400,
    TURQUOISE_300,
    TURQUOISE_200,
  ],
};

export const CHART_COLOR_PALETTES = {
  purple,
  royalblue,
  turquoise,
};
