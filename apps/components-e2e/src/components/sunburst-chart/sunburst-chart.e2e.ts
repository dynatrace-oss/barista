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

import { resetWindowSizeToDefault, waitForAngular } from '../../utils';
import {
  body,
  centralLabel,
  centralValue,
  overlay,
  segments,
  sliceShephard,
  valueJack,
  percentBtn,
} from './sunburst-chart.po';

// Reduced speed of hovering should get our e2e tests stable.
// We should think about removing the dtOverlay and using the cdk one,
// that is not flaky on other e2e tests #86
const hover: MouseActionOptions = {
  // Slowest possible speed should help as workaround til the issue is fixed.
  // The issue #646 is opened for this.
  speed: 0.6,
};

fixture('Sunburst chart')
  .page('http://localhost:4200/sunburst-chart')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should enable selection and select with absolute values', async (testController: TestController) => {
  await testController
    .expect(segments.count)
    .eql(6)
    .click(sliceShephard, { offsetY: -20 })
    .expect(centralLabel.textContent)
    .match(/Shephard/)
    .expect(centralValue.textContent)
    .match(/23/)
    .expect(segments.count)
    .eql(9)
    .expect(valueJack.textContent)
    .match(/Jack/)
    .click(body)
    .expect(centralLabel.textContent)
    .match(/All/)
    .expect(centralValue.textContent)
    .match(/108/);
});
test('should enable selection and select with relative values', async (testController: TestController) => {
  await testController
    .expect(segments.count)
    .eql(6)
    .click(percentBtn)
    .click(sliceShephard, { offsetY: -20 })
    .expect(centralLabel.textContent)
    .match(/Shephard/)
    .expect(centralValue.textContent)
    .match(/21\.3 %/)
    .expect(segments.count)
    .eql(9)
    .expect(valueJack.textContent)
    .match(/Jack/)
    .click(body)
    .expect(centralLabel.textContent)
    .match(/All/)
    .expect(centralValue.textContent)
    .match(/100 %/);
});

test('should show overlay on hover', async (testController: TestController) => {
  await testController
    .hover(sliceShephard, { ...hover, offsetY: -20 })
    .expect(overlay.exists)
    .ok()
    .expect(overlay.textContent)
    .match(/Shephard: 23/)
    .hover(body, { ...hover, offsetX: 10, offsetY: 10 })
    .expect(overlay.exists)
    .notOk();
});
