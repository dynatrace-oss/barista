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

export const treeTable = Selector('.dt-tree-table');
export const toggleButtons = Selector('.dt-tree-table-toggle');
export const treeTableRows = Selector('dt-tree-table-row');
export const expandChangedCount = Selector('.expand-changed');
export const expandChangedCountWithExpandedTrue = Selector(
  '.expand-changed-expanded-true',
);
export const expandChangedCountWithExpandedFalse = Selector(
  '.expand-changed-expanded-false',
);
export const expandedCount = Selector('.expanded');
export const collapsedCount = Selector('.collapsed');
export const expandAllBtn = Selector('.expand-all-btn');
export const collapseAllBtn = Selector('.collapse-all-btn');
