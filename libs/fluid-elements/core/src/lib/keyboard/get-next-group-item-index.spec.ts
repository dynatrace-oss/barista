/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { getNextGroupItemIndex } from './get-next-group-item-index';
import {
  ARROW_RIGHT,
  ARROW_LEFT,
  ARROW_UP,
  ARROW_DOWN,
} from '@dynatrace/shared/keycodes';

describe('get next group item index', () => {
  it('should get 1 if the index is 0 and ARROW_RIGHT and the length is 4', () => {
    expect(getNextGroupItemIndex(0, 4, ARROW_RIGHT)).toBe(1);
  });
  it('should get 2 if the index is 1 and ARROW_RIGHT and the length is 4', () => {
    expect(getNextGroupItemIndex(1, 4, ARROW_RIGHT)).toBe(2);
  });
  it('should get 3 if the index is 2 and ARROW_RIGHT and the length is 4', () => {
    expect(getNextGroupItemIndex(2, 4, ARROW_RIGHT)).toBe(3);
  });
  it('should get 0 if the index is 3 and ARROW_RIGHT and the length is 4', () => {
    expect(getNextGroupItemIndex(3, 4, ARROW_RIGHT)).toBe(0);
  });
  it('should get 1 if the index is 0 and ARROW_DOWN and the length is 4', () => {
    expect(getNextGroupItemIndex(0, 4, ARROW_DOWN)).toBe(1);
  });
  it('should get 2 if the index is 1 and ARROW_DOWN and the length is 4', () => {
    expect(getNextGroupItemIndex(1, 4, ARROW_DOWN)).toBe(2);
  });
  it('should get 3 if the index is 2 and ARROW_DOWN and the length is 4', () => {
    expect(getNextGroupItemIndex(2, 4, ARROW_DOWN)).toBe(3);
  });
  it('should get 0 if the index is 3 and ARROW_DOWN and the length is 4', () => {
    expect(getNextGroupItemIndex(3, 4, ARROW_DOWN)).toBe(0);
  });
  it('should get 3 if the index is 0 and ARROW_LEFT and the length is 4', () => {
    expect(getNextGroupItemIndex(0, 4, ARROW_LEFT)).toBe(3);
  });
  it('should get 2 if the index is 3 and ARROW_LEFT and the length is 4', () => {
    expect(getNextGroupItemIndex(3, 4, ARROW_LEFT)).toBe(2);
  });
  it('should get 1 if the index is 2 and ARROW_LEFT and the length is 4', () => {
    expect(getNextGroupItemIndex(2, 4, ARROW_LEFT)).toBe(1);
  });
  it('should get 0 if the index is 1 and ARROW_LEFT and the length is 4', () => {
    expect(getNextGroupItemIndex(1, 4, ARROW_LEFT)).toBe(0);
  });
  it('should get 3 if the index is 0 and ARROW_UP and the length is 4', () => {
    expect(getNextGroupItemIndex(0, 4, ARROW_UP)).toBe(3);
  });
  it('should get 2 if the index is 3 and ARROW_UP and the length is 4', () => {
    expect(getNextGroupItemIndex(3, 4, ARROW_UP)).toBe(2);
  });
  it('should get 1 if the index is 2 and ARROW_UP and the length is 4', () => {
    expect(getNextGroupItemIndex(2, 4, ARROW_UP)).toBe(1);
  });
  it('should get 0 if the index is 1 and ARROW_UP and the length is 4', () => {
    expect(getNextGroupItemIndex(1, 4, ARROW_UP)).toBe(0);
  });
});
