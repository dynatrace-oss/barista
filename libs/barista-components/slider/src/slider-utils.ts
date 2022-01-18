/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { roundToDecimal, clamp } from '@dynatrace/barista-components/core';
import {
  LEFT_ARROW,
  DOWN_ARROW,
  RIGHT_ARROW,
  UP_ARROW,
  HOME,
  END,
  PAGE_UP,
  PAGE_DOWN,
} from '@angular/cdk/keycodes';

/**
 * Returns the value that is represented by a coordinate on the slider.
 * This calculation needs all the values on the config parameter in order to work properly.
 *
 * @param config Holds the values representing the slider, and is properties on the view.
 */
export function getSliderValueForCoordinate(config: {
  coordinate: number;
  width: number;
  offset: number;
  max: number;
  min: number;
  step: number;
  roundShift: number;
}): number {
  const valueRange = config.max - config.min;
  const distanceFromStart = config.coordinate - config.offset;
  const calculatedValue =
    config.min + (distanceFromStart / config.width) * valueRange;
  const snapped = roundToSnap(
    calculatedValue,
    config.step,
    config.min,
    config.max,
  );
  return roundToDecimal(snapped, config.roundShift);
}

/**
 * The function calculates the proper value on the slider. It adds the
 * snapping behavior by rounding the value. It also clamps the value between min and max.
 *
 * @param inputValue the value that needs to be rounded
 * @param step the step value
 * @param min the minimum value
 * @param max the maximum value
 */
export function roundToSnap(
  inputValue: number,
  step: number,
  min: number,
  max: number,
): number {
  return clamp(Math.round(inputValue / step) * step, min, max);
}

/**
 * If we already have a value for the slider, this function is able to provide
 * the position of the thumb for that value.
 *
 * @param config
 */
export function getSliderPositionBasedOnValue(config: {
  value: number;
  min: number;
  max: number;
}): number {
  return (config.value - config.min) / (config.max - config.min);
}

/**
 * This function returns how the value should change based on
 * what key was pressed on the slider.
 *
 * @param max maximum value for the slider
 * @param step step value of the slider
 * @param keyCode the keyCode of the pressed key
 */
export function getKeyCodeValue(
  max: number,
  step: number,
  keyCode: number,
): number {
  switch (keyCode) {
    case LEFT_ARROW:
    case DOWN_ARROW:
      return -step;
    case RIGHT_ARROW:
    case UP_ARROW:
      return step;
    case HOME:
      return -max;
    case END:
      return max;
    case PAGE_UP:
      return step * 10;
    case PAGE_DOWN:
      return -step * 10;
    default:
      return 0;
  }
}
