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

import { waitForAngular } from '../../utils/wait-for-angular';
import {
  clearAll,
  getFilterfieldTags,
  tagDeleteButton,
  clickOption,
  filterFieldRangePanel,
  options,
} from '../filter-field/filter-field.po';
import {
  getGroupItem,
  getGroupItemInput,
  getGroupItems,
  getSelectedItem,
  getShowMoreButton,
  getShowMoreText,
  quickFilterBackButton,
  filterFieldInput,
} from './quick-filter.po';
import { resetWindowSizeToDefault } from '../../utils';
import { Selector } from 'testcafe';

fixture('Quick Filter')
  .page('http://localhost:4200/quick-filter')
  .meta({
    'filter-field': true,
    'quick-filter': true,
    drawer: true,
    checkbox: true,
    radio: true,
  })
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('if nothing is selected the distinct should be set to all', async (testController: TestController) => {
  await testController
    .expect(getSelectedItem('AUT').textContent)
    .match(/Any/)
    .expect(getSelectedItem('USA').exists)
    .notOk();
});

test('if nothing is selected the filter field should be empty', async (testController: TestController) => {
  await testController.expect(getFilterfieldTags()).eql([]);
});

test('if distinct option gets updated it should update the filter field', async (testController: TestController) => {
  await testController
    .expect(getFilterfieldTags())
    .eql([])
    .click(getGroupItem('AUT', 'Linz'), { speed: 0.3 })
    .expect(getFilterfieldTags())
    .eql(['AUTLinz'])
    .expect(getSelectedItem('AUT').textContent)
    .match(/Linz/)
    .click(getGroupItem('AUT', 'Graz'), { speed: 0.3 })
    .expect(getFilterfieldTags())
    .eql(['AUTGraz'])
    .expect(getSelectedItem('AUT').textContent)
    .match(/Graz/);
});

test('if it is possible to select multiple options', async (testController: TestController) => {
  await testController
    .click(getGroupItem('USA', 'San Francisco'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco'])
    .click(getGroupItem('USA', 'Los Angeles'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USALos Angeles'])
    .click(getGroupItem('USA', 'New York'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USALos Angeles', 'USANew York']);
});

test('if it is possible to select and deselect multiple options', async (testController: TestController) => {
  await testController
    .click(getGroupItem('USA', 'San Francisco'))
    .click(getGroupItem('USA', 'Los Angeles'))
    .click(getGroupItem('USA', 'New York'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USALos Angeles', 'USANew York'])
    .click(getGroupItem('USA', 'San Francisco'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USALos Angeles', 'USANew York']);
});

test('if it is possible to reset all filters via the filter fields clearAll button', async (testController: TestController) => {
  await testController
    .click(getGroupItem('USA', 'San Francisco'))
    .click(getGroupItem('USA', 'Los Angeles'))
    .click(getGroupItem('USA', 'New York'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USALos Angeles', 'USANew York'])
    .click(clearAll, { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql([])
    .expect(getSelectedItem('USA').exists)
    .notOk();
});

test('if it is possible to delete an option via the filter field', async (testController: TestController) => {
  await testController
    .click(getGroupItem('USA', 'San Francisco'))
    .click(getGroupItem('USA', 'Los Angeles'))
    .click(getGroupItem('USA', 'New York'), { speed: 0.4 })
    .click(tagDeleteButton('Los Angeles'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Francisco', 'USANew York'])
    .expect(getGroupItemInput('USA', 'New York').checked)
    .ok()
    .expect(getGroupItemInput('USA', 'Los Angeles').checked)
    .notOk();
});

test('if it is possible to set free text filters via the filter field', async (testController: TestController) => {
  // Click option USA
  await clickOption(2);
  // Click option Custom
  await clickOption(4);
  await testController
    .typeText(filterFieldInput, 'San Antonio')
    .pressKey('Enter')
    .expect(getFilterfieldTags())
    .eql(['USASan Antonio']);
});

test('if it is possible to add and remove a quickfilter after a free text was set', async (testController: TestController) => {
  // Click option USA
  await clickOption(2);
  // Click option Custom
  await clickOption(4);
  await testController
    .typeText(filterFieldInput, 'San Antonio')
    .pressKey('Enter')
    .expect(getFilterfieldTags())
    .eql(['USASan Antonio'])
    .click(getGroupItem('USA', 'San Francisco'))
    .expect(getFilterfieldTags())
    .eql(['USASan Antonio', 'USASan Francisco'])
    .expect(getGroupItemInput('USA', 'San Francisco').checked)
    .ok()
    .click(tagDeleteButton('San Francisco'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['USASan Antonio'])
    .expect(getGroupItemInput('USA', 'San Francisco').checked)
    .notOk();
});

test('if it is possible to set a range filter via the filter field', async (testController: TestController) => {
  // Select the range
  await clickOption(3);
  await testController
    // Expect the range panel to be open
    .expect(filterFieldRangePanel.exists)
    .ok()
    // Fill the range panel and submit
    .typeText('#dt-filter-field-range-0-from', '5')
    .typeText('#dt-filter-field-range-0-to', '10')
    .click('button[type=submit]')
    // Expect the range tag to be set
    .expect(getFilterfieldTags())
    .eql(['Requests per minute5s - 10s']);
});

test('if it is possible to add and remove a quickfilter after a range was added', async (testController: TestController) => {
  // Select the range
  await clickOption(3);
  await testController
    // Expect the range panel to be open
    .expect(filterFieldRangePanel.exists)
    .ok()
    // Fill the range panel and submit
    .typeText('#dt-filter-field-range-0-from', '5')
    .typeText('#dt-filter-field-range-0-to', '10')
    .click('button[type=submit]')
    // Expect the range tag to be set
    .expect(getFilterfieldTags())
    .eql(['Requests per minute5s - 10s'])
    // Click the quickfilter USA San Francisco
    .click(getGroupItem('USA', 'San Francisco'))
    // Expect the USA filter to be added
    .expect(getFilterfieldTags())
    .eql(['Requests per minute5s - 10s', 'USASan Francisco'])
    // Delete the quick filter item from the filter field again
    .click(tagDeleteButton('San Francisco'), { speed: 0.4 })
    // Expect the filters to still contain the range
    .expect(getFilterfieldTags())
    .eql(['Requests per minute5s - 10s'])
    // Expect the quick filter to have the USA option  not checkt
    .expect(getGroupItemInput('USA', 'San Francisco').checked)
    .notOk();
});

fixture('Quick Filter with initial data')
  .page('http://localhost:4200/quick-filter/initial-data')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('if the initial filter in the filter field be reflected in the quick-filter state', async (testController: TestController) => {
  await testController
    .expect(getSelectedItem('AUT').textContent)
    .match(/Vienna/)
    .expect(getSelectedItem('USA').textContent)
    .match(/New York/);
});

test('if the initial filters are reflected in the filter field ', async (testController: TestController) => {
  await testController
    .expect(getFilterfieldTags())
    .eql(['AUTVienna', 'USANew York']);
});

test('when the distinct group get set to the any option, then remove the group from the filter', async (testController: TestController) => {
  await testController
    .expect(getFilterfieldTags())
    .eql(['AUTVienna', 'USANew York'])
    .click(getGroupItem('AUT', 'Any'), { speed: 0.3 })
    .expect(getFilterfieldTags())
    .eql(['USANew York'])
    .click(getGroupItem('AUT', 'Graz'), { speed: 0.3 })
    .expect(getFilterfieldTags())
    .eql(['USANew York', 'AUTGraz'])
    .expect(getSelectedItem('AUT').textContent)
    .match(/Graz/);
});

test('should be possible to change the filters via binding on the quick-filter', async (testController: TestController) => {
  await testController
    .expect(getFilterfieldTags())
    .eql(['AUTVienna', 'USANew York'])
    .click(tagDeleteButton('New York'), { speed: 0.4 })
    .expect(getFilterfieldTags())
    .eql(['AUTVienna'])
    .click(Selector('.change-filter-binding'))
    .expect(getFilterfieldTags())
    .eql(['USANew York'])
    .expect(getSelectedItem('USA').textContent)
    .match(/New York/)
    .expect(getSelectedItem('AUT').textContent)
    .match(/Any/);
});

fixture('Quick Filter with show more')
  .page('http://localhost:4200/quick-filter/examples/show-more')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should check the show more with non distinct values', async (testController: TestController) => {
  await testController
    .expect(getShowMoreText('Country'))
    .eql('There are 26 States available')
    .expect(getGroupItems('Country').count)
    .eql(4)
    .click(getShowMoreButton('Country'))
    .expect(getGroupItems('Country').count)
    .eql(30)
    .click(getGroupItem('Country', 'State 23'))
    .expect(getFilterfieldTags())
    .eql(['CountryState 23'])
    .click(quickFilterBackButton)
    .click(getGroupItem('Country', 'State 2'))
    .expect(getFilterfieldTags())
    .eql(['CountryState 23', 'CountryState 2']);
});

test('should check the show more with distinct values', async (testController: TestController) => {
  await testController
    .expect(getShowMoreText('Value'))
    .eql('There are 996 Options available')
    .expect(getGroupItems('Value').count)
    .eql(5)
    .click(getGroupItem('Value', 'Value 2'))
    .expect(getFilterfieldTags())
    .eql(['ValueValue 2'])
    .click(getShowMoreButton('Value'))
    .expect(getGroupItems('Value').count)
    .notEql(1000) // should not render all options due to virtual scrolling
    .click(getGroupItem('Value', 'Value 23'))
    .click(quickFilterBackButton)
    .expect(getFilterfieldTags())
    .eql(['ValueValue 23']);
});

fixture('Quick Filter async')
  .page('http://localhost:4200/quick-filter/async')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should work with async data and handle distincts correctly', async (testController: TestController) => {
  // Click option Aut (async)
  await clickOption(1);
  // wait for the async process to finish
  await testController.wait(1500);
  // Click option Linz
  await clickOption(1);

  // Expect the filter to be set
  await testController.expect(getFilterfieldTags()).eql(['AUT (async)Linz']);

  // Choose another option in the filter field, which will trigger the
  // quickfilter to set the filters on the filter-field, previously
  // breaking the id-mapping.
  // Click option USA
  await clickOption(2);
  // Click option Los Angeles
  await clickOption(2);
  // Expect the filter to be set
  await testController
    .expect(getFilterfieldTags())
    .eql(['AUT (async)Linz', 'USALos Angeles']);

  // Click option Aut (async)
  await clickOption(1);
  await testController
    // Expect Linz no longer in the options
    .expect(options.count)
    .eql(2)
    // Expect Vienna and Graz to still be in the list.
    .expect(options.nth(0).textContent)
    // textContent is duplicated because of the highlight within the option
    .eql('ViennaVienna')
    .expect(options.nth(1).textContent)
    // textContent is duplicated because of the highlight within the option
    .eql('GrazGraz');
});

fixture('Quick Filter check Show More functionality')
  .page('http://localhost:4200/quick-filter/show-more')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should render the correct number or checkboxes', async (testController: TestController) => {
  await testController
    .expect(getShowMoreText('Country'))
    .eql('There are 2 States available')
    .expect(getGroupItems('Country').count)
    .eql(4)
    .click(getShowMoreButton('Country'))
    .expect(getGroupItems('Country').count)
    .eql(6)
    .click(getGroupItem('Country', 'State 5'))
    .click(quickFilterBackButton)
    .expect(getGroupItems('Country').count)
    .eql(5);
});
