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

import {
  generateBaseColors,
  generateColorGroups,
  replaceColorPrefixes,
} from './generate-color-group-config';
import { DesignTokenSource } from '../../interfaces/design-token-source';

describe('[Design tokens tailwind] generate color', () => {
  describe('replace color prefix', () => {
    it('should replace the abyss color prefix correctly', () => {
      expect(replaceColorPrefixes('color-abyss-primary-70')).toEqual(
        'primary-70',
      );
    });

    it('should replace the surface color prefix correctly', () => {
      expect(replaceColorPrefixes('color-surface-primary-70')).toEqual(
        'primary-70',
      );
    });
  });

  describe('generate color groups', () => {
    it('should convert the color groups correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'color-abyss-primary-70': { value: '#000070' },
          'color-abyss-primary-80': { value: '#000080' },
          'color-abyss-primary-90': { value: '#000090' },
        },
      };
      expect(generateColorGroups(input)).toMatchObject({
        primary: {
          '70': 'var(--color-primary-70)',
          '80': 'var(--color-primary-80)',
          '90': 'var(--color-primary-90)',
        },
      });
    });

    it('should group the colors correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'color-abyss-primary-70': { value: '#000070' },
          'color-abyss-primary-80': { value: '#000080' },
          'color-abyss-neutral-90': { value: '#000090' },
        },
      };
      expect(generateColorGroups(input)).toMatchObject({
        primary: {
          '70': 'var(--color-primary-70)',
          '80': 'var(--color-primary-80)',
        },
        neutral: {
          '90': 'var(--color-neutral-90)',
        },
      });
    });

    it('should not duplicate abyss and surface colors', () => {
      const input: DesignTokenSource = {
        aliases: {
          'color-surface-primary-70': { value: '#000070' },
          'color-abyss-primary-70': { value: '#000080' },
        },
      };
      expect(generateColorGroups(input)).toMatchObject({
        primary: {
          '70': 'var(--color-primary-70)',
        },
      });
    });
  });

  describe('generate base colors', () => {
    it('should turn the base colors into the correct output', () => {
      const input: DesignTokenSource = {
        aliases: {
          'color-abyss-background': { value: '#000000' },
          'color-abyss-maxcontrast': { value: '#ffffff' },
        },
      };
      expect(generateBaseColors(input)).toMatchObject({
        background: 'var(--color-background)',
        maxcontrast: 'var(--color-maxcontrast)',
      });
    });

    it('should not duplicate surface and abyss colors', () => {
      const input: DesignTokenSource = {
        aliases: {
          'color-abyss-background': { value: '#000000' },
          'color-surface-background': { value: '#ffffff' },
        },
      };
      expect(generateBaseColors(input)).toMatchObject({
        background: 'var(--color-background)',
      });
    });
  });
});
