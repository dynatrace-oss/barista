const DT_MICRO_CHART_HEIGHT = 150;
const DT_MICRO_CHART_MARGIN_TOP = 25;
const DT_MICRO_CHART_MARGIN_RIGHT = 15;
const DT_MICRO_CHART_MARGIN_BOTTOM = 25;
const DT_MICRO_CHART_MARGIN_LEFT = 15;

export class DtMicroChartConfig {
  /** Sets the fixed height of the microchart element. */
  height: number = DT_MICRO_CHART_HEIGHT;

  /** Sets a fixed martion top value for the microchart element plot area. */
  marginTop: number = DT_MICRO_CHART_MARGIN_TOP;

  /** Sets a fixed martion right value for the microchart element plot area. */
  marginRight: number = DT_MICRO_CHART_MARGIN_RIGHT;

  /** Sets a fixed martion bottom value for the microchart element plot area. */
  marginBottom: number = DT_MICRO_CHART_MARGIN_BOTTOM;

  /** Sets a fixed martion left value for the microchart element plot area. */
  marginLeft: number = DT_MICRO_CHART_MARGIN_LEFT;
}
