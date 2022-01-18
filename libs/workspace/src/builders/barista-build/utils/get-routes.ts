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

import { BaristaBuildBuilderSchema } from '../schema';
import { EOL } from 'os';
import { readFileSync } from 'fs';

/** Extract the route information out of the builder options */
export function getRoutes(options: BaristaBuildBuilderSchema): string[] {
  let routes: string[] = options.routes || ['/'];

  if (options.routesFile) {
    routes = routes.concat(
      readFileSync(options.routesFile, 'utf-8')
        .split(EOL)
        .map((route) => route.trim())
        .filter((route) => route?.length),
    );
  }

  return [...new Set(routes)];
}
