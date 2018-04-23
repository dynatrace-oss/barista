import * as Highcharts from 'highcharts';

console.log(Highcharts.chart);

export const configureLegendSymbols = () => {

  console.log('CONFIGURED');
    // tslint:disable-next-line: no-any
  (Highcharts as any).seriesTypes.area.prototype.drawLegendSymbol = function(legend) {
    console.log('area legend');
    const options = this.options;
    const symbolWidth = legend.symbolWidth;
    const renderer = this.chart.renderer;
    const legendItemGroup = this.legendGroup;
    const baseline = legend.baseline;

    // if lineWidth is set to 0 then draw standard rectangle
    // tslint:disable-next-line: no-any
    let attr = {} as any;
    if (options.useRectangleLegend) {
      attr = {
        'stroke-width' : 1,
        'fill' : options.color, // TODO: add opacity
      };
      if (options.dashStyle) {
        attr.dashstyle = options.dashStyle;
      }
      this.legendLine = renderer.path(
          [ 'M', 0, baseline + 1, 'L', 12, baseline + 1, 'L', 12,
              baseline - 11, 'L', 0, baseline - 11, 'L', 0,
              baseline + 1 ]).attr(attr).add(legendItemGroup);
      } else if (options.lineWidth) {
        attr = {
          'stroke-width' : options.lineWidth,
          'fill' : options.color, // TODO: add opacity
        };
        if (options.dashStyle) {
          attr.dashstyle = options.dashStyle;
        }
        this.legendLine = renderer.path(
            [ "M", 2, baseline + 1, "L", 2, baseline - 2, "L", 7,
                baseline - 6, "L", 10, baseline - 4, "L", 14,
                baseline - 9, "L", 14, baseline + 1 ]).attr(
            attr).add(legendItemGroup);
      }
  };

  // tslint:disable-next-line: no-any
  (Highcharts as any).seriesTypes.column.prototype.drawLegendSymbol = function(legend: any): void {
    console.log('column legend');
    const options = this.options;
    const symbolWidth = legend.symbolWidth;
    const step = symbolWidth / 20;
    const renderer = this.chart.renderer;
    const legendItemGroup = this.legendGroup;
    const baseline = legend.baseline;
    let attr;

    // Draw the bars
    if (options.lineWidth) {
      attr = {
        'stroke-width' : options.lineWidth,
        'stroke' : 'red',
        'stroke-opacity' : 1.0,
      };
      this.legendLine = renderer.path(
          [ "M", step * 2, baseline + 1, "L", step * 2,
              baseline - 5, "L", step * 3, baseline - 5, "L",
              step * 3, baseline + 1, "M", step * 7,
              baseline + 1, "L", step * 7, baseline - 11,
              ]).attr(attr).add(
          legendItemGroup);
      console.log(this.legendLine);
    }
  };
};
