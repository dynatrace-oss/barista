import { Colors, DtTheme } from '@dynatrace/angular-components/theming';
import { DtChartOptions } from '@dynatrace/angular-components/chart';
import { merge } from 'lodash';

export interface DtMicroChartColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
}

const purple: DtMicroChartColorPalette = {
  primary: Colors.PURPLE_400,
  secondary: Colors.PURPLE_700,
  tertiary: Colors.PURPLE_200,
};

const blue: DtMicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  secondary: Colors.ROYALBLUE_700,
  tertiary: Colors.ROYALBLUE_200,
};

const royalblue: DtMicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  secondary: Colors.ROYALBLUE_800,
  tertiary: Colors.ROYALBLUE_200,
};

export const DT_MICROCHART_PALETTES = {
  purple,
  blue,
  royalblue,
};

export function getPalette(theme: DtTheme | undefined): DtMicroChartColorPalette {
  return theme && theme.name && DT_MICROCHART_PALETTES[theme.name] ? DT_MICROCHART_PALETTES[theme.name] : purple;
}

export function colorizeOptions(options: DtChartOptions, theme: DtTheme | undefined): void {
  const palette = getPalette(theme);

  options.colors = [palette.primary];

  const colorOptions = {
    column: {
      states: {
        hover: {
          color: palette.tertiary,
        },
        select: {
          color: palette.secondary,
        },
      },
    },
    series: {
      marker: {
        states: {
          hover: {
            fillColor: palette.tertiary,
          },
          select: {
            fillColor: palette.secondary,
          },
        },
      },
    },
  };

  merge(options.plotOptions, colorOptions);
}
