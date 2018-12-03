import { Colors, DtTheme } from '@dynatrace/angular-components/theming';

export interface DtMicroChartColorPalette {
  primary: string;
  darker: string;
  lighter: string;
}

const purple: DtMicroChartColorPalette = {
  primary: Colors.PURPLE_400,
  darker:  Colors.PURPLE_700,
  lighter: Colors.PURPLE_200,
};

const blue: DtMicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  darker:  Colors.ROYALBLUE_700,
  lighter: Colors.ROYALBLUE_200,
};

const royalblue: DtMicroChartColorPalette = {
  primary: Colors.ROYALBLUE_400,
  darker:  Colors.ROYALBLUE_800,
  lighter: Colors.ROYALBLUE_200,
};

const MICROCHART_PALETTES = {
  default: purple,
  purple,
  blue,
  royalblue,
};

export function getDtMicrochartColorPalette(theme?: DtTheme): DtMicroChartColorPalette {
  return MICROCHART_PALETTES[theme && theme.name || 'default'] || MICROCHART_PALETTES.default;
}
