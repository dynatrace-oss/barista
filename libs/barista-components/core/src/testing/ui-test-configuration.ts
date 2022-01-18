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

import { InjectionToken, ElementRef } from '@angular/core';
import { coerceElement } from '@angular/cdk/coercion';

/** Interface for Injectiontoken to set UI-test attribute to overlay Container */
export interface DtUiTestConfiguration {
  attributeName: string;
  constructOverlayAttributeValue(uiTestId: string, id: number): string;
}

/** Default configuration for setting the UI-test attribute */
export const DT_DEFAULT_UI_TEST_CONFIG: DtUiTestConfiguration = {
  attributeName: 'dt-ui-test-id',
  // eslint-disable-next-line
  constructOverlayAttributeValue(uiTestId: string, id = 0): string {
    return `${uiTestId}-overlay-${id}`;
  },
};

/** Injectiontoken of the UI-test configuration */
export const DT_UI_TEST_CONFIG = new InjectionToken<DtUiTestConfiguration>(
  'DT_UI_TEST_CONFIGURATION',
);

/** Sets the UI-test attribute to the overlay container */
export function dtSetUiTestAttribute(
  overlay: Element,
  overlayId: string | null,
  componentElement?: ElementRef | Element,
  config?: DtUiTestConfiguration,
): void {
  if (componentElement && config) {
    const element = coerceElement(componentElement);
    if (overlay && element.hasAttribute(config.attributeName) && overlayId) {
      // Angular CDK hardcoded the ID for the overlay with `cdk-overlay-{uniqueIndex}`
      const index = parseInt(overlayId.replace('cdk-overlay-', ''));
      overlay.setAttribute(
        config.attributeName,
        config.constructOverlayAttributeValue(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          element.getAttribute(config.attributeName)!,
          index,
        ),
      );
    }
  }
}
