import { Colors, DtTheme } from '@dynatrace/angular-components/theming';
import { DtChartOptions } from '../chart';
import { merge } from 'lodash';

export interface MicroChartColorPalette {
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

export const MICROCHART_PALETTES = {
  purple,
  blue,
  royalblue,
};

export class MicroChartColorizer {
  static getPalette(theme: DtTheme | undefined): MicroChartColorPalette {
    return theme && theme.name && MICROCHART_PALETTES[theme.name] ? MICROCHART_PALETTES[theme.name] : purple;
  }

  static apply(options: DtChartOptions, theme: DtTheme | undefined): void {
    const palette = MicroChartColorizer.getPalette(theme);

    const colorOptions = {
      colors: [palette.primary],
      plotOptions: {
        column: {
          states: {
            hover: {
              color: palette.secondary,
            },
            select: {
              color: palette.primary,
            },
          },
        },
        series: {
          marker: {
            states: {
              hover: {
                fillColor: palette.secondary,
              },
              select: {
                lineColor: palette.secondary,
                fillColor: palette.primary,
              },
            },
          },
        },
      },
    };

    merge(options, colorOptions);
  }
}
