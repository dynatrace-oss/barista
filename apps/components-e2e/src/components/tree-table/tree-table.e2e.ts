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

import {
  treeTableRows,
  toggleButtons,
  expandChangedCount,
  expandedCount,
  collapsedCount,
  expandAllBtn,
  collapseAllBtn,
  expandChangedCountWithExpandedTrue,
  expandChangedCountWithExpandedFalse,
} from './tree-table.po';

fixture('TreeTable').page('http://localhost:4200/tree-table');

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController
    .expect(treeTableRows.count)
    .eql(3)
    .click(toggleButtons.nth(0))
    .expect(treeTableRows.count)
    .eql(5)
    .click(toggleButtons.nth(0))
    .expect(treeTableRows.count)
    .eql(3);
});

test('should increase expand and collapse counters when expandChange event was fired', async (testController: TestController) => {
  await testController
    .expect(expandChangedCount.textContent)
    .eql('0')
    .expect(expandedCount.textContent)
    .eql('0')
    .expect(collapsedCount.textContent)
    .eql('0')
    .click(toggleButtons.nth(0))
    .expect(expandChangedCount.textContent)
    .eql('1')
    .expect(expandedCount.textContent)
    .eql('1')
    .expect(collapsedCount.textContent)
    .eql('0')
    .click(toggleButtons.nth(0))
    .expect(expandChangedCount.textContent)
    .eql('2')
    .expect(expandedCount.textContent)
    .eql('1')
    .expect(collapsedCount.textContent)
    .eql('1');
});

test('should increase expand counter when expandAll was clicked', async (testController: TestController) => {
  await testController
    .expect(expandChangedCount.textContent)
    .eql('0')
    .expect(expandChangedCountWithExpandedTrue.textContent)
    .eql('0')
    .expect(expandChangedCountWithExpandedFalse.textContent)
    .eql('0')
    .expect(expandedCount.textContent)
    .eql('0')
    .expect(collapsedCount.textContent)
    .eql('0')
    .click(expandAllBtn.nth(0))
    .expect(expandChangedCount.textContent)
    .eql('2')
    .expect(expandChangedCountWithExpandedTrue.textContent)
    .eql('2')
    .expect(expandChangedCountWithExpandedFalse.textContent)
    .eql('0')
    .expect(expandedCount.textContent)
    .eql('2')
    .expect(collapsedCount.textContent)
    .eql('0')
    .click(collapseAllBtn.nth(0))
    .expect(expandChangedCount.textContent)
    .eql('4')
    .expect(expandChangedCountWithExpandedTrue.textContent)
    .eql('2')
    .expect(expandChangedCountWithExpandedFalse.textContent)
    .eql('2')
    .expect(expandedCount.textContent)
    .eql('2')
    .expect(collapsedCount.textContent)
    .eql('2');
});
