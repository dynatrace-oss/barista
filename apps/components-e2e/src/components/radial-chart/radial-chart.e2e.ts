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
  absoluteBtn,
  body,
  chartTypeDonut,
  chartTypePie,
  chrome,
  edge,
  firefox,
  nonSelectableBtn,
  overlay,
  percentBtn,
  pieSelected,
  safari,
  selectableBtn,
  setSelectBtn,
} from './radial-chart.po';

// Reduced speed of hovering should get our e2e tests stable.
// We should think about removing the dtOverlay and using the cdk one,
// that is not flaky on other e2e tests #86
const hover: MouseActionOptions = {
  // Slowest possible speed should help as workaround til the issue is fixed.
  // The issue #646 is opened for this.
  speed: 0.01,
};
const pathSelectedClassname = 'dt-radial-chart-path-selected';
const legendInactiveClassname = 'dt-radial-chart-legend-item-inactive';
const inactiveColor = /rgb\(248, 248, 248\)/;

fixture('Radial chart')
  .page('http://localhost:4200/radial-chart')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should show overlay on hover', async (testController: TestController) => {
  await testController
    .hover(chrome.pie, hover)
    .expect(overlay.exists)
    .ok()
    .expect(overlay.textContent)
    .match(/Chrome: 43 of 89/)
    .hover(body, { ...hover, offsetX: 10, offsetY: 10 })
    .expect(overlay.exists)
    .notOk();
});

test('should show correct overlays when switching from pie to donut chart and back', async (testController: TestController) => {
  await testController
    .hover(chrome.pie, hover)
    .expect(overlay.exists)
    .ok()
    .click(chartTypeDonut, { speed: 0.3 })
    // hover over circle center where no path should be in a donut chart
    .hover(body, { ...hover, offsetX: 475, offsetY: 280 })
    .expect(overlay.exists)
    .notOk()
    // hover over part of the donut where an overlay should appear
    .hover(body, { ...hover, offsetX: 650, offsetY: 255 })
    .expect(overlay.exists)
    .ok()
    .click(chartTypePie, { speed: 0.3 })
    .hover(chrome.pie, hover)
    .expect(overlay.exists)
    .ok();
});

test('should show correct overlay contents when hovering over pies', async (testController: TestController) => {
  await testController
    .click(body, { speed: 0.5, offsetX: 0, offsetY: 0 }) // triggering change detection
    .hover(chrome.pie, hover)
    .expect(overlay.textContent)
    .match(/Chrome: 43 of 89/)
    .hover(safari.pie, hover)
    .expect(overlay.textContent)
    .match(/Safari: 22 of 89/)
    .hover(firefox.pie, hover)
    .expect(overlay.textContent)
    .match(/Firefox: 15 of 89/)
    .hover(edge.pie, hover)
    .expect(overlay.textContent)
    .match(/Microsoft Edge: 9 of 89/);
});

test('should enable selection and select', async (testController: TestController) => {
  await testController
    // selectable + input
    .click(selectableBtn)
    .click(setSelectBtn)
    .expect(chrome.pie.classNames)
    .contains(pathSelectedClassname)
    // non selectable
    .click(nonSelectableBtn)
    .expect(pieSelected.exists)
    .notOk()
    // selectable + click
    .click(selectableBtn)
    .click(chrome.pie)
    .expect(chrome.pie.classNames)
    .contains(pathSelectedClassname)
    // deselect
    .click(chrome.pie)
    .expect(pieSelected.exists)
    .notOk()
    // select other
    .click(chrome.pie)
    .click(firefox.pie)
    .expect(chrome.pie.classNames)
    .notContains(pathSelectedClassname)
    .expect(firefox.pie.classNames)
    .contains(pathSelectedClassname);
});
test('should show legend with percent and absolute values', async (testController: TestController) => {
  await testController
    .click(absoluteBtn)
    .expect(chrome.legend.textContent)
    .match(/43 Chrome/)
    .click(percentBtn)
    .expect(chrome.legend.textContent)
    .match(/48\.3 % Chrome/);
});

test('should fade legend and slice', async (testController: TestController) => {
  await testController
    .click(chrome.legend)
    .expect(chrome.legend.classNames)
    .contains(legendInactiveClassname)
    .expect(chrome.legendSymbol.getStyleProperty('background-color'))
    .match(inactiveColor)
    .expect(chrome.piePath.getStyleProperty('fill'))
    .match(inactiveColor);
});

test('should keep at least one slice active', async (testController: TestController) => {
  await testController
    .click(chrome.legend)
    .click(firefox.legend)
    .click(edge.legend)
    .click(safari.legend)
    .expect(chrome.legendSymbol.getStyleProperty('background-color'))
    .match(inactiveColor)
    .expect(chrome.piePath.getStyleProperty('fill'))
    .match(inactiveColor)
    .expect(firefox.legendSymbol.getStyleProperty('background-color'))
    .match(inactiveColor)
    .expect(chrome.piePath.getStyleProperty('fill'))
    .match(inactiveColor)
    .expect(edge.legendSymbol.getStyleProperty('background-color'))
    .match(inactiveColor)
    .expect(edge.piePath.getStyleProperty('fill'))
    .match(inactiveColor)
    .expect(safari.legendSymbol.getStyleProperty('background-color'))
    .notMatch(inactiveColor)
    .expect(safari.piePath.getStyleProperty('fill'))
    .notMatch(inactiveColor);
});
