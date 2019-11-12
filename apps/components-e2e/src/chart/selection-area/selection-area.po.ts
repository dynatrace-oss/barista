import { Selector, t } from 'testcafe';

export interface Point {
  x: number;
  y: number;
}
export const selectionArea = Selector('.dt-chart-selection-area');
export const range = Selector('.dt-chart-range');
export const timestamp = Selector('.dt-chart-timestamp');
export const selection = Selector('div').withAttribute('aria-role', 'slider');
export const rightHandle = Selector('.dt-chart-right-handle');
export const leftHandle = Selector('.dt-chart-left-handle');
export const plotBackground = Selector('.highcharts-plot-background');

/** Different chart layers where a click should trigger a selection */
export const chartClickTargets = [
  plotBackground,
  Selector(
    '[class^="highcharts-series highcharts-series-2 highcharts-a"]',
  ).find('.highcharts-area'),
  Selector(
    '[class^="highcharts-series highcharts-series-0 highcharts-a"]',
  ).find('.highcharts-tracker-line'),
];

/** The range slider */
export const rangeSelection = range
  .child('div')
  .withAttribute('aria-role', 'slider');

/** The time-frame slider  */
export const timestampSelection = timestamp
  .child('div')
  .withAttribute('aria-role', 'slider');

export const overlay = Selector('.dt-chart-selection-area-overlay');
export const overlayApply = overlay.child('button').withText('Apply');
export const overlayText = overlay.child('.dt-selection-area-overlay-text');

/** Creates a selection from the starting point with the provided width */
export async function createRange(
  width: number,
  start: Point,
  testController?: TestController,
): Promise<void> {
  const controller = testController || t;
  return controller.drag(plotBackground, width, 0, {
    offsetX: start.x,
    offsetY: start.y,
  });
}

export async function createTimestamp(
  point: Point,
  selector?: Selector,
  testController?: TestController,
): Promise<void> {
  const controller = testController || t;
  return controller.click(selector || plotBackground, {
    offsetX: point.x,
    offsetY: point.y,
  });
}

/** Execute a drag on a range handle to increase or decrease the selection */
export async function dragHandle(
  handle: Selector,
  offsetX: number,
  testController?: TestController,
): Promise<void> {
  const controller = testController || t;

  return controller.drag(handle, offsetX, 0);
}

export async function closeOverlay(
  testController?: TestController,
): Promise<void> {
  const controller = testController || t;
  const closeButton = await overlay
    .child('button')
    .withAttribute('aria-label', /close/gim);

  return controller.click(closeButton);
}

/** checks if the current range is valid */
export async function isRangeValid(): Promise<boolean> {
  return !range.hasClass('dt-chart-range-invalid');
}

export const getRangeWidth = () =>
  rangeSelection.getBoundingClientRectProperty('width');
