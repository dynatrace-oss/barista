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

import { CommitMessage, CommitTypes } from '../interfaces/commit-message';

/**
 * Splits the commit message string into its own components. This helps for
 * further processing of the commit messages.
 *
 * @param original Original string of the commit message.
 */
export function splitStringIntoCommitMessage(original: string): CommitMessage {
  const expression = new RegExp(
    `(?<type>${Object.values(CommitTypes).join(
      '|',
    )})(?<component>\(.*?\))?:(?<message>.*)`,
    'gims',
  );
  const matching = expression.exec(original);

  if (!matching) {
    throw new Error(`Message was not parsable: ${original}`);
  }

  const type = (
    (matching.groups && matching.groups.type) ||
    ''
  ).trim() as CommitTypes;
  const componentMatch = (
    (matching.groups && matching.groups.component) ||
    ''
  ).trim();

  const components = componentMatch
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map((component) => (component || '').trim())
    .filter(Boolean);

  const message = ((matching.groups && matching.groups.message) || '').trim();

  const breakingChange = /(^| )breaking?( change)?/gim.test(
    original.toLowerCase(),
  );

  const releaseCommit =
    /chore: bump version to ([\d|\.].*?) w\/ changelog/gim.test(
      original.toLowerCase(),
    );

  return {
    type,
    components,
    message,
    breakingChange,
    releaseCommit,
    original,
  };
}
