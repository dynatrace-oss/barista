import { CHART_COLOR_PALETTE_ORDERED, DtTheme, CHART_COLOR_PALETTES } from '@dynatrace/angular-components/theming';
import { Options } from 'highcharts';

const CHART_THEME_COLOR_MAX_LENGTH = 3;

export class ChartColorizer {
  static apply(options: Options, nrOfSeries: number, theme: DtTheme): void {

    const palette = theme && theme.name && CHART_COLOR_PALETTES[theme.name] ?
      CHART_COLOR_PALETTES[theme.name] : CHART_COLOR_PALETTE_ORDERED;

    options.colors = nrOfSeries <= CHART_THEME_COLOR_MAX_LENGTH ? palette
    : CHART_COLOR_PALETTE_ORDERED;
  }
}
