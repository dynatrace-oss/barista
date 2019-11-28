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

import { prompt } from 'inquirer';

import { ReleaseType, createNewVersion } from './create-version';
import { Version, parseVersionName } from './parse-version';

// These imports lack type definitions.
// tslint:disable:no-var-requires no-require-imports
const conventionalRecommendedBump = require(`conventional-recommended-bump`);
// tslint:enable:no-var-requires no-require-imports

/** Answers that will be prompted for. */
interface VersionPromptAnswers {
  proposedVersion: string;
}

/**
 * Prompts the current user-input interface for a new version name.
 * The new version will be validated to be a proper increment of the
 * specified current version.
 */
export async function promptForNewVersion(
  currentVersion: Version,
): Promise<Version> {
  const recommendedBump = await recommendBump();
  const recommendVersion = createNewVersion(
    currentVersion,
    recommendedBump.releaseType,
  );

  console.log(recommendedBump.reason);
  console.log(
    `Proposed Version based on commits: ${recommendVersion.format()}`,
  );
  console.log();

  const versionChoices: Array<{
    value: string;
    name: string;
    releaseType: ReleaseType;
  }> = [
    createVersionChoice(currentVersion, 'major', 'Major release'),
    createVersionChoice(currentVersion, 'minor', 'Minor release'),
    createVersionChoice(currentVersion, 'patch', 'Patch release'),
  ];

  const answers = await prompt<VersionPromptAnswers>([
    {
      type: 'list',
      name: 'proposedVersion',
      message: `What's the type of the new release?`,
      choices: versionChoices,
      default: versionChoices.findIndex(
        choice => choice.releaseType === recommendedBump.releaseType,
      ),
    },
  ]);

  return parseVersionName(answers.proposedVersion)!;
}

/**
 * Creates a new choice for selecting a version inside of
 * an Inquirer list prompt.
 */
function createVersionChoice(
  currentVersion: Version,
  releaseType: ReleaseType,
  message: string,
  recommended: boolean = false,
): { value: string; name: string; releaseType: ReleaseType } {
  const versionName = createNewVersion(currentVersion, releaseType).format();
  return {
    value: versionName,
    name: `${message} (${versionName})${recommended ? ' [recommended]' : ''}`,
    releaseType,
  };
}

/**
 * Returns an object containing information for the
 * recommended version bump.
 */
async function recommendBump(): Promise<{
  level: number;
  reason: string;
  releaseType: ReleaseType;
}> {
  return new Promise<any>((resolve, reject) => {
    conventionalRecommendedBump(
      { preset: 'angular' },
      (error, recommendation) => {
        if (error) {
          reject(error);
        } else {
          resolve(recommendation);
        }
      },
    );
  });
}
