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

import { resetWindowSizeToDefault, waitForAngular } from '../../utils';
import {
  dataCells,
  dragHandles,
  disableButton,
  expandButtons,
  getDragDistance,
  orderInputs,
  changeOrderButton,
  setEmptyDataButton,
  setLoadingButton,
  loadingDistractor,
  emptyState,
} from './table.po';

fixture('Table')
  .page('http://localhost:4200/table')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should only be draggable at the drag handle', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .drag(dataCells.nth(0), 0, await getDragDistance(0, 1), {
      speed: 0.2,
    })
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II');
});

test('drag - should reorder the table - drag towards last row', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .drag(dragHandles.nth(0), 0, await getDragDistance(0, 1), {
      speed: 0.2,
    })
    .expect(dataCells.nth(0).textContent)
    .eql('II')
    .expect(dataCells.nth(1).textContent)
    .eql('I');
});

test('drag - should reorder the table - drag towards first row', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .expect(dataCells.nth(2).textContent)
    .eql('III')
    .drag(dragHandles.nth(2), 0, await getDragDistance(2, 0), {
      speed: 0.2,
    })
    .expect(dataCells.nth(0).textContent)
    .eql('III')
    .expect(dataCells.nth(1).textContent)
    .eql('I')
    .expect(dataCells.nth(2).textContent)
    .eql('II');
});

test('drag - should not reorder the table if disabled', async (testController: TestController) => {
  await testController
    .click(disableButton)
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .drag(dragHandles.nth(0), 0, await getDragDistance(0, 1), {
      speed: 0.2,
    })
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II');
});

test('programmatically - should reorder the table', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .click(changeOrderButton)
    .expect(dataCells.nth(0).textContent)
    .eql('II')
    .expect(dataCells.nth(1).textContent)
    .eql('I');
});

test('programmatically - should not reorder the table if disabled', async (testController: TestController) => {
  await testController
    .click(disableButton)
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .click(changeOrderButton)
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II');
});

test('input - should reorder the table - higher index', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .typeText(orderInputs.nth(0), '1', { replace: true })
    .pressKey('enter')
    .expect(dataCells.nth(0).textContent)
    .eql('II')
    .expect(dataCells.nth(1).textContent)
    .eql('I');
});

test('input - should reorder the table - lower index', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .expect(dataCells.nth(2).textContent)
    .eql('III')
    .typeText(orderInputs.nth(2), '0', { replace: true })
    .pressKey('enter')
    .expect(dataCells.nth(0).textContent)
    .eql('III')
    .expect(dataCells.nth(1).textContent)
    .eql('I')
    .expect(dataCells.nth(2).textContent)
    .eql('II');
});

test('input - should reorder the table on blur', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .typeText(orderInputs.nth(0), '1', { replace: true })
    .click(dataCells.nth(3))
    .expect(dataCells.nth(0).textContent)
    .eql('II')
    .expect(dataCells.nth(1).textContent)
    .eql('I');
});

test('input - should keep focus after reordering', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .typeText(orderInputs.nth(0), '1', { replace: true })
    .click(dataCells.nth(3))
    .expect(dataCells.nth(0).textContent)
    .eql('II')
    .expect(dataCells.nth(1).textContent)
    .eql('I')
    .expect(orderInputs.nth(1).focused)
    .eql(true);
});

test('input - should invalidate the input', async (testController: TestController) => {
  await testController
    .typeText(orderInputs.nth(0), ' ', { replace: true })
    .expect(orderInputs.nth(0).classNames)
    .contains('dt-order-cell-input-invalid');
});

test('input - should not reorder the table if the input is invalid', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .typeText(orderInputs.nth(0), ' ', { replace: true })
    .pressKey('enter')
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II');
});

test('input - should move item to last position if the value is higher than the number of rows', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .typeText(orderInputs.nth(0), '999', { replace: true })
    .pressKey('enter')
    .expect(dataCells.nth(0).textContent)
    .eql('II')
    .expect(dataCells.nth(4).textContent)
    .eql('I');
});

test('input - should not reorder the table if disabled', async (testController: TestController) => {
  await testController
    .click(disableButton)
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .typeText(orderInputs.nth(0), '1', { replace: true })
    .pressKey('enter')
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II');
});

fixture('Default table')
  .page('http://localhost:4200/table/simple')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should show the empty state when removing the data', async (testController: TestController) => {
  await testController.click(setEmptyDataButton).expect(emptyState.exists).ok();
});

test('should not show the empty state, when loading is set', async (testController: TestController) => {
  await testController
    .click(setEmptyDataButton)
    .expect(emptyState.exists)
    .ok()
    .click(setLoadingButton)
    .expect(emptyState.exists)
    .notOk()
    .expect(loadingDistractor.exists)
    .ok();
});

fixture('Table Order Expandable')
  .page('http://localhost:4200/table/expandable')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should only be draggable at the drag handle', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .drag(dataCells.nth(0), 0, await getDragDistance(0, 1), {
      speed: 0.2,
    })
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II');
});

test('should only be draggable at the drag handle', async (testController: TestController) => {
  await testController
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .drag(orderInputs.nth(0), 0, await getDragDistance(0, 1), {
      speed: 0.2,
    })
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II');
});

test('should reorder with expanded rows', async (testController: TestController) => {
  await testController
    .click(expandButtons.nth(0))
    .expect(dataCells.nth(0).textContent)
    .eql('I')
    .expect(dataCells.nth(1).textContent)
    .eql('II')
    .drag(dragHandles.nth(0), 0, await getDragDistance(0, 1), {
      speed: 0.2,
    })
    .expect(dataCells.nth(0).textContent)
    .eql('II')
    .expect(dataCells.nth(1).textContent)
    .eql('I');
});
