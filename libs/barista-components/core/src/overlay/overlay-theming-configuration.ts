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

import { coerceElement } from '@angular/cdk/coercion';
import { ElementRef, InjectionToken } from '@angular/core';

export interface DtOverlayThemingConfiguration {
  className: string;
}

export const DT_DEFAULT_DARK_THEMING_CONFIG: DtOverlayThemingConfiguration = {
  className: 'dt-theme-dark',
};

export const DT_OVERLAY_THEMING_CONFIG =
  new InjectionToken<DtOverlayThemingConfiguration>(
    'DT_OVERLAY_THEMING_CONFIGURATION',
  );

export function dtSetOverlayThemeAttribute(
  overlayElement: Element,
  componentElement: ElementRef | Element,
  config: DtOverlayThemingConfiguration,
): void {
  const element = coerceElement(componentElement) as Element;

  if (!element) {
    return;
  }

  overlayElement.classList.add(config.className);
}
