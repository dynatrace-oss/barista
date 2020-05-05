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

// Originally sourced from
// https://github.com/adobe/leonardo/tree/master/packages/contrast-colors
// But it currently seems to be not usable in node:12, because of module
// loading mismatches.
/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { range } from 'd3-array';
import { scalePow, scaleLinear } from 'd3-scale';
import { rgb } from 'd3-color';
import { hsluv, interpolateHsluv } from 'd3-hsluv';
import { jab, interpolateJab } from 'd3-cam02';

/** Calculates the constrast between an input color and the base color.  */
function contrast(color: number[], base: number[], baseV: number): number {
  let colorLum = luminance(color[0], color[1], color[2]);
  let baseLum = luminance(base[0], base[1], base[2]);

  let cr1 = (colorLum + 0.05) / (baseLum + 0.05);
  let cr2 = (baseLum + 0.05) / (colorLum + 0.05);

  if (baseV < 0.5) {
    if (cr1 >= 1) {
      return cr1;
    } else {
      return cr2 * -1;
    } // Return as whole negative number
  } else {
    if (cr1 < 1) {
      return cr2;
    } else {
      return cr1 * -1;
    } // Return as whole negative number
  }
}

function cArray(c: string): number[] {
  const L: number = hsluv(c).l;
  const U: number = hsluv(c).u;
  const V: number = hsluv(c).v;

  return new Array(L, U, V);
}

function createScale(
  config: {
    swatches?: number;
    colorKeys?: string[];
    colorspace?: string;
    shift?: number;
    fullScale?: boolean;
  } = {},
): {
  colorKeys: string[] | undefined;
  colorspace: 'CAM02' | 'HSLuv';
  shift: number;
  colors: string[];
  scale: any;
  colorsHex: string[];
} {
  let {
    swatches,
    colorKeys,
    colorspace = 'CAM02',
    shift = 1,
    fullScale = true,
  } = config;
  let domains = (colorKeys || [])
    .map((key) => swatches! - swatches! * (hsluv(key).v / 100))
    .sort((a, b) => a - b)
    .concat(swatches!);

  domains.unshift(0);

  // Test logarithmic domain (for non-contrast-based scales)
  const sqrtDomains = scalePow()
    .exponent(shift)
    .domain([1, swatches!])
    .range([1, swatches!]);

  const sqrtDomainsMapped = domains.map((d) => {
    if (sqrtDomains(d) < 0) {
      return 0;
    }
    return sqrtDomains(d);
  });

  // Transform square root in order to smooth gradient
  domains = sqrtDomainsMapped;

  let sortedColor = (colorKeys || [])
    // Convert to HSLuv and keep track of original indices
    .map((c, i) => {
      return { colorKeys: cArray(c), index: i };
    })
    // Sort by lightness
    .sort((c1, c2) => c2.colorKeys[2] - c1.colorKeys[2])
    // Retrieve original RGB color
    .map((data) => colorKeys![data.index]);

  let colorsArray: any[] = [];

  let scale;
  if (colorspace == 'CAM02') {
    if (fullScale == true) {
      colorsArray = colorsArray.concat('#ffffff', sortedColor, '#000000');
    } else {
      colorsArray = colorsArray.concat(sortedColor);
    }
    colorsArray = colorsArray.map((d) => jab(d));

    scale = scaleLinear()
      .range(colorsArray)
      .domain(domains)
      .interpolate(interpolateJab);
  } else if (colorspace == 'HSLuv') {
    colorsArray = colorsArray.map((d) => hsluv(d));
    if (fullScale == true) {
      colorsArray = colorsArray.concat(
        hsluv(NaN, NaN, 100),
        sortedColor,
        hsluv(NaN, NaN, 0),
      );
    } else {
      colorsArray = colorsArray.concat(sortedColor);
    }
    scale = scaleLinear()
      .range(colorsArray)
      .domain(domains)
      .interpolate(interpolateHsluv);
  } else {
    throw new Error(`Colorspace ${colorspace} not supported`);
  }

  // tslint:disable-next-line: variable-name
  const Colors = range(swatches!).map((d) => scale(d));

  const colors = Colors.filter((el) => el != null);

  // Return colors as hex values for interpolators.
  const colorsHex: string[] = [];
  for (let i = 0; i < colors.length; i++) {
    colorsHex.push(rgb(colors[i]).hex());
  }

  return {
    colorKeys: colorKeys,
    colorspace: colorspace,
    shift: shift,
    colors: colors,
    scale: scale,
    colorsHex: colorsHex,
  };
}

// Binary search to find index of contrast ratio that is input
// Modified from https://medium.com/hackernoon/programming-with-js-binary-search-aaf86cef9cb3
function binarySearch(list: any[], value: any, baseLum: any): number {
  // initial values for start, middle and end
  let start = 0;
  let stop = list.length - 1;
  let middle = Math.floor((start + stop) / 2);

  // While the middle is not what we're looking for and the list does not have a single item
  while (list[middle] !== value && start < stop) {
    // Value greater than since array is ordered descending
    if (baseLum > 0.5) {
      // if base is light, ratios ordered ascending
      if (value < list[middle]) {
        stop = middle - 1;
      } else {
        start = middle + 1;
      }
    } else {
      // order descending
      if (value > list[middle]) {
        stop = middle - 1;
      } else {
        start = middle + 1;
      }
    }
    // recalculate middle on every iteration
    middle = Math.floor((start + stop) / 2);
  }

  // If no match, find closest item greater than value
  let closest = list.reduce((prev, curr) => (curr > value ? curr : prev));

  // if the current middle item is what we're looking for return it's index, else closest
  return list[middle] == !value ? closest : middle; // how it was originally expressed
}

/** Calculate the luminance of an rgb color. */
function luminance(r: number, g: number, b: number): number {
  let a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function generateContrastColors(
  config: {
    colorKeys?: string[];
    base?: string;
    ratios?: number[];
    colorspace?: string;
  } = {},
): string[] {
  let { colorKeys, base, ratios, colorspace = 'CAM02' } = config;
  if (!base) {
    throw new Error(`Base is undefined`);
  }
  if (!colorKeys) {
    throw new Error(`Color Keys are undefined`);
  }
  for (let i = 0; i < colorKeys.length; i++) {
    if (colorKeys[i].length < 6) {
      throw new Error(
        'Color Key must be greater than 6 and include hash # if hex.',
      );
    } else if (colorKeys[i].length == 6 && colorKeys[i].charAt(0) !== '#') {
      throw new Error('Color Key missing hash #');
    }
  }
  if (!ratios) {
    throw new Error(`Ratios are undefined`);
  }

  let swatches = 3000;

  let scaleData = createScale({
    swatches: swatches,
    colorKeys: colorKeys,
    colorspace: colorspace,
    shift: 1,
  });
  let baseV = hsluv(base).v / 100;

  const costrastRange = range(swatches).map((d) => {
    let rgbArray = [
      rgb(scaleData.scale(d)).r,
      rgb(scaleData.scale(d)).g,
      rgb(scaleData.scale(d)).b,
    ];
    let baseRgbArray = [rgb(base!).r, rgb(base!).g, rgb(base!).b];
    let ca = contrast(rgbArray, baseRgbArray, baseV).toFixed(2);

    return Number(ca);
  });

  let contrasts = costrastRange.filter((el) => el != null);

  const newColors: string[] = [];
  ratios = ratios.map(Number);

  // Return color matching target ratio, or closest number
  for (let i = 0; i < ratios.length; i++) {
    let r = binarySearch(contrasts, ratios[i], baseV);
    newColors.push(rgb(scaleData.colors[r]).hex());
  }

  return newColors;
}
