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

import { BaUxdNode } from '@dynatrace/shared/design-system/interfaces';

export const nodes: BaUxdNode[] = [
  {
    id: 1,
    order: 1,
    start: true,
    tasknode: false,
    text: 'startnode',
    path: [{ text: 'not so sure', uxd_node: 2 }],
  },
  {
    id: 2,
    order: 0,
    start: false,
    tasknode: false,
    text: 'first node',
    path: [
      { text: 'yes', uxd_node: 3 },
      { text: 'no', uxd_node: 4 },
    ],
  },
  {
    id: 3,
    order: 0,
    start: false,
    tasknode: false,
    text: 'second node',
    path: [{ text: 'got it', uxd_node: 4 }],
  },
  {
    id: 4,
    order: 0,
    start: false,
    tasknode: true,
    text: 'task node',
    path: [],
  },
];

export const wrongIdNode: BaUxdNode = {
  id: 5,
  order: 0,
  start: false,
  tasknode: false,
  path: [
    {
      uxd_node: 6,
      text: 'got it',
    },
  ],
  text: 'wrong node',
};
