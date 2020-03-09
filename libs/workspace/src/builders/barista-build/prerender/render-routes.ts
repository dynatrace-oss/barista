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
import { logging } from '@angular-devkit/core';
import axios from 'axios';
import { grey } from 'chalk';
import { mkdirSync, promises as fs } from 'fs';
import { dirname, join } from 'path';

/** Collects a list of routes and get the html code of it */
export async function renderRoutes(config: {
  outputPath: string;
  baseURL: string;
  routes: string[];
  logger?: logging.LoggerApi;
}): Promise<number> {
  const max = config.routes.length;

  for (let i = 0; i < max; i++) {
    const route = config.routes[i];
    const { data } = await axios.get<string>(route, {
      baseURL: config.baseURL,
    });
    const fileName = generateFileName(route);
    const filePath = join(config.outputPath, fileName);

    mkdirSync(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data, 'utf-8');

    if (config.logger) {
      config.logger.info(`CREATED: ${grey(filePath)}`);
    }
  }

  return max;
}

/** generates the html filename out of a route */
function generateFileName(route: string): string {
  return join(route, 'index.html');
}
