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

import { BaIconsChangelog } from '../types';

const modeMessageMap = new Map<string, string>([
  ['ADD', 'Added'],
  ['PUBLISHED', 'Published'],
  ['MOVE', 'Moved'],
  ['MODIFY', 'Modified'],
  ['DELETE', 'Removed'],
  ['UNPUBLISHED', 'Unpublished'],
]);

/** Converts the json changelog to a markdown readable changelog. */
export function convertJsonChangelogToMarkdown(
  jsonChangelog: BaIconsChangelog,
): string {
  // Generate the header
  const mdOutput = ['# Iconpack changelog', '', ''];
  const changeEntries = Object.entries(jsonChangelog).reverse();
  for (const [version, changes] of changeEntries) {
    mdOutput.push(`## Version ${version}`);
    if (changes.length === 0) {
      mdOutput.push(
        '',
        'This version contained no changes to the icons themselves, but rather build or optimization changes.',
        '',
      );
      continue;
    }
    const changesList = changes
      .map(
        (change) =>
          `* ${modeMessageMap.get(change.mode)} [${
            change.name
          }](/resources/icons/${change.name})`,
      )
      .filter(Boolean)
      .sort((a, b) => a!.localeCompare(b!));
    mdOutput.push('', ...(changesList as string[]), '');
  }
  return mdOutput.join('\n');
}
