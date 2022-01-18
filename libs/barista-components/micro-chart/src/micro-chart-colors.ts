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

import { DtColors, DtTheme } from '@dynatrace/barista-components/theming';

export interface DtMicroChartColorPalette {
  primary: string;
  darker: string;
}

const purple: DtMicroChartColorPalette = {
  primary: DtColors.PURPLE_400,
  darker: DtColors.PURPLE_600,
};

const blue: DtMicroChartColorPalette = {
  primary: DtColors.BLUE_400,
  darker: DtColors.BLUE_600,
};

const royalblue: DtMicroChartColorPalette = {
  primary: DtColors.ROYALBLUE_400,
  darker: DtColors.ROYALBLUE_600,
};

const turquoise: DtMicroChartColorPalette = {
  primary: DtColors.TURQUOISE_400,
  darker: DtColors.TURQUOISE_600,
};

const MICROCHART_PALETTES = {
  default: purple,
  purple,
  blue,
  royalblue,
  turquoise,
};

export function getDtMicrochartColorPalette(
  theme?: DtTheme,
): DtMicroChartColorPalette {
  return (
    MICROCHART_PALETTES[(theme && theme.name) || 'default'] ||
    MICROCHART_PALETTES.default
  );
}
