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

import { LintResult } from 'stylelint';
import { create } from 'xmlbuilder';
import { parseSuite } from './parse-suite';
import { ParsedSuite } from './parsed-suite.interface';

/** Junit formatter for stylelint */
export function junitFormatter(stylelintResults: LintResult[]): string {
  const parsedResults = stylelintResults.map((result) => parseSuite(result));

  return createXML(parsedResults);
}

/** Creates an XML out of the provided object structure */
export function createXML(testSuites: ParsedSuite[]): string {
  const xmlRoot = create('testsuites', { encoding: 'utf-8' }).att(
    'package',
    'stylelint.rules',
  );

  return testSuites.length > 0
    ? xmlRoot.element(testSuites).end({ pretty: true })
    : xmlRoot.end({ pretty: true });
}
