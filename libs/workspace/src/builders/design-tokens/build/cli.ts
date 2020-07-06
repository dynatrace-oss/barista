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

// import { BuilderContext } from '@angular-devkit/architect';
import { options } from 'yargs';
// import { designTokensBuildBuilder } from './build';

async function main(): Promise<void> {
  const cliOptions = options({
    workspaceRoot: { type: 'string', default: process.cwd() },
    baseDirectory: { type: 'string', demandOption: true },
    outputPath: { type: 'string', demandOption: true },
    entrypoints: { type: 'array', demandOption: true },
    aliasesEntrypoints: { type: 'array', demandOption: true },
  }).argv;

  // console.log(process.env);
  console.log(cliOptions);

  // const result = await designTokensBuildBuilder(
  //   {
  //     outputPath: cliOptions.outputPath,
  //     baseDirectory: cliOptions.baseDirectory,
  //     entrypoints: cliOptions.entrypoints as string[],
  //     aliasesEntrypoints: cliOptions.aliasesEntrypoints as string[],
  //   },
  //   { workspaceRoot: cliOptions.workspaceRoot } as BuilderContext,
  // ).toPromise();

  // if (result.error) {
  //   throw new Error('Failed to build');
  // }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
