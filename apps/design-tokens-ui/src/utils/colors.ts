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
  luminance,
  generateContrastColors,
} from '@adobe/leonardo-contrast-colors';
import { rgb } from 'd3-color';
import { FluidPaletteSourceAlias } from '@dynatrace/shared/design-system/interfaces';

/** Luminance threshold when at which a dark text color should be used  */
const TEXT_COLOR_LUMINANCE_THRESHOLD = 0.45;

/** Generates contrast colors with Adobe Leonardo for the given options */
export function generatePaletteContrastColors(
  paletteSource: FluidPaletteSourceAlias,
): string[] {
  return generateContrastColors({
    base: paletteSource.baseColor,
    colorKeys: Array.isArray(paletteSource.keyColor)
      ? paletteSource.keyColor
      : [paletteSource.keyColor],
    colorspace: paletteSource.colorspace,
    ratios: paletteSource.shades.map((shade) => shade.ratio),
  });
}

/** Returns a readable text color based on the luminance of the given background color. */
export function getTextColorOnBackground(bgColor: string): string {
  const { r, g, b } = rgb(bgColor);
  return luminance(r, g, b) > TEXT_COLOR_LUMINANCE_THRESHOLD
    ? 'black'
    : 'white';
}

/** Returns a color that is a bit darker than the input color. */
export function getDarkerColor(color: string, amount: number = 1): string {
  return rgb(color).darker(amount).hex();
}
