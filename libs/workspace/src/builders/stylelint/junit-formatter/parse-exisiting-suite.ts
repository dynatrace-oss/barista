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
import {
  ExisitingTestSuite,
  ExisitingTestCase,
} from './existing-result.interface';
import { ParsedSuite, ParsedCase } from './parsed-suite.interface';

/** Parses an existing XML Test suite to a parsed suite definition */
export function parseExistingSuite(suite: ExisitingTestSuite): ParsedSuite {
  return {
    testsuite: {
      '@name': suite.$.name,
      '@failures': +suite.$.failures,
      '@errors': +suite.$.errors,
      '@tests': +suite.$.tests,
      testcase: parseExistingCases(suite.testcase || []),
    },
  };
}

/** Parses existing test cases to the parsed case definition */
function parseExistingCases(testCases: ExisitingTestCase[]): ParsedCase[] {
  return testCases.map((testCase) => {
    const parsedCase: ParsedCase = { '@name': testCase.$.name };

    if (testCase.failure && testCase.failure.length) {
      parsedCase.failure = testCase.failure.map((failure) => ({
        '#text': failure._.trim(),
        '@message': failure.$.message,
        '@type': failure.$.type,
      }));
    }

    return parsedCase;
  });
}
