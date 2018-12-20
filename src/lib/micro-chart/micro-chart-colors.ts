import { Colors, DtTheme } from '@dynatrace/angular-components/theming';

export interface DtMicroChartColorPalette {
  primary: string;
  darker: string;
}

const purple: DtMicroChartColorPalette = {
  primary: Colors.PURPLE_400,
  darker:  Colors.PURPLE_600,
};

const blue: DtMicroChartColorPalette = {
  primary: Colors.BLUE_400,
  darker:  Colors.BLUE_600,
};

const royalblue: DtMicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  darker:  Colors.ROYALBLUE_600,
};

const turquoise: DtMicroChartColorPalette = {
  primary: Colors.TURQUOISE_400,
  darker:  Colors.TURQUOISE_600,
};

const MICROCHART_PALETTES = {
  default: purple,
  purple,
  blue,
  royalblue,
  turquoise,
};

export function getDtMicrochartColorPalette(theme?: DtTheme): DtMicroChartColorPalette {
  return MICROCHART_PALETTES[theme && theme.name || 'default'] || MICROCHART_PALETTES.default;
}
