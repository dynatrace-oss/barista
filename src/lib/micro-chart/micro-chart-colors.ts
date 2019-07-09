import { DtColors, DtTheme } from '@dynatrace/angular-components/theming';

export interface DtMicroChartColorPalette {
  primary: string;
  darker: string;
}

const purple: DtMicroChartColorPalette = {
  primary: DtColors.PURPLE_400,
  darker: DtColors.PURPLE_600,
};

const blue: DtMicroChartColorPalette = {
  primary: DtColors.BLUE_400,
  darker: DtColors.BLUE_600,
};

const royalblue: DtMicroChartColorPalette = {
  primary: DtColors.ROYALBLUE_400,
  darker: DtColors.ROYALBLUE_600,
};

const turquoise: DtMicroChartColorPalette = {
  primary: DtColors.TURQUOISE_400,
  darker: DtColors.TURQUOISE_600,
};

const MICROCHART_PALETTES = {
  default: purple,
  purple,
  blue,
  royalblue,
  turquoise,
};

export function getDtMicrochartColorPalette(
  theme?: DtTheme
): DtMicroChartColorPalette {
  return (
    MICROCHART_PALETTES[(theme && theme.name) || 'default'] ||
    MICROCHART_PALETTES.default
  );
}
