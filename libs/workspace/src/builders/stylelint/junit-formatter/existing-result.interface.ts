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

export interface ExistingResult {
  testsuites: ExistingTestSuites;
}

export interface ExistingTestSuites {
  $: { package: string };
  testsuite: ExisitingTestSuite[];
}

export interface ExisitingTestSuite {
  $: {
    name: string;
    failures: string;
    errors: string;
    tests: string;
  };
  testcase: ExisitingTestCase[];
}

export interface ExisitingTestCase {
  $: {
    name: string;
  };
  failure?: ExisitingTestcaseFailure[];
}

export interface ExisitingTestcaseFailure {
  _: string;
  $: {
    type: string;
    message: string;
  };
}
