/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { ElementRef, InjectionToken } from '@angular/core';

/** Default UI test Attributename */
export const UI_TEST_ID = 'uitestid';

/** Interface for Injectiontoken to set UI test attribute to overlay Container */
export interface DtUiTestConfiguration {
  attributeName: string;
  setOverlayAttributeValue(param: string): string;
}

/** Default function for setting the UI test attribute */
export const DT_DEFAULT_UI_TEST_CONFIG: DtUiTestConfiguration = {
  attributeName: UI_TEST_ID,
  setOverlayAttributeValue(param: string): string {
    return `${param}-overlay`;
  },
};

/** Injectiontoken for the DtUiTestConfiguration interface */
export const DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG = new InjectionToken<
  DtUiTestConfiguration
>('DT_UI_TEST_CONFIGURATION');

/** Sets the UI test attribute to the overlay container */
export function setUiTestAttribute(
  element: ElementRef,
  overlay: Element,
  config: DtUiTestConfiguration,
): void {
  if (
    element &&
    overlay &&
    element.nativeElement.hasAttribute(config.attributeName)
  ) {
    overlay.setAttribute(
      config.attributeName,
      config.setOverlayAttributeValue(config.attributeName),
    );
  }
}
