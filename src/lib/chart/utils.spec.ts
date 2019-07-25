// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { createKeyboardEvent } from '../../testing/event-objects';
import { getKeyboardNavigationOffset } from './utils';

describe('DtChart utils', () => {
  describe('getKeyboardNavigationOffset', () => {
    it('should return 1 if the right arrow key was pressed', () => {
      const event = createKeyboardEvent('keydown', RIGHT_ARROW);

      expect(getKeyboardNavigationOffset(event)).toBe(1);
    });

    it('should return 1 if the up arrow key was pressed', () => {
      const event = createKeyboardEvent('keydown', UP_ARROW);

      expect(getKeyboardNavigationOffset(event)).toBe(1);
    });

    it('should return -1 if the left arrow key was pressed', () => {
      const event = createKeyboardEvent('keydown', LEFT_ARROW);

      expect(getKeyboardNavigationOffset(event)).toBe(-1);
    });

    it('should return -1 if the down arrow key was pressed', () => {
      const event = createKeyboardEvent('keydown', LEFT_ARROW);

      expect(getKeyboardNavigationOffset(event)).toBe(-1);
    });

    it('should return -10 if the page down key was pressed', () => {
      const event = createKeyboardEvent('keydown', PAGE_DOWN);

      expect(getKeyboardNavigationOffset(event)).toBe(-10);
    });

    it('should return -10 if the page up key was pressed', () => {
      const event = createKeyboardEvent('keydown', PAGE_UP);

      expect(getKeyboardNavigationOffset(event)).toBe(10);
    });
  });
});
