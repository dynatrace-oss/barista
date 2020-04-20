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

/** Preliminary interface for the source of a generated palette. */
export interface FluidPaletteSource {
  aliases: FluidPaletteSourceAlias[];
}

export interface FluidPaletteSourceAlias {
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
  shades: FluidPaletteSourceShade[];
  /** Function easing options */
  generationOptions: FluidPaletteGenerationOptions;
}

/** Definition for a shade of color */
export interface FluidPaletteSourceShade {
  /** Name of the shade. */
  name: string;
  /** Target contrast ratio level. */
  ratio: number;
  /** Comment for this particular alias. */
  comment: string;
  /** Output alias name. */
  aliasName: string;
}

export interface FluidPaletteAlias {
  [aliasName: string]: {
    value: string;
    comment?: string;
    originalRatio?: number;
  };
}

/** Preliminary interface for alias typings. */
export interface FluidPaletteAliases {
  aliases: FluidPaletteAlias;
  global: {
    type: string;
    category: string;
  };
}

export type FluidEasingType = 'ease-in' | 'ease-out' | 'ease-in-out';

/** Data required for automated palette generation */
export interface FluidPaletteGenerationOptions {
  /** Easing type for the contrast values under the base contrast */
  lowerEasing: FluidEasingType;
  /** Easing type for the contrast values above the base contrast */
  upperEasing: FluidEasingType;
  /** Easing exponent for the contrast values under the base contrast */
  lowerExponent: number;
  /** Easing exponent for the contrast values above the base contrast */
  upperExponent: number;
  /** Middle contrast value used for generating the base color */
  baseContrast: number;
  /** Minimum contrast value */
  minContrast: number;
  /** Maximum contrast value */
  maxContrast: number;
}
