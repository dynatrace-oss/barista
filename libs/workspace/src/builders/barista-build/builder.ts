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

import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { green } from 'chalk';
import { existsSync, renameSync } from 'fs';
import { join } from 'path';
import { from, Observable, of } from 'rxjs';
import { catchError, finalize, mapTo, switchMap, tap } from 'rxjs/operators';
import { BaristaBuildBuilderSchema } from './schema';
import { getRoutes, renderRoutes, scheduleBuilds, startServer } from './utils';

/**
 * output file is placed in the build output next to the
 * builder file.
 */
export const RENDERER_MODULE = join(__dirname, 'renderer.js');

/** The server port where the server app is running on. */
const SERVER_PORT = 4200;

/** The main builder function to pre-render barista */
export function runBuilder(
  options: BaristaBuildBuilderSchema,
  context: BuilderContext,
): Observable<BuilderOutput> {
  const outputPath = options.outputPath;
  const routes = getRoutes(options);

  // Process id of the spawned server that should be killed
  // afterwards
  let serverProcessId: number;

  return from(scheduleBuilds(options, context)).pipe(
    tap(() => {
      // rename the original index file to avoid race conditions.
      const originalIndex = join(outputPath, 'index.html');
      if (existsSync(originalIndex)) {
        renameSync(originalIndex, join(outputPath, 'index.original.html'));
      }
    }),
    switchMap((serverModule) => startServer(serverModule, SERVER_PORT)),
    tap(({ pid }) => {
      serverProcessId = pid;
      context.logger.info(green(`Server started with PID: ${pid}`));
    }),
    switchMap(() =>
      renderRoutes({
        outputPath,
        routes,
        port: SERVER_PORT,
        renderModule: RENDERER_MODULE,
        logger: context.logger,
      }),
    ),
    mapTo({ success: true }),
    catchError((error) => {
      context.reportStatus(`Error: ${error.message}`);
      context.logger.error(error.message);
      return of({ success: false });
    }),
    finalize(() => {
      if (serverProcessId) {
        process.kill(serverProcessId);
      }
    }),
  );
}

export default createBuilder(runBuilder);
