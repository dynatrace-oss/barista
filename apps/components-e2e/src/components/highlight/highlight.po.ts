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

import { Selector } from 'testcafe';

export const contentFunWithFlagsButton = Selector(
  '.content-fun-with-flags-button',
);
export const contentHaveFunWithFlagsButton = Selector(
  '.content-have-fun-with-flags-button',
);
export const termFlagsUppercaseButton = Selector(
  '.term-flags-uppercase-button',
);
export const termFlagsLowercaseButton = Selector(
  '.term-flags-lowercase-button',
);
export const caseSensitiveFalseButton = Selector(
  '.case-sensitive-false-button',
);
export const caseSensitiveTrueButton = Selector('.case-sensitive-true-button');

export const highlightMark = Selector('.dt-highlight-mark');
