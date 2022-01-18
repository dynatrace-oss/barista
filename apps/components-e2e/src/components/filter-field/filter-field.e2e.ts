/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import {
  clickOption,
  errorBox,
  input,
  clearAll,
  filterTags,
  focusFilterFieldInput,
  getFilterfieldTags,
  tagOverlay,
  setupSecondTestScenario,
  filterFieldRangePanel,
  clickMultiSelectOption,
  multiSelectApply,
  multiSelectPanel,
  switchToSecondDatasource,
  setupMultiselectEditScenario,
  options,
} from './filter-field.po';
import { Selector } from 'testcafe';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Filter Field')
  .page('http://localhost:4200/filter-field')
  .beforeEach(async () => {
    await waitForAngular();
    await resetWindowSizeToDefault();
  });

test('should not show a error box if there is no validator provided', async () => {
  await clickOption(1).typeText(input, 'abc').expect(errorBox.exists).notOk();
});

test('should show a error box if does not meet the validation function', async () => {
  await clickOption(3)
    .typeText(input, 'a', { speed: 0.1 })
    // Wait for the filter field to refresh the error message.
    .wait(250)
    .expect(errorBox.exists)
    .ok()
    .expect(errorBox.innerText)
    .match(/min 3 characters/gm);
});

test('should show is required error when the input is dirty', async () => {
  await clickOption(3)
    .typeText(input, 'a', { speed: 0.1 })
    .pressKey('backspace', { speed: 0.1 })
    .expect(errorBox.exists)
    .ok()
    .expect(errorBox.innerText)
    .match(/field is required/gm);
});

test('should hide the error box when the node was deleted', async () => {
  await clickOption(3)
    .pressKey('backspace')
    .pressKey('backspace')
    .expect(errorBox.exists)
    .notOk();
});

test('should show the error box when the user tries to submit an empty value', async () => {
  await clickOption(3)
    .pressKey('enter', { speed: 0.1 })
    .expect(errorBox.exists)
    .ok()
    .expect(errorBox.innerText)
    .match(/field is required/gm);
});

test('should remove all filters when clicking the clear-all button', async () => {
  // Create a new filter by clicking the outer- and inner-option
  await clickOption(4);
  await clickOption(1)
    // Click somewhere outside so the clear-all button appears
    .click(Selector('.outside'))
    .wait(300)
    .expect(clearAll.exists)
    .ok()
    // Click the clear all-button, the created filter should be removed
    .click(clearAll)
    .wait(300)
    .expect(filterTags.exists)
    .notOk();
});

test('should choose a freetext node with the keyboard and submit the correct value', async (testController: TestController) => {
  // Focus the filter field.
  await focusFilterFieldInput();

  // Select the test autocomplete
  await testController
    .pressKey('down down down down enter')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the free text node and start typing
    .pressKey('down down down enter')
    .typeText(input, 'Custom selection')
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250)
    // Confirm the text typed in
    .pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text optionsCustom selection');
});

test('should choose a freetext node with the keyboard and submit an empty value', async (testController: TestController) => {
  // Focus the filter field.
  await focusFilterFieldInput();

  // Select the test autocomplete
  await testController
    .pressKey('down down down down enter')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the free text node and start typing
    .pressKey('down down down enter')
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250)
    // Confirm the text typed in
    .pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text options');
});

test('should choose a freetext node with the keyboard and submit an empty value immediately', async (testController: TestController) => {
  await focusFilterFieldInput();

  // Select the test autocomplete
  await testController
    .pressKey('down down down down enter')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the free text node and start typing
    .pressKey('down down down enter')
    // Focus the filter field
    .pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text options');
});

test('should choose a freetext node with the mouse and submit the correct value immediately', async (testController: TestController) => {
  // Select the test autocomplete
  await clickOption(5)
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250);

  // Select the free text node and start typing
  await clickOption(4)
    // Wait for a certain amount fo time to let the filterfield refresh
    .wait(250)
    // Send the correct value into the input field
    .typeText(input, 'Custom selection');

  // Focus the filter field
  await focusFilterFieldInput();

  // Submit the value immediately
  await testController.pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .match(/Autocomplete with free text options/);
});

test('should choose a freetext node with the mouse and submit an empty value immediately', async (testController: TestController) => {
  // Select the test autocomplete
  await clickOption(5)
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250);

  // Select the free text node and start typing
  await clickOption(4)
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250);

  // Confirm the text typed in
  await focusFilterFieldInput();

  // Submit the empty value immediately
  await testController.pressKey('enter');

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('Autocomplete with free text options')

    // Click somewhere outside so the clear-all button appears
    .click(Selector('.outside'))
    .wait(300)
    .expect(clearAll.exists)
    .ok()
    // Click the clear all-button, the created filter should be removed
    .click(clearAll)
    .wait(300)
    .expect(filterTags.exists)
    .notOk();
});

test('should not show the overlay on a tag because the tag value is not ellipsed', async () => {
  await clickOption(1)
    .typeText(input, 'abcdefghijklmno')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the free text node and start typing
    .pressKey('enter')
    .wait(250)
    // Hover the filter field tag
    .hover(filterTags)
    .expect(tagOverlay.exists)
    .notOk();
});

test('should show the overlay on a tag because the tag value is ellipsed', async () => {
  await clickOption(1)
    .typeText(
      input,
      'abcdefghijklmnopqrstuvwxyz, 1234567890, abcdefghijklmnopqrstuvwxyz',
    )
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the free text node and start typing
    .pressKey('enter')
    .wait(250)
    // Hover the filter field tag
    .hover(filterTags)
    .expect(tagOverlay.exists)
    .ok();
});

test('should remove all removable filters when clicking the clear-all button', async (testController: TestController) => {
  // Setup the second datasource.
  await testController
    .click(setupSecondTestScenario)
    // Wait for the filterfield to catch up.
    .wait(500);

  // Manually set an option, because this seems to break the
  // clear all change detection.
  await clickOption(1);
  await clickOption(1)
    .expect(filterTags.count)
    .eql(2)
    // Click somewhere outside so the clear-all button appears
    .click(Selector('.outside'))
    // Wait for the filterfield to catch up.
    .wait(500)
    .expect(clearAll.exists)
    .ok()
    // Click the clear all-button, the created filter should be removed
    .click(clearAll)
    // Wait for the filterfield to catch up.
    .wait(500)
    .expect(filterTags.count)
    .eql(1);
});

test('should close the range when blurring the filter field mid filter, returning back and deleting the current filter', async (testController: TestController) => {
  // Setup the second datasource.
  await testController
    .click(setupSecondTestScenario)
    // Wait for the filterfield to catch up.
    .wait(500);

  await clickOption(2);

  await testController
    .click(Selector('.outside'))
    .expect(filterFieldRangePanel.exists)
    .notOk();

  // Focus the filter field again,
  // press backspace - deleting the current filter
  // the range should now be closed.
  await focusFilterFieldInput();
  await testController
    .expect(filterFieldRangePanel.exists)
    .ok()
    .wait(250)
    .pressKey('backspace')
    .wait(250)
    .expect(filterFieldRangePanel.exists)
    .notOk();
});

test('should choose a multiselect node with the keyboard and submit the correct value', async (testController: TestController) => {
  await testController
    .click(switchToSecondDatasource)
    // Wait for the filterfield to catch up.
    .wait(500);

  // Focus the filter field.
  await focusFilterFieldInput();

  // Select the test autocomplete
  await testController
    // Select the multiselect node
    .pressKey('down down down enter')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250)
    // Select the desired option
    .pressKey('down space enter')
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250);

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .eql('SeasoningKetchup');
});

test('should not apply an empty multiselect node with the keyboard', async (testController: TestController) => {
  await testController
    .click(switchToSecondDatasource)
    // Wait for the filterfield to catch up.
    .wait(500);

  // Focus the filter field.
  await focusFilterFieldInput();

  // Select the test autocomplete
  await testController
    // Select the multiselect node
    .pressKey('down down down enter')
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250)
    // Try to apply without any option
    .pressKey('enter')
    // Wait for a certain amout fo time to let the filterfield refresh
    .wait(250);

  const tags = await getFilterfieldTags();

  await testController.expect(tags.length).eql(0);
});

test('should choose a multiselect node with the mouse and submit the correct value immediately', async (testController: TestController) => {
  // Switch to second datasource.
  await testController
    .click(switchToSecondDatasource)
    // Wait for the filterfield to catch up.
    .wait(500);

  // Select the multiSelect
  await clickOption(4)
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250);

  // Select the multiSelect option
  await clickMultiSelectOption(3).wait(250);

  // Submit the value immediately
  await testController.click(multiSelectApply).wait(250);

  const tags = await getFilterfieldTags();

  await testController
    .expect(tags.length)
    .eql(1)
    .expect(tags[0])
    .match(/SeasoningMustard/);
});

test('should keep selected an option as it was previously set by default', async (testController: TestController) => {
  // Switch to second datasource.
  await testController
    .click(setupMultiselectEditScenario)
    // Wait for the filterfield to catch up.
    .wait(500);

  const tag = await filterTags();

  await testController.click(tag);

  const currentOptionsCount = await options().find('input:checked').count;

  await testController.expect(currentOptionsCount).eql(2);
});

test('should not apply an empty multiselect node with the mouse', async (testController: TestController) => {
  // Switch to second datasource.
  await testController
    .click(switchToSecondDatasource)
    // Wait for the filterfield to catch up.
    .wait(500);

  // Select the multiSelect
  await clickOption(4)
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250);

  // Submit the value immediately
  await testController.click(multiSelectApply).wait(250);

  // panel should not have closed
  await testController.expect(multiSelectPanel.exists).ok();
});

test('should close the multiselect when blurring the filter field mid filter, returning back and deleting the current filter', async (testController: TestController) => {
  // Switch to second datasource.
  await testController
    .click(switchToSecondDatasource)
    // Wait for the filterfield to catch up.
    .wait(500);

  // Select the multiSelect
  await clickOption(4)
    // Wait for a certain amount of time to let the filterfield refresh
    .wait(250);

  await testController
    .click(Selector('.outside'))
    .expect(multiSelectPanel.exists)
    .notOk();

  // Focus the filter field again,
  // press backspace - deleting the current filter
  // the multiSelect should now be closed.
  await focusFilterFieldInput();
  await testController
    .expect(multiSelectPanel.exists)
    .ok()
    .wait(250)
    .pressKey('backspace')
    .wait(250)
    .expect(multiSelectPanel.exists)
    .notOk();
});

test('should be able to apply without editing any selection when an option was previously selected', async (testController: TestController) => {
  // Switch to second datasource.
  await testController
    .click(setupMultiselectEditScenario)
    // Wait for the filterfield to catch up.
    .wait(500);

  const tag = await filterTags();

  await testController
    // Click on tag to open the panel
    .click(tag)
    .wait(250)
    // Panel should be open
    .expect(multiSelectPanel.exists)
    .ok()
    // Click on apply button
    .click(multiSelectApply)
    .wait(250)
    // Panel should be closed
    .expect(multiSelectPanel.exists)
    .notOk();
});
