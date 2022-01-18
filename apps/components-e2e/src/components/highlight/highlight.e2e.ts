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
  contentFunWithFlagsButton,
  termFlagsLowercaseButton,
  termFlagsUppercaseButton,
  highlightMark,
  caseSensitiveTrueButton,
  caseSensitiveFalseButton,
  contentHaveFunWithFlagsButton,
} from './highlight.po';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Highlight')
  .page('http://localhost:4200/highlight')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should only highlight caseinsensitive matches', async (testController: TestController) => {
  await testController
    .click(contentFunWithFlagsButton)
    .click(termFlagsUppercaseButton)
    .expect(highlightMark.textContent)
    .eql('flags')
    .click(termFlagsLowercaseButton)
    .expect(highlightMark.textContent)
    .eql('flags');
});

test('should only highlight casesensitive matches', async (testController: TestController) => {
  await testController
    .click(caseSensitiveTrueButton)
    .click(contentFunWithFlagsButton)
    .click(termFlagsUppercaseButton)
    .expect(highlightMark.count)
    .eql(0)
    .click(termFlagsLowercaseButton)
    .expect(highlightMark.textContent)
    .eql('flags');
});

test('should highlight after content changes', async (testController: TestController) => {
  await testController
    .click(caseSensitiveFalseButton)
    .click(contentFunWithFlagsButton)
    .click(termFlagsUppercaseButton)
    .expect(highlightMark.textContent)
    .eql('flags')
    .click(contentHaveFunWithFlagsButton)
    .expect(highlightMark.textContent)
    .eql('flags');
});
