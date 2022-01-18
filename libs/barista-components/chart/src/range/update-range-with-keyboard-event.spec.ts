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
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';

import { createKeyboardEvent } from '@dynatrace/testing/browser';
import { updateRangeWithKeyboardEvent } from './update-range-with-keyboard-event';

function getKeyName(keycode: number): string {
  switch (keycode) {
    case PAGE_UP:
      return 'Page Up';
    case PAGE_DOWN:
      return 'Page Down';
    case END:
      return 'End';
    case HOME:
      return 'Home';
    case LEFT_ARROW:
      return 'Arrow Left';
    case UP_ARROW:
      return 'Arrow Up';
    case RIGHT_ARROW:
      return 'Arrow Right';
    case DOWN_ARROW:
      return 'Arrow Down';
    default:
      return `${keycode}`;
  }
}

describe('DtChartRange update range with keyboard', () => {
  const maxWidth = 500;
  const currentRange = { left: 100, width: 100 };

  const commands = [
    { key: RIGHT_ARROW, handle: 'right', range: { left: 100, width: 101 } },
    { key: UP_ARROW, handle: 'right', range: { left: 100, width: 101 } },
    { key: LEFT_ARROW, handle: 'right', range: { left: 100, width: 99 } },
    { key: DOWN_ARROW, handle: 'right', range: { left: 100, width: 99 } },
    { key: RIGHT_ARROW, handle: 'left', range: { left: 101, width: 99 } },
    { key: UP_ARROW, handle: 'left', range: { left: 101, width: 99 } },
    { key: LEFT_ARROW, handle: 'left', range: { left: 99, width: 101 } },
    { key: DOWN_ARROW, handle: 'left', range: { left: 99, width: 101 } },
    { key: PAGE_UP, handle: 'right', range: { left: 100, width: 110 } },
    { key: PAGE_DOWN, handle: 'right', range: { left: 100, width: 90 } },
    { key: PAGE_UP, handle: 'left', range: { left: 110, width: 90 } },
    { key: PAGE_DOWN, handle: 'left', range: { left: 90, width: 110 } },
    { key: HOME, handle: 'right', range: { left: 100, width: 0 } },
    { key: HOME, handle: 'left', range: { left: 0, width: 200 } },
    { key: END, handle: 'right', range: { left: 100, width: 400 } },
    { key: END, handle: 'left', range: { left: 200, width: 0 } },
    {
      key: RIGHT_ARROW,
      handle: 'selected-area',
      range: { left: 101, width: 100 },
    },
    {
      key: UP_ARROW,
      handle: 'selected-area',
      range: { left: 101, width: 100 },
    },
    {
      key: LEFT_ARROW,
      handle: 'selected-area',
      range: { left: 99, width: 100 },
    },
    {
      key: DOWN_ARROW,
      handle: 'selected-area',
      range: { left: 99, width: 100 },
    },
    { key: PAGE_UP, handle: 'selected-area', range: { left: 110, width: 100 } },
    {
      key: PAGE_DOWN,
      handle: 'selected-area',
      range: { left: 90, width: 100 },
    },
    { key: HOME, handle: 'selected-area', range: { left: 0, width: 100 } },
    { key: END, handle: 'selected-area', range: { left: 400, width: 100 } },
  ];

  commands.forEach((command) => {
    const handle = command.handle;
    const event = createKeyboardEvent('keydown', command.key);
    const range = updateRangeWithKeyboardEvent(
      event,
      handle,
      maxWidth,
      currentRange,
    );
    const stringRange = JSON.stringify(range);

    it(`${getKeyName(
      command.key,
    )} keypress on ${handle} ${stringRange},`, () => {
      expect(range).toMatchObject(command.range);
    });
  });
});
