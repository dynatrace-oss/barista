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
import { prompt } from 'inquirer';
import { inc, parse, ReleaseType, SemVer, valid } from 'semver';
import { recommendBump } from './recommend-bump';
import { gray, red } from 'chalk';

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
  currentVersion: SemVer,
): Promise<SemVer> {
  const recommendedBump = await recommendBump();
  const recommendVersion = inc(currentVersion.raw, recommendedBump.releaseType);

  console.log(recommendedBump.reason);
  console.log(`Proposed Version based on commits: ${recommendVersion}`);
  console.log();

  const versionChoices: Array<{
    value: string;
    name: string;
    releaseType?: ReleaseType;
  }> = [
    createVersionChoice(currentVersion, 'major', 'Major release'),
    createVersionChoice(currentVersion, 'minor', 'Minor release'),
    createVersionChoice(currentVersion, 'patch', 'Patch release'),
  ];

  // Add the possibility to create own semver version tag (pre or alpha)
  versionChoices.push({
    name: gray('I prefer a custom version:'),
    value: 'custom',
    releaseType: undefined,
  });

  let answers = await prompt<VersionPromptAnswers>([
    {
      type: 'list',
      name: 'proposedVersion',
      message: `What's the type of the new release?`,
      choices: versionChoices,
      default: versionChoices.findIndex(
        (choice) => choice.releaseType === recommendedBump.releaseType,
      ),
    },
  ]);

  if (answers.proposedVersion === 'custom') {
    answers = await prompt<VersionPromptAnswers>([
      {
        name: 'proposedVersion',
        message: `Please provide the custom version tag:`,
        validate: (input: string) => {
          if (!valid(input)) {
            console.error(red('\n✘   Please provide a valid semver tag!'));
            return false;
          }
          return true;
        },
      },
    ]);
  }

  return parse(answers.proposedVersion)!;
}

/**
 * Creates a new choice for selecting a version inside of
 * an Inquirer list prompt.
 */
export function createVersionChoice(
  currentVersion: SemVer,
  releaseType: ReleaseType,
  message: string,
  recommended = false,
): { value: string; name: string; releaseType: ReleaseType } {
  const versionName = inc(currentVersion.raw, releaseType);
  return {
    value: versionName!,
    name: `${message} (${versionName})${recommended ? ' [recommended]' : ''}`,
    releaseType,
  };
}
