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

import { DesignTokenSource } from '../../interfaces/design-token-source';
import {
  generateFontFamilies,
  generateFontSize,
  generateFontWeight,
  generateLineHeights,
} from './generate-font-config';

describe('[Design tokens tailwind] generate font', () => {
  describe('generate font families', () => {
    it('should gnerate the three font families correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'font-family-sans-serif': 'Roboto, Helvetica, sans-serif',
          'font-family-serif': 'serif',
          'font-family-monospaced': 'monospace',
        },
      };
      expect(generateFontFamilies(input)).toMatchObject({
        sans: ['Roboto', 'Helvetica', 'sans-serif'],
        serif: ['serif'],
        mono: ['monospace'],
      });
    });
  });

  describe('generate font size', () => {
    it('should generate the font sizes correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'typography--font-size-4xl': '20px',
          'typography--font-size-xl': '18px',
          'typography--font-size-xs': '14px',
        },
      };
      expect(generateFontSize(input)).toMatchObject({
        '4xl': '20px',
        xl: '18px',
        xs: '14px',
      });
    });

    it('should replace the base token correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'typography--font-size': '16px',
        },
      };
      expect(generateFontSize(input)).toMatchObject({
        base: '16px',
      });
    });
  });

  describe('generate font weigth', () => {
    it('should generate font weight config correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'typography--emphasis-regular': '400',
          'typography--emphasis-medium': '500',
          'typography--emphasis-high': '700',
        },
      };
      expect(generateFontWeight(input)).toMatchObject({
        regular: '400',
        medium: '500',
        high: '700',
      });
    });
  });

  describe('generate line heights', () => {
    it('should generate the font sizes correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'typography--line-height-4xl': '20px',
          'typography--line-height-xl': '18px',
          'typography--line-height-xs': '14px',
        },
      };
      expect(generateLineHeights(input)).toMatchObject({
        '4xl': '20px',
        xl: '18px',
        xs: '14px',
      });
    });

    it('should replace the base token correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'typography--line-height': '16px',
        },
      };
      expect(generateLineHeights(input)).toMatchObject({
        base: '16px',
      });
    });
  });
});
