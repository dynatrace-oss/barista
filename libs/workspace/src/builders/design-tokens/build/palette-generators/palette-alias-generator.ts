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

import { generateContrastColors } from './contrast-colors';
// import { generateContrastColors } from '@adobe/leonardo-contrast-colors';

/** Preliminary interface for the source of a generated palette. */
interface FluidPaletteSource {
  aliases: {
    /** Root name of the alias. */
    name: string;
    /** Key color(s) on which the calculations are based on. */
    keyColor: string | string[];
    /** Base color used to calculate the contrast ratios to. */
    baseColor: string;
    /** Type of calculations that should be used. Currently only adobe-leonardo is available. */
    type: 'adobe-leonardo' | undefined;
    /** Colorspace to use */
    colorspace: 'CAM02' | 'HSLuv';
    /** List of shades that should be generated. */
    shades: {
      /** Name of the shade. */
      name: string;
      /** Target contrast ratio level. */
      ratio: number;
      /** Comment for this particular alias. */
      comment: string;
      /** Output alias name. */
      aliasName: string;
    }[];
  }[];
}

interface FluidPaletteAlias {
  [aliasName: string]: {
    value: string;
    comment?: string;
    originalRatio?: number;
  };
}

/** Preliminary interface for alias typings. */
interface FluidPaletteAliases {
  aliases: FluidPaletteAlias;
  global: {
    type: string;
    category: string;
  };
}

/**
 * Generates a list of aliases for the color palette based on the source
 * baseColor and the shades given. Calculations currently utilizes leonardo
 * package to calculate different shades
 */
export function generatePaletteAliases(
  paletteSource: FluidPaletteSource,
): FluidPaletteAliases {
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
