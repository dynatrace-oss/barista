import { Colors, DtTheme } from '@dynatrace/angular-components/theming';
import { DtChartOptions } from '@dynatrace/angular-components/chart';
import { merge, isPlainObject, isArray } from 'lodash';
import { DataPoint } from 'highcharts';

interface MicroChartColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
}

const purple: MicroChartColorPalette = {
  primary: Colors.PURPLE_400,
  secondary: Colors.PURPLE_700,
  tertiary: Colors.PURPLE_200,
};

const blue: MicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  secondary: Colors.ROYALBLUE_700,
  tertiary: Colors.ROYALBLUE_200,
};

const royalblue: MicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  secondary: Colors.ROYALBLUE_800,
  tertiary: Colors.ROYALBLUE_200,
};

const MICROCHART_PALETTES = {
  purple,
  blue,
  royalblue,
};

export const enum DtMicroChartColorPlaceholder {
  PRIMARY = '!color:primary',
  SECONDARY = '!color:secondary',
  TERTIARY = '!color:tertiary',
}

function getPalette(theme: DtTheme | undefined): MicroChartColorPalette {
  return theme && theme.name && MICROCHART_PALETTES[theme.name] ? MICROCHART_PALETTES[theme.name] : purple;
}

function applyColors(options: object, palette: MicroChartColorPalette): void {
  let value;
  Object.keys(options).forEach((key) => {
    value = options[key];

    if (value === DtMicroChartColorPlaceholder.PRIMARY) {
      options[key] = palette.primary;
    } else if (value === DtMicroChartColorPlaceholder.SECONDARY) {
      options[key] = palette.secondary;
    } else if (value === DtMicroChartColorPlaceholder.TERTIARY) {
      options[key] = palette.tertiary;
    } else if (isPlainObject(value) || isArray(value)) {
      applyColors(value, palette);
    }
  });
}

export function colorizeOptions(options: Readonly<DtChartOptions>, theme: DtTheme | undefined): DtChartOptions {
  const palette = getPalette(theme);
  const result = merge({}, options) as DtChartOptions;

  applyColors(result, palette);

  return result;
}

export function colorizeDataPoint(point: DataPoint, theme: DtTheme | undefined): void {
  const palette = getPalette(theme);

  applyColors(point, palette);
}
