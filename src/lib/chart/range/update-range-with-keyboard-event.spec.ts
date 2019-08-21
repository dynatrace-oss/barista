// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { END, HOME } from '@angular/cdk/keycodes';

import { createKeyboardEvent } from '../../../testing/event-objects';
import { updateRangeWithKeyboardEvent } from './update-range-with-keyboard-event';

describe('DtChartRange update range with keyboard', () => {
  const maxWidth = 500;

  it('should increase the width to the max when end key was pressed on the right handle', () => {
    const currentRange = { left: 0, width: 100 };
    const event = createKeyboardEvent('keydown', END);

    const range = updateRangeWithKeyboardEvent(
      event,
      'right',
      maxWidth,
      currentRange,
    );

    expect(range).toMatchObject({ left: 0, width: 500 });
  });

  it('should set the width to 0 when the home key was pressed on the right handle', () => {
    const currentRange = { left: 0, width: 100 };
    const event = createKeyboardEvent('keydown', HOME);

    const range = updateRangeWithKeyboardEvent(
      event,
      'right',
      maxWidth,
      currentRange,
    );

    expect(range).toMatchObject({ left: 0, width: 0 });
  });

  it('should set the left to 0 when the home key was pressed on the left handle', () => {
    const currentRange = { left: 50, width: 100 };
    const event = createKeyboardEvent('keydown', HOME);

    const range = updateRangeWithKeyboardEvent(
      event,
      'left',
      maxWidth,
      currentRange,
    );

    expect(range).toMatchObject({ left: 0, width: 150 });
  });

  it('should set the left to the end of the width when the end key was pressed on the left handle', () => {
    const currentRange = { left: 50, width: 100 };
    const event = createKeyboardEvent('keydown', END);

    const range = updateRangeWithKeyboardEvent(
      event,
      'left',
      maxWidth,
      currentRange,
    );

    expect(range).toMatchObject({ left: 150, width: 0 });
  });
});
