import { Colors, DtTheme } from '@dynatrace/angular-components/theming';
import { DtChartOptions } from '@dynatrace/angular-components';
import { merge } from 'lodash';

interface MicroChartColorPalette {
  primary: string;
  secondary: string;
}

const purple: MicroChartColorPalette = {
  primary: Colors.PURPLE_400,
  secondary: Colors.PURPLE_700,
};

const blue: MicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  secondary: Colors.ROYALBLUE_700,
};

const royalblue: MicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  secondary: Colors.ROYALBLUE_800,
};

export const MICROCHART_PALETTES = {
  purple,
  blue,
  royalblue,
};

export class MicroChartColorizer {
  static apply(options: DtChartOptions, theme: DtTheme): void {
    const palette = theme && theme.name && MICROCHART_PALETTES[theme.name] ? MICROCHART_PALETTES[theme.name] : purple;

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
