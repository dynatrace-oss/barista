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

import { JsonObject } from '@angular-devkit/core';

export interface BaristaBuildBuilderSchema extends JsonObject {
  /** Target to build. */
  browserTarget: string;
  /** Server target to use for rendering the app. */
  serverTarget: string;
  /** The output path of the generated files. */
  outputPath: string;
  /** Path to the file that holds the route information.  */
  routesFile?: string;
  /** Comma separated list of routes.  */
  routes?: string[];
}
