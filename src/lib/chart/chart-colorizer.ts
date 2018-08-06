import { IndividualSeriesOptions } from 'highcharts';
import { CHART_COLOR_PALETTE_ORDERED, DtTheme, CHART_COLOR_PALETTES } from '@dynatrace/angular-components/theming';

const CHART_THEME_COLOR_MAX_LENGTH = 3;

export class ChartColorizer {
  static apply(series: IndividualSeriesOptions[], theme: DtTheme): void {

    const palette = theme && theme.name && CHART_COLOR_PALETTES[theme.name] ?
      CHART_COLOR_PALETTES[theme.name] : CHART_COLOR_PALETTE_ORDERED;
    if (series) {
      series.forEach((s: IndividualSeriesOptions, index: number): void => {
        if (s.color) {
          return;
        }
        // if there are less than 3 colors
        if (series && series.length <= CHART_THEME_COLOR_MAX_LENGTH) {
          s.color = palette[index];
          return;
        }
        // apply color for from ordered list
        s.color = CHART_COLOR_PALETTE_ORDERED[index % CHART_COLOR_PALETTE_ORDERED.length];
      });
    }
  }
}
