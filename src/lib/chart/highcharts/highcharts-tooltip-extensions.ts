import { DtChartTooltipData } from './highcharts-tooltip-types';

// tslint:disable-next-line: no-any
declare var require: any;
// tslint:disable-next-line: no-require-imports no-var-requires
const highcharts = require('highcharts');

export interface DtHcTooltipEventPayload {
  data: DtChartTooltipData;
}

/** Function that gets the arguments from highcharts and extracts the tooltip data the same way highcharts does it internally */
// tslint:disable-next-line:no-any
export function prepareTooltipData(pointOrPoints: any | any[]): DtChartTooltipData {
  let data: DtChartTooltipData;
  if (Array.isArray(pointOrPoints)) {
    // tslint:disable-next-line:no-any
    const pointConfig: any[] = [];
    // tslint:disable-next-line:no-any
    highcharts.each(pointOrPoints, function(item: any): void {
      pointConfig.push(item.getLabelConfig());
    });
    data = {
        x: pointOrPoints[0].category,
        y: pointOrPoints[0].y,
        points: pointConfig,
    };
  } else {
    const label = pointOrPoints.getLabelConfig();
    data = {
      x: label.x,
      y: label.y,
      point: label,
    };
  }
  return data;
}

/**
 * Wraps the reset function of the pointer class to have events that we can listen to
 */
export function addTooltipEvents(): boolean {
  // tslint:disable-next-line: no-any
  highcharts.wrap(highcharts.Pointer.prototype, 'reset', function(proceed: any): void {

    /**
     * Now apply the original function with the original arguments,
     * which are sliced off this function's arguments
     */
    const args = Array.prototype.slice.call(arguments, 1);
    proceed.apply(this, args);
    highcharts.fireEvent(this.chart, 'tooltipClosed');
  });

  // tslint:disable-next-line:no-any
  highcharts.wrap(highcharts.Tooltip.prototype, 'refresh', function(proceed: any): void {
    const args = Array.prototype.slice.call(arguments, 1);
    proceed.apply(this, args);
    /**
     * Extract data that would be passed to the formatter function due to a
     * weird issue that highcharts reuses the bound context to the formatter function
     */
    const pointOrPoints = args[0];

    const data = prepareTooltipData(pointOrPoints);

    const eventPayload: DtHcTooltipEventPayload = { data };
    highcharts.fireEvent(this.chart, 'tooltipRefreshed', eventPayload);
  });

  // this has to return something otherwise when running a build with the prod flag enabled
  // uglify throws away this code because it does not produce sideeffects
  return true;
}
