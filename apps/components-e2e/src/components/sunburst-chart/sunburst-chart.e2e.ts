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
  root,
  centralLabel,
  centralValue,
  overlay,
  segments,
  sliceShephard,
  valueJack,
  percentBtn,
} from './sunburst-chart.po';

// Reduced speed of mouse actions should get our e2e tests stable.
// We should think about removing the dtOverlay and using the cdk one.
const mouseInteraction: MouseActionOptions = {
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
    .click(sliceShephard, { ...mouseInteraction, offsetY: -20 })
    .expect(centralLabel.textContent)
    .match(/Shephard/)
    .expect(centralValue.textContent)
    .match(/23/)
    .expect(segments.count)
    .eql(9)
    .expect(valueJack.textContent)
    .match(/Jack/)
    .click(root, mouseInteraction)
    .expect(centralLabel.textContent)
    .match(/All/)
    .expect(centralValue.textContent)
    .match(/108/);
});
test('should enable selection and select with relative values', async (testController: TestController) => {
  await testController
    .expect(segments.count)
    .eql(6)
    .click(percentBtn, mouseInteraction)
    .click(sliceShephard, { ...mouseInteraction, offsetY: -20 })
    .expect(centralLabel.textContent)
    .match(/Shephard/)
    .expect(centralValue.textContent)
    .match(/21\.3 %/)
    .expect(segments.count)
    .eql(9)
    .expect(valueJack.textContent)
    .match(/Jack/)
    .click(root, mouseInteraction)
    .expect(centralLabel.textContent)
    .match(/All/)
    .expect(centralValue.textContent)
    .match(/100 %/);
});
