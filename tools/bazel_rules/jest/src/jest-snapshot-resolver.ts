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

import { join, parse, relative } from 'path';

const rootDir = process.env.BAZEL_TEST_ROOTDIR!;

/**
 * Resolver for snapshot tests with Bazel. The test .js files are generated in
 * a Bazel temp directory, but we need to access the snapshots in the workspace
 * since Jest needs to be able to overwrite the original snapshot files instead
 * of the copies in the Bazel directory.
 */
module.exports = {
  /** Resolves from test to snapshot path. */
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) => {
    const relativeTestPath = relative(process.cwd(), testPath);
    const { dir, base } = parse(relativeTestPath);
    const snapshotPath = join(
      rootDir,
      dir,
      '__snapshots__',
      `${base}${snapshotExtension}`,
    );
    return snapshotPath;
  },

  /** resolves from snapshot to test path */
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    const relativeTestPath = relative(rootDir, snapshotFilePath)
      .replace('__snapshots__', '')
      .replace(snapshotExtension, '');

    return join(process.cwd(), relativeTestPath);
  },

  testPathForConsistencyCheck: join(
    process.cwd(),
    'tools/bazel_rules/jest/src/jest-path-consistency-check.test.ts',
  ),
};
