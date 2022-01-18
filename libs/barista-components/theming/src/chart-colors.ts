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

import { DtColors } from './colors';
import { DtTheme } from './theme';

// Threshold to determine the color palette used
const DT_CHART_THEME_COLOR_MAX_LENGTH = 3;

export const DT_CHART_COLOR_PALETTE_ORDERED: string[] = [
  DtColors.PURPLE_600 /* 1 */,
  DtColors.YELLOW_200 /* 2 */,
  DtColors.TURQUOISE_400 /* 3 */,
  DtColors.PURPLE_200 /* 4 */,
  DtColors.ORANGE_500 /* 5 */,
  DtColors.YELLOW_500 /* 6 */,
  DtColors.ROYALBLUE_600 /* 7 */,
  DtColors.ORANGE_300 /* 8 */,
  DtColors.PURPLE_400 /* 9 */,
  DtColors.ORANGE_200 /* 10 */,
  DtColors.TURQUOISE_600 /* 11 */,
  DtColors.ROYALBLUE_300 /* 12 */,
  DtColors.YELLOW_700 /* 13 */,
  DtColors.TURQUOISE_200 /* 14 */,
  DtColors.ROYALBLUE_400 /* 15 */,
];

/** Chart colors for the purple theme up to 3 metrics */
const DT_COLOR_PALETTE_PURPLE: string[] = [
  DtColors.PURPLE_700,
  DtColors.PURPLE_200,
  DtColors.PURPLE_400,
];

/** Chart colors for the royalblue theme up to 3 metrics */
const DT_COLOR_PALETTE_ROYALBLUE: string[] = [
  DtColors.ROYALBLUE_800,
  DtColors.ROYALBLUE_200,
  DtColors.ROYALBLUE_400,
];

/** Chart colors for the blue theme up to 3 metrics */
const DT_COLOR_PALETTE_BLUE: string[] = [
  DtColors.BLUE_700,
  DtColors.BLUE_200,
  DtColors.BLUE_400,
];

export const DT_CHART_COLOR_PALETTES = {
  purple: DT_COLOR_PALETTE_PURPLE,
  royalblue: DT_COLOR_PALETTE_ROYALBLUE,
  blue: DT_COLOR_PALETTE_BLUE,
};

/** Return correct color palette depending on the number of metrics */
export function getDtChartColorPalette(
  nrOfMetrics: number,
  theme?: DtTheme,
): string[] {
  let palette = DT_CHART_COLOR_PALETTE_ORDERED;

  if (theme && theme.name && DT_CHART_COLOR_PALETTES[theme.name]) {
    palette = DT_CHART_COLOR_PALETTES[theme.name];
  }

  return nrOfMetrics <= DT_CHART_THEME_COLOR_MAX_LENGTH
    ? palette
    : DT_CHART_COLOR_PALETTE_ORDERED;
}
