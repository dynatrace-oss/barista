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

import { createReadStream, createWriteStream, promises as fs } from 'fs';
import { mergeNodeStreams } from '../utils/merge-node-streams';
import { getNewChangelog } from './get-new-changelog';

/** Default filename for the changelog. */
export const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

/** Writes the changelog from the latest Semver tag to the current HEAD. */
export async function prependChangelogFromLatestTag(
  changelogPath: string,
  headerPartialPath: string,
  releaseName: string = '',
): Promise<void | Error> {
  const headerPartial = await fs.readFile(headerPartialPath, {
    encoding: 'utf-8',
  });

  const newChangelogStream: any = getNewChangelog(headerPartial, releaseName);

  // Stream for reading the existing changelog. This is necessary because we want to
  // actually prepend the new changelog to the existing one.
  const previousChangelogStream = createReadStream(changelogPath);

  // Sequentially merge the changelog output and the previous changelog stream, so that
  // the new changelog section comes before the existing versions. Afterwards, pipe into the
  // changelog file, so that the changes are reflected on file system.
  const mergedCompleteChangelog = mergeNodeStreams(
    newChangelogStream,
    previousChangelogStream,
  );

  return new Promise<void | Error>((resolve, reject) => {
    // Wait for the previous changelog to be completely read because otherwise we would
    // read and write from the same source which causes the content to be thrown off.
    previousChangelogStream.on('end', () => {
      mergedCompleteChangelog
        .pipe(createWriteStream(changelogPath))
        .once('error', (error: Error) => {
          reject(error);
        })
        .once('finish', () => {
          resolve();
        });
    });
  });
}
