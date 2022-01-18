/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { calculatePages } from './pagination-calculate-pages';

describe('calculatePages', () => {
  describe('functionality of the ellipsis calculation', () => {
    it('should return an empty array when no pages are present', () => {
      const pages = calculatePages(0, 1);
      expect(pages).toEqual([]);
    });

    it('should return an array with all pages when all pages would be smaller as 7', () => {
      const pages = calculatePages(3, 1);
      expect(pages).toEqual([[1, 2, 3]]);
    });

    it('should return an array with all pages when the length is 6', () => {
      const pages = calculatePages(6, 1);
      expect(pages).toEqual([[1, 2, 3, 4, 5, 6]]);
    });

    it('should start with an ellipsis in the middle if the length is 7', () => {
      const pages = calculatePages(7, 1);
      expect(pages).toEqual([
        [1, 2, 3],
        [5, 6, 7],
      ]);
    });

    it('should return an array with all pages when all pages would be smaller as 7', () => {
      const pages = calculatePages(7, 1);
      expect(pages).toEqual([
        [1, 2, 3],
        [5, 6, 7],
      ]);
    });

    it('should shift the ellipsis from the middle to the end when the current is 3 with a length of 7', () => {
      const pages = calculatePages(7, 3);
      expect(pages).toEqual([
        [1, 2, 3, 4],
        [6, 7],
      ]);
    });

    it('should start with a middle block if the current is 4 with a length of 7', () => {
      const pages = calculatePages(7, 4);
      expect(pages).toEqual([[1], [3, 4, 5], [7]]);
    });

    it('should shift the ellipsis to the middle if the current is 5 with a length of 7', () => {
      const pages = calculatePages(7, 5);
      expect(pages).toEqual([
        [1, 2],
        [4, 5, 6, 7],
      ]);
    });

    it('should ellipsis in the middle if the current is 6 with a length of 7', () => {
      const pages = calculatePages(7, 6);
      expect(pages).toEqual([
        [1, 2, 3],
        [5, 6, 7],
      ]);
    });

    it('should ellipsis in the middle if the current is 7 with a length of 7', () => {
      const pages = calculatePages(7, 7);
      expect(pages).toEqual([
        [1, 2, 3],
        [5, 6, 7],
      ]);
    });

    it('should ellipsis in the middle if the current is 54 with a length of 88', () => {
      const pages = calculatePages(88, 54);
      expect(pages).toEqual([[1], [53, 54, 55], [88]]);
    });

    it('should return an empty array if the current page is greater than the pages length', () => {
      const pages = calculatePages(10, 11);
      expect(pages).toEqual([]);
    });

    it('should return an empty array if the current page lower than 1', () => {
      expect(calculatePages(10, -1)).toEqual([]);
      expect(calculatePages(10, 0)).toEqual([]);
    });
  });
});
