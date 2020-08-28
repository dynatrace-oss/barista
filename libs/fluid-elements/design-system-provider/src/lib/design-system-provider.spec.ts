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

import { FluidDesignSystemProvider } from './design-system-provider';
import * as designTokens from '@dynatrace/fluid-design-tokens';

function tick(): Promise<void> {
  return Promise.resolve();
}

describe('Fluid design system provider', () => {
  let fixture: FluidDesignSystemProvider;

  beforeEach(() => {
    if (!customElements.get('fluid-design-system-provider')) {
      customElements.define(
        'fluid-design-system-provider',
        FluidDesignSystemProvider,
      );
    }
    document.body.innerHTML =
      '<fluid-design-system-provider></fluid-design-system-provider>';
    fixture = document.querySelector<FluidDesignSystemProvider>(
      'fluid-design-system-provider',
    )!;
  });

  it('should create the provider', () => {
    expect(fixture).not.toBe(null);
  });

  describe('update()', () => {
    it('should set the layout multiplicator for the "default" layout density by default', async () => {
      await tick();

      const style = getComputedStyle(fixture);
      expect(style.getPropertyValue('--fluid-layout--multiplicator')).toBe(
        designTokens.FLUID_LAYOUT_DEFAULT,
      );
    });

    it('should set the layout multiplicator according to the layout attribute', async () => {
      fixture.layoutDensity = 'dense';
      await tick();

      const style = getComputedStyle(fixture);
      expect(style.getPropertyValue('--fluid-layout--multiplicator')).toBe(
        designTokens.FLUID_LAYOUT_DENSE,
      );
    });

    it('should create custom properties for spacing computation', async () => {
      await tick();

      const style = getComputedStyle(fixture);
      expect(style.getPropertyValue('--fluid-spacing--medium')).toBe(
        `calc(${designTokens.FLUID_SPACING_MEDIUM} * var(--fluid-layout--multiplicator))`,
      );
    });

    it('should set color properties for the Abyss theme by default', async () => {
      await tick();

      const style = getComputedStyle(fixture);
      expect(style.getPropertyValue('--color-background')).toBe(
        designTokens.FLUID_COLOR_ABYSS_BACKGROUND,
      );
    });

    it('should set color properties according to the theme attribute', async () => {
      fixture.theme = 'surface';
      await tick();

      const style = getComputedStyle(fixture);
      expect(style.getPropertyValue('--color-background')).toBe(
        designTokens.FLUID_COLOR_SURFACE_BACKGROUND,
      );
    });
  });

  describe('data validation', () => {
    // These tests make sure that whenever design tokens are added
    // or removed, the change is reflected in the component style.

    it('should define the correct amount of color tokens', async () => {
      const tokenCount = Object.keys(designTokens.THEMES.ABYSS).length;

      await tick();

      const style = getComputedStyle(fixture);
      let propCount = 0;
      for (let i = 0; i < style.length; i++) {
        if (style[i].startsWith('--color')) {
          propCount++;
        }
      }

      expect(propCount).toBe(tokenCount);
    });

    it('should define the correct amount of spacing tokens', async () => {
      const tokenCount = Object.keys(designTokens).filter((name) =>
        name.startsWith('FLUID_SPACING'),
      ).length;

      await tick();

      const style = getComputedStyle(fixture);
      let propCount = 0;
      for (let i = 0; i < style.length; i++) {
        if (style[i].startsWith('--fluid-spacing')) {
          propCount++;
        }
      }

      expect(propCount).toBe(tokenCount);
    });
  });
});
