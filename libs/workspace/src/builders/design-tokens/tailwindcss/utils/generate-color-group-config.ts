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

/** Removes the color and theme prefix from the color name. */
export function replaceColorPrefixes(colorname: string): string {
  return colorname.replace('color-abyss-', '').replace('color-surface-', '');
}

/** Generates themed colors versions */
export function generateColorGroups(
  paletteAliasSource: DesignTokenSource,
): {
  [colorGroup: string]: {
    [colorShade: string]: string;
  };
} {
  // Get all colors and replace their themes
  // as themeing is handled by the browser css custom property cascade.
  // We only need the redirect to the css-custom-property.
  // Replace the color prefixes from the colors, transforming `color-abyss-primary-70`
  // to `primary-70`
  const colors = Object.keys(paletteAliasSource.aliases!).map(
    replaceColorPrefixes,
  );
  const groupedColors: {
    [colorGroup: string]: {
      [colorShade: string]: string;
    };
  } = {};
  // Iterate over the unique set of colors and add them to their respective group
  for (const color of Array.from(new Set(colors))) {
    // Last portion of the color name is always the
    // shade value. Splitting out `70` from `primary-70`.
    const shadeKey = color.split('-').pop()!;
    // Construct the css custom property value that is defined by the theme.scss
    // resulting in `var(--color-primary-70)`
    const value = `var(--color-${color})`;
    // Extract the color group from it's name.
    const group = color.replace(`-${shadeKey}`, '');
    groupedColors[group] = groupedColors[group] || {};
    groupedColors[group][shadeKey] = value;
  }
  return groupedColors;
}

/** Generate the base colors assignments for `base` and `text` colors */
export function generateBaseColors(
  basecolorAliasSource: DesignTokenSource,
): {
  [colorShade: string]: string;
} {
  // Get all colors and replace their themenames
  // Replace the color prefixes from the colors, transforming `color-abyss-background`
  // to `background`
  const colors = Object.keys(basecolorAliasSource.aliases!).map(
    replaceColorPrefixes,
  );
  const baseColors = {};
  // Iterate over a unique set of the colors and add them to the
  // base color list
  for (const color of Array.from(new Set(colors))) {
    baseColors[color] = `var(--color-${color})`;
  }
  return baseColors;
}
