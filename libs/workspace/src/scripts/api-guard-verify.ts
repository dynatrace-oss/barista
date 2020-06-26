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

import { options } from 'yargs';
import { affectedArgs } from './affected-args';
import { getAffectedProjects } from './util';
import { executeCommand } from '@dynatrace/shared/node';
import { writeFileSync } from 'fs';

export async function runApiGuardVerify(): Promise<string | null> {
  const { verifyDir, rootDir, allowModuleIdentifiers, _: inputs } = options({
    verifyDir: {
      type: 'string',
      demandOption: true,
      description: 'Read golden file structure from directory',
    },
    rootDir: {
      type: 'string',
      description: 'Specify the root directory of input files',
    },
    allowModuleIdentifiers: {
      type: 'string',
      description: 'Comma separated list of projects that should be excluded',
    },
    _: {
      type: 'array',
      description: '<entrypoint .d.ts files>',
    },
  }).argv;
  const baseSha = await affectedArgs();
  const projects = getAffectedProjects(baseSha, 'build');

  // If the components are not affected, verification does not need to run.
  if (!projects.includes('components')) {
    console.log('No components were affected, api surface has not changed');
    return null;
  }

  // Initialize the basic command that needs to be run.
  const command = ['npx ts-api-guardian', `--verifyDir ${verifyDir}`];

  // If a rootDir is given, proxy the flag to the guardian command.
  if (rootDir) {
    command.push(`--rootDir ${rootDir}`);
  }

  // If a allowModuelIdentifiers is given, proxy the flag to the guardian.
  if (allowModuleIdentifiers) {
    command.push(`--allowModuleIdentifiers ${allowModuleIdentifiers}`);
  }

  // Push all input files to the command.
  command.push(...(inputs as string[]));

  return command.join(' ');
}

// if filename is set the file is executed via an import or require.
// This should only run on direct execution with nodejs.
if (!require.main?.filename) {
  runApiGuardVerify()
    .then((command: string | null) => {
      if (command) {
        return executeCommand(command);
      }
    })
    .then(() => {
      console.log('Api guardian done, no diff found');
    })
    .catch((diff: string) => {
      writeFileSync('dist/api-diff.patch', diff);
      process.exit(1);
    });
}
