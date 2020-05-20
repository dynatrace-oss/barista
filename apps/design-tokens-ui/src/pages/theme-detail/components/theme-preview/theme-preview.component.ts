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

import { Component, Input } from '@angular/core';
import { Palette } from '@dynatrace/design-tokens-ui/shared';
import { getTextColorOnBackground } from '../../../../utils/colors';

@Component({
  selector: 'design-tokens-ui-theme-preview',
  templateUrl: './theme-preview.component.html',
  styleUrls: ['./theme-preview.component.scss'],
  host: {
    '[class.design-tokens-ui-gaps]': 'gaps',
  },
})
export class ThemePreviewComponent {
  /** Palettes of the current theme */
  @Input() palettes: Palette[];

  /** Whether to show gaps between the palette colors */
  @Input() gaps: boolean;

  /** @internal */
  _getTextColorOnBackground(color: string): string {
    return getTextColorOnBackground(color);
  }
}
