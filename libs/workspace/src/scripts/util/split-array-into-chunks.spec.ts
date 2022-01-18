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

import { splitArrayIntoChunks } from './split-array-into-chunks';

it('should split all the targets into the correct chunks', () => {
  const projects = [
    'components',
    'components-e2e',
    'universal',
    'demos',
    'dev',
    'barista-design-system',
  ];

  const chunkSize = Math.ceil(projects.length / 4);
  expect(splitArrayIntoChunks(projects, chunkSize)).toEqual([
    ['components', 'components-e2e'],
    ['universal', 'demos'],
    ['dev', 'barista-design-system'],
  ]);
});

it('should split into chunks even if less targets are affected', () => {
  const projects = ['components', 'components-e2e'];

  const chunkSize = Math.ceil(projects.length / 4);
  expect(splitArrayIntoChunks(projects, chunkSize)).toEqual([
    ['components'],
    ['components-e2e'],
  ]);
});
