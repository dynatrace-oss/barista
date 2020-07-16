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

import * as rollup from 'rollup';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export function runRollup(
  options: rollup.RollupOptions,
): Observable<{ success: boolean }> {
  return from(rollup.rollup(options)).pipe(
    switchMap((bundle) => {
      const outputOptions = Array.isArray(options.output)
        ? options.output
        : [options.output];
      return from(
        Promise.all(
          (<Array<rollup.OutputOptions>>outputOptions).map((o) =>
            bundle.write(o),
          ),
        ),
      );
    }),
    map(() => ({ success: true })),
  );
}
