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

/** Custom bazel reporter that tells how to update snapshots */
class BazelReporter {
  /** lifecycle hook that is triggered after the run is completed */
  onRunComplete(_: any, results: any): void {
    if (results.numFailedTests && results.snapshot.failure) {
      // eslint-disable-next-line no-console
      console.log(`================================================================================

      Snapshot failed, you can update the snapshot by running
      $ bazel run ${process.env['TEST_TARGET']!.replace(/_bin$/, '')}.update
      `);
    }
  }
}

// ES module export doesn't work here
module.exports = BazelReporter;
