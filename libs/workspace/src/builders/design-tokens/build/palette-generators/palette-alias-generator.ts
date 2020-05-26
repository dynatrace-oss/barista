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

import { generateContrastColors } from '@adobe/leonardo-contrast-colors';
import {
  FluidPaletteSource,
  FluidPaletteAlias,
} from '@dynatrace/shared/barista-definitions';
import { DesignTokenSource } from '../../interfaces/design-token-source';

/**
 * Generates a list of aliases for the color palette based on the source
 * baseColor and the shades given. Calculations currently utilizes leonardo
 * package to calculate different shades
 */
export function generatePaletteAliases(
  paletteSource: FluidPaletteSource,
): DesignTokenSource {
  const aliases: FluidPaletteAlias = {};

  for (const alias of paletteSource.aliases) {
    const options = {
      colorKeys: Array.isArray(alias.keyColor)
        ? alias.keyColor
        : [alias.keyColor],
      base: alias.baseColor,
      ratios: alias.shades.map((shade) => shade.ratio),
      colorspace: alias.colorspace,
    };
    const contrastPalette = generateContrastColors(options);

    for (let i = 0; i < alias.shades.length; i += 1) {
      const shade = alias.shades[i];
      aliases[shade.aliasName] = {
        value: contrastPalette[i],
        comment: shade.comment,
        originalRatio: shade.ratio,
      };
    }
  }

  return {
    aliases,
    global: {
      type: 'color',
      category: 'color',
    },
  };
}
