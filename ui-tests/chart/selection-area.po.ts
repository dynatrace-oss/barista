import { ElementFinder, WebElement, browser, by, element } from 'protractor';

export interface Point {
  x: number;
  y: number;
}

/** Page of the e2e test app where the selection area can be found */
export const E2E_PAGE_URL = '/chart/selection-area';

export const selectionSelector = by.css('div[aria-role="slider"]');

export const getChart = () => element(by.css('.dt-chart'));
export const getSelectionArea = () =>
  element(by.css('.dt-chart-selection-area'));
export const getRange = () => element(by.css('.dt-chart-range'));
export const getTimestamp = () => element(by.css('.dt-chart-timestamp'));
export const getSelection = () => element(selectionSelector);
export const getOverlay = () =>
  element(by.css('.dt-chart-selection-area-overlay'));

export const getApplyButton = () =>
  getOverlay().element(by.css('.dt-button-primary'));

export const getOverlayCloseButton = () =>
  getOverlay().element(by.css('.dt-button-secondary'));

export const getRightHandle = () =>
  getRange().element(by.css('.dt-chart-right-handle'));

export const getLeftHandle = () =>
  getRange().element(by.css('.dt-chart-left-handle'));

export const getOverlayText = () =>
  element(by.css('.dt-selection-area-overlay-text')).getText();

export const isRangeOverlayVisible = () =>
  getRange()
    .element(selectionSelector)
    .isPresent();

export const isTimestampOverlayVisible = () =>
  getTimestamp()
    .element(selectionSelector)
    .isPresent();

/** checks if the current range is valid */
export async function isRangeValid(): Promise<boolean> {
  const classList = await getRange().getAttribute('class');
  return !classList.includes('dt-chart-range-invalid');
}

export async function createTimestamp(point: Point): Promise<void> {
  await browser
    .actions()
    .mouseMove(getChart(), point)
    .click()
    .perform();
}

export async function createRange(from: Point, to: Point): Promise<void> {
  await browser
    .actions()
    .mouseMove(getChart(), from)
    .mouseDown()
    .mouseMove(getChart(), to)
    .mouseUp()
    .perform();
}

export async function dragHandle(
  handle: ElementFinder,
  position: Point,
): Promise<void> {
  await browser
    .actions()
    .mouseDown(handle)
    .mouseMove(position)
    .mouseUp()
    .perform();
}

export async function closeOverlay(): Promise<void> {
  return getOverlayCloseButton().click();
}

/** Check if the provided element is focused */
export async function isFocused(el: ElementFinder): Promise<boolean> {
  const activeElement = await getActiveElement();
  return el.equals(activeElement);
}

/** Returns the current active element */
export async function getActiveElement(): Promise<WebElement> {
  return browser.driver
    .switchTo()
    .activeElement()
    .then(activeElement => Promise.resolve(activeElement));
}
