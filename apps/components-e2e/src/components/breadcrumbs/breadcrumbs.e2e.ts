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
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

const btnChangeBreadcrumbs = Selector(`#change-breadcrumbs`);
const btnHideBreadcrumbs = Selector(`#hide-breadcrumbs`);
const visibleBreadcrumbs = Selector(`dt-breadcrumbs .dt-breadcrumbs-item`);
const btnToggleOverlay = Selector(
  `dt-breadcrumbs .dt-breadcrumb-collapsed-trigger`,
);
const transplantedBreadcrumbsContainer = Selector(
  `.cdk-overlay-pane .dt-breadcrumb-collapsed-container`,
);
const transplantedBreadcrumbs = Selector(
  `.dt-breadcrumb-collapsed-container .dt-breadcrumbs-item`,
);

fixture('Breadcrumbs')
  .page('http://localhost:4200/breadcrumbs')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should display all breadcrumbs', async (testController: TestController) => {
  await testController
    .expect(visibleBreadcrumbs.count)
    .eql(4)
    .expect(btnToggleOverlay.exists)
    .notOk();
});

test('should hide first two breadcrumbs if the overlay toggle needs more space', async (testController: TestController) => {
  await testController
    .expect(visibleBreadcrumbs.count)
    .eql(4)
    .expect(btnToggleOverlay.exists)
    .notOk()
    .resizeWindow(850, 800)
    .expect(btnToggleOverlay.exists)
    .ok()
    .expect(visibleBreadcrumbs.count)
    .eql(2);
});

test('should hide the first breadcrumb if the overlay toggle is smaller than the first breadcrumb', async (testController: TestController) => {
  await testController
    .click(btnChangeBreadcrumbs)
    .expect(visibleBreadcrumbs.count)
    .eql(4)
    .expect(btnToggleOverlay.exists)
    .notOk()
    .resizeWindow(960, 800)
    .expect(btnToggleOverlay.exists)
    .ok()
    .expect(visibleBreadcrumbs.count)
    .eql(3);
});

test('should open and close the overlay with transplanted breadcrumbs', async (testController: TestController) => {
  await testController
    .expect(btnToggleOverlay.exists)
    .notOk()
    .resizeWindow(850, 800)
    .expect(btnToggleOverlay.exists)
    .ok()
    .click(btnToggleOverlay)
    .expect(transplantedBreadcrumbsContainer.exists)
    .ok()
    .expect(transplantedBreadcrumbs.count)
    .eql(2)
    .click(btnToggleOverlay)
    .expect(transplantedBreadcrumbsContainer.exists)
    .notOk();
});

test('should set ellipsis on last visible item', async (testController: TestController) => {
  await testController
    .expect(btnToggleOverlay.exists)
    .notOk()
    .resizeWindow(500, 800)
    .expect(visibleBreadcrumbs.count)
    .eql(1)
    .expect(visibleBreadcrumbs.nth(0).classNames)
    .contains(`dt-breadcrumbs-item-ellipsis`);
});

test('should hide breadcrumbs if none are left to render', async (testController: TestController) => {
  await testController
    .expect(btnToggleOverlay.exists)
    .notOk()
    .resizeWindow(500, 800)
    .expect(visibleBreadcrumbs.count)
    .eql(1)
    .click(btnHideBreadcrumbs)
    .expect(visibleBreadcrumbs.count)
    .eql(0)
    .expect(btnToggleOverlay.exists)
    .notOk()
    .expect(transplantedBreadcrumbs.count)
    .eql(0)
    .expect(transplantedBreadcrumbsContainer.exists)
    .notOk();
});

test('should focus the next focusable breadcrumb item if the overlay is closed', async (testController: TestController) => {
  await testController
    .click(btnChangeBreadcrumbs)
    .resizeWindow(850, 800)
    .click(btnToggleOverlay)
    .click(btnToggleOverlay)
    .pressKey('tab')
    .expect(visibleBreadcrumbs.nth(0).focused)
    .ok();
});

test('should focus the next focusable breadcrumb item in the overlay', async (testController: TestController) => {
  await testController
    .click(btnChangeBreadcrumbs)
    .resizeWindow(900, 800)
    .click(btnToggleOverlay)
    .pressKey(`tab`)
    .expect(transplantedBreadcrumbs.nth(0).focused)
    .ok();
});

test('should swith focus from the last item in the overlay to the toggle', async (testController: TestController) => {
  await testController
    .click(btnChangeBreadcrumbs)
    .resizeWindow(900, 800)
    .click(btnToggleOverlay)
    .pressKey(`tab`)
    .expect(transplantedBreadcrumbs.nth(0).focused)
    .ok()
    .pressKey(`shift+tab`)
    .expect(btnToggleOverlay.focused)
    .ok();
});

test('should focus the next focusable element if no breadcrumbs are focusable', async (testController: TestController) => {
  await testController
    .click(btnChangeBreadcrumbs)
    .resizeWindow(500, 800)
    .click(btnHideBreadcrumbs)
    .click(btnToggleOverlay)
    .pressKey(`tab`)
    .expect(btnChangeBreadcrumbs.focused)
    .ok();
});
