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

import * as conventionalChangelog from 'conventional-changelog';

/** Generates the new changelog based on the git history */
export async function getNewChangelog(
  headerPartial: string,
  releaseName: string,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: any = [];
    conventionalChangelog(
      { preset: 'angular' },
      { title: releaseName },
      null, // raw-commits options
      {}, // commit parser options
      {
        // writer options
        headerPartial,
      },
    )
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
      })
      .on('error', (err) => reject(err));
  });
}
