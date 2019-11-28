/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
  ReadStream,
  createReadStream,
  createWriteStream,
  readFileSync,
} from 'fs';
import { Readable } from 'stream';
import { join } from 'path';

// These imports lack type definitions.
// tslint:disable:no-var-requires no-require-imports
const conventionalChangelog = require('conventional-changelog');
const merge2 = require('merge2');
// tslint:enable:no-var-requires no-require-imports

/** Prompts for a changelog release name and prepends the new changelog. */
export async function promptAndGenerateChangelog(
  changelogPath: string,
  releaseName: string,
): Promise<any> {
  return prependChangelogFromLatestTag(changelogPath, releaseName);
}

/** Writes the changelog from the latest Semver tag to the current HEAD. */
export async function prependChangelogFromLatestTag(
  changelogPath: string,
  releaseName: string,
): Promise<any> {
  const outputStream: Readable = conventionalChangelog(
    { preset: 'angular' },
    { title: releaseName },
    /* raw-commits options */ null,
    /* commit parser options */ {},
    /* writer options */ {
      headerPartial: readFileSync(
        join(
          __dirname,
          '../../../',
          'tools',
          'release',
          'src',
          'changelog-header-template.hbs',
        ),
        'utf8',
      ),
    },
  );

  // Stream for reading the existing changelog. This is necessary because we want to
  // actually prepend the new changelog to the existing one.
  const previousChangelogStream = createReadStream(changelogPath);

  return new Promise<any>((resolve, reject) => {
    // Sequentially merge the changelog output and the previous changelog stream, so that
    // the new changelog section comes before the existing versions. Afterwards, pipe into the
    // changelog file, so that the changes are reflected on file system.
    const mergedCompleteChangelog: ReadStream = merge2(
      outputStream,
      previousChangelogStream,
    );

    // Wait for the previous changelog to be completely read because otherwise we would
    // read and write from the same source which causes the content to be thrown off.
    previousChangelogStream.on('end', () => {
      mergedCompleteChangelog
        .pipe(createWriteStream(changelogPath))
        .once('error', (error: any) => {
          reject(error);
        })
        .once('finish', () => {
          resolve();
        });
    });
  });
}
