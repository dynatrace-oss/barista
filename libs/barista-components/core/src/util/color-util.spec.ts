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

import { _isValidColorHexValue } from './color-util';

describe('ColorUtil', () => {
  describe('isValidColorHexValue', () => {
    it('should pass for value: #00a1b2', () => {
      const value = '#00a1b2';
      expect(_isValidColorHexValue(value)).toBe(true);
    });

    it('should pass for value: #00A1B2', () => {
      const value = '#00A1B2';
      expect(_isValidColorHexValue(value)).toBe(true);
    });

    it('should pass for value: #CCC', () => {
      const value = '#CCC';
      expect(_isValidColorHexValue(value)).toBe(true);
    });

    it('should pass for value: #333', () => {
      const value = '#333';
      expect(_isValidColorHexValue(value)).toBe(true);
    });

    it('should fail for value: #123xyz (invalid characters)', () => {
      const value = '#123xyz';
      expect(_isValidColorHexValue(value)).toBe(false);
    });

    it('should fail for value: 00a1b2 (missing #)', () => {
      const value = '00a1b2';
      expect(_isValidColorHexValue(value)).toBe(false);
    });

    it('should fail for value: #00a1b2FF (too many characters)', () => {
      const value = '#00a1b2FF';
      expect(_isValidColorHexValue(value)).toBe(false);
    });

    it('should fail for value: #00a1 (too few characters)', () => {
      const value = '#00a1';
      expect(_isValidColorHexValue(value)).toBe(false);
    });

    it('should fail for value: red (invalid value)', () => {
      const value = 'red';
      expect(_isValidColorHexValue(value)).toBe(false);
    });

    it("should fail for value: '' (empty string)", () => {
      const value = '';
      expect(_isValidColorHexValue(value)).toBe(false);
    });

    it('should fail for value: # abc123 (space between # and value)', () => {
      const value = '# abc123';
      expect(_isValidColorHexValue(value)).toBe(false);
    });
  });
});
