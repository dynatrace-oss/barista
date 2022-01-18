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
import { logging } from '@angular-devkit/core';
import { grey, green } from 'chalk';
import { fork } from 'child_process';
import { chunk } from 'lodash';
import { cpus } from 'os';

/** Collects a list of routes and get the html code of it */
export async function renderRoutes(options: {
  outputPath: string;
  routes: string[];
  renderModule: string;
  port: number;
  maxCpus?: number;
  logger: logging.LoggerApi;
}): Promise<void> {
  const { routes, renderModule, outputPath, logger, port, maxCpus } = options;
  const nodes = maxCpus || cpus().length - 2;
  const chunks = chunk(routes, Math.ceil(routes.length / nodes));

  let renderCount = 0;

  const childProcesses = chunks.map(
    (chunkRoutes) =>
      new Promise((resolve, reject) => {
        fork(renderModule, [
          outputPath,
          `http://localhost:${port}`,
          ...chunkRoutes,
        ])
          .on('message', (data) => {
            if (data.success) {
              logger.info(grey(`CREATE ${data.filePath} (${data.size} bytes)`));
              renderCount++;
            } else {
              logger.error(`Error: ${data.error.message}`);
              logger.error(`Unable to render ${data.path}`);
            }
          })
          .on('exit', resolve)
          .on('error', reject);
      }),
  );

  await Promise.all(childProcesses);

  logger.info(green(`✅ Successful rendered ${renderCount} pages!`));
}
