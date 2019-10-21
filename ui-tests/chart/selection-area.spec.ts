// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Key, browser } from 'protractor';

import { pressKey, resizeWindow } from '../utils';
import {
  closeOverlay,
  createRange,
  createTimestamp,
  dragHandle,
  getApplyButton,
  getLeftHandle,
  getOverlayText,
  getRange,
  getRightHandle,
  getSelection,
  getSelectionArea,
  getTimestamp,
  isFocused,
  isRangeOverlayVisible,
  isRangeValid,
  isTimestampOverlayVisible,
} from './selection-area.po';

describe('Selection Area', () => {
  beforeEach(async () => {
    await resizeWindow(1200, 1000);
    await browser.get('/chart/selection-area');
  });

  it('should have the possibility to create a range and a timestamp', () => {
    expect(getRange()).toBeDefined();
    expect(getTimestamp()).toBeDefined();
  });

  it('should not have an initial selection', async () => {
    expect(await getSelection().isPresent()).toBe(false);
    expect(await isRangeOverlayVisible()).toBe(false);
    expect(await isTimestampOverlayVisible()).toBe(false);
  });

  describe('Range', () => {
    it('should create a range when a selection will be dragged', async () => {
      const from = { x: 300, y: 100 };
      const to = { x: 850, y: 100 };
      await createRange(from, to);
      expect(await getSelection().isPresent()).toBe(true);
      expect(await isRangeOverlayVisible()).toBe(true);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31 \d{2}:16 — \d{2}:23/g);
    });

    it('should create a range that is disabled when it does not meet the 5min constraints', async () => {
      const from = { x: 300, y: 100 };
      const to = { x: 350, y: 100 };
      await createRange(from, to);

      expect(await isRangeValid()).toBe(false);
      const button = getApplyButton();
      expect(await button.getAttribute('disabled')).toBeTruthy();
      expect(await button.isEnabled()).toBe(false);
    });

    it('should close the overlay of a range when the close overlay button was triggered', async () => {
      const from = { x: 300, y: 100 };
      const to = { x: 350, y: 100 };
      await createRange(from, to);

      expect(await getSelection().isPresent()).toBe(true);
      expect(await isRangeOverlayVisible()).toBe(true);

      await closeOverlay();

      expect(await getSelection().isPresent()).toBe(false);
      expect(await isRangeOverlayVisible()).toBe(false);
    });

    it('should increase the selection by dragging the right handle', async () => {
      const from = { x: 300, y: 100 };
      const to = { x: 850, y: 100 };
      await createRange(from, to);
      expect((await getSelection().getSize()).width).toEqual(550);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31 \d{2}:16 — \d{2}:23/g);

      await dragHandle(getRightHandle(), { x: 100, y: 100 });
      expect((await getSelection().getSize()).width).toEqual(648);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31 \d{2}:16 — \d{2}:24/g);
    });

    it('should increase the selection by dragging the left handle', async () => {
      const from = { x: 300, y: 100 };
      const to = { x: 850, y: 100 };
      await createRange(from, to);
      expect((await getSelection().getSize()).width).toEqual(550);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31 \d{2}:16 — \d{2}:23/g);

      await dragHandle(getLeftHandle(), { x: -200, y: 100 });
      expect((await getSelection().getSize()).width).toEqual(749);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31 \d{2}:14 — \d{2}:23/g);
    });
  });

  describe('Timestamp', () => {
    it('should create a timestamp when it was clicked on a certain point of the screen', async () => {
      await createTimestamp({ x: 400, y: 100 });

      expect(await getSelection().isPresent()).toBe(true);
      expect(await isTimestampOverlayVisible()).toBe(true);
      expect(await isRangeOverlayVisible()).toBe(false);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31, \d{2}:17/g);
    });

    it('should close the overlay of a timestamp when the close overlay button was triggered', async () => {
      await createTimestamp({ x: 400, y: 100 });

      expect(await getSelection().isPresent()).toBe(true);
      expect(await isTimestampOverlayVisible()).toBe(true);

      await closeOverlay();

      expect(await getSelection().isPresent()).toBe(false);
      expect(await isTimestampOverlayVisible()).toBe(false);
    });
  });

  describe('Timestamp + Range', () => {
    it('should switch to a timestamp if there is a open range and a click will be performed', async () => {
      const from = { x: 300, y: 100 };
      const to = { x: 850, y: 100 };
      await createRange(from, to);

      expect(await isRangeOverlayVisible()).toBe(true);

      await createTimestamp({ x: 450, y: 100 });

      expect(await isTimestampOverlayVisible()).toBe(true);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31, \d{2}:18/g);
    });

    it('should switch to a range if there is a open timestamp and a drag will be performed', async () => {
      await createTimestamp({ x: 450, y: 100 });
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31, \d{2}:18/g);

      const from = { x: 300, y: 100 };
      const to = { x: 850, y: 100 };
      await createRange(from, to);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31 \d{2}:16 — \d{2}:23/g);
    });
  });

  describe('Keyboard', () => {
    it('should focus the selection area if tab key is pressed', async () => {
      await pressKey(Key.TAB);

      expect(isFocused(getSelectionArea())).toBe(true);
    });

    it('should create an initial timestamp when the chart is focused and enter is pressed', async () => {
      await pressKey(Key.TAB);
      await pressKey(Key.ENTER);

      expect(await isTimestampOverlayVisible()).toBe(true);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31, \d{2}:20/g);

      expect(isFocused(getSelection())).toBe(true);
    });

    it('should create a range out of the timestamp with shift + left arrow key', async () => {
      await pressKey(Key.TAB);
      await pressKey(Key.ENTER);
      await pressKey(Key.SHIFT, Key.ARROW_LEFT);

      expect(await isTimestampOverlayVisible()).toBe(false);
      expect(await isRangeOverlayVisible()).toBe(true);
      // using the \d{2} two digits regex matcher to be timezone independent! Would fail on CI otherwise.
      expect(await getOverlayText()).toMatch(/Jul 31 \d{2}:20 — \d{2}:25/g);
    });
  });
});
