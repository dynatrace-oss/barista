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

import { yellow } from 'chalk';
import { prompt } from 'inquirer';

/**
 * Prompts the user whether he is sure that the script should continue publishing
 * the release to NPM.
 */
export async function promptConfirmReleasePublish(): Promise<void> {
  if (!(await promptConfirm('Are you sure that you want to release now?'))) {
    console.log();
    console.log(yellow('Aborting publish...'));
    process.exit(0);
  }
}

/** Prompts the user with a confirmation question and a specified message. */
export async function promptConfirm(message: string): Promise<boolean> {
  return (
    await prompt<{ result: boolean }>({
      type: 'confirm',
      name: 'result',
      message: message,
    })
  ).result;
}
