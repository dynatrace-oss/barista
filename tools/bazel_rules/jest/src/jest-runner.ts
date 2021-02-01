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

import { copyFileSync, PathLike } from 'fs';
import { runCLI } from 'jest';
import { resolve } from 'path';
import yargs from 'yargs/yargs';

const BAZEL_NODE_RUNFILES_HELPER = process.env.BAZEL_NODE_RUNFILES_HELPER!;

const runFilesHelper = require(BAZEL_NODE_RUNFILES_HELPER);

const { update, files, config, snapshotFiles, setupFile } = yargs(
  process.argv.slice(2),
).options({
  update: { type: 'boolean', default: false },
  files: { array: true, default: [] },
  setupFile: { type: 'string' },
  config: { type: 'string', demandOption: true },
  snapshotFiles: { array: true, default: [] },
  suite: { type: 'string', demandOption: true },
}).argv;

if (snapshotFiles && snapshotFiles.length > 0) {
  // Check if it is run as test or as binary to detect where the path of the
  // snapshots files should be. For tests, it should normally be inside the bazel-out directory.
  // But if we run as nodejs_binary we want to update it in the user workspace
  process.env.BAZEL_TEST_ROOTDIR = process.env.TEST_BINARY
    ? process.cwd()
    : runFilesHelper
        .resolveWorkspaceRelative(snapshotFiles[0])
        .replace(snapshotFiles[0], '');
}

/** Main function that gets executed by the bazel nodejs_binary */
async function main(): Promise<void> {
  // Create a new config file out of an existing one or not

  const enableCoverage = !!process.env.COVERAGE_OUTPUT_FILE;

  const cliArgs: any = {
    /**
     * This is a way to avoid using the jest-haste-map fs that does not support symbolic links
     * https://github.com/facebook/metro/issues/1#issuecomment-641633646
     */
    _: files.map((f: string) => f.replace(/\.tsx?$/g, '.js')),
    $0: '',
    setupFilesAfterEnv: setupFile
      ? [resolve(setupFile).replace(/ts$/, 'js')]
      : [],
    resolver: resolve('tools/bazel_rules/jest/src/jest-resolver.js'),
    rootDir: resolve('./'),
    updateSnapshot: update,
    runTestsByPath: true,
    verbose: true,
    expand: true,
    cache: false,
    colors: true,
    coverage: enableCoverage,
  };

  if (snapshotFiles && snapshotFiles.length > 0) {
    cliArgs.snapshotResolver = resolve(
      'tools/bazel_rules/jest/src/jest-snapshot-resolver.js',
    );
  }

  const { results } = await runCLI(cliArgs, [config]);

  if (!results.success) {
    throw new Error('Failed executing jest tests');
  }

  if (enableCoverage) {
    // Copy the coverage file to where Bazel wants it to be
    copyFileSync(
      `${process.cwd()}/coverage/lcov.info`,
      process.env.COVERAGE_OUTPUT_FILE as PathLike,
    );
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
