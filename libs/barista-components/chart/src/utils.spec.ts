/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import {
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';

import { createKeyboardEvent } from '@dynatrace/testing/browser';
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
