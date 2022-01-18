/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import axios from 'axios';
import { mkdirSync, promises as fs } from 'fs';
import { dirname, join } from 'path';

/** generates the html filename out of a route */
export function generateFileName(route: string): string {
  // If the route is the index route we don't need to wrap it in a folder
  // https://regex101.com/r/lp5RRn/1
  if (route.match(/^\/?(index)?$/gm)) {
    return 'index.html';
  }

  return join(route, 'index.html');
}

/**
 * Function that renders the provided routes and send a signal to the process that is running
 * when it succeeded or failed.
 *
 * This function will be executed via the self executed function in the bottom of this file
 * and this file will be spawned via a fork!
 *
 * @param outputPath The path where the rendered files should be written to
 * @param baseUrl The base url where the routes should be appended
 * @param routes The list of routes that should be rendered
 */
export async function render(
  outputPath: string,
  baseUrl: string,
  routes: string[],
): Promise<void> {
  for (const route of routes) {
    const fileName = generateFileName(route);
    const filePath = join(outputPath, fileName);

    try {
      const { data } = await axios.get<string>(route, {
        baseURL: baseUrl,
      });

      mkdirSync(dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, data, 'utf-8');

      if (process.send) {
        process.send({
          success: true,
          filePath,
          size: Buffer.byteLength(data).toFixed(0),
        });
      }
    } catch (error) {
      if (process.send) {
        process.send({
          success: false,
          message: error.message,
          filePath,
        });
      }
    }
  }
}

/** Renders each route that is provided via the process args */
(async () => {
  const [outputPath, baseUrl, ...routes] = process.argv.slice(2);
  await render(outputPath, baseUrl, routes);
})().catch();
