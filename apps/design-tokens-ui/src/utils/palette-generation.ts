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
  FluidPaletteGenerationOptions,
  FluidEasingType,
} from '@dynatrace/shared/barista-definitions';
import { easeIn, easeOut, easeInOut } from './math';

/** Applies easing of the given type and alpha to t. */
export function ease(type: FluidEasingType, alpha: number, t: number): number {
  switch (type) {
    case 'ease-in':
      return easeIn(t, alpha);
    case 'ease-out':
      return easeOut(t, alpha);
    case 'ease-in-out':
      return easeInOut(t, alpha);
  }
}

/** Combines two easing functions into one piecewise function */
export function easePiecewise(
  type1: FluidEasingType,
  alpha1: number,
  type2: FluidEasingType,
  alpha2: number,
  t: number,
): number {
  return t < 0.5
    ? ease(type1, alpha1, t * 2) * 0.5
    : ease(type2, alpha2, t * 2 - 1) * 0.5 + 0.5;
}

/** Applies easing with the given options */
export function easeWithOptions(
  t: number,
  options: FluidPaletteGenerationOptions,
): number {
  const { lowerEasing, lowerExponent, upperEasing, upperExponent } = options;
  return easePiecewise(
    lowerEasing,
    lowerExponent,
    upperEasing,
    upperExponent,
    t,
  );
}

/** Default palette generation options */
export const DEFAULT_GENERATION_OPTIONS: FluidPaletteGenerationOptions = {
  lowerEasing: 'ease-in',
  upperEasing: 'ease-out',
  lowerExponent: 2,
  upperExponent: 2,
  baseContrast: 6,
  minContrast: 1.5,
  maxContrast: 13,
};
