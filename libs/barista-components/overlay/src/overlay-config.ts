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

export class DtOverlayConfig {
  /** enables pinning the overlay */
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  pinnable?: boolean = false;

  /** Constrains movement along an axis */
  movementConstraint?: 'xAxis' | 'yAxis';

  /**
   * The originY defines the vertical attachment point for the overlay.
   * By default `center` is set. `edge` defines that the vertical attachment point is set to the bottom edge
   * if the overlay fits below the origin element and the top edge otherwise.
   */
  originY?: 'edge' | 'center' = 'center';

  /** Data passed to the overlay as the $implicit context object */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}
