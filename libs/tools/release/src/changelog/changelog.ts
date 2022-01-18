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

import { promises as fs } from 'fs';
import { getNewChangelog } from './get-new-changelog';

/** Default filename for the changelog. */
export const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

/** Writes the changelog from the latest Semver tag to the current HEAD. */
export async function prependChangelogFromLatestTag(
  changelogPath: string,
  headerPartialPath: string,
  releaseName = '',
): Promise<void> {
  const headerPartial = await fs.readFile(headerPartialPath, {
    encoding: 'utf-8',
  });

  const newChangelog: string = await getNewChangelog(
    headerPartial,
    releaseName,
  );

  const previousChangelog: string = await fs.readFile(changelogPath, {
    encoding: 'utf-8',
  });

  await fs.writeFile(changelogPath, `${newChangelog}${previousChangelog}`);
}
