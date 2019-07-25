// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { createKeyboardEvent } from '../../../testing/event-objects';
import { updateTimestampWithKeyboardEvent } from './update-timestamp-with-keyboard-event';

describe('DtChartRange update range with keyboard', () => {
  const maxWidth = 500;

  it('should set the timestamp to the max value if end was pressed', () => {
    const event = createKeyboardEvent('keydown', END);
    const timestamp = updateTimestampWithKeyboardEvent(event, 100, maxWidth);

    expect(timestamp).toBe(500);
  });

  it('should set the width to 0 when the home key was pressed', () => {
    const event = createKeyboardEvent('keydown', HOME);
    const timestamp = updateTimestampWithKeyboardEvent(event, 100, maxWidth);

    expect(timestamp).toBe(0);
  });

  it('should decrease the number with 1 if the left arrow was pressed', () => {
    const event = createKeyboardEvent('keydown', LEFT_ARROW);
    const timestamp = updateTimestampWithKeyboardEvent(event, 100, maxWidth);

    expect(timestamp).toBe(99);
  });

  it('should decrease the number with 1 if the down arrow was pressed', () => {
    const event = createKeyboardEvent('keydown', DOWN_ARROW);
    const timestamp = updateTimestampWithKeyboardEvent(event, 100, maxWidth);

    expect(timestamp).toBe(99);
  });

  it('should increase the number with 1 if the right arrow was pressed', () => {
    const event = createKeyboardEvent('keydown', RIGHT_ARROW);
    const timestamp = updateTimestampWithKeyboardEvent(event, 100, maxWidth);

    expect(timestamp).toBe(101);
  });

  it('should increase the number with 1 if the up arrow was pressed', () => {
    const event = createKeyboardEvent('keydown', UP_ARROW);
    const timestamp = updateTimestampWithKeyboardEvent(event, 100, maxWidth);

    expect(timestamp).toBe(101);
  });

  it('should increase the number with 10 if page up was pressed', () => {
    const event = createKeyboardEvent('keydown', PAGE_UP);
    const timestamp = updateTimestampWithKeyboardEvent(event, 100, maxWidth);

    expect(timestamp).toBe(110);
  });

  it('should decrease the number with 10 if page down was pressed', () => {
    const event = createKeyboardEvent('keydown', PAGE_DOWN);
    const timestamp = updateTimestampWithKeyboardEvent(event, 100, maxWidth);

    expect(timestamp).toBe(90);
  });

  it('should set the width to 0 when the page down was pressed and it would be negative', () => {
    const event = createKeyboardEvent('keydown', PAGE_DOWN);
    const timestamp = updateTimestampWithKeyboardEvent(event, 8, maxWidth);

    expect(timestamp).toBe(0);
  });

  it('should set the width to max when the page down was pressed and it would be greater than max', () => {
    const event = createKeyboardEvent('keydown', PAGE_UP);
    const timestamp = updateTimestampWithKeyboardEvent(event, 495, maxWidth);

    expect(timestamp).toBe(500);
  });
});
