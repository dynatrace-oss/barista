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

import { LintResult, Warning } from 'stylelint';
import { ParsedSuite, ParsedCase } from './parsed-suite.interface';

/** Creates an object that can be used to create an XML out of the provided lint result */
export function parseSuite(testSuite: LintResult): ParsedSuite {
  const name = testSuite.source;
  const failuresCount = testSuite.warnings.length;
  const testCases = testSuite.errored
    ? testSuite.warnings.map((testCase: Warning) =>
        parseFailedCase(testCase, name),
      )
    : { '@name': 'stylelint.passed' };

  return {
    testsuite: {
      '@name': name,
      '@failures': failuresCount,
      '@errors': failuresCount,
      '@tests': failuresCount || 1,
      testcase: testCases,
    },
  };
}

/** Creates an object for the failed rules that can be converted in an XML */
function parseFailedCase(testCase: Warning, testFile: string): ParsedCase {
  const { line, column, text, rule, severity } = testCase;

  return {
    '@name': rule,
    failure: {
      '@type': severity,
      '@message': text,
      '#text': `On line ${line}, column ${column} in ${testFile}`,
    },
  };
}
